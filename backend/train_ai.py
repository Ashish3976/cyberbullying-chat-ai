import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

data = {

"greeting":[
"hello",
"hi",
"hey",
"good morning",
"good evening"
],

"time":[
"what time is it",
"tell me the time",
"current time"
],

"date":[
"what is today's date",
"tell me today's date",
"today date"
],

"ai":[
"what is ai",
"explain artificial intelligence",
"define ai"
],

"project":[
"what is this project",
"tell me about this system",
"what does this application do"
]

}

texts=[]
labels=[]

for intent,examples in data.items():
    for e in examples:
        texts.append(e)
        labels.append(intent)

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

model = LogisticRegression()
model.fit(X,labels)

pickle.dump(model,open("ai_model.pkl","wb"))
pickle.dump(vectorizer,open("vectorizer.pkl","wb"))

print("AI model trained successfully")