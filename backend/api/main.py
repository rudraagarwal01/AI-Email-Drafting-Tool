from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import os

load_dotenv()
app = FastAPI()



# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

class EmailRequest(BaseModel):
    prompt: str

@app.post("/generate-email")
async def generate_email(request: EmailRequest):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": request.prompt}],
    max_tokens=200,
    temperature=0.7,
)

        email_text = response.choices[0].text.strip()
        return {"email": email_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
