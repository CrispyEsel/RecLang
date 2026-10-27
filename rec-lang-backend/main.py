import pathlib

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

"""
main.py file for RecLang backend. This backend is responsible for these following functions: storing the user's setting for the
mode of the language game, randomly choosing two images/cartoons/GIFs, calling ElevenLabs TTS for announcing the chosen word, 
getting the button that the person presses, comparing it with the word announced, and storing the score. 
"""

app = FastAPI()
IMAGES_DIR = pathlib.Path(__file__).parent / "image"
app.mount("/image", StaticFiles(directory=IMAGES_DIR), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def say_hello():
    print("Hello, World! I'm from FastAPI")
    return {"message" : "Hello, World!"}
ROUNDS = {
    "image": [
        {"id": 1, "image_1": "/image/cat.jpg", "image_2": "/image/dog.png", "correct": 1},
        {"id": 2, "image_1": "/image/dog.png", "image_2": "/image/cat.png", "correct": 2},
        {"id": 3, "image_1": "/image/cat.png", "image_2": "/image/dog.png", "correct": 1},
        {"id": 4, "image_1": "/image/dog.png", "image_2": "/image/cat.png", "correct": 2},
        {"id": 5, "image_1": "/image/cat.png", "image_2": "/image/dog.png", "correct": 1},
    ],
}

SESSIONS = []

#@app.post("/sessions")
#def save_session(result: dict):
#    SESSIONS.append(result)
#    return {"saved": True, "count": len(SESSIONS)}
