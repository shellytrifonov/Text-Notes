:: This script commits and pushes changes to the Text-Notes GitHub repository.
:: To run: .\run_git.bat
@echo off
setlocal

:: Get the current date in 'dd-mm-yy' format
for /f "tokens=1-3 delims=/" %%a in ("%date%") do (
    set "day=%%a"
    set "month=%%b"
    set "year=%%c"
)

:: Formatted date for the commit message
set "formattedDate=%day%-%month%-%year:~-2%"

:: Display the status of the repository
git status

:: Stage all changes
git add .

:: Commit the changes with the current date as the message
git commit -m "%formattedDate%"

:: Push the changes to the remote repository
git push -u origin main

endlocal
