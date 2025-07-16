import React from 'react';
import PrimaryButton from "./PrimaryButton";

// TODO fix the image cutting off
const Landing = () => {
    return (
        <div className="row p-4">
            <div className="col-6 d-flex align-items-center">
                <div className="d-flex flex-column align-items-start">
                    <h1 style={{fontSize: "5rem"}}>
                        Meet GiftFlow
                    </h1>
                    <div className="fs-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus
                        ac libero pulvinar facilisis. Nullam nec purus ac libero pulvinar facilisis.
                        Nullam nec purus ac libero pulvinar facilisis. Nullam nec purus ac libero
                    </div>
                    <PrimaryButton className={"mt-3"} text={"Find Idea!"}/>
                </div>
            </div>

            <div className="col-6">
                <img src="/images/rb_2149199217.png" alt="" className="w-100"/>
            </div>
        </div>
    );
};

export default Landing;