import time
import logging
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import Suggestion
from ai_agent import validate_suggestion, generate_component_code

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def process_pending_suggestions():
    """
    Main worker function that polls for pending suggestions and processes them.
    """
    db: Session = SessionLocal()
    
    try:
        # Query for pending suggestions
        pending = db.query(Suggestion).filter(
            Suggestion.status == 'pending'
        ).order_by(Suggestion.created_at).all()
        
        if not pending:
            return
        
        logger.info(f"Found {len(pending)} pending suggestion(s)")
        
        for suggestion in pending:
            try:
                logger.info(f"Processing suggestion #{suggestion.id}: {suggestion.content[:50]}...")
                
                # Update status to processing
                suggestion.status = 'processing'
                db.commit()
                
                # Validate suggestion
                validation_result = validate_suggestion(suggestion.content)
                
                if not validation_result["approved"]:
                    logger.warning(f"Suggestion #{suggestion.id} rejected: {validation_result['reason']}")
                    suggestion.status = 'failed'
                    suggestion.generated_code = f"// Validation failed: {validation_result['reason']}"
                    db.commit()
                    continue
                
                logger.info(f"Suggestion #{suggestion.id} validated successfully")
                
                # Generate code
                generated_code = generate_component_code(suggestion.content)
                
                # Update suggestion with generated code
                suggestion.generated_code = generated_code
                suggestion.status = 'completed'
                db.commit()
                
                logger.info(f"Suggestion #{suggestion.id} completed successfully")
                
            except Exception as e:
                logger.error(f"Error processing suggestion #{suggestion.id}: {str(e)}")
                suggestion.status = 'failed'
                suggestion.generated_code = f"// Error: {str(e)}"
                db.commit()
                
    except Exception as e:
        logger.error(f"Error querying database: {str(e)}")
    finally:
        db.close()


def main():
    """
    Main worker loop - runs indefinitely checking for pending suggestions.
    """
    logger.info("🤖 Worker started - monitoring for pending suggestions...")
    logger.info("Press Ctrl+C to stop")
    
    # Initialize database tables
    init_db()
    logger.info("Database initialized")
    
    # Main loop
    while True:
        try:
            process_pending_suggestions()
            time.sleep(10)  # Wait 10 seconds before checking again
            
        except KeyboardInterrupt:
            logger.info("Worker stopped by user")
            break
        except Exception as e:
            logger.error(f"Unexpected error in worker loop: {str(e)}")
            time.sleep(10)  # Wait before retrying


if __name__ == "__main__":
    main()
