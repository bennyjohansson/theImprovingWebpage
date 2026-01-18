import os
import logging
from openai import OpenAI
from typing import Dict, List
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_files_for_suggestion(suggestion: str) -> Dict:
    """
    Analyze which files need to be modified for a suggestion.
    
    Returns dict with:
    - files_to_modify: list of file paths
    - reasoning: why these files
    """
    prompt = f"""You are analyzing a codebase for a self-improving web application.

User Suggestion: "{suggestion}"

Current codebase structure:
- frontend/src/App.tsx - Main React app component
- frontend/src/components/ - React components
- frontend/src/types.ts - TypeScript type definitions
- backend/main.py - FastAPI backend with endpoints
- backend/models.py - Database models

Analyze which files need modification to implement this suggestion.

Respond ONLY with JSON in this exact format:
{{
  "files_to_modify": ["path/to/file1.tsx", "path/to/file2.py"],
  "reasoning": "Brief explanation of why these files",
  "complexity": "simple|moderate|complex"
}}"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.3
        )
        
        result_text = response.choices[0].message.content.strip()
        logger.info(f"File analysis: {result_text}")
        
        # Parse JSON response
        result = json.loads(result_text)
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing files: {str(e)}")
        return {
            "files_to_modify": [],
            "reasoning": f"Error: {str(e)}",
            "complexity": "unknown"
        }


def generate_file_modification(suggestion: str, file_path: str, current_content: str) -> str:
    """
    Generate modifications for a specific file.
    
    Returns the complete modified file content.
    """
    prompt = f"""You are modifying code files for a self-improving web application.

User Suggestion: "{suggestion}"

File to modify: {file_path}

Current file content:
```
{current_content}
```

Generate the COMPLETE modified file that implements the suggestion.

Rules:
- Preserve existing code that doesn't need changes
- Add necessary imports
- Maintain code style
- Keep it simple and functional
- For React components: use arrow functions if react-live compatible needed

Return ONLY the complete modified file content, no explanations, no markdown fences."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=0.7
        )
        
        modified_content = response.choices[0].message.content.strip()
        logger.info(f"Generated modification for {file_path}: {len(modified_content)} chars")
        
        return modified_content
        
    except Exception as e:
        logger.error(f"Error generating modification for {file_path}: {str(e)}")
        return current_content  # Return original if error


def review_changes(suggestion: str, changes: Dict[str, str]) -> Dict:
    """
    Review the proposed changes before applying them.
    
    Args:
        suggestion: Original user suggestion
        changes: Dict mapping file paths to their new content
        
    Returns dict with:
        - approved: bool
        - issues: list of issues found
        - suggestions: list of improvement suggestions
    """
    changes_summary = "\n\n".join([
        f"File: {path}\nLength: {len(content)} chars\nPreview: {content[:200]}..."
        for path, content in changes.items()
    ])
    
    prompt = f"""You are reviewing code changes for a self-improving web application.

Original Suggestion: "{suggestion}"

Proposed Changes:
{changes_summary}

Review these changes for:
1. Security issues (XSS, injection, etc.)
2. Breaking changes (will it break existing functionality?)
3. Code quality (maintainability, readability)
4. Completeness (does it fully implement the suggestion?)

Respond ONLY with JSON:
{{
  "approved": true/false,
  "issues": ["issue1", "issue2"],
  "suggestions": ["improvement1", "improvement2"],
  "risk_level": "low|medium|high"
}}"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.3
        )
        
        review_text = response.choices[0].message.content.strip()
        logger.info(f"Review result: {review_text}")
        
        review = json.loads(review_text)
        return review
        
    except Exception as e:
        logger.error(f"Error reviewing changes: {str(e)}")
        return {
            "approved": False,
            "issues": [f"Review error: {str(e)}"],
            "suggestions": [],
            "risk_level": "unknown"
        }


if __name__ == "__main__":
    # Test the multi-agent system
    test_suggestion = "Add a dark mode toggle button"
    
    print("1. Analyzing files...")
    analysis = analyze_files_for_suggestion(test_suggestion)
    print(f"   Result: {json.dumps(analysis, indent=2)}")
    
    print("\n2. Would generate modifications for each file...")
    print("\n3. Would review all changes...")
