#! /bin/bash
set -e


source .venv/Scripts/activate
echo "Activated virtual environment"

echo "Starting the server..."
uvicorn main:app --reload