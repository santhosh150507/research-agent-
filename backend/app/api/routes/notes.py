from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.get("/papers/{id}/notes")
def get_notes(id: int): not_impl()
@router.post("/papers/{id}/notes")
def add_note(id: int): not_impl()
@router.patch("/notes/{note_id}")
def update_note(note_id: int): not_impl()
@router.delete("/notes/{note_id}")
def delete_note(note_id: int): not_impl()
