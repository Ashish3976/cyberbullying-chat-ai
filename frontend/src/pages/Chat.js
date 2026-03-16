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

/* MINI AI ASSISTANT */

const miniAI=(text)=>{

const msg=text.toLowerCase();

if(msg.includes("hello") || msg.includes("hi"))
return "👋 Hello! I'm your AI assistant.";

if(msg.includes("how are you"))
return "😊 I'm doing great!";

if(msg.includes("project"))
return "📚 This is an AI Cyberbullying Detection Chat Application.";

if(msg.includes("time"))
return "⏰ Current time: "+new Date().toLocaleTimeString();

if(msg.includes("date"))
return "📅 Today is: "+new Date().toLocaleDateString();

if(msg.includes("ai"))
return "🧠 AI stands for Artificial Intelligence.";

if(msg.includes("thank"))
return "🙏 You're welcome!";

const replies=[

"🤖 Interesting message!",
"💬 Tell me more.",
"😊 That sounds cool!",
"🚀 Nice conversation!"

];

return replies[Math.floor(Math.random()*replies.length)];

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

const send=async()=>{

if(blocked){

alert("🚫 You are blocked due to repeated abusive messages.");
return;

}

if(msg.trim()==="") return;

const user=localStorage.getItem("user") || "User";

/* TRANSLATE */

const translated=await translateMessage(msg,language);
const englishText=await translateMessage(msg,"en");

let newMessages=[...messages];

/* USER MESSAGE */

newMessages.push({

user:user,
text:msg,
translated:translated

});

/* CYBERBULLYING DETECTION */

if(detectAbuse(msg) || detectAbuse(englishText)){

const newViolation=violations+1;
setViolations(newViolation);

newMessages.push({

user:"AI Moderator",
text:"⚠️ Warning: abusive language detected"

});

if(newViolation>=3){

setBlocked(true);

newMessages.push({

user:"AI Moderator",
text:"🚫 You have been blocked after 3 violations"

});

}

}else{

/* AI TYPING MESSAGE */

newMessages.push({

user:"Mini AI",
text:"Typing..."

});

setMessages(newMessages);

/* SMALL DELAY */

setTimeout(()=>{

const reply=miniAI(msg);

setMessages(prev=>{

let updated=[...prev];
updated.pop();

updated.push({

user:"Mini AI",
text:reply

});

return updated;

});

},800);

setMsg("");
return;

}

setMessages(newMessages);
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
className={`message ${m.user==="Mini AI" || m.user==="AI Moderator" ? "bot" : "user"}`}
>

<b>{m.user}</b>
{m.text}

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

Send </button>

</div>

</div>

);

}

export default Chat;
