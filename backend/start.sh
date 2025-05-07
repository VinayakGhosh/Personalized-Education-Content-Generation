#! /bin/bash
set -e

source personalizedVenv/Scripts/activate

uvicorn main:app --reload