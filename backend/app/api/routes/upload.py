from fastapi import APIRouter, File, UploadFile, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uuid
from app.services.pdf.pdf_processor import process_pdf_background
from app.database import SessionLocal
from app.models.paper import Paper
from app.models.upload_job import UploadJob

router = APIRouter()

class UploadRes(BaseModel):
    upload_id: str
    status: str

class UploadStatusRes(BaseModel):
    status: str
    error: str | None = None
    paper: dict | None = None
    structure: dict | None = None

@router.post("/upload", response_model=UploadRes)
async def upload_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "File must be a PDF")
    content = await file.read()
    upload_id = str(uuid.uuid4())
    
    db = SessionLocal()
    job = UploadJob(id=upload_id, status="queued")
    db.add(job)
    db.commit()
    db.close()
    
    background_tasks.add_task(process_pdf_background, upload_id, content)
    return UploadRes(upload_id=upload_id, status="queued")

@router.get("/upload/{upload_id}", response_model=UploadStatusRes)
def get_upload_status(upload_id: str):
    db = SessionLocal()
    job = db.query(UploadJob).filter(UploadJob.id == upload_id).first()
    if not job:
        db.close()
        raise HTTPException(404, "Upload ID not found")
        
    paper_dict = None
    if job.paper_id:
        p = db.query(Paper).filter(Paper.id == job.paper_id).first()
        if p:
            paper_dict = {"id": p.id, "title": p.title, "abstract": p.abstract}
            
    res = UploadStatusRes(
        status=job.status,
        error=job.error,
        paper=paper_dict,
        structure=job.structure
    )
    db.close()
    return res
