# Changelog

All notable changes to this project are documented in this file.

## Unreleased
- Added .gitignore for OS, editor, and log files
- Added CONTRIBUTING.md and package.json
- Added focus-visible, responsive, and print styles
- Persisted the active filter between visits
- Added a dark mode toggle, saved between visits
- Added a search box to filter tasks by text

## Accessibility
- Added aria-pressed to filter buttons and kept it in sync on click and on load
- Added aria-live to the task count so screen readers announce updates

## Features
- Add, complete, and delete tasks
- Tasks persist automatically in the browser via localStorage
- Edit task text in place
- Clear completed tasks with one click
- Filter tasks by All, Active, or Completed
- Mark all tasks complete or active with one click

## Initial release
- Basic to-do list with add, complete, and delete
