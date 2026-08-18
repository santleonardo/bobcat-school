# Bobcat Language School — App PWA

App simples de lições de inglês com perfil de aluno, progresso e painel do professor.

Funciona de duas formas:
- **Sem configurar nada**: tudo fica salvo só no navegador do aluno (localStorage). Funciona offline, mas cada aparelho tem seu próprio progresso e ninguém mais enxerga.
- **Com Supabase configurado**: perfil e progresso ficam na nuvem, sincronizados entre aparelhos, e você (professor) consegue ver a turma inteira em `teacher.html`.

Este guia cobre os três passos: **Supabase** (banco de dados) → **GitHub** (código) → **Vercel** (site no ar).

---

## Passo 1 — Supabase (banco de dados)

1. Crie uma conta grátis em [supabase.com](https://supabase.com) e clique em **New project**.
2. Escolha um nome e uma senha de banco (guarde a senha, mas não vai precisar dela aqui).
3. Espere o projeto terminar de subir (~2 minutos).
4. No menu lateral, vá em **SQL Editor** → **New query**, cole todo o conteúdo do arquivo `schema.sql` deste projeto, e clique em **Run**.
   - Isso cria as tabelas `profiles` e `progress`, com as regras de segurança (RLS) já configuradas.
5. Vá em **Authentication → Providers**, encontre **Email** e **ative**. Nessa mesma tela tem a opção **"Confirm email"** — escolha um dos dois caminhos:
   - **Desligado (mais simples):** o aluno cria a conta e já entra na hora, sem precisar checar o e-mail. Bom para turmas pequenas / alunos mais novos.
   - **Ligado (mais seguro):** o aluno recebe um e-mail de confirmação e precisa clicar no link antes de conseguir entrar. Se escolher essa opção, configure também **Authentication → URL Configuration → Site URL** com a URL do seu site (ex. `https://SEU-SITE.vercel.app`), senão o link de confirmação pode não redirecionar direito.
6. Vá em **Project Settings → API**. Copie:
   - **Project URL**
   - **anon public key**
7. Abra o arquivo `config.js` neste projeto e cole os dois valores:

   ```js
   window.SUPABASE_CONFIG = {
     url: 'https://SEU-PROJETO.supabase.co',
     anonKey: 'SUA-CHAVE-ANON-PUBLICA'
   };
   ```

Pronto — o app já vai detectar automaticamente que o Supabase está configurado e passar a exigir login (e-mail + senha) antes de criar o perfil, sincronizando tudo na nuvem (dá pra conferir isso na tela de Perfil do app, que mostra "☁️ Conta na nuvem").

> **Sobre login:** o app usa o e-mail de verdade do aluno + uma senha (mínimo 6 caracteres) no Supabase Auth. Assim, mesmo se o aluno trocar de aparelho, desinstalar o app ou limpar os dados do navegador, ele recupera o perfil e o progresso de qualquer lugar, só entrando de novo com e-mail e senha. Também tem um link **"Esqueci minha senha"** na tela de login, que envia um e-mail de redefinição automaticamente — não precisa mais do professor mexer no painel do Supabase pra isso (mas se preferir, ainda dá pra redefinir manualmente em **Authentication → Users**).

> **Sobre segurança:** a chave `anon public key` é feita para ser exposta no navegador — ela sozinha não dá acesso a nada; quem protege os dados são as regras de RLS no `schema.sql`. Por padrão, cada aluno só consegue **escrever** no próprio perfil/progresso, mas **qualquer** aluno logado consegue **ler** todos os perfis — é isso que permite o painel do professor funcionar sem precisar de um login separado de professor. Para uma turma pequena isso costuma ser aceitável; se quiser bloquear a leitura só para um login de professor de verdade, é só pedir que eu ajusto o schema.

> **Sem Supabase configurado:** o app funciona do mesmo jeito de antes — sem tela de login, perfil salvo só no navegador (localStorage). É só para quando você quiser sincronizar entre aparelhos e ter o painel do professor que vale a pena configurar o Supabase.

---


## Segurança (professor + APIs de IA)

### Conta de professor
1. Crie um usuário no Supabase Auth (e-mail + senha) só para o professor.
2. Rode o `schema.sql` atualizado (cria a tabela `teachers` e a função `is_teacher()`).
3. Insira o UUID do professor:
   ```sql
   insert into public.teachers (user_id)
   values ('COLE-O-UUID-AQUI')
   on conflict do nothing;
   ```
4. Acesse `/teacher.html` e faça login com esse e-mail/senha (não use mais sessão anônima).

### APIs de IA (`/api/chat`, vocab, explain-error, etc.)
Exigem header `Authorization: Bearer <access_token>` da sessão do aluno. Sem login válido, retornam 401.

### Variáveis na Vercel
- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (ou `SUPABASE_ANON_KEY` para validar JWT)
- `CRON_SECRET` / secrets de push


## Passo 2 — GitHub (guardar o código)

Se ainda não tem o Git configurado, instale em [git-scm.com](https://git-scm.com).

Dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Bobcat app: perfil, lições e painel do professor"
```

Crie um repositório novo (vazio, sem README) em [github.com/new](https://github.com/new), depois:

```bash
git remote add origin https://github.com/SEU-USUARIO/bobcat-app.git
git branch -M main
git push -u origin main
```

---

## Passo 3 — Vercel (colocar no ar)

1. Crie uma conta grátis em [vercel.com](https://vercel.com) (dá pra entrar direto com GitHub).
2. Clique em **Add New → Project**.
3. Selecione o repositório `bobcat-app` que você acabou de subir.
4. Em **Framework Preset**, deixe como **Other** (é um site estático, não precisa de build).
5. Clique em **Deploy**.

Em menos de um minuto você recebe um link tipo `https://bobcat-app.vercel.app`. É só esse link que os alunos vão abrir — em um celular, o navegador vai oferecer **"Adicionar à tela inicial"** automaticamente (é o PWA sendo instalado).

Toda vez que você der `git push`, a Vercel republica sozinha.

---

## Passo 4 — IA para praticar conversação (opcional, e gratuito)

O app tem uma tela **"🤖 Praticar com IA"** onde o aluno **cria suas próprias personalidades de IA** — escolhe um avatar, um nome, um **gênero (feminino ou masculino)** e descreve a personalidade do jeito que quiser (ex: "uma astronauta aventureira que adora contar histórias sobre o espaço") — e cada personalidade vira uma conversa exclusiva, com histórico salvo separado. O gênero escolhido define os pronomes que a IA usa para si mesma em inglês (she/her ou he/him) e, quando o navegador do aluno tiver vozes em inglês disponíveis, também influencia a voz usada na leitura em voz alta. O aluno pode criar quantas personalidades quiser (ficam numa lista, tipo contatos) e voltar a conversar com qualquer uma delas depois. A IA ajusta o vocabulário ao nível do aluno e corrige erros com gentileza, mantendo o "jeito de ser" descrito, mas sempre dentro das regras de segurança do app (isso vale mesmo que o aluno tente descrever uma personalidade que peça pra "ignorar as regras" — o servidor sempre prioriza a segurança). Isso usa o **Gemini API do Google (Google AI Studio)**, que tem uma cota gratuita generosa (bem mais do que uma escola pequena usaria) — não precisa cartão de crédito.

> As personalidades e as conversas ficam salvas só no navegador/aparelho do aluno (localStorage) — não sincronizam entre aparelhos nem aparecem para o professor, mesmo com Supabase configurado.

1. Acesse [aistudio.google.com](https://aistudio.google.com), entre com uma conta Google e clique em **Get API key → Create API key**.
2. Copie a chave gerada (começa com `AIza...`).
3. No painel da Vercel, abra o projeto do app → **Settings → Environment Variables**.
4. Adicione uma variável:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** cole a chave que você copiou
   - Marque para os ambientes **Production** (e Preview, se usar).
5. Clique em **Save**, depois vá em **Deployments** e clique em **Redeploy** no último deploy (para a variável nova entrar em vigor).

Pronto — a chave fica só no servidor da Vercel, nunca aparece no navegador do aluno. Se você não configurar essa variável, a tela de chat continua no app mas mostra um aviso avisando que a IA não está configurada, sem quebrar o resto do app.

> **Sobre custo:** o Gemini 2.5 Flash-Lite (modelo usado por padrão, veja `api/chat.js`) tem uma cota diária gratuita alta o bastante para o uso normal de uma turma. Se um dia a escola crescer muito e passar da cota grátis, dá pra ativar faturamento no Google AI Studio (paga só pelo excedente) — mas isso é opcional e você decide se/quando fazer isso.

---

## Lembretes por notificação (Web Push)

Na tela **Praticar com IA** o aluno pode ativar **Lembretes de prática**. Isso usa Web Push + Service Worker: mesmo com o app fechado, o celular pode receber um toque do tipo “Hora de praticar inglês!”.

### O que já funciona no app
- Botão **Ativar / Desativar** lembretes
- Pedido de permissão de notificação
- Inscrição Push (subscription) salva no aparelho e, com Supabase, também na tabela `push_subscriptions`
- Botão **⏰ Configurar horários** — o aluno escolhe um ou mais horários do dia pra receber o lembrete (fica salvo por aparelho; sem escolha nenhuma, usa o padrão 8h/18h)
- Service Worker exibe a notificação e, ao tocar, abre a tela de Praticar com IA
- **Notificação de teste** (local, sem servidor)
- Com Shift + clique no teste: envia push de verdade via `/api/push-send` (precisa das chaves VAPID na Vercel)

### Configuração na Vercel (obrigatória para push real)

1. Gere um par de chaves VAPID (não reaproveite nenhuma chave que já tenha aparecido em texto puro em algum arquivo do projeto): `npx web-push generate-vapid-keys`.
   - **Pública** → cole em `config.js` (`APP_CONFIG.vapidPublicKey`)
   - **Privada** → só na Vercel, nunca em nenhum arquivo do repositório

2. No painel da Vercel → **Settings → Environment Variables**, adicione:

| Name | Value |
|------|--------|
| `VAPID_PUBLIC_KEY` | a mesma pública de `config.js` |
| `VAPID_PRIVATE_KEY` | a privada gerada no passo 1 (nunca no código) |
| `VAPID_SUBJECT` | `mailto:seu-email@escola.com` |
| `SUPABASE_URL` | (opcional) URL do projeto Supabase — para enviar à turma inteira |
| `SUPABASE_SERVICE_ROLE_KEY` | (opcional) service role do Supabase — só no servidor |
| `GEMINI_API_KEY` | (opcional, mesma chave do `api/chat.js`) com Supabase + essa chave, o lembrete vira personalizado com base na última conversa (veja abaixo) |
| `PUSH_SEND_SECRET` | (recomendado) uma senha à sua escolha — protege `/api/push-send` de ser chamada por qualquer um que descubra a URL |

3. Rode de novo o `schema.sql` no Supabase — além de garantir a tabela `push_subscriptions`, agora ele também adiciona as colunas `reminder_times` e `last_reminder_sent_at` nela (seguro rodar de novo em um banco que já existe).

4. **Redeploy** o projeto na Vercel (para instalar a dependência `web-push` do `package.json`).

### Lembrete automático, todo dia, no horário de cada aluno

O envio automático **não** usa o Cron nativo da Vercel: no plano gratuito (Hobby), cron só pode rodar 1x por dia, o que não é suficiente pra checar o horário individual de cada aluno. Em vez disso, o repositório já vem com um workflow do **GitHub Actions** (`.github/workflows/push-reminders.yml`) que chama `/api/push-send` a cada 15 minutos; a própria rota decide quem está "no horário" agora e só manda notificação pra esses alunos.

Pra ativar, em **Settings → Secrets and variables → Actions** deste repositório no GitHub, adicione:

| Secret | Valor |
|--------|-------|
| `APP_URL` | `https://SEU-SITE.vercel.app` (sem barra no final) |
| `PUSH_SEND_SECRET` | o **mesmo** valor que você colocou na env var `PUSH_SEND_SECRET` da Vercel |

Pronto — a partir do próximo `git push`, o GitHub já passa a rodar o workflow sozinho a cada 15 minutos (dá pra testar na hora clicando em "Run workflow" na aba **Actions** do repositório).

> Prefere manter tudo dentro da Vercel? Se o projeto estiver no plano **Pro**, adicione de volta um bloco `"crons"` em `vercel.json` apontando pra `/api/push-send` (o handler já aceita chamadas `GET` e reconhece o header que o Vercel Cron manda automaticamente) e pode desativar o workflow do GitHub Actions.

### Enviar um aviso manual pra turma (fora do horário configurado)

```bash
curl -X POST https://SEU-SITE.vercel.app/api/push-send \
  -H "Content-Type: application/json" \
  -H "x-push-secret: SUA_SENHA_SE_CONFIGUROU" \
  -d '{"title":"Bobcat 🐱","body":"Hora de praticar inglês com a IA!","url":"./index.html?screen=ai-chat"}'
```

Diferente do envio automático (que só manda pra quem está no horário certo), um `POST` como esse manda **na hora**, pra turma inteira — útil pra um aviso pontual do professor. Exige `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` configurados. Sem isso, o endpoint ainda aceita uma `subscription` avulsa no body (como o botão de teste com Shift faz).

### Limitações
- **iPhone (Safari/PWA):** Web Push em PWA no iOS exige iOS 16.4+ e o app instalado na tela inicial; o suporte ainda é mais limitado que no Android.
- **Android + Chrome:** funciona bem com o app instalado ou aberto no navegador.
- A notificação em si é um lembrete genérico; ao abrir o chat, a mensagem proativa da personalidade (já implementada) continua gerando o “bom dia / como você está?” no tom da IA.
- O horário configurado é arredondado pro quarto de hora mais próximo (ex.: 9h07 vira 9h00) e o lembrete pode chegar com até 15 minutos de atraso em relação a ele — é a granularidade da checagem do GitHub Actions.

### Lembrete personalizado com a última conversa

Se **Supabase** e **`GEMINI_API_KEY`** estiverem configurados na Vercel, o `/api/push-send` personaliza automaticamente o título/corpo do lembrete de cada aluno com base no final de uma conversa recente dele com a IA — algo como *"Mia 🐱 — Ready to talk about that trip to Rio?"* em vez do texto genérico.

Como funciona:
- Se o aluno tiver **mais de uma personalidade de IA criada**, o servidor sorteia qual delas "manda" o lembrete dessa vez (usando o histórico daquela personalidade específica) — assim o lembrete não vem sempre da mesma, o que ficaria estranho pra quem conversa com várias.
- Com só uma personalidade (ou nenhuma conversa ainda registrada pra sorteada), cai no resumo da conversa mais recente (qualquer personalidade), como antes — gravado na tabela `ai_chat_last_conversation` a cada resposta da IA no chat.
- Sem `GEMINI_API_KEY`, ou se o Gemini falhar nesse aluno em particular, cai automaticamente no `title`/`body` genérico.
- Para desligar a personalização em um envio específico (ex.: um aviso igual pra turma toda), mande `"personalize": false` no body do POST.
- Por segurança de custo, um mesmo envio gera no máximo 60 lembretes personalizados (turmas maiores que isso recebem o texto genérico para o excedente).
- Exige rodar de novo o `schema.sql` no Supabase (cria as tabelas `ai_chat_last_conversation`, `ai_chat_personas` e `ai_chat_history`).

---

## Estrutura do projeto

```
index.html           → tela de perfil + lista de lições (o app em si)
app.js                → lógica de navegação e telas
db-client.js          → decide entre Supabase (nuvem) e localStorage (offline)
config.js             → suas chaves do Supabase + VAPID pública (edite aqui)
api/chat.js            → função serverless (Vercel) que fala com a IA — a GEMINI_API_KEY fica aqui, como variável de ambiente, nunca neste arquivo
api/explain-error.js   → mesma chave/modelo do chat; gera as explicações da "Trilha de Erro" (tela de fim de lição, quando o aluno não passa)
api/wordsearch-words.js → mesma chave/modelo do chat; gera palavras novas (com mini-definição) pro Caça-Palavras a cada partida, por tema. Sem GEMINI_API_KEY, ou se a IA falhar, o jogo cai automaticamente na lista fixa de sempre.
api/push-send.js       → envia notificações Web Push (VAPID + opcionalmente Supabase)
api/delete-account.js  → exclui a conta do aluno (LGPD) — precisa de SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
.github/workflows/push-reminders.yml → GitHub Actions: chama /api/push-send a cada 15 min (lembrete automático)
style.css             → visual do app
manifest.json         → deixa o app instalável
sw.js                 → cache offline + handlers de push/notificationclick
schema.sql            → script para criar as tabelas no Supabase
teacher.html         → painel do professor (só funciona com Supabase configurado)
package.json          → dependência web-push (Vercel instala no deploy)
icons/               → ícones do app
lessons/
  gridscape-*.html   → lições do curso de inglês em mapa Canvas
```

## Currículo completo (5 semestres)

Esquema oficial: **5 semestres**, com **C1 e C2 unidos no Semestre 5**.

**Meta do Semestre 1 (A1):** o aluno sai capaz de se apresentar, perguntar sobre pessoas e fazer perguntas básicas no **presente, passado e futuro**.

| Semestre | Nível CEFR | Faixa | Status |
|----------|------------|-------|--------|
| **1** | A1 (+ Introdutório) | Pronúncia + Lições 1–18 | ✅ Existente (reordenado) |
| **2** | A2 | Lições 19–29 | ✅ Existente (reordenado) |
| **3** | B1 | Lições 30–40 | ✅ Existente (reordenado) |
| **4** | B1 → B2 | Lições 41–50 | 📝 Planejado |
| **5** | B2 → C2 *(C1 + C2)* | Lições 51–70 | 📝 Planejado |

> **Nota de disponibilidade (arquivos em `lessons/`):**  
> - Lições de inglês 1–40: formato **gridscape** (`gridscape-*.html`, canvas interativo).  
> - Introdução: `pronuncia-essencial.html` (formato próprio).  
> - IDs no `app.js` seguem o padrão do currículo (`licao-10-can-cant`, `verb-to-be`, etc.).  
> - Semestres 4–5 (lições 41–70) continuam planejados.  
> - As versões antigas `licao-*.html` (design longo) foram removidas.

---

## Semestre 1 — A1 Conversacional

*Saída esperada: Hi, I’m… / Where do you live? / What do you do? / Can you…? / What did you do yesterday? / What are you going to do tomorrow?*

| # | ID | Nome | Q | Descrição |
|---|-----|------|---|-----------|
| 0 | `pronuncia-essencial` | Pronúncia Essencial do Inglês | 15 | Comece por aqui: alfabeto, vogais, consoantes e combinações mais comuns |
| 1 | `verb-to-be` | Lição 1 — Verb To Be | 21 | am, is, are — afirmativas, negativas e perguntas |
| 2 | `saudacoes-apresentacoes` | Lição 2 — Saudações e Apresentações | 17 | Greetings, introductions e diálogos com áudio |
| 3 | `licao-3-perguntas-artigos` | Lição 3 — Fazendo Perguntas e Apresentando Coisas | 20 | Wh- words, artigos a/an/the — base para perguntar sobre pessoas e coisas |
| 4 | `licao-4-revisao-perguntas` | Lição 4 — Revisando: Quem é Você? O Que é Isso? | 12 | Revisão de To Be, saudações e Wh- questions com prática de diálogos |
| 5 | `licao-5-preposicoes` | Lição 5 — Preposições: Onde? Com Quem? Como? | 10 | Preposições de lugar e companhia para localizar pessoas e coisas |
| 6 | `licao-6-posse` | Lição 6 — Posse: De Quem É? | 12 | Possessivos, 's e whose — falar de pertences e pessoas |
| 7 | `licao-7-simple-present-daily-life` | Lição 7 — Simple Present: Rotina e Hábitos | 12 | Simple Present, advérbios de frequência e a rotina diária |
| 8 | `licao-8-do-does-to-for` | Lição 8 — DO/DOES, TO e FOR | 14 | Verbos essenciais, perguntas com DO/DOES e o uso de TO e FOR |
| 9 | `licao-9-perguntas-simple-present` | Lição 9 — Perguntas no Simple Present | 12 | Perguntas e negativas com Do/Does — perguntar sobre pessoas e rotina |
| 10 | `licao-10-can-cant` | Lição 10 — Can / Can't | 38 | Habilidade, permissão e pedidos do dia a dia com can/can't |
| 11 | `licao-11-there-is-there-are` | Lição 11 — There Is / There Are | 12 | Descrevendo lugares e objetos com There is/There are |
| 12 | `licao-12-here-there` | Lição 12 — Aqui e Ali: Localização | 12 | Localização, posição e phrasal verbs básicos de movimento |
| 13 | `licao-13-to-be-passado` | Lição 13 — To Be no Passado (was/were) | 12 | Was e were — como era, onde estava, quem estava |
| 14 | `licao-14-simple-past-regular` | Lição 14 — Simple Past: Verbos Regulares | 12 | Passado de ação com verbos regulares (-ed) e expressões de tempo |
| 15 | `licao-15-simple-past-irregular` | Lição 15 — Simple Past: Verbos Irregulares | 12 | Verbos irregulares mais comuns no Simple Past |
| 16 | `licao-16-future-going-to` | Lição 16 — Futuro com Going To | 12 | Planos e intenções futuras com going to |
| 17 | `licao-17-future-will` | Lição 17 — Futuro com Will | 12 | Previsões, decisões espontâneas e promessas com will |
| 18 | `licao-18-revisao-completa` | Lição 18 — Revisão A1: Conversação Básica 🎓 | 16 | Projeto final do Semestre 1: se apresentar, perguntar sobre pessoas, rotina, ontem e planos |

## Semestre 2 — A2 (expansão do dia a dia)

| # | ID | Nome | Q | Descrição |
|---|-----|------|---|-----------|
| 19 | `licao-19-object-possessive-pronouns` | Lição 19 — Pronomes Objeto e Possessivos | 12 | Object pronouns, possessives e mais verbos essenciais |
| 20 | `licao-20-present-continuous` | Lição 20 — Present Continuous | 12 | Ações em andamento e situações temporárias |
| 21 | `licao-21-countable-uncountable` | Lição 21 — Contáveis e Incontáveis | 12 | Countable/uncountable, some, any, much e many |
| 22 | `licao-22-quantities-choices` | Lição 22 — Quantidades e Escolhas | 12 | Expressando quantidades e fazendo escolhas em inglês |
| 23 | `licao-23-quantities-distance-time` | Lição 23 — Quantidade, Distância e Tempo | 12 | How much/many/long/far e perguntas de medida |
| 24 | `licao-24-survival-english` | Lição 24 — Survival English | 12 | Inglês de sobrevivência para situações reais do dia a dia |
| 25 | `licao-25-talking-about-the-past` | Lição 25 — Falando Sobre o Passado | 12 | Perguntas, negativas e expressões de tempo no passado (consolidação) |
| 26 | `licao-26-comparatives-superlatives` | Lição 26 — Comparativos e Superlativos | 12 | Comparando pessoas e coisas em inglês (nível A2) |
| 27 | `licao-27-modal-verbs` | Lição 27 — Verbos Modais (introdução) | 12 | Could, must, should e outros modais além de can |
| 28 | `licao-28-phrasal-verbs` | Lição 28 — Phrasal Verbs Essenciais | 12 | Phrasal verbs mais usados no inglês do dia a dia |
| 29 | `licao-29-revisao-semestre-2` | Lição 29 — Revisão Geral do Semestre 2 🎓 | 12 | Revisão completa do Semestre 2 (A2) e consolidação |

## Semestre 3 — B1 (narrativa e experiência)

| # | ID | Nome | Q | Descrição |
|---|-----|------|---|-----------|
| 30 | `licao-30-past-continuous` | Lição 30 — Past Continuous | 12 | Ações em progresso no passado: was/were + verbo-ing |
| 31 | `licao-31-simple-past-past-continuous` | Lição 31 — Simple Past × Past Continuous | 12 | Ações simultâneas e interrompidas ao contar histórias |
| 32 | `licao-32-present-perfect` | Lição 32 — Present Perfect (introdução) | 12 | Have/has + particípio — primeira abordagem ao Present Perfect |
| 33 | `licao-33-present-perfect-experiences` | Lição 33 — Present Perfect: Experiences | 12 | Experiências de vida com ever, never, before |
| 34 | `licao-34-present-perfect-simple-past` | Lição 34 — Present Perfect × Simple Past | 12 | Quando usar cada tempo: since, for, last, ago |
| 35 | `licao-35-present-perfect-already-yet-just` | Lição 35 — Present Perfect: Already, Yet, Just | 12 | Already, yet, just, still, recently e lately |
| 36 | `licao-36-future-will-going-to` | Lição 36 — Futuro consolidado (Will, Going to & Present Continuous) | 12 | Decisões espontâneas, planos e compromissos marcados |
| 37 | `licao-37-modal-verbs-advice-obligation` | Lição 37 — Modais: Conselho, Obrigação e Permissão | 12 | Should, must, have to, can, may e might em contexto real |
| 38 | `licao-38-comparatives-superlatives-equality` | Lição 38 — Comparativos, Superlativos e Igualdade | 12 | Bigger, the best, as...as — nível B1 |
| 39 | `licao-39-conditionals-zero-first` | Lição 39 — Conditionals: Zero & First | 12 | Fatos gerais e possibilidades reais com if/unless |
| 40 | `licao-40-revisao-semestre-3` | Lição 40 — Grande Revisão A2 → B1 🎓 | 12 | Revisão completa do Semestre 3 e projeto final B1 |

## Semestre 4 — B1 → B2 *(planejado)*

**Projeto final:** *The Story of My Life*

| # | Título | Tópicos principais |
|---|--------|--------------------|
| 41 | Second Conditional | Second Conditional; Situações hipotéticas e improváveis; Imaginação e conselhos hipotéticos; if + past, would + verb; What would you do if...?; If I were you... |
| 42 | First × Second Conditional | First Conditional × Second Conditional; Possibilidade real × situação hipotética; unless; as long as; provided that; in case |
| 43 | Present Perfect Continuous | have/has been + verb-ing; Ações iniciadas no passado que continuam; Ações recentes com resultado presente; for / since; Present Perfect × Present Perfect Continuous |
| 44 | Past Perfect | had + past participle; Uma ação anterior a outra no passado; already; before; after; by the time |
| 45 | Past Perfect × Simple Past | Sequência temporal no passado; Narrativas mais complexas; Storytelling; Causa e consequência; before / after / by the time |
| 46 | Passive Voice | Present Passive; Past Passive; Future Passive; Modal + Passive; be + past participle; Uso quando o agente não é importante ou desconhecido |
| 47 | Reported Speech | Direct Speech × Reported Speech; say × tell; Mudanças básicas de tempo verbal; Mudanças de pronomes; Mudanças de expressões de tempo e lugar; Reported questions |
| 48 | Relative Clauses | who; which; that; whose; where; when |
| 49 | Gerunds & Infinitives | Gerund: verb + -ing; Infinitive: to + verb; enjoy doing / avoid doing / finish doing / keep doing / mind doing; want to / need to / decide to / hope to / plan to / promise to; remember doing × remember to do; stop doing × stop to do |
| 50 | Grande Revisão B1 → B2 | First Conditional; Second Conditional; Present Perfect Continuous; Past Perfect; Passive Voice; Reported Speech |

## Semestre 5 — B2 → C2 *(C1 + C2 juntos — planejado)*

**Projetos:** *An Issue Worth Discussing* e *The Big Argument*

| # | Título | Tópicos principais |
|---|--------|--------------------|
| 51 | Third Conditional & Mixed Conditionals | Third Conditional; Past unreal situations; Regrets and missed opportunities; would have + past participle; could have / might have; Mixed Conditionals |
| 52 | Advanced Modal Verbs & Deduction | must have; might have; may have; could have; can't have; should have |
| 53 | Advanced Passive Voice | Passive Voice em tempos diferentes; Passive with modals; Perfect Passive; Continuous Passive; It is believed that...; He is thought to... |
| 54 | Advanced Reported Speech | Reported statements; Reported questions; Reported commands; Reporting verbs; admit; deny |
| 55 | Advanced Relative Clauses & Reduced Clauses | Defining × Non-defining Relative Clauses; who / whom / which / whose; where / when; Preposition + relative pronoun; which para referência a uma oração inteira; Reduced Relative Clauses |
| 56 | Advanced Gerunds, Infinitives & Verb Patterns | verb + gerund; verb + infinitive; verb + object + infinitive; gerund after prepositions; infinitive of purpose; bare infinitive |
| 57 | Complex Sentence Structure | although; even though; whereas; while; despite; in spite of |
| 58 | Discourse, Cohesion & Coherence | Linking devices; furthermore; moreover; in addition; besides; nevertheless |
| 59 | Nuance, Register & Advanced Vocabulary | Registro: informal / neutral / formal / academic; Nuance lexical; big / enormous / substantial; good / beneficial / advantageous; bad / harmful / detrimental; say / claim / argue / assert |
| 60 | Grande Revisão B2 → C1 | Conditionals; Modal verbs; Passive voice; Reported speech; Relative clauses; Complex sentences |
| 61 | Advanced Inversion | Negative adverbials; Inversion after restrictive expressions; Never have I...; Rarely do we...; Not only did he..., but...; Under no circumstances... |
| 62 | Cleft Sentences & Emphasis | It-clefts; What-clefts; All-clefts; Emphatic structures; It was John who...; What I need is... |
| 63 | Advanced Subordination & Nominalization | Subordinação: concessão, causa, consequência, condição, propósito e; contraste; Nominalization; Transformação de estruturas verbais em estruturas nominais; Linguagem condensada acadêmica, jornalística e profissional |
| 64 | Hedging, Certainty & Academic Language | may; might; could; appears to; seems to; tends to |
| 65 | Pragmatics: Meaning Beyond Words | Implicature; Politeness; Pedidos indiretos; Recusas diplomáticas; Desacordo; Crítica |
| 66 | Idioms, Metaphors & Figurative Language | Idioms; Metaphors; Similes; Hyperbole; Understatement; Euphemism |
| 67 | Collocations, Lexical Chunks & Precision | Collocations; Lexical chunks; Precisão lexical; deeply concerned; highly unlikely; utterly ridiculous |
| 68 | Register, Style & Voice | Informal English; Neutral English; Formal English; Academic English; Professional English; Conversational English |
| 69 | Rhetoric, Argumentation & Persuasion | Claim; Evidence; Reasoning; Counterargument; Rebuttal; Concession |
| 70 | Grande Revisão C1 → C2 | Advanced inversion; Cleft sentences; Nominalization; Hedging; Pragmatics; Figurative language |

---

> **Legenda**
> - ✅ = página HTML em `lessons/` e entrada em `app.js`
> - 📝 = roadmap em `teacher.html` (aba Próximos Semestres)
>
> **IDs estáveis:** os arquivos HTML e os `id` de progresso **não mudaram** — só a ordem, o nível CEFR e os nomes de exibição. Progresso antigo do aluno continua válido.
>
> **Lógica da reorganização:** Simple Present, DO/DOES, Can, Simple Past e Future foram antecipados para o A1, para fechar o ciclo conversacional mínimo no fim do Semestre 1. Present Perfect foi concentrado no B1 (depois do Simple Past consolidado).


## Adicionando novas lições

Tem dois jeitos de adicionar lição: **pelo painel do professor** (mais simples, não mexe em código) ou **direto nos arquivos do projeto** (o jeito "clássico", exige um novo `git push`).

### Pelo painel do professor (upload de HTML, sem mexer em código)

Só funciona com o Supabase configurado (a lição fica guardada no banco, já que o app é um site estático e não tem como criar arquivo novo sozinho).

1. Monte o arquivo `.html` da lição do jeito de sempre: duplique um `lessons/gridscape-*.html` existente (mapa Canvas com áudio e exercícios) e troque o conteúdo, mantendo:
   - a linha `const LESSON_ID = '...'` com um id novo e único (o mesmo que você vai usar no campo "ID" do painel);
   - as três tags `<script src="../config.js">`, `<script src="../db-client.js">` e o `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">` no `<head>`;
   - a função `finishLesson()` (ajuste a contagem de `total` para o número de questões da nova lição).
2. Abra `teacher.html` → aba **"➕ Adicionar Lição"**.
3. Escolha se ela entra em **"Lições"** (agrupada pelo nível, com bloqueio sequencial normal — o aluno precisa concluir a anterior do catálogo pra desbloquear) ou **"Extra"** (libera direto, sem bloqueio, como o Manual de Português).
4. Preencha nível (ex. `B2`), ícone, nome, descrição e número de questões, confira o ID gerado automaticamente a partir do nome (pode editar) e selecione o arquivo `.html` que você montou no passo 1.
5. Clique em **"Adicionar lição"** — ela já aparece no app dos alunos na hora, sem precisar publicar nada de novo no GitHub/Vercel.

A lição é aberta pelo endereço `lessons/custom.html?id=SEU-ID`, uma página "carregadora" que busca o HTML salvo no banco e o exibe — por isso os caminhos relativos (`../config.js`, `../index.html` etc.) dentro dela continuam funcionando normalmente. Pra excluir ou conferir as lições já enviadas, use a lista logo abaixo do formulário nessa mesma aba (excluir a lição do catálogo não apaga o progresso que os alunos já tiverem salvo nela).

> É preciso rodar a nova tabela do `schema.sql` (`custom_lessons`, perto do final do arquivo) no SQL Editor do Supabase se você já tinha o banco configurado antes dessa atualização.

### Direto nos arquivos do projeto (o jeito "clássico")

1. Duplique um `lessons/gridscape-*.html` existente (mapa Canvas com áudio e exercícios), troque o conteúdo pela nova lição, mas mantenha:
   - a linha `const LESSON_ID = '...'` com um id novo e único;
   - as três tags `<script src="../config.js">`, `<script src="../db-client.js">` e o `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">` no `<head>`;
   - a função `finishLesson()` (ajuste a contagem de `total` para o número de questões da nova lição).
2. Em `app.js`, adicione a lição no array `LESSONS` no topo do arquivo.
3. Em `sw.js`, adicione o novo arquivo à lista `APP_SHELL` para funcionar offline, e suba o número em `CACHE_NAME` (ex.: `bobcat-app-v3` → `v4`) para forçar o navegador dos alunos a buscar a versão nova.

### Transformando um PDF de lição em lição interativa

Fluxo recomendado para pegar uma apostila em PDF (como a de "Saudações e Apresentações") e virar uma lição do app:

1. Extraia do PDF: objetivo da aula, vocabulário novo, diálogo modelo, exercícios (e o gabarito).
2. Duplique um arquivo `.html` de lição existente e reescreva o conteúdo, reaproveitando os componentes já prontos: `.fill-grid` (completar lacunas), `.mc-item`/`.mc-options` (múltipla escolha), `.dialog-box` (diálogo).
3. Adapte a função `checkParts()`/`finishLesson()` com as respostas certas de cada exercício novo.
4. Registre a lição em `app.js` e `sw.js` como no passo acima.

### Áudio (pronúncia) sem precisar hospedar arquivos de som

As lições Canvas (`gridscape-*.html`) já usam a **Web Speech API** do navegador (`speechSynthesis`), que faz o próprio navegador "falar" o texto em inglês — não precisa gravar, subir nem hospedar nenhum arquivo `.mp3`. Função pronta (`speak(btn, texto)`) e um botão `🔊 ouvir` já ficam ao lado de cada palavra/frase do vocabulário e do diálogo. Para reaproveitar em outra lição, basta chamar `speak(this, 'texto em inglês')` no `onclick` de um botão com a classe `audio-btn`.
   - Vantagem: funciona offline, sem custo, sem hospedagem.
   - Limitação: a voz depende do navegador/aparelho do aluno (qualidade varia, mas é totalmente aceitável para prática de pronúncia).

### Vídeo

Para vídeo real (ex. um vídeo do YouTube sobre o tema), incorpore um `<iframe>` no corpo da lição, por exemplo:

```html
<div class="video-box">
  <iframe width="100%" height="315"
    src="https://www.youtube.com/embed/SEU_VIDEO_ID"
    title="Vídeo da lição" frameborder="0" allowfullscreen></iframe>
</div>
```

Troque `SEU_VIDEO_ID` pelo ID do vídeo escolhido (a parte depois de `watch?v=` na URL do YouTube). A versão gridscape (`gridscape-saudacoes.html`) já tem um bloco `.video-box` reservado para isso — é só trocar o texto de aviso pelo `<iframe>`.


## Painel do professor

Depois de configurar o Supabase, abra `https://SEU-SITE.vercel.app/teacher.html` — mostra todos os alunos que já criaram perfil, pontuação por lição e data da última tentativa. Dá pra favoritar esse link separado do app dos alunos.

## Canal de mensagens (aluno ↔ professor)

Cada aluno tem, no próprio perfil (aba "Perfil" → "💬 Fale com o professor"), um campo para mandar mensagens/dúvidas. Elas chegam para o professor na aba "💬 Mensagens" de `teacher.html`, organizadas por aluno (como uma caixa de conversas), e o professor pode responder por lá — a resposta aparece de volta no app do aluno.

Esse recurso **só funciona com o Supabase configurado** (não existe versão local/offline, já que a mensagem precisa "viajar" de um aparelho para o outro). Se você já tinha o Supabase configurado antes dessa atualização, é preciso rodar a nova parte do `schema.sql` (a tabela `messages` e as políticas dela, logo abaixo da tabela `progress`) no SQL Editor do Supabase — o restante do arquivo pode ser executado de novo sem problema, os `create table if not exists` e `drop policy if exists` são seguros para rodar mais de uma vez.

### Enviando arquivos pelo chat (PDF, Word, texto, planilha, imagem...)

Ao lado da caixa de mensagem, tanto no app do aluno quanto no painel do professor, tem um botão 📎 para anexar um arquivo — junto com o texto, ou sozinho, sem escrever nada. Tipos aceitos: PDF, Word (`.doc`/`.docx`), OpenDocument (`.odt`), RTF, texto (`.txt`), planilha (`.xls`/`.xlsx`/`.csv`), apresentação (`.ppt`/`.pptx`) e imagens (`.jpg`/`.png`). Tamanho máximo: 10MB por arquivo. O arquivo aparece na conversa como um cartão clicável que abre/baixa o anexo.

Os arquivos ficam guardados no **Supabase Storage**, num bucket chamado `mensagens-arquivos` (criado automaticamente ao rodar o `schema.sql` — não precisa criar nada manualmente no painel do Supabase). Se você já tinha o Supabase configurado antes dessa atualização, rode o `schema.sql` de novo no SQL Editor: ele adiciona as colunas novas na tabela `messages` (`file_url`, `file_name`, `file_type`, `file_size`) e cria o bucket + políticas de Storage, tudo de forma segura para rodar mais de uma vez.

> **Sobre segurança dos arquivos:** o bucket é público (mesmo trade-off já assumido no resto do projeto) — quem tiver o link direto do arquivo consegue abrir, mas ninguém consegue enviar ou listar arquivos sem estar autenticado (aluno logado ou o painel do professor). Para uma turma pequena costuma ser um risco aceitável.

## Senha para zerar progresso (uma por aluno)

O botão "Zerar progresso das lições" (no perfil do aluno) agora pede uma senha antes de apagar qualquer coisa. Essa senha é **definida pelo professor, individualmente para cada aluno**, na aba "🔑 Senhas" de `teacher.html` — basta digitar a senha desejada no campo do aluno e clicar em Salvar (deixar em branco remove a senha, e sem senha o aluno não consegue zerar sozinho).

- Com Supabase configurado: cada aluno usa a própria senha, cadastrada pelo professor.
- Sem Supabase (app rodando só localmente): não existe painel do professor, então o app cai para a senha única em `config.js` → `window.APP_CONFIG.resetProgressPassword`, que serve como alternativa.
- Assim como as outras senhas deste projeto (é um app 100% front-end), essa não é um segredo criptográfico à prova de tudo — quem souber mexer no navegador consegue contornar. Ela serve para evitar zeragem sem querer ou sem autorização, não como proteção contra alguém tecnicamente insistente.

Também é preciso rodar a nova tabela do `schema.sql` (`student_reset_passwords`, perto do final do arquivo) no SQL Editor do Supabase se você já tinha o banco configurado antes dessa atualização.

---

## Design das lições de inglês (Canvas / mapa vertical)

O curso de inglês (A1–B1) usa o visual **Gridscape**: cards empilhados, arraste vertical, áudio TTS, quiz, lacunas e exercícios práticos (V/F, combinar, ordenar diálogo, prática oral, montar frase).

### Arquivos compartilhados

- `lessons/lesson-kit.js` — HUD/XP, `speak()` (TTS com gênero), confetti, ponte de progresso (`finishLesson`)
- `lessons/gridscape-kit.js` / `gridscape-kit.css` — motor do mapa (nós, câmera, exercícios práticos)
- Inclua nos HTML de lição Canvas (nessa ordem):

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../config.js"></script>
<script src="../db-client.js"></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
<script src="lesson-kit.js"></script>
<script src="gridscape-kit.js"></script>
```

```js
BobcatLesson.init({ lessonId: 'licao-3-perguntas-artigos', totalQuestions: 20 });
// ao finalizar:
await BobcatLesson.finishLesson(correct, total, 'correct'); // ou 'filled'
```

### Progresso real

- Nota mínima continua **85%** (`PASSING_PCT` em `db-client.js`).
- Na Lição 2 interativa a pontuação é composta: drag-drop (8) + quiz (6) + memória (6) = 20.
- Fotos: Pexels & domínio público · Design interativo inspirado em Genially.

Para migrar outras lições ao mesmo visual: reutilize o CSS/estrutura da Lição 2 e o `lesson-kit.js`; mantenha o mesmo `LESSON_ID` do catálogo em `app.js`.
