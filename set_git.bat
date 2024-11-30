:: This script initializes the Git repository and sets the remote for Text-Notes.
:: To run: .\set_git.bat
@echo off

:: Initialize the repository
git init

:: Add all files to the repository
git add .

:: Commit the changes
git commit -m "Initial commit"

:: Create or rename the branch to main
git branch -M main

:: Set the GitHub repository as the remote origin
git remote set-url origin https://github.com/shellytrifonov/Text-Notes.git

:: Push the changes to the remote repository
git push -u origin main
