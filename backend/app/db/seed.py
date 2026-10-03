import json
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Paper, Author, Topic, Method, Dataset, PaperAuthor, Citation

def seed_demo_data():
    db = SessionLocal()
    try:
        if db.query(Paper).count() > 0:
            return # Idempotent
        
        path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'demo_papers.json')
        if not os.path.exists(path): return

        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        authors_map = {}
        for item in data:
            if '_notice' in item: continue
            
            p = Paper(
                title=item['title'],
                year=item.get('year'),
                venue=item.get('venue'),
                doi=item.get('doi'),
                abstract=item.get('abstract'),
                citation_count=item.get('citation_count'),
                open_access=item.get('open_access', False),
                source="demo"
            )
            db.add(p)
            db.flush() # get id
            
            for a_data in item.get('authors', []):
                aname = a_data['name']
                if aname not in authors_map:
                    auth = Author(name=aname)
                    db.add(auth)
                    db.flush()
                    authors_map[aname] = auth.id
                db.add(PaperAuthor(paper_id=p.id, author_id=authors_map[aname]))
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
