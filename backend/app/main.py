from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.core.errors import AppException, app_exception_handler
import importlib
import pkgutil
import app.api.routes as api_routes

app = FastAPI(title="AI Research Literature Discovery Agent")

@app.on_event("startup")
def on_startup():
    from app.config import settings
    from app.db.seed import seed_demo_data
    if settings.demo_mode:
        seed_demo_data()


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(NotImplementedError, lambda r, e: app_exception_handler(r, AppException("NOT_IMPLEMENTED", "Endpoint not implemented", 501)))

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}

# Auto-register routers
for _, module_name, _ in pkgutil.iter_modules(api_routes.__path__):
    mod = importlib.import_module(f"app.api.routes.{module_name}")
    if hasattr(mod, "router"):
        app.include_router(mod.router, prefix="/api/v1")
