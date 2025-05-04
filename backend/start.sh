#! /bin/bash

deactivate 
source personalizedVenv/Scripts/activate

uvicorn main:app --reload