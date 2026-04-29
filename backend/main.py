from fastapi import FastAPI

app = FastAPI(title="HireGenie AI")

@app.get("/")
def home():
    return {"message": "HireGenie AI Running"}