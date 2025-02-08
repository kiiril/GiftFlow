import React from 'react';

// TODO fix the image cutting off
const Landing = () => {
    return (
        <div className="row p-4">
            <div className="col-6 d-flex align-items-center">
                <div>
                    <h1 style={{fontSize: "5rem"}}>
                        Meet GiftFlow
                    </h1>
                    <div className="fs-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus
                        ac libero pulvinar facilisis. Nullam nec purus ac libero pulvinar facilisis.
                        Nullam nec purus ac libero pulvinar facilisis. Nullam nec purus ac libero
                    </div>
                    <div className="d-flex">
                        <button className="btn btn-primary me-2">Some button</button>
                    </div>
                </div>
            </div>

            <div className="col-6">
                <img src="/images/rb_2149199217.png" alt="" className="w-100"/>
            </div>
        </div>
    );
};

export default Landing;