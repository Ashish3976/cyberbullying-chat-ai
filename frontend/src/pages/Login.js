import React,{useState} from "react";

function Login({setPage}){

const [user,setUser] = useState("");
const [pass,setPass] = useState("");

const login = ()=>{

localStorage.setItem("user",user);
localStorage.setItem("pass",pass);

let history = JSON.parse(localStorage.getItem("history")) || [];

history.push({user,pass,date:new Date().toLocaleString()});

localStorage.setItem("history",JSON.stringify(history));

setPage("chat");

}

return(

<div className="login">

<h2>Login</h2>

<input placeholder="Username"
onChange={(e)=>setUser(e.target.value)}/>

<input type="password"
placeholder="Password"
onChange={(e)=>setPass(e.target.value)}/>

<button onClick={login}>Login</button>

</div>

);

}

export default Login;