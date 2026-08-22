from fastapi import APIRouter
from app.schemas.settings import SettingsUpdate, SettingsResponse
from app.services import settings_service

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("", response_model=SettingsResponse)
async def get_settings():
    threshold = await settings_service.get_auto_resolution_threshold()
    return {"auto_resolution_threshold": threshold}

@router.patch("", response_model=SettingsResponse)
async def update_settings(settings: SettingsUpdate):
    threshold = await settings_service.update_auto_resolution_threshold(settings.auto_resolution_threshold)
    return {"auto_resolution_threshold": threshold}
