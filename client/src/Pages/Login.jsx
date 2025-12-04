import React from "react";
import Loginform from "../components/Loginform";

function Login(){
    return (
        <>
            <div className="grid-container">
                <div className="container-form">
                    <div>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjfsK9iGkMtV5p88Kry1F0rdrL7RndRENRJw&s"/>
                    </div>
                    <div>
                       <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
                    </div>
                </div>

                <div className="form">
                    <Loginform/>
                </div>

            </div>

        </>
    );
}

export default Login;