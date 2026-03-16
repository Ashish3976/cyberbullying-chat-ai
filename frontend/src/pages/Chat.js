import React, { useState, useRef, useEffect } from "react";

function Chat(){

const [msg,setMsg] = useState("");
const [messages,setMessages] = useState([]);
const [violations,setViolations] = useState(0);
const [blocked,setBlocked] = useState(false);
const [language,setLanguage] = useState("en");
const chatEndRef = useRef(null);

/* AUTO SCROLL */

useEffect(()=>{
chatEndRef.current?.scrollIntoView({behavior:"smooth"});
},[messages]);

/* ABUSIVE WORD DATASET */

const abusiveWords=[
"idiot","stupid","dumb","loser","moron","hate",
"yedava","vedhava","lanja",
"bewakoof","pagal","chutiya"
];

/* CYBERBULLYING DETECTION */

const detectAbuse=(text)=>{
const t=text.toLowerCase();
return abusiveWords.some(word=>t.includes(word));
};

/* TRANSLATION */

const translateMessage=async(text,target)=>{

try{

const res=await fetch("https://libretranslate.de/translate",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
q:text,
source:"auto",
target:target,
format:"text"
})
});

const data=await res.json();
return data.translatedText;

}catch{
return text;
}

};

/* SEND MESSAGE */

const send = async () => {

if (blocked) {
alert("🚫 You are blocked due to repeated abusive messages.");
return;
}

if (msg.trim() === "") return;

const user = localStorage.getItem("user") || "User";

/* TRANSLATE */

const translated = await translateMessage(msg, language);
const englishText = await translateMessage(msg, "en");

let newMessages = [...messages];

/* USER MESSAGE */

newMessages.push({
user: user,
text: msg,
translated: translated
});

/* CYBERBULLYING DETECTION */

if (detectAbuse(msg) || detectAbuse(englishText)) {

const newViolation = violations + 1;
setViolations(newViolation);

newMessages.push({
user: "AI Moderator",
text: "⚠️ Warning: abusive language detected"
});

if (newViolation >= 3) {

setBlocked(true);

newMessages.push({
user: "AI Moderator",
text: "🚫 You have been blocked after 3 violations"
});

}

setMessages(newMessages);
setMsg("");
return;

}

/* ===== BACKEND AI CALL ===== */

newMessages.push({
user: "AI",
text: "Typing..."
});

setMessages(newMessages);

try {

const res = await fetch(
"https://cyberbullying-chat-ai.onrender.com/chat",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
message: msg
})
}
);

const data = await res.json();

setMessages(prev => {

let updated = [...prev];
updated.pop();

updated.push({
user: "AI",
text: data.reply
});

return updated;

});

} catch {

setMessages(prev => {

let updated = [...prev];
updated.pop();

updated.push({
user: "AI",
text: "⚠️ Backend not responding"
});

return updated;

});

}

setMsg("");

};

return(

<div className="chat-container">

<div className="header">

<h2>AI Chat Room</h2>

<select
value={language}
onChange={(e)=>setLanguage(e.target.value)}
>
<option value="en">English</option>
<option value="hi">Hindi</option>
<option value="te">Telugu</option>
</select>

</div>

<div className="chat-box">

{messages.map((m,i)=>(

<div
key={i}
className={`message ${m.user==="AI" || m.user==="AI Moderator" ? "bot" : "user"}`}
>

<b>{m.user}</b> {m.text}

{m.translated && m.translated!==m.text && (

<div className="translation">
🌐 {m.translated}
</div>

)}

</div>

))}

<div ref={chatEndRef}></div>

</div>

<div className="input-area">

<input
value={msg}
placeholder={blocked ? "Blocked" : "Type your message"}
disabled={blocked}
onChange={(e)=>setMsg(e.target.value)}
onKeyDown={(e)=>{
if(e.key==="Enter") send();
}}
/>

<button
onClick={send}
disabled={blocked}
>
Send
</button>

</div>

</div>

);

}

export default Chat;