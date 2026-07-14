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
5. Vá em **Authentication → Providers**, encontre **Anonymous Sign-Ins** e **ative**.
   - O app usa login anônimo (o aluno não precisa criar senha) para identificar cada perfil com segurança.
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

Pronto — o app já vai detectar automaticamente que o Supabase está configurado e passar a sincronizar na nuvem (dá pra conferir isso na tela de Perfil do app, que mostra "☁️ Sincronizado com a nuvem").

> **Sobre segurança:** a chave `anon public key` é feita para ser exposta no navegador — ela sozinha não dá acesso a nada; quem protege os dados são as regras de RLS no `schema.sql`. Por padrão, cada aluno só consegue **escrever** no próprio perfil/progresso, mas **qualquer** sessão (inclusive anônima) consegue **ler** todos os perfis — é isso que permite o painel do professor funcionar sem precisar de login separado. Para uma turma pequena isso costuma ser aceitável; se quiser bloquear a leitura só para um login de professor de verdade, é só pedir que eu ajusto o schema.

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

1. Duplique `lessons/verb-to-be.html`, troque o conteúdo pela nova lição, mas mantenha:
   - a linha `const LESSON_ID = '...'` com um id novo e único;
   - as três tags `<script src="../config.js">`, `<script src="../db-client.js">` e o `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2">` no `<head>`;
   - a função `finishLesson()` (ajuste a contagem de `total` para o número de questões da nova lição).
2. Em `app.js`, adicione a lição no array `LESSONS` no topo do arquivo.
3. Em `sw.js`, adicione o novo arquivo à lista `APP_SHELL` para funcionar offline.

## Painel do professor

Depois de configurar o Supabase, abra `https://SEU-SITE.vercel.app/teacher.html` — mostra todos os alunos que já criaram perfil, pontuação por lição e data da última tentativa. Dá pra favoritar esse link separado do app dos alunos.
