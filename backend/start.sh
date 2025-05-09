#! /bin/bash
set -e

echo "Activating virtual environment"
source venvPersonlaized/Scripts/activate

echo "Starting the server"
uvicorn main:app --reload