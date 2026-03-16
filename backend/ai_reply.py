import pickle
import datetime

# load trained AI model
model = pickle.load(open("ai_model.pkl","rb"))
vectorizer = pickle.load(open("vectorizer.pkl","rb"))

def ai_reply(text):

    X = vectorizer.transform([text])
    intent = model.predict(X)[0]

    if intent == "greeting":
        return "👋 Hello! How can I help you?"

    if intent == "time":
        return "⏰ Current time: " + datetime.datetime.now().strftime("%H:%M")

    if intent == "date":
        return "📅 Today's date is " + str(datetime.date.today())

    if intent == "ai":
        return "🧠 Artificial Intelligence is technology that allows machines to learn and solve problems."

    if intent == "project":
        return "📚 This project detects cyberbullying messages using AI and protects users in real-time chat."

    return "🤖 I'm still learning. Tell me more!"