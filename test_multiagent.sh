#!/bin/bash

echo "=== Testing Multi-Agent Workflow ==="
echo ""

SUGGESTION_ID=14

# Step 1: Analyze
echo "Step 1: Analyzing which files to modify..."
curl -s -X POST "http://localhost:8000/api/suggestions/$SUGGESTION_ID/analyze" | python3 -m json.tool
echo ""
echo "---"
echo ""

# Step 2: Generate changes
echo "Step 2: Generating multi-file changes with AI review..."
curl -s -X POST "http://localhost:8000/api/suggestions/$SUGGESTION_ID/generate-changes" > /tmp/multi_agent_result.json
cat /tmp/multi_agent_result.json | python3 -c "
import json
import sys

data = json.load(sys.stdin)

print('Analysis:', data['analysis'])
print()
print('Review:', data['review'])
print()
print('Files to be modified:')
for file in data['changes'].keys():
    print(f'  - {file}')
"
echo ""
echo "---"
echo ""

echo "Step 3: Apply changes (manual for simplified version)"
echo "To apply these changes:"
echo "  1. Review the generated code in /tmp/multi_agent_result.json"
echo "  2. Manually copy the changes to your files"
echo "  3. Or use git_manager.py to automate it (requires host access)"
echo ""
echo "Full result saved to: /tmp/multi_agent_result.json"
