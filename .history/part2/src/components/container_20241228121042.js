import React, { useState } from "react";
import "../syles/main.css"
import MainSection from "../sections/mainSection"

const container = () =>{
    const [show,setshow] = useState("Overview")

    return(
        <main>
            <MainSection />
            
        </main>
    );
}
export default container;
