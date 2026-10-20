# RecLang
Mobile Project for Professor Xu and the UMD Department of Hearing and Speech Sciencess

## How to use
Clone this repository, but note that node-modules aren't pushed. To use the app, run
`npm install` inside the `rec-lang/` directory to install all NodeJS modules.

Next, go over to the `rec-lang-backend` directory using `cd rec-lang-backend`. Run `python3 -m venv .venv`, followed by `source .venv/Scripts/activate`, followed by `pip install -r requirements.txt` to download necessary Python dependencies. From there, run `uvicorn main:app` in a separate terminal.
