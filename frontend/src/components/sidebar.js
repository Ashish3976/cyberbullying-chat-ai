import React, { useState } from "react";

function Sidebar({ setPage }) {

const [open,setOpen] = useState(true);

return(

<div className={open ? "sidebar" : "sidebar collapsed"}>

<button className="toggle-btn" onClick={()=>setOpen(!open)}>
☰
</button>

<h2>Menu</h2>

<ul>

<li onClick={()=>setPage("chat")}>Chat</li>

<li onClick={()=>setPage("history")}>History</li>

<li onClick={()=>setPage("login")}>Logout</li>

</ul>

</div>

);

}

export default Sidebar;