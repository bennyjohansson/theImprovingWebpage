import os
import logging
from git import Repo, GitCommandError
from typing import Dict, List
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GitManager:
    """Manages git operations for the self-improving codebase"""
    
    def __init__(self, repo_path: str = "/Users/bennyjohansson/Documents/Projects/theImprovingWebpage"):
        self.repo_path = repo_path
        try:
            self.repo = Repo(repo_path)
            logger.info(f"Git repo initialized at {repo_path}")
        except Exception as e:
            logger.error(f"Failed to initialize git repo: {e}")
            raise
    
    def create_branch(self, suggestion_id: int, description: str) -> str:
        """
        Create a new branch for the suggestion.
        
        Args:
            suggestion_id: ID of the suggestion
            description: Short description for branch name
            
        Returns:
            Branch name
        """
        # Sanitize description for branch name
        safe_desc = re.sub(r'[^a-z0-9]+', '-', description.lower())[:30]
        branch_name = f"suggestion-{suggestion_id}-{safe_desc}"
        
        try:
            # Make sure we're on main
            self.repo.git.checkout('master')
            
            # Create and checkout new branch
            self.repo.git.checkout('-b', branch_name)
            logger.info(f"Created branch: {branch_name}")
            
            return branch_name
            
        except GitCommandError as e:
            logger.error(f"Failed to create branch: {e}")
            # If branch exists, checkout it
            try:
                self.repo.git.checkout(branch_name)
                return branch_name
            except:
                raise
    
    def apply_changes(self, changes: Dict[str, str]) -> List[str]:
        """
        Write modified files to disk.
        
        Args:
            changes: Dict mapping file paths to new content
            
        Returns:
            List of modified file paths
        """
        modified_files = []
        
        for file_path, content in changes.items():
            full_path = os.path.join(self.repo_path, file_path)
            
            try:
                # Ensure directory exists
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                
                # Write file
                with open(full_path, 'w') as f:
                    f.write(content)
                
                modified_files.append(file_path)
                logger.info(f"Modified: {file_path}")
                
            except Exception as e:
                logger.error(f"Failed to write {file_path}: {e}")
        
        return modified_files
    
    def commit_changes(self, message: str, files: List[str] = None) -> str:
        """
        Commit changes to the current branch.
        
        Args:
            message: Commit message
            files: List of files to commit (None = all)
            
        Returns:
            Commit hash
        """
        try:
            if files:
                self.repo.index.add(files)
            else:
                self.repo.git.add(A=True)
            
            commit = self.repo.index.commit(message)
            logger.info(f"Committed: {commit.hexsha[:7]} - {message}")
            
            return commit.hexsha
            
        except Exception as e:
            logger.error(f"Failed to commit: {e}")
            raise
    
    def get_diff(self, file_path: str = None) -> str:
        """
        Get diff of changes.
        
        Args:
            file_path: Specific file to diff (None = all)
            
        Returns:
            Diff as string
        """
        try:
            if file_path:
                return self.repo.git.diff('HEAD', file_path)
            else:
                return self.repo.git.diff('HEAD')
        except:
            # If no HEAD (new files), diff against empty tree
            return self.repo.git.diff('--cached')
    
    def switch_to_main(self):
        """Switch back to main branch"""
        try:
            self.repo.git.checkout('master')
            logger.info("Switched to master branch")
        except Exception as e:
            logger.error(f"Failed to switch to master: {e}")
    
    def get_current_branch(self) -> str:
        """Get name of current branch"""
        return self.repo.active_branch.name


if __name__ == "__main__":
    # Test git operations
    git = GitManager()
    print(f"Current branch: {git.get_current_branch()}")
    
    # Test branch creation
    # branch = git.create_branch(999, "test dark mode toggle")
    # print(f"Created branch: {branch}")
    
    # Test switching back
    # git.switch_to_main()
    # print(f"Back to: {git.get_current_branch()}")
