import React,{useState} from "react";
import "./style.css";

import Sidebar from "./components/sidebar";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import History from "./pages/History";

function App(){

const [page,setPage] = useState("login");

if(page==="login") return <Login setPage={setPage}/>

return(

<div className="app">

<Sidebar setPage={setPage}/>

<div className="content">

{page==="chat" && <Chat/>}

{page==="history" && <History/>}

</div>

</div>

)

}

export default App;