from fastapi import FastAPI

"""
main.py file for RecLang backend. This backend is responsible for these following functions: storing the user's setting for the
mode of the language game, randomly choosing two images/cartoons/GIFs, calling ElevenLabs TTS for announcing the chosen word, 
getting the button that the person presses, comparing it with the word announced, and storing the score. 
"""