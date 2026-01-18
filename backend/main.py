from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import logging

from database import get_db, init_db
from models import Suggestion, SuggestionCreate, SuggestionResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="Self-Improving Webpage API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized successfully")

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "backend"}

@app.post("/api/suggestions", response_model=SuggestionResponse, status_code=201)
def create_suggestion(
    suggestion: SuggestionCreate,
    db: Session = Depends(get_db)
):
    """Create a new suggestion"""
    if not suggestion.content or not suggestion.content.strip():
        raise HTTPException(status_code=400, detail="Suggestion content cannot be empty")
    
    if len(suggestion.content) > 500:
        raise HTTPException(status_code=400, detail="Suggestion content too long (max 500 characters)")
    
    logger.info(f"Creating suggestion: {suggestion.content[:50]}...")
    
    try:
        db_suggestion = Suggestion(
            content=suggestion.content.strip(),
            status="pending"
        )
        db.add(db_suggestion)
        db.commit()
        db.refresh(db_suggestion)
        
        logger.info(f"Created suggestion with ID: {db_suggestion.id}")
        return db_suggestion
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating suggestion: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create suggestion")

@app.get("/api/suggestions", response_model=List[SuggestionResponse])
def list_suggestions(db: Session = Depends(get_db)):
    """List all suggestions"""
    suggestions = db.query(Suggestion).order_by(Suggestion.created_at.desc()).all()
    logger.info(f"Retrieved {len(suggestions)} suggestions")
    return suggestions

@app.get("/api/suggestions/{suggestion_id}", response_model=SuggestionResponse)
def get_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    """Get a specific suggestion by ID"""
    suggestion = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    
    if not suggestion:
        logger.warning(f"Suggestion {suggestion_id} not found")
        raise HTTPException(status_code=404, detail="Suggestion not found")
    
    return suggestion
