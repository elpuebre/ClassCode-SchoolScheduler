import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [backendStatus, setBackendStatus] = useState('Conectando...')
  const [backendMessage, setBackendMessage] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
        const response = await axios.get(`${backendUrl}/`)
        setBackendStatus(response.data.status)
        setBackendMessage(response.data.message)
        setError(false)
      } catch (err) {
        setBackendStatus('erro')
        setBackendMessage('Não foi possível conectar ao backend')
        setError(true)
      }
    }

    checkBackend()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ClassCode SchoolScheduler
          </h1>
          <p className="text-gray-600 mb-6">Sistema de Agenda Escolar</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Status do Backend</h2>
            <div className="flex items-center justify-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                error ? 'bg-red-500' : 'bg-green-500'
              } animate-pulse`}></div>
              <span className={`text-lg font-medium ${
                error ? 'text-red-600' : 'text-green-600'
              }`}>
                {backendStatus}
              </span>
            </div>
            {backendMessage && (
              <p className="text-sm text-gray-600 mt-3">{backendMessage}</p>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Funcionalidades</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✓ Gerenciamento de Salas</li>
              <li>✓ Calendário de Tarefas</li>
              <li>✓ Upload de Arquivos</li>
              <li>✓ Temas Claro/Escuro</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App