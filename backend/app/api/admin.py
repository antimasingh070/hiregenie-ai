from fastapi import APIRouter, Depends
from app.api.deps import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard")
def admin_dashboard(
    user=Depends(require_role("admin"))
):
    return {
        "message": "Admin dashboard",
        "status": "ok"
    }