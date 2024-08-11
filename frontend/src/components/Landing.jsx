import React from 'react';
import SubmitButton from "./SubmitButton";

// TODO fix the image cutting off
const Landing = () => {
    return (
        <div className="d-flex align-items-center justify-content-center w-100 vh-100" style={{
            backgroundImage: "url('/images/main_background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}>
            <div style={{width: "200px", height: "200px"}}>
                <SubmitButton className="rounded-circle fs-4 text-outline" textColor={"white"} backgroundColor={"#009951"}>
                    Spark inspiration!
                </SubmitButton>
            </div>
        </div>
    );
};

export default Landing;