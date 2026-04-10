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
import { Moon, Sun, Lock, Trash2, Download, Upload, X, Eye, EyeOff, FileText, HelpCircle, Heart, Globe, Bell, Loader2, Plus } from "lucide-react";
import { Switch } from "./components/ui/switch";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Translations
const translations = {
  pt: {
    title: "Agenda Escolar",
    subtitle: "Organize suas tarefas em salas compartilhadas",
    createRoom: "Criar Sala",
    joinRoom: "Entrar em uma Sala",
    createNewRoom: "Criar Nova Sala",
    roomName: "Nome da Sala",
    roomNamePlaceholder: "Ex: 9A Colégio CEPMG",
    maxChars: "máx. {n} caracteres",
    continue: "Continuar",
    setPassword: "Definir Senha da Sala",
    passwordForEdit: "Senha para Edição",
    createPasswordPlaceholder: "Crie uma senha",
    passwordNote: "Esta senha será necessária para editar tarefas",
    joinRoomTitle: "Entrar em uma Sala",
    roomCode: "Código da Sala",
    roomCodePlaceholder: "Ex: 9AXKQ2H",
    enter: "Entrar",
    code: "Código",
    authenticated: "Autenticado",
    enterToEdit: "Editar",
    leaveRoom: "Sair",
    enterPassword: "Insira a senha para editar",
    password: "Senha",
    passwordPlaceholder: "Digite a senha",
    confirm: "Confirmar",
    addFor: "Adicionar para",
    type: "Tipo",
    task: "Tarefa",
    holiday: "Feriado",
    recess: "Recesso",
    titleField: "Título",
    titlePlaceholder: "Ex: Prova de Matemática",
    subject: "Matéria",
    subjectPlaceholder: "Ex: Matemática",
    description: "Descrição",
    descriptionPlaceholder: "Detalhes sobre a tarefa...",
    optional: "opcional",
    required: "obrigatório",
    files: "Arquivos",
    addFile: "Adicionar arquivo",
    save: "Salvar",
    saving: "Salvando...",
    tasksFor: "Tarefas de",
    addAnotherTask: "Adicionar outra tarefa",
    instructions: "Instruções",
    howToUse: "Como usar a Agenda Escolar",
    whatIsThis: "O que é este site?",
    whatIsThisText: "A Agenda Escolar é um sistema de calendário compartilhado onde você pode organizar tarefas, feriados e recessos escolares em salas privadas.",
    creatingRoom: "Criando uma Sala",
    creatingRoomSteps: ["Clique em \"Criar Sala\" na tela inicial", "Digite um nome para sua sala", "Crie uma senha para proteger as edições", "Anote o código da sala gerado para compartilhar"],
    joiningRoom: "Entrando em uma Sala",
    joiningRoomSteps: ["Clique em \"Entrar em uma Sala\"", "Digite o código de 7 caracteres", "Clique em \"Entrar\""],
    addingTasks: "Adicionando Tarefas",
    addingTasksSteps: ["Clique em um dia no calendário", "Digite a senha da sala", "Escolha o tipo: Tarefa, Feriado ou Recesso", "Preencha os detalhes e salve"],
    calendarColors: "Cores do Calendário",
    blueTask: "Azul = Tarefas/Provas",
    greenHoliday: "Verde = Feriados",
    redRecess: "Vermelho = Recesso",
    tips: "Dicas",
    tipsList: ["Use o toggle para mudar entre tema claro/escuro", "Você pode anexar arquivos às tarefas", "Compartilhe o código com seus colegas", "Qualquer pessoa pode VER, mas só quem tem a senha pode EDITAR"],
    tasks: "Tarefas",
    holidays: "Feriados",
    roomCreated: "Sala criada! Código:",
    welcome: "Bem-vindo à sala",
    roomNotFound: "Sala não encontrada!",
    invalidRoomName: "Nome da sala inválido!",
    invalidPassword: "Senha inválida!",
    errorCreatingRoom: "Erro ao criar sala!",
    authSuccess: "Autenticado com sucesso!",
    wrongPassword: "Senha incorreta!",
    titleRequired: "Título é obrigatório!",
    subjectRequired: "Matéria é obrigatória para tarefas!",
    taskAdded: "Tarefa adicionada com sucesso!",
    errorAddingTask: "Erro ao adicionar tarefa!",
    taskRemoved: "Tarefa removida!",
    errorRemovingTask: "Erro ao remover tarefa!",
    donate: "Apoiar",
    donateTitle: "Apoie o Projeto",
    donateText: "Essa ferramenta te ajudou? A Agenda Escolar é criada e mantida de forma independente. Se quiser apoiar o projeto e ajudar a manter o site online, qualquer valor é bem-vindo.",
    pixKey: "Chave PIX",
    copyPix: "Copiar",
    pixCopied: "Chave PIX copiada!",
    orScanQR: "Ou escaneie o QR Code:",
    announcements: "Avisos",
    announcementsTitle: "Avisos Gerais",
    noAnnouncements: "Nenhum aviso no momento. Clique no + para adicionar.",
    addAnnouncement: "Adicionar Aviso",
    announcementPlaceholder: "Digite o aviso...",
    loading: "Carregando...",
    creating: "Criando...",
    joining: "Entrando...",
    calendar: "Calendário",
    schedule: "Horários",
    scheduleTitle: "Horários de Aula",
    noSchedule: "Nenhum horário cadastrado.",
    createSchedule: "Criar Horário",
    editSchedule: "Editar",
    saveSchedule: "Salvar",
    cancelEdit: "Cancelar",
    addPeriod: "Adicionar Horário",
    scheduleSaved: "Horários salvos!",
    scheduleError: "Erro ao salvar horários!",
    scheduleDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    periodLabel: "Horário",
    monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    weekDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  },
  en: {
    title: "School Schedule",
    subtitle: "Organize your tasks in shared rooms",
    createRoom: "Create Room",
    joinRoom: "Join Room",
    createNewRoom: "Create New Room",
    roomName: "Room Name",
    roomNamePlaceholder: "Ex: 9A School",
    maxChars: "max. {n} characters",
    continue: "Continue",
    setPassword: "Set Room Password",
    passwordForEdit: "Password for Editing",
    createPasswordPlaceholder: "Create a password",
    passwordNote: "This password will be required to edit tasks",
    joinRoomTitle: "Join a Room",
    roomCode: "Room Code",
    roomCodePlaceholder: "Ex: 9AXKQ2H",
    enter: "Enter",
    code: "Code",
    authenticated: "Authenticated",
    enterToEdit: "Edit",
    leaveRoom: "Leave",
    enterPassword: "Enter password to edit",
    password: "Password",
    passwordPlaceholder: "Enter password",
    confirm: "Confirm",
    addFor: "Add for",
    type: "Type",
    task: "Task",
    holiday: "Holiday",
    recess: "Break",
    titleField: "Title",
    titlePlaceholder: "Ex: Math Test",
    subject: "Subject",
    subjectPlaceholder: "Ex: Math",
    description: "Description",
    descriptionPlaceholder: "Task details...",
    optional: "optional",
    required: "required",
    files: "Files",
    addFile: "Add file",
    save: "Save",
    saving: "Saving...",
    tasksFor: "Tasks for",
    addAnotherTask: "Add another task",
    instructions: "Instructions",
    howToUse: "How to use School Schedule",
    whatIsThis: "What is this site?",
    whatIsThisText: "School Schedule is a shared calendar system where you can organize tasks, holidays and school breaks in private rooms.",
    creatingRoom: "Creating a Room",
    creatingRoomSteps: ["Click \"Create Room\" on the home screen", "Enter a name for your room", "Create a password to protect edits", "Note the generated room code to share"],
    joiningRoom: "Joining a Room",
    joiningRoomSteps: ["Click \"Join a Room\"", "Enter the 7-character room code", "Click \"Enter\""],
    addingTasks: "Adding Tasks",
    addingTasksSteps: ["Click on a day in the calendar", "Enter the room password", "Choose the type: Task, Holiday or Break", "Fill in the details and save"],
    calendarColors: "Calendar Colors",
    blueTask: "Blue = Tasks/Tests",
    greenHoliday: "Green = Holidays",
    redRecess: "Red = Break",
    tips: "Tips",
    tipsList: ["Use the toggle to switch between light/dark theme", "You can attach files to tasks", "Share the room code with your classmates", "Anyone can VIEW, but only those with the password can EDIT"],
    tasks: "Tasks",
    holidays: "Holidays",
    roomCreated: "Room created! Code:",
    welcome: "Welcome to room",
    roomNotFound: "Room not found!",
    invalidRoomName: "Invalid room name!",
    invalidPassword: "Invalid password!",
    errorCreatingRoom: "Error creating room!",
    authSuccess: "Authenticated successfully!",
    wrongPassword: "Wrong password!",
    titleRequired: "Title is required!",
    subjectRequired: "Subject is required for tasks!",
    taskAdded: "Task added successfully!",
    errorAddingTask: "Error adding task!",
    taskRemoved: "Task removed!",
    errorRemovingTask: "Error removing task!",
    donate: "Support",
    donateTitle: "Support the Project",
    donateText: "Did this tool help you? School Schedule is created and maintained independently. If you want to support the project and help keep the site online, any amount is welcome.",
    pixKey: "PIX Key",
    copyPix: "Copy",
    pixCopied: "PIX key copied!",
    orScanQR: "Or scan the QR Code:",
    announcements: "News",
    announcementsTitle: "General Announcements",
    noAnnouncements: "No announcements yet. Click + to add one.",
    addAnnouncement: "Add Announcement",
    announcementPlaceholder: "Enter announcement...",
    loading: "Loading...",
    creating: "Creating...",
    joining: "Joining...",
    calendar: "Calendar",
    schedule: "Schedule",
    scheduleTitle: "Class Schedule",
    noSchedule: "No schedule set up yet.",
    createSchedule: "Create Schedule",
    editSchedule: "Edit",
    saveSchedule: "Save",
    cancelEdit: "Cancel",
    addPeriod: "Add Period",
    scheduleSaved: "Schedule saved!",
    scheduleError: "Error saving schedule!",
    scheduleDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    periodLabel: "Period",
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  }
};

const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage;
  return lang.startsWith("pt") ? "pt" : "en";
};

function App() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || getBrowserLanguage();
  });
  const t = translations[language];
  
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showRoomSelection, setShowRoomSelection] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [showRoomPasswordVisible, setShowRoomPasswordVisible] = useState(false);
  const [showPasswordVisible, setShowPasswordVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  
  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  
  // Schedule state
  const [activeTab, setActiveTab] = useState("calendar");
  const [schedule, setSchedule] = useState({ periods: [], grid: {} });
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [tempSchedule, setTempSchedule] = useState({ periods: [], grid: {} });
  
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
  
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [newTask, setNewTask] = useState({
    type: "task",
    title: "",
    subject: "",
    description: ""
  });
  const [uploadFiles, setUploadFiles] = useState([]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    
    const savedRoom = localStorage.getItem("currentRoom");
    if (savedRoom) {
      try {
        const roomData = JSON.parse(savedRoom);
        setCurrentRoom(roomData);
        setShowRoomSelection(false);
      } catch (e) {
        localStorage.removeItem("currentRoom");
      }
    }
  }, []);
  
  useEffect(() => {
    if (currentRoom) {
      loadTasks(currentRoom.code);
      loadAnnouncements(currentRoom.code);
      loadSchedule(currentRoom.code);
    }
  }, [currentRoom]);

  const loadTasks = async (roomCode, retry = true) => {
    try {
      const response = await axios.get(`${API}/tasks/${roomCode}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      if (retry) {
        setTimeout(() => loadTasks(roomCode, false), 1500);
      }
    }
  };

  const loadAnnouncements = (roomCode) => {
    const saved = localStorage.getItem(`announcements_${roomCode}`);
    if (saved) {
      setAnnouncements(JSON.parse(saved));
    } else {
      setAnnouncements([]);
    }
  };

  const loadSchedule = async (roomCode) => {
    try {
      const response = await axios.get(`${API}/schedules/${roomCode}`);
      setSchedule(response.data);
    } catch (error) {
      console.error("Error loading schedule:", error);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      const storedPassword = sessionStorage.getItem(`roomPassword_${currentRoom.code}`);
      await axios.put(`${API}/schedules/${currentRoom.code}`, {
        periods: tempSchedule.periods, grid: tempSchedule.grid
      }, { headers: { password: storedPassword } });
      setSchedule({ ...tempSchedule, roomCode: currentRoom.code });
      setEditingSchedule(false);
      toast.success(t.scheduleSaved);
    } catch (error) {
      toast.error(t.scheduleError);
    }
  };

  const saveAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    const updated = [...announcements, { id: Date.now(), text: newAnnouncement, date: new Date().toLocaleDateString() }];
    setAnnouncements(updated);
    localStorage.setItem(`announcements_${currentRoom.code}`, JSON.stringify(updated));
    setNewAnnouncement("");
    setShowAddAnnouncement(false);
    toast.success("Aviso adicionado!");
  };

  const deleteAnnouncement = (id) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem(`announcements_${currentRoom.code}`, JSON.stringify(updated));
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "pt" ? "en" : "pt");
  };
  
  const handleCreateRoom = async () => {
    if (!roomName || roomName.length > 32) {
      toast.error(t.invalidRoomName);
      return;
    }
    setShowCreateRoom(false);
    setShowSetPassword(true);
  };
  
  const handleSetPassword = async () => {
    if (!roomPassword || roomPassword.length > 16) {
      toast.error(t.invalidPassword);
      return;
    }
    
    setIsCreating(true);
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
      toast.success(`${t.roomCreated} ${response.data.code}`);
      setRoomName("");
      setRoomPassword("");
      setShowRoomPasswordVisible(false);
    } catch (error) {
      toast.error(t.errorCreatingRoom);
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleJoinRoom = async () => {
    if (!roomCode) {
      toast.error(t.roomNotFound);
      return;
    }
    
    setIsJoining(true);
    try {
      const response = await axios.post(`${API}/rooms/join`, { code: roomCode });
      const roomData = { code: response.data.code, name: response.data.name };
      setCurrentRoom(roomData);
      localStorage.setItem("currentRoom", JSON.stringify(roomData));
      setShowJoinRoom(false);
      setShowRoomSelection(false);
      toast.success(`${t.welcome} ${response.data.name}!`);
      setRoomCode("");
    } catch (error) {
      toast.error(t.roomNotFound);
    } finally {
      setIsJoining(false);
    }
  };
  
  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentRoom");
    setShowRoomSelection(true);
    setTasks([]);
    setAnnouncements([]);
    setActiveTab("calendar");
    setSchedule({ periods: [], grid: {} });
    setEditingSchedule(false);
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
      toast.success(t.authSuccess);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      toast.error(t.wrongPassword);
    }
    setPassword("");
    setShowPasswordVisible(false);
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
      toast.error(t.titleRequired);
      return;
    }

    if (newTask.type === "task" && !newTask.subject) {
      toast.error(t.subjectRequired);
      return;
    }

    setIsSaving(true);
    try {
      const taskData = {
        roomCode: currentRoom.code,
        date: selectedDate,
        type: newTask.type,
        title: newTask.title,
        subject: newTask.type === "task" ? newTask.subject : null,
        description: newTask.type === "task" ? newTask.description : null
      };

      const storedPassword = sessionStorage.getItem(`roomPassword_${currentRoom.code}`);
      
      const response = await axios.post(`${API}/tasks`, taskData, {
        headers: { password: storedPassword }
      });

      const taskId = response.data.id;

      if (uploadFiles.length > 0) {
        for (const file of uploadFiles) {
          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("taskId", taskId);
            formData.append("roomCode", currentRoom.code);
            
            await axios.post(`${API}/upload`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                password: storedPassword
              }
            });
          } catch (uploadError) {
            console.error("File upload error:", uploadError);
          }
        }
      }

      toast.success(t.taskAdded);
      setShowAddTask(false);
      setNewTask({ type: "task", title: "", subject: "", description: "" });
      setUploadFiles([]);
      await loadTasks(currentRoom.code);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error(t.errorAddingTask);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    requireAuth(async () => {
      try {
        const storedPassword = sessionStorage.getItem(`roomPassword_${currentRoom.code}`);
        await axios.delete(`${API}/tasks/${currentRoom.code}/${taskId}`, {
          headers: { password: storedPassword }
        });
        toast.success(t.taskRemoved);
        loadTasks(currentRoom.code);
      } catch (error) {
        toast.error(t.errorRemovingTask);
      }
    });
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText("62999121460");
    toast.success(t.pixCopied);
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

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    if (language === "en") return `${month}/${day}/${year}`;
    return `${day}/${month}/${year}`;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => task.date === date);
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
      // Mostrar tarefas sem pedir senha (só pede pra editar)
      setShowViewTasks(true);
    } else {
      handleAddTask();
    }
  };

  const days = getDaysInMonth(currentMonth);
  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  // Room Selection Screen
  if (showRoomSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
        <Toaster position="top-center" richColors />
        
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button onClick={toggleLanguage} className="flex items-center gap-1 px-2 py-1 text-sm text-slate-600 dark:text-slate-400">
            <Globe className="w-4 h-4" />
            <span>{language.toUpperCase()}</span>
          </button>
          <div className="flex items-center gap-1">
            <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <Switch checked={darkMode} onCheckedChange={toggleTheme} />
            <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
        
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white mb-2">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{t.subtitle}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
            <Button onClick={() => setShowCreateRoom(true)} className="w-full h-12 text-base">
              {t.createRoom}
            </Button>
            <Button onClick={() => setShowJoinRoom(true)} variant="outline" className="w-full h-12 text-base">
              {t.joinRoom}
            </Button>
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setShowInstructions(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg text-sm">
              <FileText className="w-4 h-4" />
              <span>{t.instructions}</span>
            </button>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader><DialogTitle>{t.createNewRoom}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>{t.roomName} ({t.maxChars.replace("{n}", "32")})</Label>
                <Input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder={t.roomNamePlaceholder} maxLength={32} />
              </div>
              <Button onClick={handleCreateRoom} className="w-full">{t.continue}</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showSetPassword} onOpenChange={setShowSetPassword}>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader><DialogTitle>{t.setPassword}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>{t.passwordForEdit} ({t.maxChars.replace("{n}", "16")})</Label>
                <div className="relative">
                  <Input type={showRoomPasswordVisible ? "text" : "password"} value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)} placeholder={t.createPasswordPlaceholder} maxLength={16} className="pr-10" />
                  <button type="button" onClick={() => setShowRoomPasswordVisible(!showRoomPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    {showRoomPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">{t.passwordNote}</p>
              </div>
              <Button onClick={handleSetPassword} className="w-full" disabled={isCreating}>
                {isCreating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.creating}</> : t.createRoom}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showJoinRoom} onOpenChange={setShowJoinRoom}>
          <DialogContent className="max-w-[95vw] sm:max-w-md">
            <DialogHeader><DialogTitle>{t.joinRoomTitle}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>{t.roomCode}</Label>
                <Input value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} placeholder={t.roomCodePlaceholder} maxLength={7} />
              </div>
              <Button onClick={handleJoinRoom} className="w-full" disabled={isJoining}>
                {isJoining ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.joining}</> : t.enter}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                {t.howToUse}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 text-sm text-slate-700 dark:text-slate-300">
              <section>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">📚 {t.whatIsThis}</h3>
                <p>{t.whatIsThisText}</p>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">🏠 {t.creatingRoom}</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {t.creatingRoomSteps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </section>
              <section>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">🎨 {t.calendarColors}</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-xs">{t.tasks}</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs">{t.holidays}</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs">{t.recess}</span></div>
                </div>
              </section>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  // Main Calendar Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="px-3 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white truncate">{currentRoom?.name || t.title}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.code}: {currentRoom?.code}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 ml-2">
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Lock className="w-3 h-3" />
                  <span className="hidden md:inline">{t.authenticated}</span>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowPasswordDialog(true)} className="text-xs px-2 h-8">
                  <Lock className="w-3 h-3 sm:mr-1" />
                  <span className="hidden sm:inline">{t.enterToEdit}</span>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLeaveRoom} className="text-xs px-2 h-8">{t.leaveRoom}</Button>
              <button onClick={toggleLanguage} className="p-1 text-slate-600 dark:text-slate-400"><Globe className="w-4 h-4" /></button>
              <button onClick={toggleTheme} className="p-1 text-slate-600 dark:text-slate-400">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="px-2 sm:px-6 py-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab("calendar")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "calendar" ? "bg-blue-500 text-white shadow-lg" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}>
              {t.calendar}
            </button>
            <button onClick={() => setActiveTab("schedule")} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "schedule" ? "bg-blue-500 text-white shadow-lg" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"}`}>
              {t.schedule}
            </button>
          </div>

          {/* Schedule View */}
          {activeTab === "schedule" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-3 sm:px-6 py-4 flex justify-between items-center">
                <h2 className="text-base sm:text-xl font-semibold text-white">{t.scheduleTitle}</h2>
                {!editingSchedule ? (
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => requireAuth(() => { setTempSchedule(JSON.parse(JSON.stringify(schedule))); setEditingSchedule(true); })}>
                    {t.editSchedule}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleSaveSchedule}>{t.saveSchedule}</Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => setEditingSchedule(false)}>{t.cancelEdit}</Button>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4 overflow-x-auto">
                {(editingSchedule ? tempSchedule : schedule).periods.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <p className="mb-4">{t.noSchedule}</p>
                    {!editingSchedule && (
                      <Button variant="outline" onClick={() => requireAuth(() => {
                        setTempSchedule({
                          periods: [
                            { label: "1°", start: "07:00", end: "07:50" },
                            { label: "2°", start: "07:50", end: "08:40" },
                            { label: "3°", start: "08:40", end: "09:30" },
                            { label: "Intervalo", start: "09:30", end: "09:50" },
                            { label: "4°", start: "09:50", end: "10:40" },
                            { label: "5°", start: "10:40", end: "11:30" },
                          ],
                          grid: {}
                        });
                        setEditingSchedule(true);
                      })}>
                        <Plus className="w-4 h-4 mr-2" />{t.createSchedule}
                      </Button>
                    )}
                  </div>
                ) : (
                  <table className="w-full border-collapse min-w-[550px]">
                    <thead>
                      <tr>
                        <th className="border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 text-left text-xs font-medium text-slate-700 dark:text-slate-300 min-w-[120px]">{t.periodLabel}</th>
                        {t.scheduleDays.map((day, i) => (
                          <th key={i} className="border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 text-center text-xs font-medium text-slate-700 dark:text-slate-300 min-w-[80px]">{day}</th>
                        ))}
                        {editingSchedule && <th className="border border-slate-200 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-800 w-8" />}
                      </tr>
                    </thead>
                    <tbody>
                      {(editingSchedule ? tempSchedule : schedule).periods.map((period, pIdx) => (
                        <tr key={pIdx}>
                          <td className="border border-slate-200 dark:border-slate-700 p-2">
                            {editingSchedule ? (
                              <div className="flex flex-col gap-1">
                                <Input className="h-7 text-xs" value={period.label} placeholder="Nome" onChange={(e) => { const np = [...tempSchedule.periods]; np[pIdx] = { ...period, label: e.target.value }; setTempSchedule({ ...tempSchedule, periods: np }); }} />
                                <div className="flex gap-1">
                                  <Input type="time" className="h-7 text-xs flex-1" value={period.start} onChange={(e) => { const np = [...tempSchedule.periods]; np[pIdx] = { ...period, start: e.target.value }; setTempSchedule({ ...tempSchedule, periods: np }); }} />
                                  <Input type="time" className="h-7 text-xs flex-1" value={period.end} onChange={(e) => { const np = [...tempSchedule.periods]; np[pIdx] = { ...period, end: e.target.value }; setTempSchedule({ ...tempSchedule, periods: np }); }} />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{period.label}</span>
                                <br /><span className="text-xs text-slate-500 dark:text-slate-400">{period.start} - {period.end}</span>
                              </div>
                            )}
                          </td>
                          {[0, 1, 2, 3, 4].map((dayIdx) => (
                            <td key={dayIdx} className="border border-slate-200 dark:border-slate-700 p-2 text-center">
                              {editingSchedule ? (
                                <Input className="h-7 text-xs text-center" value={tempSchedule.grid[`${pIdx}-${dayIdx}`] || ""} placeholder="-" onChange={(e) => { const ng = { ...tempSchedule.grid }; if (e.target.value) ng[`${pIdx}-${dayIdx}`] = e.target.value; else delete ng[`${pIdx}-${dayIdx}`]; setTempSchedule({ ...tempSchedule, grid: ng }); }} />
                              ) : (
                                <span className="text-sm text-slate-700 dark:text-slate-300">{schedule.grid[`${pIdx}-${dayIdx}`] || "-"}</span>
                              )}
                            </td>
                          ))}
                          {editingSchedule && (
                            <td className="border border-slate-200 dark:border-slate-700 p-1 text-center">
                              <button onClick={() => { const np = tempSchedule.periods.filter((_, i) => i !== pIdx); const ng = {}; Object.entries(tempSchedule.grid).forEach(([key, val]) => { const [p, d] = key.split("-").map(Number); if (p < pIdx) ng[`${p}-${d}`] = val; else if (p > pIdx) ng[`${p-1}-${d}`] = val; }); setTempSchedule({ periods: np, grid: ng }); }} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {editingSchedule && (
                  <Button variant="outline" className="w-full mt-3" onClick={() => { const np = [...tempSchedule.periods, { label: `${tempSchedule.periods.length + 1}°`, start: "", end: "" }]; setTempSchedule({ ...tempSchedule, periods: np }); }}>
                    <Plus className="w-4 h-4 mr-2" />{t.addPeriod}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Calendar View */}
          {activeTab === "calendar" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-3 sm:px-6 py-4 flex justify-between items-center">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="text-white hover:bg-white/20 rounded-lg p-2">←</button>
              <h2 className="text-base sm:text-xl font-semibold text-white">
                {t.monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="text-white hover:bg-white/20 rounded-lg p-2">→</button>
            </div>

            {/* Week Days - Nome completo */}
            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800">
              {t.weekDays.map((day, i) => (
                <div key={i} className="text-center py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 p-2 sm:p-3">
              {days.map((day, index) => {
                const date = day ? formatDate(day) : "";
                const dayTasks = day ? getTasksForDate(date) : [];
                const hasTask = dayTasks.some(t => t.type === "task");
                const hasHoliday = dayTasks.some(t => t.type === "holiday");
                const hasRecess = dayTasks.some(t => t.type === "recess");
                
                if (!day) {
                  // Dia vazio - COM quadradinho branco e borda
                  return <div key={index} className="aspect-square rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />;
                }
                
                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`
                      aspect-square p-1 sm:p-2 rounded-lg cursor-pointer transition-all relative
                      hover:bg-slate-100 dark:hover:bg-slate-800
                      ${isToday(day) ? "ring-2 ring-slate-900 dark:ring-white bg-white dark:bg-slate-900" : ""}
                    `}
                  >
                    {/* Número no canto superior esquerdo */}
                    <span className={`text-xs sm:text-sm font-medium ${isToday(day) ? "text-slate-900 dark:text-white font-bold" : "text-slate-900 dark:text-white"}`}>
                      {day}
                    </span>
                    
                    {/* Bolinhas no canto inferior direito */}
                    {dayTasks.length > 0 && (
                      <div className="absolute bottom-1 right-1 flex gap-[2px]">
                        {hasTask && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                        {hasHoliday && <div className="w-2 h-2 rounded-full bg-green-500" />}
                        {hasRecess && <div className="w-2 h-2 rounded-full bg-red-500" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-slate-600 dark:text-slate-400">{t.tasks}</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-slate-600 dark:text-slate-400">{t.holidays}</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-slate-600 dark:text-slate-400">{t.recess}</span></div>
            </div>
          </div>
          )}
        </div>
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-4 right-4 left-4 z-50 flex justify-center gap-2">
        <button onClick={() => setShowAnnouncements(true)} className="flex items-center gap-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg text-sm">
          <Bell className="w-4 h-4" />
          <span className="hidden sm:inline">{t.announcements}</span>
        </button>
        <button onClick={() => setShowDonate(true)} className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-full shadow-lg text-sm">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="hidden sm:inline">{t.donate}</span>
        </button>
        <button onClick={() => setShowInstructions(true)} className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg text-sm">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">{t.instructions}</span>
        </button>
      </div>

      {/* Announcements Dialog */}
      <Dialog open={showAnnouncements} onOpenChange={setShowAnnouncements}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />{t.announcementsTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
            {announcements.length === 0 && !showAddAnnouncement ? (
              <p className="text-center text-slate-500 text-sm">{t.noAnnouncements}</p>
            ) : (
              announcements.map(a => (
                <div key={a.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm flex justify-between items-start">
                  <div>
                    <p>{a.text}</p>
                    <p className="text-xs text-slate-400 mt-1">{a.date}</p>
                  </div>
                  {isAuthenticated && (
                    <button onClick={() => deleteAnnouncement(a.id)} className="text-red-500 ml-2"><X className="w-4 h-4" /></button>
                  )}
                </div>
              ))
            )}
            {showAddAnnouncement ? (
              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2">
                <Textarea value={newAnnouncement} onChange={e => setNewAnnouncement(e.target.value)} placeholder={t.announcementPlaceholder} rows={2} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveAnnouncement}>{t.save}</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddAnnouncement(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => requireAuth(() => setShowAddAnnouncement(true))}>
                <Plus className="w-4 h-4 mr-2" />{t.addAnnouncement}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Donate Dialog */}
      <Dialog open={showDonate} onOpenChange={setShowDonate}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-red-500" />{t.donateTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <p className="text-center text-slate-700 dark:text-slate-300">💙 {t.donateText}</p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
              <p className="text-xs font-medium mb-2">{t.pixKey}:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white dark:bg-slate-900 px-2 py-1 rounded text-sm font-mono">62999121460</code>
                <Button onClick={copyPixKey} size="sm" className="text-xs">{t.copyPix}</Button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium mb-2">{t.orScanQR}</p>
              <div className="flex justify-center">
                <img src="https://customer-assets.emergentagent.com/job_school-schedule-11/artifacts/qwyda6mq_image.png" alt="QR Code PIX" className="w-32 h-32 rounded-lg border" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-600" />{t.howToUse}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm text-slate-700 dark:text-slate-300">
            <section>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">📚 {t.whatIsThis}</h3>
              <p>{t.whatIsThisText}</p>
            </section>
            <section>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">🏠 {t.creatingRoom}</h3>
              <ol className="list-decimal list-inside space-y-1">{t.creatingRoomSteps.map((step, i) => <li key={i}>{step}</li>)}</ol>
            </section>
            <section>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">📝 {t.addingTasks}</h3>
              <ol className="list-decimal list-inside space-y-1">{t.addingTasksSteps.map((step, i) => <li key={i}>{step}</li>)}</ol>
            </section>
            <section>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">💡 {t.tips}</h3>
              <ul className="list-disc list-inside space-y-1">{t.tipsList.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader><DialogTitle>{t.enterPassword}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{t.password}</Label>
              <div className="relative">
                <Input type={showPasswordVisible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()} placeholder={t.passwordPlaceholder} className="pr-10" />
                <button type="button" onClick={() => setShowPasswordVisible(!showPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handlePasswordSubmit} className="w-full">{t.confirm}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{t.addFor} {formatDisplayDate(selectedDate)}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{t.type}</Label>
              <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">{t.task}</SelectItem>
                  <SelectItem value="holiday">{t.holiday}</SelectItem>
                  <SelectItem value="recess">{t.recess}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.titleField} *</Label>
              <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder={t.titlePlaceholder} />
            </div>
            {newTask.type === "task" && (
              <>
                <div>
                  <Label>{t.subject} *</Label>
                  <Input value={newTask.subject} onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })} placeholder={t.subjectPlaceholder} />
                </div>
                <div>
                  <Label>{t.description} ({t.optional})</Label>
                  <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder={t.descriptionPlaceholder} rows={3} />
                </div>
                <div>
                  <Label>{t.files} ({t.optional})</Label>
                  <div className="mt-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm">
                      <Upload className="w-4 h-4" />{t.addFile}
                      <input type="file" multiple className="hidden" onChange={(e) => setUploadFiles([...uploadFiles, ...Array.from(e.target.files)])} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" />
                    </label>
                  </div>
                  {uploadFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                          <span className="truncate flex-1">{file.name}</span>
                          <button onClick={() => setUploadFiles(uploadFiles.filter((_, i) => i !== index))} className="text-red-500 ml-2"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            <Button onClick={handleSaveTask} className="w-full" disabled={isSaving}>
              {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t.saving}</> : t.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Tasks Dialog */}
      <Dialog open={showViewTasks} onOpenChange={setShowViewTasks}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{formatDisplayDate(selectedDate)}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            {selectedTasks.map((task) => (
              <div key={task.id} className={`p-3 rounded-lg border-2 ${
                task.type === "task" ? "bg-blue-50 dark:bg-blue-950/20 border-blue-500"
                  : task.type === "holiday" ? "bg-green-50 dark:bg-green-950/20 border-green-500"
                  : "bg-red-50 dark:bg-red-950/20 border-red-500"
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{task.title}</h3>
                    {task.subject && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.subject}: {task.subject}</p>}
                    {task.description && <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{task.description}</p>}
                    {task.files && task.files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {task.files.map((file, index) => (
                          <a key={index} href={`${API}/files/${file.filename}`} download={file.originalName} className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                            <Download className="w-3 h-3" />{file.originalName}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  {isAuthenticated && (
                    <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-700 ml-2"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              </div>
            ))}
            <Button onClick={() => { setShowViewTasks(false); requireAuth(() => setShowAddTask(true)); }} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />{t.addAnotherTask}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
