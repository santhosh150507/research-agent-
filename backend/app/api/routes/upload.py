from fastapi import APIRouter, File, UploadFile, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uuid
import threading
from app.services.pdf.pdf_processor import process_pdf_background
from app.database import SessionLocal
from app.models.paper import Paper

router = APIRouter()

upload_status = {}

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
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large")
    
    upload_id = str(uuid.uuid4())
    upload_status[upload_id] = {"status": "queued"}
    
    # Run in background
    background_tasks.add_task(process_pdf_background, upload_id, content)
    return UploadRes(upload_id=upload_id, status="queued")

@router.get("/upload/{upload_id}", response_model=UploadStatusRes)
def get_upload_status(upload_id: str):
    if upload_id not in upload_status:
        raise HTTPException(404, "Upload ID not found")
    st = upload_status[upload_id]
    
    paper_dict = None
    if st.get("paper_id"):
        db = SessionLocal()
        p = db.query(Paper).filter(Paper.id == st["paper_id"]).first()
        if p:
            paper_dict = {"id": p.id, "title": p.title, "abstract": p.abstract}
        db.close()
        
    return UploadStatusRes(
        status=st["status"],
        error=st.get("error"),
        paper=paper_dict,
        structure=st.get("structure")
    )
