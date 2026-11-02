import pathlib
import random

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

# Allows for multiple ports to access the backend, including the frontend port (8000) and the backend port (8001)
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

VERSIONS = {"real", "animated", "animated_text"}
ROUNDS_PER_TEST = 5

# cat and dog used until we have actual replacements
TRIALS = [
    # Real
    {"id": 1, "version": "real", "word": "cat", "category": "noun", "prompt": "Where is the cat?",
     "target": "/image/regular/cat.jpg", "distractor": "/image/regular/dog.jpg"},
    {"id": 2, "version": "real", "word": "dog", "category": "noun", "prompt": "Where is the dog?",
     "target": "/image/regular/dog.jpg", "distractor": "/image/regular/cat.jpg"},
    {"id": 3, "version": "real", "word": "cat", "category": "noun", "prompt": "Where is the cat?",
     "target": "/image/regular/cat.jpg", "distractor": "/image/regular/dog.jpg"},
    {"id": 4, "version": "real", "word": "dog", "category": "noun", "prompt": "Where is the dog?",
     "target": "/image/regular/dog.jpg", "distractor": "/image/regular/cat.jpg"},
    {"id": 5, "version": "real", "word": "cat", "category": "noun", "prompt": "Where is the cat?",
     "target": "/image/regular/cat.jpg", "distractor": "/image/regular/dog.jpg"},

    # Animated
    {"id": 6, "version": "animated", "word": "cat", "category": "noun", "prompt": "Where is the cat?",
     "target": "/image/regular/cat.jpg", "distractor": "/image/regular/dog.jpg"},
    {"id": 7, "version": "animated", "word": "dog", "category": "noun", "prompt": "Where is the dog?",
     "target": "/image/regular/dog.jpg", "distractor": "/image/regular/cat.jpg"},
    {"id": 8, "version": "animated", "word": "cat", "category": "noun", "prompt": "Where is the cat?",
     "target": "/image/regular/cat.jpg", "distractor": "/image/regular/dog.jpg"},
    {"id": 9, "version": "animated", "word": "dog", "category": "noun", "prompt": "Where is the dog?",
     "target": "/image/regular/dog.jpg", "distractor": "/image/regular/cat.jpg"},
    {"id": 10, "version": "animated", "word": "cat", "category": "noun", "prompt": "Where is the cat?",
     "target": "/image/regular/cat.jpg", "distractor": "/image/regular/dog.jpg"},

    # Animted + Text
    {"id": 11, "version": "animated_text", "word": "cat", "category": "noun", "prompt": "Where is the cat?",
     "target": "/image/regular/cat.jpg", "distractor": "/image/regular/dog.jpg"},
    {"id": 12, "version": "animated_text", "word": "dog", "category": "noun", "prompt": "Where is the dog?",
     "target": "/image/regular/dog.jpg", "distractor": "/image/regular/cat.jpg"},
    {"id": 13, "version": "animated_text", "word": "cat", "category": "noun", "prompt": "Where is the cat?",
     "target": "/image/regular/cat.jpg", "distractor": "/image/regular/dog.jpg"},
    {"id": 14, "version": "animated_text", "word": "dog", "category": "noun", "prompt": "Where is the dog?",
     "target": "/image/regular/dog.jpg", "distractor": "/image/regular/cat.jpg"},
    {"id": 15, "version": "animated_text", "word": "cat", "category": "noun", "prompt": "Where is the cat?",
     "target": "/image/regular/cat.jpg", "distractor": "/image/regular/dog.jpg"},
]

SESSIONS = []

# Records selected type and result (stored in sessions)
@app.get("/tests/{version}/rounds")
def get_rounds(version: str):
    if version not in VERSIONS:
        return {"error": "Unknown version"}

    pool = [trial for trial in TRIALS if trial["version"] == version]

    # Pick 5 trials in a random order
    count = min(ROUNDS_PER_TEST, len(pool))
    chosen = random.sample(pool, count)

    rounds = []
    for trial in chosen:
        if random.random() < 0.5:
            left, right, correct = trial["target"], trial["distractor"], "left"
        else:
            left, right, correct = trial["distractor"], trial["target"], "right"

        rounds.append({
            "id": trial["id"],
            "version": trial["version"],
            "word": trial["word"],
            "category": trial["category"],
            "prompt": trial["prompt"],
            "left": left,
            "right": right,
            "correct": correct,
        })
    return rounds
# Records results for finish.tsx
@app.post("/sessions")
def save_session(result: dict):
    SESSIONS.append(result)
    return {"saved": True, "count": len(SESSIONS)}