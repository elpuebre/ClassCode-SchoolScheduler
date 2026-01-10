from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Header
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'agenda_escolar')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Upload directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Helper function to generate unique room code
async def generate_room_code():
    import random
    import string
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=7))
        existing = await db.rooms.find_one({"code": code})
        if not existing:
            return code

# Define Models
class Room(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    code: str
    name: str
    password: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RoomCreate(BaseModel):
    name: str
    password: str

class RoomJoin(BaseModel):
    code: str

class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    roomCode: str
    date: str  # ISO date string YYYY-MM-DD
    type: str  # "task", "holiday", "recess"
    title: str
    subject: Optional[str] = None
    description: Optional[str] = None
    files: List[dict] = []  # List of file objects
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(BaseModel):
    roomCode: str
    date: str
    type: str
    title: str
    subject: Optional[str] = None
    description: Optional[str] = None

class PasswordVerify(BaseModel):
    password: str
    roomCode: str

class TaskFile(BaseModel):
    taskId: str
    filename: str
    originalName: str

# Create room
@api_router.post("/rooms/create")
async def create_room(input: RoomCreate):
    if len(input.name) > 32:
        raise HTTPException(status_code=400, detail="Nome da sala muito longo (máximo 32 caracteres)")
    if len(input.password) > 16:
        raise HTTPException(status_code=400, detail="Senha muito longa (máximo 16 caracteres)")
    
    code = await generate_room_code()
    
    room_obj = Room(code=code, name=input.name, password=input.password)
    doc = room_obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.rooms.insert_one(doc)
    
    return {"code": code, "name": input.name}

# Join room
@api_router.post("/rooms/join")
async def join_room(input: RoomJoin):
    room = await db.rooms.find_one({"code": input.code}, {"_id": 0})
    
    if not room:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    
    return {"code": room["code"], "name": room["name"]}

# Verify password
@api_router.post("/auth/verify")
async def verify_password(input: PasswordVerify):
    room = await db.rooms.find_one({"code": input.roomCode}, {"_id": 0})
    
    if not room:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    
    if input.password == room["password"]:
        return {"valid": True}
    return {"valid": False}

# Get all tasks for a room
@api_router.get("/tasks/{room_code}", response_model=List[Task])
async def get_tasks(room_code: str):
    tasks = await db.tasks.find({"roomCode": room_code}, {"_id": 0}).to_list(10000)
    
    for task in tasks:
        if isinstance(task.get('createdAt'), str):
            task['createdAt'] = datetime.fromisoformat(task['createdAt'])
    
    return tasks

# Create task
@api_router.post("/tasks", response_model=Task)
async def create_task(input: TaskCreate, password: Optional[str] = Header(None), roomcode: Optional[str] = Header(None)):
    # Verify room exists
    room = await db.rooms.find_one({"code": input.roomCode}, {"_id": 0})
    if not room:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    
    # Verify password
    if password != room["password"]:
        raise HTTPException(status_code=403, detail="Senha inválida")
    
    task_obj = Task(**input.model_dump())
    doc = task_obj.model_dump()
    doc['createdAt'] = doc['createdAt'].isoformat()
    
    await db.tasks.insert_one(doc)
    return task_obj

# Delete task
@api_router.delete("/tasks/{room_code}/{task_id}")
async def delete_task(room_code: str, task_id: str, password: Optional[str] = Header(None)):
    # Verify room and password
    room = await db.rooms.find_one({"code": room_code}, {"_id": 0})
    if not room:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    
    if password != room["password"]:
        raise HTTPException(status_code=403, detail="Senha inválida")
    
    result = await db.tasks.delete_one({"id": task_id, "roomCode": room_code})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    return {"success": True}

# Upload file
@api_router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    taskId: str = None,
    roomCode: str = None,
    password: Optional[str] = Header(None)
):
    # Verify room and password
    room = await db.rooms.find_one({"code": roomCode}, {"_id": 0})
    if not room:
        raise HTTPException(status_code=404, detail="Sala não encontrada")
    
    if password != room["password"]:
        raise HTTPException(status_code=403, detail="Senha inválida")
    
    # Check file size (750MB limit)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > 750 * 1024 * 1024:  # 750MB in bytes
        raise HTTPException(status_code=413, detail="Arquivo muito grande (máximo 750MB)")
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update task with file reference if taskId provided
    if taskId:
        await db.tasks.update_one(
            {"id": taskId, "roomCode": roomCode},
            {"$push": {"files": {"filename": unique_filename, "originalName": file.filename}}}
        )
    
    return {
        "filename": unique_filename,
        "originalName": file.filename,
        "url": f"/api/files/{unique_filename}"
    }

# Download file
@api_router.get("/files/{filename}")
async def download_file(filename: str):
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    
    return FileResponse(file_path)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
