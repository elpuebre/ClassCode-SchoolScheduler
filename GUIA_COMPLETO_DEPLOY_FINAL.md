# 📘 GUIA COMPLETO E DEFINITIVO - ClassCode-SchoolScheduler

## ⚠️ IMPORTANTE: LEIA ANTES DE COMEÇAR

Este guia foi criado considerando TODOS os erros que você pode enfrentar.
Siga EXATAMENTE como está escrito. NÃO pule etapas. NÃO improvise.

**Tempo estimado total: 30-40 minutos**

---

## 🎯 PARTE 1: PREPARAÇÃO INICIAL

### 1.1 - Criar Conta no GitHub (se não tiver)

1. Acesse: https://github.com
2. Clique em "Sign up"
3. Crie sua conta (use um email válido)
4. Confirme seu email
5. Faça login

**✅ CHECKPOINT:** Você deve estar logado no GitHub

---

### 1.2 - Instalar Git no Seu Computador

**Windows:**
1. Baixe: https://git-scm.com/download/win
2. Instale com as opções padrão
3. Abra o "Git Bash" (procure no menu iniciar)

**Mac:**
1. Abra o Terminal
2. Digite: `git --version`
3. Se não estiver instalado, siga as instruções que aparecerem

**Linux:**
```bash
sudo apt-get install git
```

**✅ CHECKPOINT:** No terminal/Git Bash, digite `git --version` e deve aparecer a versão

---

### 1.3 - Verificar a Estrutura do Projeto

Na pasta `ClassCode-SchoolScheduler` que você extraiu, confirme que tem:

```
ClassCode-SchoolScheduler/
├── .gitignore
├── README.md
├── COMANDOS_PRONTOS.txt
├── COMO_BAIXAR.md
├── backend/
│   ├── __init__.py
│   ├── requirements.txt
│   └── server.py
└── frontend/
    ├── public/
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── yarn.lock
```

**✅ CHECKPOINT:** A estrutura está correta

---

## 📤 PARTE 2: PUBLICAR NO GITHUB

### 2.1 - Configurar Git (Primeira Vez)

Abra o terminal/Git Bash e execute:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

(Use o mesmo email da sua conta GitHub)

**✅ CHECKPOINT:** Comandos executados sem erro

---

### 2.2 - Criar Repositório no GitHub

1. Acesse: https://github.com
2. Clique no botão **"+"** (canto superior direito)
3. Escolha **"New repository"**
4. Configure:
   - **Repository name:** `ClassCode-SchoolScheduler`
   - **Description:** "Sistema de Agenda Escolar"
   - **Visibilidade:** Public (ou Private, sua escolha)
   - **❌ NÃO marque "Add a README file"**
   - **❌ NÃO adicione .gitignore**
   - **❌ NÃO escolha licença**
5. Clique em **"Create repository"**

**✅ CHECKPOINT:** Repositório criado. Anote a URL (algo como: `https://github.com/SEU-USUARIO/ClassCode-SchoolScheduler`)

---

### 2.3 - Fazer Upload do Projeto

No terminal/Git Bash, navegue até a pasta do projeto:

```bash
cd caminho/para/ClassCode-SchoolScheduler
```

Execute os seguintes comandos **UM POR VEZ**:

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Initial commit"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/SEU-USUARIO/ClassCode-SchoolScheduler.git
```
(Substitua SEU-USUARIO pelo seu usuário do GitHub)

```bash
git push -u origin main
```

Quando pedir credenciais:
- **Username:** Seu usuário do GitHub
- **Password:** Use um **Personal Access Token** (não sua senha normal)

**Como criar o Token:**
1. GitHub > Settings (seu perfil) > Developer settings
2. Personal access tokens > Tokens (classic)
3. Generate new token (classic)
4. Marque: `repo` (todos os subitens)
5. Gere e copie o token (GUARDE-O!)
6. Use este token como senha

**✅ CHECKPOINT:** 
- Comando `git push` executado com sucesso
- Acesse seu repositório no GitHub e veja os arquivos lá

---

## 🚀 PARTE 3: DEPLOY DO BACKEND NO RENDER

### 3.1 - Criar Conta no Render

1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Escolha **"Sign in with GitHub"** (mais fácil)
4. Autorize o Render a acessar seus repositórios

**✅ CHECKPOINT:** Logado no Render Dashboard

---

### 3.2 - Criar o Backend

1. No Dashboard do Render, clique em **"New +"**
2. Escolha **"Web Service"** (NÃO Static Site)

3. **Connect a repository:**
   - Clique em "Connect account" se necessário
   - Procure por `ClassCode-SchoolScheduler`
   - Clique em **"Connect"** ao lado do repositório

4. **Configurar o serviço EXATAMENTE assim:**

   ```
   Name: classcode-backend
   Region: Ohio (US East)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

   **⚠️ ATENÇÃO:**
   - **Root Directory:** digite exatamente `backend` (sem barra)
   - **Start Command:** copie exatamente como está acima

5. **Environment Variables:** NÃO adicione nada por enquanto

6. Clique em **"Create Web Service"**

**✅ CHECKPOINT:** 
- Backend está sendo deployado (pode levar 2-3 minutos)
- Aguarde até ver "Live" (bolinha verde)

---

### 3.3 - Testar o Backend

1. Na página do seu serviço no Render, copie a URL (algo como: `https://classcode-backend.onrender.com`)

2. **ANOTE ESTA URL EM ALGUM LUGAR SEGURO**

3. Teste no navegador:
   - Cole a URL e adicione `/` no final: `https://classcode-backend.onrender.com/`
   - Deve aparecer: `{"status":"ok","message":"ClassCode-SchoolScheduler Backend"}`

4. Teste o health check:
   - Acesse: `https://classcode-backend.onrender.com/health`
   - Deve aparecer: `{"status":"healthy"}`

**✅ CHECKPOINT:** Backend funcionando corretamente

**❌ SE DER ERRO:**
- Clique em "Logs" no menu lateral
- Procure por mensagens de erro em vermelho
- Erros comuns:
  - "ModuleNotFoundError": Verifique se requirements.txt está correto
  - "Address already in use": Reinicie o serviço (Settings > Manual Deploy)
  - "Failed to bind": Verifique o Start Command

---

## 🎨 PARTE 4: DEPLOY DO FRONTEND NO RENDER

### 4.1 - Criar o Frontend

1. No Dashboard do Render, clique em **"New +"**
2. Escolha **"Static Site"** (NÃO Web Service)

3. **Connect a repository:**
   - Selecione novamente `ClassCode-SchoolScheduler`
   - Clique em **"Connect"**

4. **Configurar EXATAMENTE assim:**

   ```
   Name: classcode-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

   **⚠️ ATENÇÃO:**
   - **Root Directory:** digite exatamente `frontend` (sem barra)
   - **Build Command:** copie exatamente `npm install && npm run build`
   - **Publish Directory:** digite exatamente `dist` (não build, não public)

5. **Environment Variables (IMPORTANTE):**
   - Clique em **"Advanced"**
   - Clique em **"Add Environment Variable"**
   - Configure:
     ```
     Key: VITE_BACKEND_URL
     Value: https://classcode-backend.onrender.com
     ```
     (Use a URL que você anotou do backend, SEM a barra "/" no final)

6. Clique em **"Create Static Site"**

**✅ CHECKPOINT:**
- Frontend está sendo deployado (pode levar 3-5 minutos)
- Aguarde até ver "Live"

---

### 4.2 - Testar o Frontend

1. Copie a URL do frontend (algo como: `https://classcode-frontend.onrender.com`)

2. Abra no navegador

3. **O que você DEVE ver:**
   - Título: "ClassCode SchoolScheduler"
   - Subtítulo: "Sistema de Agenda Escolar"
   - Status do Backend: "ok" (bolinha verde)
   - Mensagem: "ClassCode-SchoolScheduler Backend"
   - Lista de funcionalidades

**✅ CHECKPOINT:** Frontend funcionando e conectando com backend

**❌ SE DER ERRO:**

**Erro 1: "Failed to build"**
- Solução: Verifique os logs
- Procure por "npm ERR!" ou "error TS"
- Causa comum: Root Directory errado (deve ser `frontend`)

**Erro 2: Frontend carrega mas mostra "erro" (bolinha vermelha)**
- Causa: Backend não está respondendo ou URL errada
- Solução:
  1. Volte para o backend e teste a URL
  2. Verifique se a variável VITE_BACKEND_URL está correta
  3. Vá em Settings > Environment Variables e confirme
  4. Se precisar alterar, clique em "Manual Deploy" para rebuildar

**Erro 3: "não foi possível conectar ao backend"**
- Causa: CORS ou backend offline
- Solução:
  1. Confirme que o backend está "Live"
  2. Teste a URL do backend direto no navegador
  3. O CORS já está configurado no código, não precisa mexer

---

## 🧪 PARTE 5: TESTE FINAL COMPLETO

### 5.1 - Checklist Final

Execute cada teste abaixo:

**Backend:**
- [ ] https://classcode-backend.onrender.com/ retorna `{"status":"ok"}`
- [ ] https://classcode-backend.onrender.com/health retorna `{"status":"healthy"}`
- [ ] Logs do backend não mostram erros (Render > Logs)

**Frontend:**
- [ ] https://classcode-frontend.onrender.com abre o site
- [ ] Título "ClassCode SchoolScheduler" aparece
- [ ] Status do backend mostra "ok" (bolinha verde)
- [ ] Mensagem do backend aparece

**Integração:**
- [ ] Frontend consegue se conectar ao backend
- [ ] Não há erros no console do navegador (F12 > Console)

---

## 🔄 PARTE 6: FAZER ATUALIZAÇÕES

### 6.1 - Como Atualizar o Código

Quando você quiser fazer mudanças:

1. Edite os arquivos no seu computador
2. No terminal, dentro da pasta do projeto:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

3. O Render detectará automaticamente e fará novo deploy

**✅ CHECKPOINT:** Mudanças aplicadas automaticamente

---

## ❌ PARTE 7: SOLUÇÃO DE PROBLEMAS

### 7.1 - Backend Não Inicia

**Erro: "Failed to start"**

Solução:
1. Render > Seu serviço backend > Logs
2. Procure pela última mensagem de erro
3. Erros comuns:
   - "ModuleNotFoundError: No module named 'fastapi'": requirements.txt não foi lido
     - Verifique Root Directory = `backend`
   - "Address already in use": Aguarde 1 minuto e reinicie
   - "Failed to bind to $PORT": Start Command está errado
     - Deve ser: `uvicorn server:app --host 0.0.0.0 --port $PORT`

---

### 7.2 - Frontend Não Builda

**Erro: "npm ERR!"**

Solução:
1. Render > Seu static site > Logs
2. Procure por "npm ERR!" ou "error"
3. Erros comuns:
   - "Cannot find module": Root Directory está errado (deve ser `frontend`)
   - "vite: not found": Build Command está errado
   - "dist directory not found": Publish Directory está errado (deve ser `dist`)

---

### 7.3 - Frontend Não Conecta ao Backend

**Sintoma: Bolinha vermelha, mensagem "erro"**

Solução:
1. Teste o backend direto no navegador
2. Se backend funcionar:
   - Render > Frontend > Settings > Environment Variables
   - Confirme: `VITE_BACKEND_URL` = URL correta do backend
   - SEM barra no final
   - Exemplo: `https://classcode-backend.onrender.com`
3. Após alterar variável:
   - Clique em "Manual Deploy" > "Deploy latest commit"

---

## 📝 PARTE 8: INFORMAÇÕES TÉCNICAS

### 8.1 - Versões Utilizadas

**Backend:**
- Python: 3.11+ (Render usa automaticamente)
- FastAPI: 0.110.1
- Uvicorn: 0.25.0

**Frontend:**
- Node.js: 18+ (Render usa automaticamente)
- React: 18.2.0
- Vite: 5.0.0
- Tailwind CSS: 3.4.0

---

### 8.2 - CORS Já Está Configurado

O arquivo `backend/server.py` já tem:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Você NÃO precisa fazer nada sobre CORS.**

---

## ✅ CONCLUSÃO

Se você seguiu todos os passos:

**Seu projeto está no ar! 🎉**

**URLs finais:**
- Backend: `https://classcode-backend.onrender.com`
- Frontend: `https://classcode-frontend.onrender.com`

**Próximos passos:**
- Compartilhe o link do frontend
- Backend pode "dormir" após 15min de inatividade (plano free)
- Primeiro acesso após dormir: 30-60 segundos

---

**Guia completo - Última atualização: Dezembro 2024**
