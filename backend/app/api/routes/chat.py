from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.post("/conversations")
def create_conversation(): not_impl()

@router.get("/conversations")
def get_conversations(): not_impl()

@router.get("/conversations/{id}")
def get_conversation(id: int): not_impl()

@router.post("/conversations/{id}/messages")
def post_message(id: int): not_impl()

@router.post("/multi-qa")
def multi_qa(): not_impl()
