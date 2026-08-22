from pydantic import BaseModel

class HumanResolutionRequest(BaseModel):
    action: str
    reviewer: str
    reason: str
