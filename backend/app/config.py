from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import List, Union
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"

class Settings(BaseSettings):
    database_url: str = ""
    demo_mode: bool = True
    llm_provider: str = "gemini"
    gemini_api_key: str = ""
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    cohere_api_key: str = ""
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_dim: int = 384
    openalex_email: str = ""
    crossref_email: str = ""
    unpaywall_email: str = ""
    semantic_scholar_api_key: str = ""
    cors_origins: Union[List[str], str] = ["http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(env_file=str(env_path), env_file_encoding="utf-8", extra="ignore")

settings = Settings()
