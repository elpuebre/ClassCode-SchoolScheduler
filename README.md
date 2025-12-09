# ClassCode SchoolScheduler

Sistema de Agenda Escolar com Frontend (React + Tailwind) e Backend (FastAPI)

## 🚀 Início Rápido

**COMECE PELO ARQUIVO: `GUIA_COMPLETO_DEPLOY.md`**

Este guia contém instruções completas e detalhadas desde a criação da conta GitHub até o deploy no Render.

## 📂 Estrutura

```
ClassCode-SchoolScheduler/
├── backend/          # API FastAPI
├── frontend/         # App React + Vite + Tailwind
├── GUIA_COMPLETO_DEPLOY.md    # ← COMECE AQUI
├── COMANDOS_PRONTOS.txt       # Comandos para copiar
└── README.md
```

## 🛠️ Tecnologias

- **Backend:** FastAPI 0.110.1, Python 3.11+
- **Frontend:** React 18, Vite 5, Tailwind CSS 3
- **Deploy:** Render.com (gratuito)

## ✅ O que está incluído

- ✅ Backend com CORS configurado
- ✅ Frontend responsivo com Tailwind
- ✅ Conexão frontend-backend funcionando
- ✅ Guia completo de deploy
- ✅ Comandos prontos para uso
- ✅ Solução de problemas documentada

## 📖 Documentação

- `GUIA_COMPLETO_DEPLOY.md` - Tutorial completo (COMECE AQUI)
- `COMANDOS_PRONTOS.txt` - Comandos Git e configurações Render

## 🎯 Deploy no Render

### Backend (Web Service)
```
Root Directory: backend
Build: pip install -r requirements.txt
Start: uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Frontend (Static Site)
```
Root Directory: frontend
Build: npm install && npm run build
Publish: dist
Env: VITE_BACKEND_URL=(URL do backend)
```

## 📝 Licença

MIT - Use livremente!
