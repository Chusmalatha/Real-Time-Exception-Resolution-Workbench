from pydantic import BaseModel, Field

class SettingsUpdate(BaseModel):
    auto_resolution_threshold: int = Field(ge=0, le=100)

class SettingsResponse(BaseModel):
    auto_resolution_threshold: int
