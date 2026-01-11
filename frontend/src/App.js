import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { Moon, Sun, Lock, Trash2, Download, Upload, X } from "lucide-react";
import { Switch } from "./components/ui/switch";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showRoomSelection, setShowRoomSelection] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [tempRoomData, setTempRoomData] = useState(null);
  
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAddTask, setShowAddTask] = useState(false);
  const [showViewTasks, setShowViewTasks] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  
  const [newTask, setNewTask] = useState({
    type: "task",
    title: "",
    subject: "",
    description: ""
  });
  const [uploadFiles, setUploadFiles] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    
    const savedRoom = localStorage.getItem("currentRoom");
    if (savedRoom) {
      const roomData = JSON.parse(savedRoom);
      setCurrentRoom(roomData);
      setShowRoomSelection(false);
      loadTasks(roomData.code);
    }
  }, []);
  
  useEffect(() => {
    if (currentRoom) {
      loadTasks(currentRoom.code);
    }
  }, [currentRoom]);

  const loadTasks = async (roomCode) => {
    try {
      const response = await axios.get(`${API}/tasks/${roomCode}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  };
  
  const handleCreateRoom = async () => {
    if (!roomName || roomName.length > 32) {
      toast.error("Nome da sala inválido (máximo 32 caracteres)!");
      return;
    }
    setShowCreateRoom(false);
    setShowSetPassword(true);
  };
  
  const handleSetPassword = async () => {
    if (!roomPassword || roomPassword.length > 16) {
      toast.error("Senha inválida (máximo 16 caracteres)!");
      return;
    }
    
    try {
      const response = await axios.post(`${API}/rooms/create`, {
        name: roomName,
        password: roomPassword
      });
      
      const roomData = { code: response.data.code, name: response.data.name };
      setCurrentRoom(roomData);
      localStorage.setItem("currentRoom", JSON.stringify(roomData));
      setShowSetPassword(false);
      setShowRoomSelection(false);
      toast.success(`Sala criada! Código: ${response.data.code}`);
      setRoomName("");
      setRoomPassword("");
    } catch (error) {
      toast.error("Erro ao criar sala!");
    }
  };
  
  const handleJoinRoom = async () => {
    if (!roomCode) {
      toast.error("Digite o código da sala!");
      return;
    }
    
    try {
      const response = await axios.post(`${API}/rooms/join`, { code: roomCode });
      const roomData = { code: response.data.code, name: response.data.name };
      setCurrentRoom(roomData);
      localStorage.setItem("currentRoom", JSON.stringify(roomData));
      setShowJoinRoom(false);
      setShowRoomSelection(false);
      toast.success(`Bem-vindo à sala ${response.data.name}!`);
      setRoomCode("");
    } catch (error) {
      toast.error("Sala não encontrada!");
    }
  };
  
  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentRoom");
    setShowRoomSelection(true);
    setTasks([]);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const verifyPassword = async (pwd) => {
    try {
      const response = await axios.post(`${API}/auth/verify`, { 
        password: pwd,
        roomCode: currentRoom.code 
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  };

  const handlePasswordSubmit = async () => {
    const isValid = await verifyPassword(password);
    if (isValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem(`roomPassword_${currentRoom.code}`, password);
      setShowPasswordDialog(false);
      toast.success("Autenticado com sucesso!");
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      toast.error("Senha incorreta!");
    }
    setPassword("");
  };

  const requireAuth = (action) => {
    if (isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setShowPasswordDialog(true);
    }
  };

  const handleAddTask = () => {
    requireAuth(() => setShowAddTask(true));
  };

  const handleSaveTask = async () => {
    if (!newTask.title) {
      toast.error("Título é obrigatório!");
      return;
    }

    if (newTask.type === "task" && !newTask.subject) {
      toast.error("Matéria é obrigatória para tarefas!");
      return;
    }

    try {
      const taskData = {
        roomCode: currentRoom.code,
        date: selectedDate,
        type: newTask.type,
        title: newTask.title,
        subject: newTask.type === "task" ? newTask.subject : null,
        description: newTask.type === "task" ? newTask.description : null
      };

      // Get stored password for this session
      const storedPassword = sessionStorage.getItem(`roomPassword_${currentRoom.code}`);
      
      const response = await axios.post(`${API}/tasks`, taskData, {
        headers: { password: storedPassword }
      });

      // Upload files if any
      if (uploadFiles.length > 0) {
        for (const file of uploadFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("taskId", response.data.id);
          formData.append("roomCode", currentRoom.code);
          
          await axios.post(`${API}/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              password: storedPassword
            }
          });
        }
      }

      toast.success("Tarefa adicionada com sucesso!");
      setShowAddTask(false);
      setNewTask({ type: "task", title: "", subject: "", description: "" });
      setUploadFiles([]);
      loadTasks(currentRoom.code);
    } catch (error) {
      toast.error("Erro ao adicionar tarefa!");
    }
  };

  const handleDeleteTask = async (taskId) => {
    requireAuth(async () => {
      try {
        const storedPassword = sessionStorage.getItem(`roomPassword_${currentRoom.code}`);
        await axios.delete(`${API}/tasks/${currentRoom.code}/${taskId}`, {
          headers: { password: storedPassword }
        });
        toast.success("Tarefa removida!");
        loadTasks(currentRoom.code);
      } catch (error) {
        toast.error("Erro ao remover tarefa!");
      }
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDate = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${month}-${d}`;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => task.date === date);
  };

  const getDayColor = (date) => {
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length === 0) return "";
    
    const hasHoliday = dayTasks.some(t => t.type === "holiday");
    const hasRecess = dayTasks.some(t => t.type === "recess");
    const hasTask = dayTasks.some(t => t.type === "task");
    
    if (hasHoliday) return "bg-green-500/20 border-green-500";
    if (hasRecess) return "bg-red-500/20 border-red-500";
    if (hasTask) return "bg-blue-500/20 border-blue-500";
    return "";
  };

  const isToday = (day) => {
    const today = new Date();
    const checkDate = formatDate(day);
    const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    
    return checkDate === todayDate && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  };

  const handleDayClick = (day) => {
    const date = formatDate(day);
    setSelectedDate(date);
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length > 0) {
      setShowViewTasks(true);
    } else {
      handleAddTask();
    }
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const days = getDaysInMonth(currentMonth);
  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  // Room Selection Screen
  if (showRoomSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
        <Toaster position="top-center" richColors />
        
        <div className="absolute top-6 right-6">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <Switch
              data-testid="theme-toggle"
              checked={darkMode}
              onCheckedChange={toggleTheme}
            />
            <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
        
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-white mb-2">Agenda Escolar</h1>
            <p className="text-slate-600 dark:text-slate-400">Organize suas tarefas em salas compartilhadas</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <Button
              data-testid="create-room-button"
              onClick={() => setShowCreateRoom(true)}
              className="w-full h-14 text-lg"
            >
              Criar Sala
            </Button>
            <Button
              data-testid="join-room-button"
              onClick={() => setShowJoinRoom(true)}
              variant="outline"
              className="w-full h-14 text-lg"
            >
              Entrar em uma Sala
            </Button>
          </div>
        </div>
        
        {/* Create Room Dialog */}
        <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
          <DialogContent data-testid="create-room-dialog">
            <DialogHeader>
              <DialogTitle>Criar Nova Sala</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="room-name">Nome da Sala (máx. 32 caracteres)</Label>
                <Input
                  data-testid="room-name-input"
                  id="room-name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Ex: 9A Colégio CEPMG - HCR"
                  maxLength={32}
                />
              </div>
              <Button data-testid="create-room-submit" onClick={handleCreateRoom} className="w-full">
                Continuar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Set Password Dialog */}
        <Dialog open={showSetPassword} onOpenChange={setShowSetPassword}>
          <DialogContent data-testid="set-password-dialog">
            <DialogHeader>
              <DialogTitle>Definir Senha da Sala</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="room-password">Senha para Edição (máx. 16 caracteres)</Label>
                <Input
                  data-testid="room-password-input"
                  id="room-password"
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  placeholder="Crie uma senha"
                  maxLength={16}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Esta senha será necessária para editar tarefas nesta sala
                </p>
              </div>
              <Button data-testid="set-password-submit" onClick={handleSetPassword} className="w-full">
                Criar Sala
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Join Room Dialog */}
        <Dialog open={showJoinRoom} onOpenChange={setShowJoinRoom}>
          <DialogContent data-testid="join-room-dialog">
            <DialogHeader>
              <DialogTitle>Entrar em uma Sala</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="room-code">Código da Sala</Label>
                <Input
                  data-testid="room-code-input"
                  id="room-code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Ex: 9AXKQ2H"
                  maxLength={7}
                />
              </div>
              <Button data-testid="join-room-submit" onClick={handleJoinRoom} className="w-full">
                Entrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Agenda Escolar</h1>
              {currentRoom && (
                <div className="mt-2 text-sm">
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{currentRoom.name}</p>
                  <p className="text-slate-500 dark:text-slate-400">Código: {currentRoom.code}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Lock className="w-4 h-4" />
                  Autenticado
                </div>
              )}
              {!isAuthenticated && (
                <Button
                  data-testid="auth-button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordDialog(true)}
                  className="gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Entrar para Editar
                </Button>
              )}
              <Button
                data-testid="leave-room-button"
                variant="outline"
                size="sm"
                onClick={handleLeaveRoom}
              >
                Sair da Sala
              </Button>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <Switch
                  data-testid="theme-toggle"
                  checked={darkMode}
                  onCheckedChange={toggleTheme}
                />
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 px-6 py-6 flex justify-between items-center">
            <button
              data-testid="prev-month-button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="text-white hover:bg-white/20 rounded-lg px-4 py-2 transition-colors"
            >
              ←
            </button>
            <h2 className="text-2xl font-semibold text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button
              data-testid="next-month-button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="text-white hover:bg-white/20 rounded-lg px-4 py-2 transition-colors"
            >
              →
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center py-3 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 p-2 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                data-testid={day ? `calendar-day-${formatDate(day)}` : undefined}
                onClick={() => day && handleDayClick(day)}
                className={`
                  aspect-square p-3 rounded-lg cursor-pointer
                  transition-all duration-200
                  ${day ? "hover:shadow-md hover:scale-105" : ""}
                  ${!day ? "cursor-default" : ""}
                  ${getDayColor(day ? formatDate(day) : "")}
                  ${!getDayColor(day ? formatDate(day) : "") && day ? "hover:bg-slate-100 dark:hover:bg-slate-800" : ""}
                  ${day && isToday(day) ? "!border-slate-900 dark:!border-white !border-[3px]" : "border-2"}
                  ${day && !isToday(day) && !getDayColor(formatDate(day)) ? "border-transparent" : ""}
                  ${day ? "bg-white dark:bg-slate-900" : ""}
                `}
              >
                {day && (
                  <div className="flex flex-col h-full">
                    <span className="text-lg font-medium text-slate-900 dark:text-white">
                      {day}
                    </span>
                    {getTasksForDate(formatDate(day)).length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {getTasksForDate(formatDate(day)).slice(0, 2).map((task, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-current opacity-60"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/40 border-2 border-blue-500" />
            <span className="text-slate-700 dark:text-slate-300">Tarefas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/40 border-2 border-green-500" />
            <span className="text-slate-700 dark:text-slate-300">Feriados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/40 border-2 border-red-500" />
            <span className="text-slate-700 dark:text-slate-300">Recesso</span>
          </div>
        </div>
      </main>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent data-testid="password-dialog">
          <DialogHeader>
            <DialogTitle>Insira a senha para editar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                data-testid="password-input"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                placeholder="Digite a senha"
              />
            </div>
            <Button data-testid="password-submit" onClick={handlePasswordSubmit} className="w-full">
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent data-testid="add-task-dialog" className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar para {selectedDate}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tipo</Label>
              <Select
                data-testid="task-type-select"
                value={newTask.type}
                onValueChange={(value) => setNewTask({ ...newTask, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Tarefa</SelectItem>
                  <SelectItem value="holiday">Feriado</SelectItem>
                  <SelectItem value="recess">Recesso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                data-testid="task-title-input"
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Ex: Prova de Matemática"
              />
            </div>

            {newTask.type === "task" && (
              <>
                <div>
                  <Label htmlFor="subject">Matéria *</Label>
                  <Input
                    data-testid="task-subject-input"
                    id="subject"
                    value={newTask.subject}
                    onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                    placeholder="Ex: Matemática"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    data-testid="task-description-input"
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Detalhes sobre a tarefa..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Arquivos (opcional)</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Adicionar arquivo
                    </label>
                    <input
                      id="file-upload"
                      data-testid="task-file-input"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => setUploadFiles([...uploadFiles, ...Array.from(e.target.files)])}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    />
                  </div>
                  {uploadFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <button
                            onClick={() => setUploadFiles(uploadFiles.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <Button data-testid="save-task-button" onClick={handleSaveTask} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Tasks Dialog */}
      <Dialog open={showViewTasks} onOpenChange={setShowViewTasks}>
        <DialogContent data-testid="view-tasks-dialog" className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tarefas de {selectedDate}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedTasks.map((task) => (
              <div
                key={task.id}
                data-testid={`task-item-${task.id}`}
                className={`p-4 rounded-lg border-2 ${
                  task.type === "task"
                    ? "bg-blue-50 dark:bg-blue-950/20 border-blue-500"
                    : task.type === "holiday"
                    ? "bg-green-50 dark:bg-green-950/20 border-green-500"
                    : "bg-red-50 dark:bg-red-950/20 border-red-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                      {task.title}
                    </h3>
                    {task.subject && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Matéria: {task.subject}
                      </p>
                    )}
                    {task.description && (
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                        {task.description}
                      </p>
                    )}
                    {task.files && task.files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {task.files.map((file, index) => (
                          <a
                            key={index}
                            href={`${API}/files/${file.filename}`}
                            download={file.originalName}
                            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <Download className="w-4 h-4" />
                            {file.originalName}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  {isAuthenticated && (
                    <button
                      data-testid={`delete-task-${task.id}`}
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isAuthenticated && (
              <Button
                data-testid="add-another-task-button"
                onClick={() => {
                  setShowViewTasks(false);
                  setShowAddTask(true);
                }}
                variant="outline"
                className="w-full"
              >
                Adicionar outra tarefa
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;