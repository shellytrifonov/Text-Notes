:: This script initializes the Git repository and sets the remote for Text-Notes.
:: To run: .\set_git.bat
@echo off

:: Initialize the repository if it hasn't been initialized
if not exist ".git" (
    git init
)

:: Add all files to the repository
git add .

:: Commit the changes
git commit -m "Initial commit"

:: Rename the branch to main
git branch -M main

:: Check if 'origin' remote exists
git remote get-url origin 2>nul
if errorlevel 1 (
    git remote add origin https://github.com/shellytrifonov/Text-Notes.git
) else (
    git remote set-url origin https://github.com/shellytrifonov/Text-Notes.git
)

:: Push the changes to the remote repository
git push -u origin main