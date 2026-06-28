from fastapi import FastAPI

app = FastAPI(
    title="Dalil API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to the Dalil API!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
