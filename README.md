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

## Estrutura do projeto

```
index.html          → tela de perfil + lista de lições (o app em si)
app.js               → lógica de navegação e telas
db-client.js         → decide entre Supabase (nuvem) e localStorage (offline)
config.js            → suas chaves do Supabase (edite aqui)
style.css            → visual do app
manifest.json        → deixa o app instalável
sw.js                → cache offline (service worker)
schema.sql            → script para criar as tabelas no Supabase
teacher.html         → painel do professor (só funciona com Supabase configurado)
icons/               → ícones do app
lessons/
  verb-to-be.html    → lição interativa "Verb To Be"
```

## Adicionando novas lições

1. Duplique `lessons/verb-to-be.html` (ou `lessons/saudacoes-apresentacoes.html`, que já tem áudio embutido), troque o conteúdo pela nova lição, mas mantenha:
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

A lição `saudacoes-apresentacoes.html` já usa a **Web Speech API** do navegador (`speechSynthesis`), que faz o próprio navegador "falar" o texto em inglês — não precisa gravar, subir nem hospedar nenhum arquivo `.mp3`. Função pronta (`speak(btn, texto)`) e um botão `🔊 ouvir` já ficam ao lado de cada palavra/frase do vocabulário e do diálogo. Para reaproveitar em outra lição, basta chamar `speak(this, 'texto em inglês')` no `onclick` de um botão com a classe `audio-btn`.
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

Troque `SEU_VIDEO_ID` pelo ID do vídeo escolhido (a parte depois de `watch?v=` na URL do YouTube). A lição `saudacoes-apresentacoes.html` já tem um bloco `.video-box` reservado para isso — é só trocar o texto de aviso pelo `<iframe>`.


## Painel do professor

Depois de configurar o Supabase, abra `https://SEU-SITE.vercel.app/teacher.html` — mostra todos os alunos que já criaram perfil, pontuação por lição e data da última tentativa. Dá pra favoritar esse link separado do app dos alunos.
