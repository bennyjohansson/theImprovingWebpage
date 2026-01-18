#!/usr/bin/env python3
"""
CLI tool to review and approve code changes from AI suggestions.
"""
import sys
import os
from git_manager import GitManager
from colorama import init, Fore, Style

# Initialize colorama for colored output
init(autoreset=True)


def print_diff(diff: str):
    """Print colored diff output"""
    for line in diff.split('\n'):
        if line.startswith('+') and not line.startswith('+++'):
            print(Fore.GREEN + line)
        elif line.startswith('-') and not line.startswith('---'):
            print(Fore.RED + line)
        elif line.startswith('@@'):
            print(Fore.CYAN + line)
        else:
            print(line)


def review_suggestion(suggestion_id: int):
    """Review changes for a specific suggestion"""
    git = GitManager()
    
    # Check if branch exists
    branch_name = f"suggestion-{suggestion_id}"
    branches = [b.name for b in git.repo.branches]
    
    matching_branches = [b for b in branches if b.startswith(branch_name)]
    
    if not matching_branches:
        print(f"{Fore.RED}No branch found for suggestion #{suggestion_id}")
        return
    
    branch = matching_branches[0]
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.YELLOW}Reviewing: {branch}")
    print(f"{Fore.CYAN}{'='*60}\n")
    
    # Checkout the branch
    git.repo.git.checkout(branch)
    
    # Get diff
    diff = git.get_diff()
    
    if not diff:
        print(f"{Fore.YELLOW}No changes found")
        return
    
    print(f"{Fore.WHITE}Changes:\n")
    print_diff(diff)
    
    print(f"\n{Fore.CYAN}{'='*60}\n")
    
    # Prompt for action
    while True:
        choice = input(f"{Fore.YELLOW}Action? [a]pprove / [r]eject / [e]dit / [q]uit: {Style.RESET_ALL}").lower()
        
        if choice == 'a':
            print(f"{Fore.GREEN}✓ Approved! Merging to master...")
            try:
                git.repo.git.checkout('master')
                git.repo.git.merge(branch, '--no-ff')
                print(f"{Fore.GREEN}✓ Merged successfully!")
            except Exception as e:
                print(f"{Fore.RED}✗ Merge failed: {e}")
            break
            
        elif choice == 'r':
            print(f"{Fore.RED}✗ Rejected. Switching back to master...")
            git.switch_to_main()
            break
            
        elif choice == 'e':
            print(f"{Fore.YELLOW}Opening files for editing...")
            print(f"{Fore.CYAN}Edit the files, then run this command again.")
            break
            
        elif choice == 'q':
            print(f"{Fore.CYAN}Exiting...")
            git.switch_to_main()
            break
        else:
            print(f"{Fore.RED}Invalid choice")


def list_pending_suggestions():
    """List all suggestion branches"""
    git = GitManager()
    branches = [b.name for b in git.repo.branches if 'suggestion-' in b.name]
    
    if not branches:
        print(f"{Fore.YELLOW}No pending suggestions")
        return
    
    print(f"\n{Fore.CYAN}Pending Suggestions:")
    for i, branch in enumerate(branches, 1):
        # Extract suggestion ID
        parts = branch.split('-')
        if len(parts) >= 2 and parts[1].isdigit():
            print(f"{Fore.GREEN}{i}. {Fore.WHITE}Suggestion #{parts[1]}: {'-'.join(parts[2:])}")
    print()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"{Fore.CYAN}Usage:")
        print(f"  {sys.argv[0]} list              - List pending suggestions")
        print(f"  {sys.argv[0]} review <id>       - Review suggestion by ID")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'list':
        list_pending_suggestions()
    elif command == 'review' and len(sys.argv) >= 3:
        suggestion_id = int(sys.argv[2])
        review_suggestion(suggestion_id)
    else:
        print(f"{Fore.RED}Invalid command")
