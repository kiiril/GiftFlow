import React, {useState} from 'react';
import Calendar from "react-calendar";
import SecondaryButton from "../components/SecondaryButton";

const UserCalendar = () => {
    // const getBlocksForDate = (date) => {
    //     // Mock data for demonstration; replace with your dynamic logic
    //     const mockEvents = {
    //         "2025-05-22": ["New Year Celebration", "Brunch with Friends"],
    //         "2024-05-28": ["Workout", "Team Meeting", "Dinner"],
    //         "2024-05-03": ["Project Deadline"],
    //     };
    //     const formattedDate = date.toISOString().split('T')[0];
    //     return mockEvents[formattedDate] || [];
    // };

    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const showForm = (date) => {
        setSelectedDate(date);
        setShow(true);
    };

    const hideForm = () => {
        setShow(false);
        setSelectedDate(null);
    };

    const [adding, setAdding] = useState(false);
    const [title, setTitle]   = useState("");
    const [desc,  setDesc]    = useState("");
    const [cat,   setCat]     = useState("birthday");

    const resetInlineForm = () => {
        setAdding(false);
        setTitle(""); setDesc(""); setCat("birthday");
    };

    const handleInlineSave = (e) => {
        e.preventDefault();
        // todo: save the note to the database
        resetInlineForm();
    };

    return (
        // fixme: calendar must fit the size of the parent component
        <div className="p-3" style={{width: "800px", height: "400px"}}>
            <Calendar
                locale="us-US"
                tileContent={({date, view}) => {
                    // todo: is it needed?
                    // if (view === "month") {
                    //     const blocks = getBlocksForDate(date);
                    //     return (
                    //         <div className="mt-3">
                    //             {blocks.slice(0, 3).map((block, index) => (
                    //                 <div
                    //                     key={index}
                    //                     className="bg-primary text-white rounded-pill text-truncate mb-1 px-2"
                    //                     style={{maxWidth: "100%", fontSize: "0.75em", lineHeight: "1.3"}}
                    //                     title={block} // to show full text on hover
                    //                 >
                    //                     {block}
                    //                 </div>
                    //             ))}
                    //             {blocks.length > 3 && (
                    //                 <div className="bg-secondary text-white rounded-pill text-truncate small px-2">
                    //                     +{blocks.length - 3} more
                    //                 </div>
                    //             )}
                    //         </div>
                    //     );
                    // }
                    // return null;
                }}
                tileDisabled={({activeStartDate, date, view}) => {
                    return view === "month" && date.getMonth() !== activeStartDate.getMonth();
                }}
                onClickDay={(value) => showForm(value)}
            />
            <br/>

            {show && (
                // todo: change the position to the cell date
                <div className="modal show d-block" tabIndex="-1" role={"dialog"}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedDate && new Date(selectedDate).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}</h5>
                                <button type="button" className="btn-close" onClick={hideForm}></button>
                            </div>
                            <div className="modal-body">
                                <div className="accordion accordion-flush" id="accordionExample">
                                    <div className="accordion-item rounded overflow-hidden mb-2">
                                        <h2 className="accordion-header border-primary" id="headingOne"
                                            style={{borderLeft: "15px solid black"}}>
                                            <div className="d-flex align-items-center w-100">
                                                <button
                                                    className="accordion-button collapsed py-3"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseOne"
                                                    aria-expanded="false"
                                                    aria-controls="collapseOne"
                                                >
                                                    Kiryl's Birthday
                                                </button>
                                                <button
                                                    className="btn btn-sm text-danger me-2 p-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert('Delete Kiryl\'s Birthday?');
                                                    }}
                                                    aria-label="Delete event Kiryl's Birthday"
                                                    title="Delete event Kiryl's Birthday"
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        </h2>
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body ps-4">
                                                He will become 20 years old. I wanted to wish him and gift a ferrari.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="accordion-item rounded overflow-hidden mb-2">
                                        <h2 className="accordion-header border-success" id="headingTwo"
                                            style={{borderLeft: "15px solid black"}}>
                                            <div className="d-flex align-items-center w-100">
                                                <button
                                                    className="accordion-button collapsed py-3"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseTwo"
                                                    aria-expanded="false"
                                                    aria-controls="collapseTwo"
                                                >
                                                    Wish girls with Women's day
                                                </button>
                                                <button
                                                    className="btn btn-sm text-danger me-2 p-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert('Delete Wish girls with Women\'s day?');
                                                    }}
                                                    aria-label="Delete event Wish girls with Women's day"
                                                    title="Delete event Wish girls with Women's day"
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        </h2>
                                        <div
                                            id="collapseTwo"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingTwo"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                All girls from the uni, work, friends and family should be
                                                congratulated.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="accordion-item rounded overflow-hidden mb-2">
                                        <h2 className="accordion-header border-warning" id="headingThree"
                                            style={{borderLeft: "15px solid black"}}>
                                            <div className="d-flex align-items-center w-100">
                                                <button
                                                    className="accordion-button collapsed py-3"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target="#collapseThree"
                                                    aria-expanded="false"
                                                    aria-controls="collapseThree"
                                                >
                                                    Some random date
                                                </button>
                                                <button
                                                    className="btn btn-sm text-danger me-2 p-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        alert('Delete Some random date?');
                                                    }}
                                                    aria-label="Delete event Some random date"
                                                    title="Delete event Some random date"
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        </h2>
                                        <div
                                            id="collapseThree"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingThree"
                                            data-bs-parent="#accordionExample"
                                        >
                                            <div className="accordion-body">
                                                Some random description for the event. It can be anything. Just for
                                                testing purposes. Some
                                                random description for the event. It can be anything. Just for testing
                                                purposes. Some random
                                                description for the event. It can be anything. Just for testing
                                                purposes.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {adding && (
                                <div className="card card-body shadow-sm mb-3 m-3">
                                    <form onSubmit={handleInlineSave}>
                                        <div className="mb-2">
                                            <label className="form-label" htmlFor="noteTitle">Title</label>
                                            <input
                                                id="noteTitle"
                                                className="form-control"
                                                placeholder="e.g. Buy flowers"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label" htmlFor="noteDesc">Description (optional)</label>
                                            <textarea
                                                id="noteDesc"
                                                rows="3"
                                                className="form-control"
                                                placeholder="Add any extra details…"
                                                value={desc}
                                                onChange={(e) => setDesc(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="noteCat">Category</label>
                                            <select
                                                id="noteCat"
                                                className="form-select"
                                                value={cat}
                                                onChange={(e) => setCat(e.target.value)}
                                            >
                                                {/* todo: add colors and fetch from db */}
                                                <option value="birthday">Birthday</option>
                                                <option value="anniversary">Anniversary</option>
                                                <option value="holiday">Holiday</option>
                                                <option value="work">Work</option>
                                                <option value="personal">Personal</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="d-flex justify-content-between gap-5 mt-4">
                                            <button type="submit" className="btn btn-success flex-grow-1">
                                                Save
                                            </button>
                                            <button type="button" className="btn btn-outline-secondary flex-grow-1"
                                                    onClick={resetInlineForm}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {!adding && (
                                <SecondaryButton
                                    text="Create note"
                                    className="fs-5 fw-bold px-4 py-2 mx-3 mb-3"
                                    onClick={() => setAdding(true)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserCalendar;