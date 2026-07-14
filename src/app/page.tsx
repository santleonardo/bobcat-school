'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { LESSONS, type Lesson, type LessonSection, type TableRow, type DialogueLine, type Exercise, type ExerciseQuestion } from '@/lib/lessons-data'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Home as HomeIcon, User as UserIcon, BookOpen, Trophy, Target, ChevronRight, CheckCircle2, XCircle, Loader2, LogOut, RotateCcw, Send } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

// ============================================================
// Types
// ============================================================

interface Profile {
  name: string
  avatar: string
  level: string
}

interface ProgressRecord {
  completed: boolean
  correct: number
  total: number
}

type Screen = 'auth' | 'profile-setup' | 'home' | 'lesson' | 'exercises' | 'profile-view'
type AuthMode = 'login' | 'signup'

interface ExerciseAnswerState {
  questionId: string
  userAnswer: string
  isCorrect: boolean | null
  correctAnswer: string
  answered: boolean
}

// ============================================================
// Constants
// ============================================================

const AVATARS = ['🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯']

const BOBCAT_ORANGE = '#D9793F'
const BOBCAT_DARK_ORANGE = '#C9622A'
const BOBCAT_CREAM = '#FBEFE6'
const BOBCAT_INK = '#2b2b2b'
const BOBCAT_GREEN = '#2E8B57'
const BOBCAT_RED = '#C0392B'

const LEVEL_LABELS: Record<string, string> = {
  'A1': 'Nivel 1',
  'A2': 'Nivel 2',
  'B1': 'Nivel 3',
  'B2': 'Nivel 4',
}

// ============================================================
// Helper: Case-insensitive answer check
// ============================================================

function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
}

// ============================================================
// Main Component
// ============================================================

export default function Home() {
  const [screen, setScreen] = useState<Screen>('auth')
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLocalMode, setIsLocalMode] = useState(false)
  const [profile, setProfile] = useState<Profile>({ name: '', avatar: '🐱', level: 'A1' })
  const [progress, setProgress] = useState<Record<string, ProgressRecord>>({})
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  // Auth form state
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authConfirmPassword, setAuthConfirmPassword] = useState('')

  // Profile setup state
  const [setupName, setSetupName] = useState('')
  const [setupAvatar, setSetupAvatar] = useState('🐱')
  const [setupLevel, setSetupLevel] = useState('A1')

  // Profile edit state
  const [editName, setEditName] = useState('')
  const [editAvatar, setEditAvatar] = useState('🐱')
  const [editLevel, setEditLevel] = useState('A1')
  const [profileSaving, setProfileSaving] = useState(false)

  // Exercise state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({})
  const [exerciseResults, setExerciseResults] = useState<Record<string, ExerciseAnswerState>>({})
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false)
  const [exerciseScore, setExerciseScore] = useState({ correct: 0, total: 0 })
  const [showingAnswer, setShowingAnswer] = useState(false)

  // Reset password dialog
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSending, setResetSending] = useState(false)

  // Level expanded
  const [levelExpanded, setLevelExpanded] = useState<string>('level-1')

  // ============================================================
  // Boot sequence
  // ============================================================

  useEffect(() => {
    const boot = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          const loaded = await loadProfile(session.user.id)
          if (!loaded) {
            setScreen('profile-setup')
          } else {
            await loadProgress(session.user.id)
            setScreen('home')
          }
        } else {
          // Check localStorage for local profile
          const localProfile = localStorage.getItem('bobcat_profile')
          if (localProfile) {
            const p = JSON.parse(localProfile)
            setProfile({ name: p.name || '', avatar: p.avatar || '🐱', level: p.level || 'A1' })
            const localProgress = localStorage.getItem('bobcat_progress')
            if (localProgress) setProgress(JSON.parse(localProgress))
            setIsLocalMode(true)
            setScreen('home')
          } else {
            setScreen('auth')
          }
        }
      } catch {
        // Network error — try localStorage
        const localProfile = localStorage.getItem('bobcat_profile')
        if (localProfile) {
          const p = JSON.parse(localProfile)
          setProfile({ name: p.name || '', avatar: p.avatar || '🐱', level: p.level || 'A1' })
          const localProgress = localStorage.getItem('bobcat_progress')
          if (localProgress) setProgress(JSON.parse(localProgress))
          setIsLocalMode(true)
          setScreen('home')
        } else {
          setScreen('auth')
        }
      } finally {
        setLoading(false)
      }
    }
    boot()
  }, [])

  // ============================================================
  // Data loading
  // ============================================================

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (data) {
        const p: Profile = { name: data.name || '', avatar: data.avatar || '🐱', level: data.level || 'A1' }
        setProfile(p)
        setEditName(p.name)
        setEditAvatar(p.avatar)
        setEditLevel(p.level)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const loadProgress = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
      if (data) {
        const p: Record<string, ProgressRecord> = {}
        for (const row of data) {
          p[row.lesson_id] = { completed: row.completed, correct: row.correct, total: row.total }
        }
        setProgress(p)
      }
    } catch {
      // silently fail
    }
  }

  // ============================================================
  // Auth handlers
  // ============================================================

  const handleAuth = async () => {
    if (!authEmail || !authPassword) {
      toast.error('Preencha todos os campos')
      return
    }
    setAuthLoading(true)
    try {
      if (authMode === 'signup') {
        if (authPassword !== authConfirmPassword) {
          toast.error('As senhas nao coincidem')
          setAuthLoading(false)
          return
        }
        if (authPassword.length < 6) {
          toast.error('A senha deve ter pelo menos 6 caracteres')
          setAuthLoading(false)
          return
        }
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        })
        if (error) {
          toast.error(error.message)
          setAuthLoading(false)
          return
        }
        toast.success('Conta criada! Verifique seu email para confirmar.')
        setAuthMode('login')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        })
        if (error) {
          toast.error(error.message)
          setAuthLoading(false)
          return
        }
        if (data.user) {
          setUser(data.user)
          const hasProfile = await loadProfile(data.user.id)
          await loadProgress(data.user.id)
          if (hasProfile) {
            setScreen('home')
          } else {
            setScreen('profile-setup')
          }
        }
      }
    } catch {
      toast.error('Erro na autenticacao. Tente novamente.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error('Digite seu email')
      return
    }
    setResetSending(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Email de recuperacao enviado!')
        setResetPasswordOpen(false)
      }
    } catch {
      toast.error('Erro ao enviar email. Tente novamente.')
    } finally {
      setResetSending(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile({ name: '', avatar: '🐱', level: 'A1' })
    setProgress({})
    setScreen('auth')
    setAuthEmail('')
    setAuthPassword('')
  }

  // ============================================================
  // Profile setup handler
  // ============================================================

  const handleProfileSetup = async () => {
    if (!setupName.trim()) {
      toast.error('Digite seu nome')
      return
    }
    const p: Profile = { name: setupName.trim(), avatar: setupAvatar, level: setupLevel }
    if (isLocalMode) {
      localStorage.setItem('bobcat_profile', JSON.stringify(p))
      setProfile(p)
      setEditName(p.name)
      setEditAvatar(p.avatar)
      setEditLevel(p.level)
      toast.success('Perfil salvo com sucesso!')
      setScreen('home')
      return
    }
    if (!user) return
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, name: setupName.trim(), avatar: setupAvatar, level: setupLevel })
      if (error) {
        toast.error('Erro ao salvar perfil')
        return
      }
      const p: Profile = { name: setupName.trim(), avatar: setupAvatar, level: setupLevel }
      setProfile(p)
      setEditName(p.name)
      setEditAvatar(p.avatar)
      setEditLevel(p.level)
      toast.success('Perfil salvo com sucesso!')
      setScreen('home')
    } catch {
      toast.error('Erro ao salvar perfil')
    }
  }

  // ============================================================
  // Profile edit handler
  // ============================================================

  const handleProfileSave = async () => {
    if (!editName.trim()) {
      toast.error('Digite seu nome')
      return
    }
    const p: Profile = { name: editName.trim(), avatar: editAvatar, level: editLevel }
    if (isLocalMode) {
      localStorage.setItem('bobcat_profile', JSON.stringify(p))
      setProfile(p)
      toast.success('Perfil atualizado!')
      setScreen('home')
      return
    }
    if (!user) return
    setProfileSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: editName.trim(), avatar: editAvatar, level: editLevel })
        .eq('id', user.id)
      if (error) {
        toast.error('Erro ao atualizar perfil')
        setProfileSaving(false)
        return
      }
      setProfile(p)
      toast.success('Perfil atualizado!')
    } catch {
      toast.error('Erro ao atualizar perfil')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleResetProgress = async () => {
    if (isLocalMode) {
      localStorage.setItem('bobcat_progress', JSON.stringify({}))
      setProgress({})
      toast.success('Progresso zerado!')
      return
    }
    if (!user) return
    try {
      await supabase.from('progress').delete().eq('user_id', user.id)
      setProgress({})
      toast.success('Progresso zerado!')
    } catch {
      toast.error('Erro ao zerar progresso')
    }
  }

  // ============================================================
  // Lesson view
  // ============================================================

  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setScreen('lesson')
  }

  const startExercises = () => {
    if (!selectedLesson) return
    setCurrentExerciseIndex(0)
    setExerciseAnswers({})
    setExerciseResults({})
    setExerciseSubmitted(false)
    setExerciseScore({ correct: 0, total: 0 })
    setShowingAnswer(false)
    setScreen('exercises')
  }

  // ============================================================
  // Exercise logic
  // ============================================================

  const getAllQuestions = useCallback((): ExerciseQuestion[] => {
    if (!selectedLesson) return []
    const qs: ExerciseQuestion[] = []
    for (const ex of selectedLesson.exercises) {
      for (const q of ex.questions) {
        qs.push(q)
      }
    }
    return qs
  }, [selectedLesson])

  const currentQuestions = getAllQuestions()

  const submitCurrentAnswer = () => {
    if (!selectedLesson || currentQuestions.length === 0) return
    const q = currentQuestions[currentExerciseIndex]
    const userAns = exerciseAnswers[q.id] || ''
    if (!userAns.trim()) {
      toast.error('Digite sua resposta')
      return
    }
    const isCorrect = checkAnswer(userAns, q.answer)
    setExerciseResults(prev => ({
      ...prev,
      [q.id]: {
        questionId: q.id,
        userAnswer: userAns,
        isCorrect,
        correctAnswer: q.answer,
        answered: true,
      }
    }))
    setShowingAnswer(true)
  }

  const nextQuestion = () => {
    if (currentExerciseIndex < currentQuestions.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setShowingAnswer(false)
    }
  }

  const finishExercises = async () => {
    if (!selectedLesson || !user) return
    let correct = 0
    let total = 0
    for (const q of currentQuestions) {
      total++
      const result = exerciseResults[q.id]
      if (result && result.isCorrect) correct++
    }
    setExerciseScore({ correct, total })
    setExerciseSubmitted(true)

    // Save progress
    const newProgress = { completed: true, correct, total }
    setProgress(prev => ({ ...prev, [selectedLesson.id]: newProgress }))
    if (isLocalMode) {
      const allProgress = { ...progress, [selectedLesson.id]: newProgress }
      localStorage.setItem('bobcat_progress', JSON.stringify(allProgress))
    } else if (user) {
      try {
        await supabase
          .from('progress')
          .upsert({
            user_id: user.id,
            lesson_id: selectedLesson.id,
            completed: true,
            correct,
            total,
            last_attempt: new Date().toISOString(),
          })
      } catch {
        // silent fail
      }
    }
  }

  // ============================================================
  // Stats computation
  // ============================================================

  const completedLessons = Object.values(progress).filter(p => p.completed).length
  const totalAnswered = Object.values(progress).filter(p => p.total > 0)
  const avgScore = totalAnswered.length > 0
    ? Math.round(totalAnswered.reduce((sum, p) => sum + (p.correct / p.total) * 100, 0) / totalAnswered.length)
    : 0
  const availableLessons = LESSONS.length

  // ============================================================
  // Sub-components
  // ============================================================

  // ---- Loading screen ----
  function LoadingScreen() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Image src="/bobcat-logo.png" alt="Bobcat" width={80} height={80} className="animate-pulse" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    )
  }

  // ---- Auth Screen ----
  function AuthScreen() {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-center mb-8">
              <Image src="/bobcat-logo.png" alt="Bobcat Language School" width={72} height={72} className="mb-3" />
              <h1 className="text-xl font-bold" style={{ color: BOBCAT_INK }}>Bobcat Language School</h1>
              <p className="text-sm mt-1" style={{ color: BOBCAT_DARK_ORANGE }}>Aprenda ingles de forma divertida</p>
            </div>
            <Card className="border-0 shadow-lg" style={{ borderRadius: 16 }}>
              <CardContent className="p-6">
                <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as AuthMode)}>
                  <TabsList className="w-full mb-4 p-1" style={{ backgroundColor: BOBCAT_CREAM }}>
                    <TabsTrigger
                      value="login"
                      className="flex-1 data-[state=active]:shadow-sm"
                      style={{ color: BOBCAT_DARK_ORANGE } as React.CSSProperties}
                    >
                      Entrar
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="flex-1 data-[state=active]:shadow-sm"
                      style={{ color: BOBCAT_DARK_ORANGE } as React.CSSProperties}
                    >
                      Criar conta
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={authEmail}
                          onChange={e => setAuthEmail(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAuth()}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Senha</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Sua senha"
                          value={authPassword}
                          onChange={e => setAuthPassword(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAuth()}
                        />
                      </div>
                      <button
                        className="text-xs underline w-full text-left"
                        style={{ color: BOBCAT_DARK_ORANGE }}
                        onClick={() => { setResetPasswordOpen(true); setResetEmail(authEmail) }}
                      >
                        Esqueci minha senha?
                      </button>
                      <Button
                        className="w-full text-white font-semibold"
                        style={{ backgroundColor: BOBCAT_ORANGE, borderRadius: 12 }}
                        onClick={handleAuth}
                        disabled={authLoading}
                      >
                        {authLoading && <Loader2 className="animate-spin size-4" />}
                        Entrar
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="signup">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={authEmail}
                          onChange={e => setAuthEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Senha</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Minimo 6 caracteres"
                          value={authPassword}
                          onChange={e => setAuthPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm">Confirmar senha</Label>
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="Repita a senha"
                          value={authConfirmPassword}
                          onChange={e => setAuthConfirmPassword(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAuth()}
                        />
                      </div>
                      <Button
                        className="w-full text-white font-semibold"
                        style={{ backgroundColor: BOBCAT_ORANGE, borderRadius: 12 }}
                        onClick={handleAuth}
                        disabled={authLoading}
                      >
                        {authLoading && <Loader2 className="animate-spin size-4" />}
                        Criar conta
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <button
              onClick={() => { setIsLocalMode(true); setScreen('profile-setup') }}
              className="mt-4 w-full text-center text-sm font-semibold py-2 rounded-lg border-2 border-dashed transition-colors hover:bg-gray-50"
              style={{ color: BOBCAT_DARK_ORANGE, borderColor: '#ddd' }}
            >
              Continuar sem conta
            </button>
            <p className="text-xs text-center mt-2" style={{ color: '#999' }}>
              Sem conta, seus dados ficam salvos apenas neste navegador
            </p>
          </div>
        </main>
      </div>
    )
  }

  // ---- Profile Setup Screen ----
  function ProfileSetupScreen() {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-center mb-6">
              <Image src="/bobcat-logo.png" alt="Bobcat" width={56} height={56} className="mb-2" />
              <h1 className="text-lg font-bold" style={{ color: BOBCAT_INK }}>Configure seu perfil</h1>
              <p className="text-sm" style={{ color: '#888' }}>Conte-nos sobre voce</p>
            </div>
            <Card className="border-0 shadow-lg" style={{ borderRadius: 16 }}>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label>Seu nome</Label>
                  <Input
                    placeholder="Digite seu nome"
                    value={setupName}
                    onChange={e => setSetupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Escolha seu avatar</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {AVATARS.map(av => (
                      <button
                        key={av}
                        onClick={() => setSetupAvatar(av)}
                        className="text-2xl p-2 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: setupAvatar === av ? BOBCAT_ORANGE : '#e5e5e5',
                          backgroundColor: setupAvatar === av ? BOBCAT_CREAM : 'transparent',
                        }}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Seu nivel</Label>
                  <Select value={setupLevel} onValueChange={setSetupLevel}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">Nivel 1 - Iniciante</SelectItem>
                      <SelectItem value="A2">Nivel 2 - Basico</SelectItem>
                      <SelectItem value="B1">Nivel 3 - Intermediario</SelectItem>
                      <SelectItem value="B2">Nivel 4 - Intermediario superior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: BOBCAT_ORANGE, borderRadius: 12 }}
                  onClick={handleProfileSetup}
                >
                  Comecar a aprender!
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  // ---- Home Screen ----
  function HomeScreen() {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 pb-20">
          <div className="max-w-lg mx-auto">
            {/* Greeting card */}
            <div
              className="p-5 text-white"
              style={{ backgroundColor: BOBCAT_ORANGE, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{profile.avatar}</span>
                <div>
                  <p className="font-bold text-lg">Ola, {profile.name || 'Aluno'}!</p>
                  <p className="text-sm opacity-90">Continue praticando 🎯</p>
                </div>
              </div>
            </div>

            <div className="px-4 -mt-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <Card className="p-3 text-center border-0 shadow-md" style={{ borderRadius: 14 }}>
                  <div className="text-2xl font-bold" style={{ color: BOBCAT_ORANGE }}>{completedLessons}</div>
                  <div className="text-xs mt-1" style={{ color: '#888' }}>Licoes concluidas</div>
                </Card>
                <Card className="p-3 text-center border-0 shadow-md" style={{ borderRadius: 14 }}>
                  <div className="text-2xl font-bold" style={{ color: BOBCAT_ORANGE }}>{avgScore}%</div>
                  <div className="text-xs mt-1" style={{ color: '#888' }}>Media de acertos</div>
                </Card>
                <Card className="p-3 text-center border-0 shadow-md" style={{ borderRadius: 14 }}>
                  <div className="text-2xl font-bold" style={{ color: BOBCAT_ORANGE }}>{availableLessons}</div>
                  <div className="text-xs mt-1" style={{ color: '#888' }}>Licoes disponiveis</div>
                </Card>
              </div>

              {/* Level selector */}
              <Accordion
                type="single"
                collapsible
                value={levelExpanded}
                onValueChange={(v) => setLevelExpanded(v || '')}
              >
                <AccordionItem value="level-1" className="border-0">
                  <Card className="border-0 shadow-md overflow-hidden" style={{ borderRadius: 14 }}>
                    <AccordionTrigger className="p-4 hover:no-underline w-full">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: BOBCAT_ORANGE }}
                        >
                          1
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm" style={{ color: BOBCAT_INK }}>Nivel 1</p>
                          <p className="text-xs" style={{ color: '#888' }}>
                            {LESSONS.length} licoes disponiveis
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {LESSONS.map((lesson, idx) => {
                          const lp = progress[lesson.id]
                          const scorePercent = lp && lp.total > 0 ? Math.round((lp.correct / lp.total) * 100) : 0
                          return (
                            <Card
                              key={lesson.id}
                              className="cursor-pointer border shadow-sm hover:shadow-md transition-shadow"
                              style={{ borderRadius: 14 }}
                              onClick={() => openLesson(lesson)}
                            >
                              <CardContent className="p-4 flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                                  style={{ backgroundColor: BOBCAT_CREAM }}
                                >
                                  {lesson.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate" style={{ color: BOBCAT_INK }}>
                                    Licao {idx + 1}: {lesson.title}
                                  </p>
                                  <p className="text-xs truncate mt-0.5" style={{ color: '#888' }}>
                                    {lesson.description}
                                  </p>
                                  {lp && lp.total > 0 ? (
                                    <div className="mt-2">
                                      <Progress
                                        value={scorePercent}
                                        className="h-1.5"
                                        style={{
                                          '--progress-color': BOBCAT_ORANGE,
                                        } as React.CSSProperties}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                                <div className="shrink-0">
                                  {lp && lp.completed ? (
                                    <Badge
                                      className="text-white font-semibold"
                                      style={{ backgroundColor: BOBCAT_GREEN, borderRadius: 8 }}
                                    >
                                      {scorePercent}%
                                    </Badge>
                                  ) : (
                                    <Badge
                                      className="font-semibold"
                                      style={{ backgroundColor: BOBCAT_CREAM, color: BOBCAT_DARK_ORANGE, borderRadius: 8 }}
                                    >
                                      Comecar
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </main>

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 border-t bg-white z-50"
          style={{ borderColor: '#eee' }}
        >
          <button
            className="flex flex-col items-center gap-0.5 p-2"
            onClick={() => setScreen('home')}
            style={{ color: BOBCAT_ORANGE }}
          >
            <HomeIcon className="size-5" />
            <span className="text-xs font-medium">Inicio</span>
          </button>
          <button
            className="flex flex-col items-center gap-0.5 p-2"
            onClick={() => { setEditName(profile.name); setEditAvatar(profile.avatar); setEditLevel(profile.level); setScreen('profile-view') }}
            style={{ color: BOBCAT_ORANGE }}
          >
            <UserIcon className="size-5" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </nav>
      </div>
    )
  }

  // ---- Section Renderers ----
  function RenderObjective({ section }: { section: LessonSection }) {
    const content = section.content as string[]
    return (
      <div className="rounded-xl p-4" style={{ backgroundColor: BOBCAT_ORANGE, color: 'white' }}>
        <h3 className="font-bold text-sm mb-2">{section.title}</h3>
        <ul className="space-y-1.5">
          {content.map((line, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="mt-0.5">&#8226;</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  function RenderWarmup({ section }: { section: LessonSection }) {
    const content = section.content as string[]
    return (
      <div className="rounded-xl p-4" style={{ backgroundColor: '#FFF8F0' }}>
        <h3 className="font-bold text-sm mb-2" style={{ color: BOBCAT_INK }}>{section.title}</h3>
        <div className="space-y-1">
          {content.map((line, i) => (
            <p key={i} className="text-sm" style={{ color: line ? BOBCAT_INK : undefined }}>{line || '\u00A0'}</p>
          ))}
        </div>
      </div>
    )
  }

  function RenderVocabulary({ section }: { section: LessonSection }) {
    const rows = section.content as TableRow[]
    if (rows.length === 0) return null
    const headers = rows[0]?.cells || []
    const dataRows = rows.filter(r => !r.isHeader)
    return (
      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: BOBCAT_INK }}>{section.title}</h3>
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#eee' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: BOBCAT_ORANGE, color: 'white' }}>
                  {headers.map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left font-semibold text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, ri) => (
                  <tr
                    key={ri}
                    style={{ backgroundColor: ri % 2 === 0 ? '#fff' : BOBCAT_CREAM }}
                  >
                    {row.cells.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-xs" style={{ color: BOBCAT_INK }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  function RenderDialogue({ section }: { section: LessonSection }) {
    const lines = section.content as DialogueLine[]
    return (
      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: BOBCAT_INK }}>{section.title}</h3>
        <div className="space-y-2">
          {lines.map((line, i) => {
            const isRight = i % 2 === 1
            return (
              <div key={i} className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-2.5"
                  style={{
                    backgroundColor: isRight ? BOBCAT_ORANGE : BOBCAT_CREAM,
                    color: isRight ? 'white' : BOBCAT_INK,
                    borderBottomRightRadius: isRight ? 4 : 16,
                    borderBottomLeftRadius: isRight ? 16 : 4,
                  }}
                >
                  <p className="text-xs font-semibold mb-0.5 opacity-80">{line.speaker}</p>
                  <p className="text-sm">{line.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  function RenderGrammar({ section }: { section: LessonSection }) {
    const content = section.content as string[]
    return (
      <div>
        <h3 className="font-bold text-sm mb-2" style={{ color: BOBCAT_ORANGE }}>{section.title}</h3>
        <div className="space-y-1">
          {content.map((line, i) => (
            <p key={i} className="text-sm" style={{ color: BOBCAT_INK, fontWeight: line === '' ? undefined : undefined }}>
              {line || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
    )
  }

  function RenderTip({ section }: { section: LessonSection }) {
    const content = section.content
    const lines = Array.isArray(content) ? content : [content]
    return (
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: BOBCAT_CREAM, borderColor: BOBCAT_ORANGE }}
      >
        <h3 className="font-bold text-sm mb-2" style={{ color: BOBCAT_INK }}>{section.title}</h3>
        {lines.map((line, i) => (
          <p key={i} className="text-sm" style={{ color: BOBCAT_INK }}>{line}</p>
        ))}
      </div>
    )
  }

  function RenderPractice({ section }: { section: LessonSection }) {
    const content = section.content
    const lines = Array.isArray(content) ? content : [content]
    return (
      <div>
        <h3 className="font-bold text-sm mb-2" style={{ color: BOBCAT_INK }}>{section.title}</h3>
        <div className="space-y-1">
          {lines.map((line, i) => (
            <p key={i} className="text-sm" style={{ color: BOBCAT_INK }}>{line || '\u00A0'}</p>
          ))}
        </div>
      </div>
    )
  }

  function RenderText({ section }: { section: LessonSection }) {
    const content = section.content
    const lines = Array.isArray(content) ? content : [content]
    return (
      <div>
        <h3 className="font-bold text-sm mb-2" style={{ color: BOBCAT_INK }}>{section.title}</h3>
        <div className="space-y-1">
          {lines.map((line, i) => (
            <p key={i} className="text-sm" style={{ color: BOBCAT_INK }}>{line || '\u00A0'}</p>
          ))}
        </div>
      </div>
    )
  }

  function RenderSection({ section }: { section: LessonSection }) {
    switch (section.type) {
      case 'objective': return <RenderObjective section={section} />
      case 'warmup': return <RenderWarmup section={section} />
      case 'vocabulary': return <RenderVocabulary section={section} />
      case 'dialogue': return <RenderDialogue section={section} />
      case 'grammar': return <RenderGrammar section={section} />
      case 'tip': return <RenderTip section={section} />
      case 'practice': return <RenderPractice section={section} />
      case 'text': return <RenderText section={section} />
      default: return null
    }
  }

  // ---- Lesson Viewer Screen ----
  function LessonViewerScreen() {
    if (!selectedLesson) return null
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <div
          className="sticky top-0 z-40 p-4 flex items-center gap-3 shadow-sm bg-white"
          style={{ borderBottom: `2px solid ${BOBCAT_ORANGE}` }}
        >
          <button
            onClick={() => setScreen('home')}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: BOBCAT_CREAM }}
          >
            <ArrowLeft className="size-4" style={{ color: BOBCAT_DARK_ORANGE }} />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl">{selectedLesson.icon}</span>
            <h1 className="font-bold text-sm truncate" style={{ color: BOBCAT_INK }}>
              {selectedLesson.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-lg mx-auto p-4 space-y-4 pb-28">
            {selectedLesson.sections.map((section, i) => (
              <RenderSection key={i} section={section} />
            ))}
          </div>
        </ScrollArea>

        {/* Exercise button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-40" style={{ borderColor: '#eee' }}>
          <div className="max-w-lg mx-auto">
            <Button
              className="w-full text-white font-semibold h-12"
              style={{ backgroundColor: BOBCAT_ORANGE, borderRadius: 14 }}
              onClick={startExercises}
            >
              <BookOpen className="size-5 mr-2" />
              Exercicios
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ---- Exercise Screen ----
  function ExerciseScreen() {
    if (!selectedLesson) return null

    if (exerciseSubmitted) {
      // Final score screen
      const pct = exerciseScore.total > 0 ? Math.round((exerciseScore.correct / exerciseScore.total) * 100) : 0
      const isGood = pct >= 70
      return (
        <div className="min-h-screen flex flex-col bg-white">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-sm text-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: isGood ? BOBCAT_GREEN : BOBCAT_RED }}
              >
                {isGood ? (
                  <Trophy className="size-12 text-white" />
                ) : (
                  <Target className="size-12 text-white" />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: BOBCAT_INK }}>
                {isGood ? 'Parabens!' : 'Continue tentando!'}
              </h2>
              <p className="text-4xl font-bold mb-1" style={{ color: isGood ? BOBCAT_GREEN : BOBCAT_RED }}>
                {exerciseScore.correct}/{exerciseScore.total}
              </p>
              <p className="text-sm mb-6" style={{ color: '#888' }}>
                {pct}% de acertos
              </p>
              <Button
                className="w-full text-white font-semibold h-12 mb-3"
                style={{ backgroundColor: BOBCAT_ORANGE, borderRadius: 14 }}
                onClick={() => setScreen('home')}
              >
                Voltar as licoes
              </Button>
              <Button
                variant="outline"
                className="w-full font-semibold h-12"
                style={{ borderRadius: 14, borderColor: BOBCAT_ORANGE, color: BOBCAT_ORANGE }}
                onClick={startExercises}
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      )
    }

    const q = currentQuestions[currentExerciseIndex]
    if (!q) return null

    const currentResult = exerciseResults[q.id]
    const isAnswered = currentResult?.answered === true
    const isCorrect = currentResult?.isCorrect === true

    // Find the exercise group this question belongs to
    let exGroup: Exercise | undefined
    for (const ex of selectedLesson.exercises) {
      if (ex.questions.find(eq => eq.id === q.id)) {
        exGroup = ex
        break
      }
    }

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div
          className="sticky top-0 z-40 p-4 flex items-center gap-3 bg-white shadow-sm"
          style={{ borderBottom: `2px solid ${BOBCAT_ORANGE}` }}
        >
          <button
            onClick={() => setScreen('lesson')}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: BOBCAT_CREAM }}
          >
            <ArrowLeft className="size-4" style={{ color: BOBCAT_DARK_ORANGE }} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs truncate" style={{ color: '#888' }}>{exGroup?.title || 'Exercicio'}</p>
            <div className="flex items-center gap-2">
              <Progress
                value={((currentExerciseIndex + 1) / currentQuestions.length) * 100}
                className="flex-1 h-2"
              />
              <span className="text-xs font-medium" style={{ color: BOBCAT_INK }}>
                {currentExerciseIndex + 1}/{currentQuestions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <main className="flex-1 p-4">
          <div className="max-w-lg mx-auto">
            <Card className="border-0 shadow-md" style={{ borderRadius: 14 }}>
              <CardContent className="p-5">
                <p className="text-sm font-medium mb-4" style={{ color: BOBCAT_INK }}>
                  {q.prompt}
                </p>

                {exGroup?.type === 'choice' && q.options && (
                  <RadioGroup
                    value={exerciseAnswers[q.id] || ''}
                    onValueChange={(val) => {
                      if (!isAnswered) {
                        setExerciseAnswers(prev => ({ ...prev, [q.id]: val }))
                      }
                    }}
                    disabled={isAnswered}
                  >
                    {q.options.map((opt) => {
                      let optStyle: React.CSSProperties = {
                        backgroundColor: '#fff',
                        borderColor: '#e5e5e5',
                        color: BOBCAT_INK,
                      }
                      if (isAnswered) {
                        if (opt.toLowerCase() === q.answer.toLowerCase()) {
                          optStyle = { backgroundColor: '#E8F8EF', borderColor: BOBCAT_GREEN, color: BOBCAT_GREEN }
                        } else if (opt === exerciseAnswers[q.id] && !isCorrect) {
                          optStyle = { backgroundColor: '#FDECEA', borderColor: BOBCAT_RED, color: BOBCAT_RED }
                        }
                      }
                      return (
                        <label
                          key={opt}
                          className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all"
                          style={optStyle}
                        >
                          <RadioGroupItem value={opt} disabled={isAnswered} />
                          <span className="text-sm font-medium">{opt}</span>
                          {isAnswered && opt.toLowerCase() === q.answer.toLowerCase() && (
                            <CheckCircle2 className="size-4 ml-auto" style={{ color: BOBCAT_GREEN }} />
                          )}
                          {isAnswered && opt === exerciseAnswers[q.id] && !isCorrect && opt.toLowerCase() !== q.answer.toLowerCase() && (
                            <XCircle className="size-4 ml-auto" style={{ color: BOBCAT_RED }} />
                          )}
                        </label>
                      )
                    })}
                  </RadioGroup>
                )}

                {(exGroup?.type === 'fill' || exGroup?.type === 'translate' || exGroup?.type === 'match') && (
                  <div>
                    <Input
                      placeholder={exGroup?.type === 'translate' ? 'Traduza para o ingles...' : 'Sua resposta...'}
                      value={exerciseAnswers[q.id] || ''}
                      onChange={e => {
                        if (!isAnswered) {
                          setExerciseAnswers(prev => ({ ...prev, [q.id]: e.target.value }))
                        }
                      }}
                      disabled={isAnswered}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !isAnswered) submitCurrentAnswer()
                        else if (e.key === 'Enter' && isAnswered) {
                          if (currentExerciseIndex < currentQuestions.length - 1) nextQuestion()
                          else finishExercises()
                        }
                      }}
                      className="h-12 text-base"
                      style={{ borderRadius: 12 }}
                    />
                    {isAnswered && !isCorrect && (
                      <p className="text-sm mt-2 flex items-center gap-1" style={{ color: BOBCAT_GREEN }}>
                        <CheckCircle2 className="size-4" />
                        Resposta correta: <span className="font-semibold">{q.answer}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Feedback flash */}
                {isAnswered && (
                  <div
                    className="mt-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium"
                    style={{
                      backgroundColor: isCorrect ? '#E8F8EF' : '#FDECEA',
                      color: isCorrect ? BOBCAT_GREEN : BOBCAT_RED,
                    }}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="size-5" />
                        Correto!
                      </>
                    ) : (
                      <>
                        <XCircle className="size-5" />
                        Incorreto. Veja a resposta correta acima.
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action button */}
            <div className="mt-4">
              {!isAnswered ? (
                <Button
                  className="w-full text-white font-semibold h-12"
                  style={{ backgroundColor: BOBCAT_ORANGE, borderRadius: 14 }}
                  onClick={submitCurrentAnswer}
                >
                  <Send className="size-4 mr-2" />
                  Verificar
                </Button>
              ) : currentExerciseIndex < currentQuestions.length - 1 ? (
                <Button
                  className="w-full text-white font-semibold h-12"
                  style={{ backgroundColor: BOBCAT_ORANGE, borderRadius: 14 }}
                  onClick={nextQuestion}
                >
                  Proxima <ChevronRight className="size-4 ml-1" />
                </Button>
              ) : (
                <Button
                  className="w-full text-white font-semibold h-12"
                  style={{ backgroundColor: BOBCAT_GREEN, borderRadius: 14 }}
                  onClick={finishExercises}
                >
                  <Trophy className="size-4 mr-2" />
                  Ver resultado final
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ---- Profile View Screen ----
  function ProfileViewScreen() {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 pb-20">
          <div className="max-w-lg mx-auto p-4">
            {/* Header with back */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setScreen('home')}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: BOBCAT_CREAM }}
              >
                <ArrowLeft className="size-4" style={{ color: BOBCAT_DARK_ORANGE }} />
              </button>
              <h1 className="font-bold text-lg" style={{ color: BOBCAT_INK }}>Meu Perfil</h1>
            </div>

            {/* Avatar display */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md mb-3"
                style={{ backgroundColor: BOBCAT_CREAM }}
              >
                {profile.avatar}
              </div>
              <h2 className="text-xl font-bold" style={{ color: BOBCAT_INK }}>{profile.name}</h2>
              <p className="text-sm" style={{ color: '#888' }}>
                {LEVEL_LABELS[profile.level] || profile.level}
              </p>
            </div>

            {/* Edit form */}
            <Card className="border-0 shadow-md mb-4" style={{ borderRadius: 14 }}>
              <CardHeader>
                <CardTitle className="text-sm font-bold" style={{ color: BOBCAT_INK }}>Editar perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{ borderRadius: 10 }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {AVATARS.map(av => (
                      <button
                        key={av}
                        onClick={() => setEditAvatar(av)}
                        className="text-2xl p-2 rounded-xl border-2 transition-all"
                        style={{
                          borderColor: editAvatar === av ? BOBCAT_ORANGE : '#e5e5e5',
                          backgroundColor: editAvatar === av ? BOBCAT_CREAM : 'transparent',
                        }}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nivel</Label>
                  <Select value={editLevel} onValueChange={setEditLevel}>
                    <SelectTrigger className="w-full" style={{ borderRadius: 10 }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">Nivel 1 - Iniciante</SelectItem>
                      <SelectItem value="A2">Nivel 2 - Basico</SelectItem>
                      <SelectItem value="B1">Nivel 3 - Intermediario</SelectItem>
                      <SelectItem value="B2">Nivel 4 - Intermediario superior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: BOBCAT_ORANGE, borderRadius: 12 }}
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                >
                  {profileSaving && <Loader2 className="animate-spin size-4" />}
                  Salvar alteracoes
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-0 shadow-md" style={{ borderRadius: 14 }}>
              <CardContent className="p-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 font-medium"
                  style={{ borderRadius: 12, borderColor: '#e5e5e5', color: BOBCAT_RED }}
                  onClick={handleResetProgress}
                >
                  <RotateCcw className="size-4" />
                  Zerar progresso
                </Button>
                <Separator />
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 font-medium"
                  style={{ borderRadius: 12, borderColor: '#e5e5e5', color: BOBCAT_RED }}
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4" />
                  Sair da conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 border-t bg-white z-50"
          style={{ borderColor: '#eee' }}
        >
          <button
            className="flex flex-col items-center gap-0.5 p-2"
            onClick={() => setScreen('home')}
            style={{ color: BOBCAT_ORANGE }}
          >
            <HomeIcon className="size-5" />
            <span className="text-xs font-medium">Inicio</span>
          </button>
          <button
            className="flex flex-col items-center gap-0.5 p-2"
            style={{ color: '#ccc' }}
          >
            <UserIcon className="size-5" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </nav>
      </div>
    )
  }

  // ============================================================
  // Reset Password Dialog
  // ============================================================

  function ResetPasswordDialog() {
    return (
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent style={{ borderRadius: 16 }}>
          <DialogHeader>
            <DialogTitle>Recuperar senha</DialogTitle>
            <DialogDescription>Digite seu email para receber um link de recuperacao.</DialogDescription>
          </DialogHeader>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={resetEmail}
            onChange={e => setResetEmail(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordOpen(false)} style={{ borderRadius: 10 }}>
              Cancelar
            </Button>
            <Button
              className="text-white"
              style={{ backgroundColor: BOBCAT_ORANGE, borderRadius: 10 }}
              onClick={handleResetPassword}
              disabled={resetSending}
            >
              {resetSending && <Loader2 className="animate-spin size-4" />}
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // ============================================================
  // Screen Router
  // ============================================================

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-white">
      {screen === 'auth' && <AuthScreen />}
      {screen === 'profile-setup' && <ProfileSetupScreen />}
      {screen === 'home' && <HomeScreen />}
      {screen === 'lesson' && <LessonViewerScreen />}
      {screen === 'exercises' && <ExerciseScreen />}
      {screen === 'profile-view' && <ProfileViewScreen />}
      <ResetPasswordDialog />
    </div>
  )
}