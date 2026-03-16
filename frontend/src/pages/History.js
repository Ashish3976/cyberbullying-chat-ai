import React from "react";

function History(){

let history = JSON.parse(localStorage.getItem("history")) || [];

return(

<div>

<h2>Login History</h2>

{history.map((h,i)=>(
<div key={i} className="message">

User: {h.user}  
<br/>
Password: {h.pass}  
<br/>
Date: {h.date}

</div>
))}

</div>

)

}

export default History;