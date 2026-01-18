from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import logging
import os
import re

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

@app.post("/api/suggestions/{suggestion_id}/deploy")
def deploy_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    """Deploy an approved suggestion to the frontend"""
    suggestion = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    
    if suggestion.status != "completed":
        raise HTTPException(status_code=400, detail="Can only deploy completed suggestions")
    
    if not suggestion.generated_code:
        raise HTTPException(status_code=400, detail="No generated code available")
    
    try:
        # Generate component name from suggestion ID
        component_name = f"Generated{suggestion_id}"
        
        # Path to frontend generated components directory
        generated_dir = "/app/frontend/src/generated"
        os.makedirs(generated_dir, exist_ok=True)
        
        # Write component file
        file_path = os.path.join(generated_dir, f"{component_name}.tsx")
        
        # Ensure the code exports a default component
        code = suggestion.generated_code
        if "export default" not in code:
            # Try to find the component name and add export
            match = re.search(r'const\s+(\w+)\s*[:=]', code)
            if match:
                comp_name = match.group(1)
                code += f"\n\nexport default {comp_name};"
            else:
                code += f"\n\nexport default {component_name};"
        
        with open(file_path, 'w') as f:
            f.write(code)
        
        # Update database
        suggestion.deployed = True
        suggestion.component_name = component_name
        db.commit()
        db.refresh(suggestion)
        
        logger.info(f"Deployed suggestion {suggestion_id} as {component_name}")
        return {"message": "Component deployed successfully", "component_name": component_name}
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error deploying suggestion {suggestion_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to deploy component: {str(e)}")

@app.post("/api/suggestions/{suggestion_id}/undeploy")
def undeploy_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    """Undeploy a suggestion (mark as not deployed)"""
    suggestion = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    
    if not suggestion.deployed:
        raise HTTPException(status_code=400, detail="Suggestion is not deployed")
    
    try:
        # Update database
        suggestion.deployed = False
        db.commit()
        db.refresh(suggestion)
        
        logger.info(f"Undeployed suggestion {suggestion_id}")
        return {"message": "Component undeployed successfully"}
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error undeploying suggestion {suggestion_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to undeploy component: {str(e)}")

@app.get("/api/suggestions/deployed/list")
def list_deployed_suggestions(db: Session = Depends(get_db)):
    """List all deployed suggestions"""
    deployed = db.query(Suggestion).filter(Suggestion.deployed == True).order_by(Suggestion.created_at.desc()).all()
    logger.info(f"Retrieved {len(deployed)} deployed suggestions")
    return deployed

@app.post("/api/suggestions/{suggestion_id}/analyze")
def analyze_suggestion(suggestion_id: int, db: Session = Depends(get_db)):
    """Analyze which files need modification for a suggestion"""
    from multi_agent import analyze_files_for_suggestion
    
    suggestion = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    
    if suggestion.status != "completed":
        raise HTTPException(status_code=400, detail="Can only analyze completed suggestions")
    
    try:
        analysis = analyze_files_for_suggestion(suggestion.content)
        return analysis
    except Exception as e:
        logger.error(f"Error analyzing suggestion {suggestion_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/api/suggestions/{suggestion_id}/generate-changes")
def generate_changes(suggestion_id: int, db: Session = Depends(get_db)):
    """Generate multi-file changes for a suggestion"""
    from multi_agent import analyze_files_for_suggestion, generate_file_modification, review_changes
    
    suggestion = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    
    if suggestion.status != "completed":
        raise HTTPException(status_code=400, detail="Can only generate changes for completed suggestions")
    
    try:
        # Step 1: Analyze which files to modify
        analysis = analyze_files_for_suggestion(suggestion.content)
        files_to_modify = analysis.get("files_to_modify", [])
        
        if not files_to_modify:
            return {"error": "No files identified for modification"}
        
        # Step 2: Generate modifications for each file
        changes = {}
        for file_path in files_to_modify[:2]:  # Limit to 2 files for simplicity
            # Read current file content (if exists)
            full_path = os.path.join("/Users/bennyjohansson/Documents/Projects/theImprovingWebpage", file_path)
            current_content = ""
            if os.path.exists(full_path):
                with open(full_path, 'r') as f:
                    current_content = f.read()
            
            # Generate modification
            modified_content = generate_file_modification(
                suggestion.content,
                file_path,
                current_content
            )
            changes[file_path] = modified_content
        
        # Step 3: Review changes
        review = review_changes(suggestion.content, changes)
        
        return {
            "analysis": analysis,
            "changes": changes,
            "review": review,
            "suggestion_id": suggestion_id
        }
        
    except Exception as e:
        logger.error(f"Error generating changes for suggestion {suggestion_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.post("/api/suggestions/{suggestion_id}/apply")
def apply_changes(
    suggestion_id: int,
    changes: dict,
    db: Session = Depends(get_db)
):
    """Apply changes and create git branch"""
    from git_manager import GitManager
    
    suggestion = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    
    try:
        git = GitManager()
        
        # Create branch
        branch_name = git.create_branch(suggestion_id, suggestion.content[:30])
        
        # Apply changes
        modified_files = git.apply_changes(changes)
        
        # Commit
        commit_message = f"AI: {suggestion.content}\n\nSuggestion #{suggestion_id}"
        commit_hash = git.commit_changes(commit_message, modified_files)
        
        # Get diff for review
        diff = git.get_diff()
        
        logger.info(f"Applied changes for suggestion {suggestion_id}: {branch_name}")
        
        return {
            "success": True,
            "branch": branch_name,
            "commit": commit_hash[:7],
            "modified_files": modified_files,
            "diff": diff
        }
        
    except Exception as e:
        logger.error(f"Error applying changes for suggestion {suggestion_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to apply changes: {str(e)}")


