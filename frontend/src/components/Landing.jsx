import React from 'react';
import PrimaryButton from "./PrimaryButton";

const Landing = () => {
    return (
        <div className="row px-4">
            <div className="col-6 d-flex align-items-center">
                <div className="d-flex flex-column align-items-start pe-5">
                    <h1 className="fw-bold" style={{ fontSize: "2.25rem" }}>
                        🎁 GiftFlow — turn gift-giving into pure joy
                    </h1>

                    {/*<h2 className="fs-4 fw-semibold mt-3 mb-3" style={{ color: "#6c757d" }}>*/}
                    {/*    Discover thoughtful, one-of-a-kind ideas that make every celebration unforgettable.*/}
                    {/*</h2>*/}
                    <br/>
                    <br/>

                    <div className="fs-5 mb-4">
                        No more endless scrolling or last-minute panic shopping. With GiftFlow, you’ll explore unique gift ideas shared by real people — not algorithms. Whether it’s your best friend’s birthday, a wedding, or a “just because” moment, we’ve got inspiration to make it special.
                        Filter by interest, budget, and location, and find something that feels just right.
                    </div>

                    {/*<PrimaryButton className={"mt-3"} text={"Find Idea!"}/>*/}
                </div>
            </div>

            <div className="col-6">
                <img src="/images/rb_2149199217.png" alt="" className="w-100"/>
            </div>
        </div>
    );
};

export default Landing;