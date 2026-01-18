import os
import logging
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def validate_suggestion(content: str) -> dict:
    """
    Validate if a suggestion is safe and actionable using OpenAI API.
    
    Args:
        content: The suggestion text to validate
        
    Returns:
        dict with 'approved' (bool) and 'reason' (str)
    """
    try:
        logger.info(f"Validating suggestion: {content[:50]}...")
        
        prompt = f"""You are validating a user suggestion for a self-improving webpage project.

Suggestion: "{content}"

Determine if this suggestion is:
1. Safe (no malicious code, XSS, or security risks)
2. Actionable (can be implemented as a React component)
3. Reasonable (not too complex, not inappropriate)

Respond with ONLY a JSON object in this exact format:
{{"approved": true/false, "reason": "brief explanation"}}"""

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.3
        )
        
        # Parse response
        response_text = response.choices[0].message.content.strip()
        logger.info(f"Validation response: {response_text}")
        
        # Simple parsing - look for approved true/false
        if '"approved": true' in response_text or '"approved":true' in response_text:
            return {"approved": True, "reason": "Suggestion is safe and actionable"}
        else:
            return {"approved": False, "reason": "Suggestion does not meet safety or feasibility criteria"}
            
    except Exception as e:
        logger.error(f"Error validating suggestion: {str(e)}")
        return {"approved": False, "reason": f"Validation error: {str(e)}"}


def generate_component_code(content: str) -> str:
    """
    Generate React TypeScript component code based on user suggestion.
    
    Args:
        content: The approved suggestion text
        
    Returns:
        str: Generated React component code
    """
    try:
        logger.info(f"Generating code for: {content[:50]}...")
        
        prompt = f"""You are a code generation assistant for a self-improving webpage project.

User Suggestion: "{content}"

Generate a complete, production-ready React TypeScript functional component that implements this suggestion.

Requirements:
- Use TypeScript with proper types
- Use Tailwind CSS for styling
- Make it modern and visually appealing
- Include proper props interface if needed
- Keep it simple and focused
- No external dependencies beyond React and Tailwind

Return ONLY the component code, no explanations, no markdown formatting, no code fences.
Start directly with: import React from 'react'"""
response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500,
            temperature=0.7
        )
        
        code = response.choices[0].message.conten
        code = message.content[0].text.strip()
        
        # Remove markdown code fences if present
        if code.startswith("```"):
            lines = code.split("\n")
            # Remove first line (```typescript or ```tsx)
            lines = lines[1:]
            # Remove last line if it's ```
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            code = "\n".join(lines)
        
        logger.info(f"Generated {len(code)} characters of code")
        return code
        
    except Exception as e:
        logger.error(f"Error generating code: {str(e)}")
        return f"// Error generating component: {str(e)}\n\nconst ErrorComponent = () => <div>Error generating component</div>;\n\nexport default ErrorComponent;"


if __name__ == "__main__":
    # Test the functions
    test_suggestion = "Add a welcome title to the page"
    
    print("Testing validation...")
    result = validate_suggestion(test_suggestion)
    print(f"Validation result: {result}")
    
    if result["approved"]:
        print("\nTesting code generation...")
        code = generate_component_code(test_suggestion)
        print(f"Generated code:\n{code}")
