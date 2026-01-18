from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# SQLAlchemy Model
class Suggestion(Base):
    __tablename__ = "suggestions"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    generated_code = Column(Text, nullable=True)
    deployed = Column(Boolean, default=False, nullable=False)
    component_name = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# Pydantic Models for API
class SuggestionCreate(BaseModel):
    content: str

class SuggestionResponse(BaseModel):
    id: int
    content: str
    status: str
    generated_code: Optional[str] = None
    deployed: bool = False
    component_name: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
