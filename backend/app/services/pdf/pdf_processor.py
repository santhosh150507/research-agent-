import fitz
import json
from app.database import SessionLocal
from app.models.paper import Paper
from app.models.paper_chunk import PaperChunk
from app.services.llm.embeddings import get_embedding

def process_pdf_background(upload_id: str, content: bytes):
    from app.api.routes.upload import upload_status
    upload_status[upload_id]["status"] = "running"
    
    try:
        doc = fitz.open(stream=content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
            
        if not text.strip():
            raise ValueError("Corrupt or scanned PDF: no text extractable")
            
        # Basic heuristic extraction
        title = "Extracted Title"
        abstract = ""
        sections = {"methodology": "", "findings": "", "limitations": "", "future_work": ""}
        
        lines = text.split("\n")
        title = lines[0][:200] if lines else "Unknown"
        
        abs_started = False
        for i, line in enumerate(lines):
            l = line.lower().strip()
            if l == "abstract":
                abs_started = True
            elif abs_started and len(l) > 0:
                if l in ["introduction", "1. introduction", "1 introduction"]:
                    break
                abstract += line + " "
        
        abstract = abstract.strip()[:2000]
        
        db = SessionLocal()
        try:
            p = Paper(
                title=title, abstract=abstract, source="upload", open_access=True,
                citation_count=0
            )
            db.add(p)
            db.commit()
            db.refresh(p)
            
            # chunking
            chunks = []
            chunk_size = 500
            words = text.split()
            for i in range(0, len(words), chunk_size):
                chunk_text = " ".join(words[i:i+chunk_size])
                c = PaperChunk(paper_id=p.id, text=chunk_text, chunk_index=i//chunk_size)
                db.add(c)
                
            db.commit()
            
            upload_status[upload_id].update({
                "status": "done",
                "paper_id": p.id,
                "structure": sections
            })
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()
            
    except Exception as e:
        upload_status[upload_id]["status"] = "failed"
        upload_status[upload_id]["error"] = str(e)
