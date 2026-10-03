from app.database import SessionLocal
from app.models import Paper as PaperModel
from app.schemas.common import Paper, Author

class DemoDataClient:
    def search(self, query: str) -> list[Paper]:
        db = SessionLocal()
        # naive match
        res = db.query(PaperModel).filter(PaperModel.title.ilike(f"%{query}%")).limit(10).all()
        papers = []
        for r in res:
            papers.append(Paper(
                id=r.id, title=r.title, authors=[], year=r.year, venue=r.venue,
                doi=r.doi, url=r.url, abstract=r.abstract, citation_count=r.citation_count,
                open_access=r.open_access, source="demo", topics=[], methods=[], datasets=[], keywords=[]
            ))
        db.close()
        return papers
