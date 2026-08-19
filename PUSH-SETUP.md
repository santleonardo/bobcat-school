# Configurar notificações push (do zero)

## 1) Variáveis na Vercel

| Nome | Obrigatório | Onde pegar |
|------|-------------|------------|
| `VAPID_PUBLIC_KEY` | sim | igual a `config.js` → `vapidPublicKey` |
| `VAPID_PRIVATE_KEY` | sim | par gerado com `npx web-push generate-vapid-keys` |
| `VAPID_SUBJECT` | sim | `mailto:seu@email.com` |
| `PUSH_SEND_SECRET` | sim | senha aleatória (`openssl rand -hex 32`) |
| `SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_URL` | sim | Supabase → Settings → API |
| **`SUPABASE_SERVICE_ROLE_KEY`** | **sim** | Supabase → Settings → API → **service_role** |
| `GEMINI_API_KEY` | opcional | personaliza texto da IA |

`NEXT_PUBLIC_SUPABASE_ANON_KEY` **não substitui** a service_role.

Depois de salvar: **Redeploy** obrigatório.

## 2) Secrets no GitHub Actions

Settings → Secrets and variables → Actions:

| Secret | Valor |
|--------|--------|
| `APP_URL` | `https://seu-app.vercel.app` (sem `/` no final) |
| `PUSH_SEND_SECRET` | **igual** ao da Vercel |

## 3) Supabase

Rode o `schema.sql` (tabela `push_subscriptions` + RLS).

## 4) No app

1. Faça **login**
2. Perfil → **Ativar** lembretes → permitir no navegador
3. Deve aparecer alerta de “salvos na nuvem”
4. Clique **Testar push (servidor)** (não precisa Shift)
5. Confira tabela `push_subscriptions` no Supabase

## 5) Testar o workflow

Actions → **Push reminders** → Run workflow  
- `force: true` → manda para **todos** agora (ignora horário)

Ou no navegador (com o secret):

```bash
curl -H "x-push-secret: SEU_SECRET" "https://seu-app.vercel.app/api/push-send?diagnose=1"
curl -H "x-push-secret: SEU_SECRET" "https://seu-app.vercel.app/api/push-send?force=all"
```

## Problemas comuns

| Sintoma | Causa |
|---------|--------|
| Teste do servidor falha | VAPID pública do `config.js` ≠ Vercel |
| Workflow OK mas sent=0 | Ninguém no horário **ou** sem linhas em `push_subscriptions` |
| diagnose `serviceRole: false` | Falta `SUPABASE_SERVICE_ROLE_KEY` |
| Ativou sem login | Subscription só local — automático nunca chega |
| iPhone | Precisa adicionar à tela de início (PWA), iOS 16.4+ |
