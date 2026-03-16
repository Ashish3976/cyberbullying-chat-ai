import React, { useState, useRef, useEffect } from "react";

function Chat(){

const [msg,setMsg] = useState("");
const [messages,setMessages] = useState([]);
const [blocked,setBlocked] = useState(false);
const [language,setLanguage] = useState("en");
const chatEndRef = useRef(null);

useEffect(()=>{
chatEndRef.current?.scrollIntoView({behavior:"smooth"});
},[messages]);

const translateMessage=async(text,target)=>{

try{

const res=await fetch("https://libretranslate.de/translate",{
method:"POST",
headers:{ "Content-Type":"application/json" },
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

const send = async () => {

if(blocked){
alert("🚫 You are blocked");
return;
}

if(msg.trim()==="") return;

const user = localStorage.getItem("user") || "User";

const translated = await translateMessage(msg,language);

let newMessages=[...messages];

newMessages.push({
user:user,
text:msg,
translated:translated
});

newMessages.push({
user:"AI",
text:"Typing..."
});

setMessages(newMessages);

try{

const res = await fetch(
"https://cyberbullying-chat-ai.onrender.com/chat",
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({
username: user,
message: msg
})
}
);

const data = await res.json();

setMessages(prev=>{
let updated=[...prev];
updated.pop();

updated.push({
user:"AI",
text:data.reply
});

return updated;
});

if(data.blocked){
setBlocked(true);
}

}catch{

setMessages(prev=>{
let updated=[...prev];
updated.pop();

updated.push({
user:"AI",
text:"⚠️ Backend not responding"
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
className={`message ${m.user==="AI" ? "bot" : "user"}`}
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
placeholder={blocked ? "Blocked" : "Type message"}
disabled={blocked}
onChange={(e)=>setMsg(e.target.value)}
onKeyDown={(e)=>{
if(e.key==="Enter") send();
}}
/>

<button onClick={send} disabled={blocked}>
Send
</button>

</div>

</div>

);

}

export default Chat;