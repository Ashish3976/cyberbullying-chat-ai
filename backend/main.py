from fastapi import FastAPI
from pydantic import BaseModel
import re

from ai_reply import ai_reply
from abuse_detector import detect_abuse

app = FastAPI()

# store violation count
violations = {}

class Message(BaseModel):
    username: str
    message: str


# BEHAVIOR ANALYSIS
def analyze_text(text):

    score = 0

    # ALL CAPS
    if text.isupper():
        score += 1

    # repeated characters
    if re.search(r'(.)\1{3,}', text):
        score += 1

    # excessive punctuation
    if text.count("!") > 3:
        score += 1

    # abusive words
    abusive_words = [
        "stupid","idiot","loser","hate",
        "yedava","vedhava","lanja",
        "bewakoof","pagal","chutiya"
    ]

    for w in abusive_words:
        if w in text.lower():
            score += 2

    if score <= 1:
        severity = "LOW"
    elif score <= 3:
        severity = "MEDIUM"
    else:
        severity = "HIGH"

    return severity


@app.post("/chat")
def chat(msg: Message):

    user = msg.username
    text = msg.message

    if user not in violations:
        violations[user] = 0

    severity = analyze_text(text)

    # CYBERBULLYING DETECTION
    if detect_abuse(text):

        violations[user] += 1

        if violations[user] >= 3:
            return {
                "reply": "🚫 You are blocked after 3 abusive messages.",
                "severity": severity,
                "blocked": True
            }

        return {
            "reply": "⚠️ Warning: abusive language detected.",
            "severity": severity,
            "blocked": False
        }

    # AI ASSISTANT REPLY
    reply = ai_reply(text)

    return {
        "reply": reply,
        "severity": severity,
        "blocked": False
    }