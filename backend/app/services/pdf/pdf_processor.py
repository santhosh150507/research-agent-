import fitz
from app.database import SessionLocal
from app.models.paper import Paper
from app.models.paper_chunk import PaperChunk
from app.models.upload_job import UploadJob

def process_pdf_background(upload_id: str, content: bytes):
    db = SessionLocal()
    try:
        job = db.query(UploadJob).filter(UploadJob.id == upload_id).first()
        if not job: return
        job.status = "running"
        db.commit()
        
        doc = fitz.open(stream=content, filetype="pdf")
        text = "".join([page.get_text() for page in doc])
        if not text.strip():
            raise ValueError("Corrupt or scanned PDF: no text extractable")
            
        title = text.split("\n")[0][:200] if text else "Unknown"
        abstract = text[:2000] # Simplistic heuristic
        sections = {"methodology": "", "findings": "", "limitations": "", "future_work": ""}
        
        p = Paper(title=title, abstract=abstract, source="upload", open_access=True, citation_count=0)
        db.add(p)
        db.flush() # get ID
        
        chunk_size = 500
        words = text.split()
        for i in range(0, len(words), chunk_size):
            chunk_text = " ".join(words[i:i+chunk_size])
            db.add(PaperChunk(paper_id=p.id, text=chunk_text, chunk_index=i//chunk_size))
            
        job.status = "done"
        job.paper_id = p.id
        job.structure = sections
        db.commit()
    except Exception as e:
        db.rollback()
        job = db.query(UploadJob).filter(UploadJob.id == upload_id).first()
        if job:
            job.status = "failed"
            job.error = str(e)
            db.commit()
    finally:
        db.close()
