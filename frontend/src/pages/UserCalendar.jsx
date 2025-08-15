import React, {useState, useEffect} from 'react';
import Calendar from "react-calendar";
import SecondaryButton from "../components/SecondaryButton";
import axios from "axios";
import {API_BASE_URL} from "../constants";

const UserCalendar = () => {
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form state - single object instead of separate variables
    const [noteForm, setNoteForm] = useState({
        title: "",
        description: "",
        category: "birthday"
    });

    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);

    // Fetch notes for selected date when modal opens
    useEffect(() => {
        if (show && selectedDate) {
            fetchNotesForDate(selectedDate);
        }
    }, [show, selectedDate]);

    const fetchNotesForDate = async (date) => {
        setLoading(true);
        try {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const dat = date.getDate();

            const dateString = `${year}-${month < 10 ? '0' + month : month}-${dat < 10 ? '0' + dat : dat}`;
            const response = await axios.get(`${API_BASE_URL}/notes`, {
                params: { date: dateString },
                withCredentials: true
            });
            setNotes(response.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
            setNotes([]);
        } finally {
            setLoading(false);
        }
    };

    const showForm = (date) => {
        setSelectedDate(date);
        setShow(true);
    };

    const hideForm = () => {
        setShow(false);
        setSelectedDate(null);
        resetInlineForm();
    };

    const resetInlineForm = () => {
        setAdding(false);
        setEditing(false);
        setEditingNoteId(null);
        setNoteForm({
            title: "",
            description: "",
            category: "birthday"
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editing && editingNoteId) {
                // UPDATE existing note - PUT /api/notes/:id
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth() + 1;
                const dat = selectedDate.getDate();

                const dateString = `${year}-${month < 10 ? '0' + month : month}-${dat < 10 ? '0' + dat : dat}`;

                const response = await axios.put(`${API_BASE_URL}/notes/${editingNoteId}`, {
                    ...noteForm,
                    date: dateString,
                }, { withCredentials: true });

                // Update local state
                setNotes(prevNotes =>
                    prevNotes.map(note =>
                        note.id === editingNoteId ? response.data : note
                    )
                );
            } else {
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth() + 1;
                const dat = selectedDate.getDate();

                const dateString = `${year}-${month < 10 ? '0' + month : month}-${dat < 10 ? '0' + dat : dat}`;
                // CREATE new note - POST /api/notes
                const response = await axios.post(`${API_BASE_URL}/notes`, {
                    ...noteForm,
                    date: dateString,
                }, { withCredentials: true });

                // Add to local state
                setNotes(prevNotes => [...prevNotes, response.data]);
            }

            resetInlineForm();
        } catch (error) {
            console.error("Error saving note:", error);
            alert("Failed to save note. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        resetInlineForm();
    };

    const handleEdit = (note) => {
        setEditing(true);
        setEditingNoteId(note.id);
        setNoteForm({
            title: note.title,
            description: note.description,
            category: note.category
        });
        setAdding(false);
    };

    const handleDelete = async (noteId, noteTitle) => {
        if (window.confirm(`Delete "${noteTitle}"?`)) {
            setLoading(true);
            try {
                // DELETE note - DELETE /api/notes/:id
                await axios.delete(`${API_BASE_URL}/notes/${noteId}`, {
                    withCredentials: true
                });

                // Remove from local state
                setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
            } catch (error) {
                console.error("Error deleting note:", error);
                alert("Failed to delete note. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFormChange = (field, value) => {
        setNoteForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getCategoryColor = (category) => {
        const colors = {
            birthday: "border-primary",
            anniversary: "border-danger",
            holiday: "border-success",
            work: "border-warning",
            personal: "border-info",
            other: "border-secondary"
        };
        return colors[category] || "border-secondary";
    };

    // Filter notes for the selected date
    const getNotesForSelectedDate = () => {
        if (!selectedDate) return [];

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const dat = selectedDate.getDate();

        const dateString = `${year}-${month < 10 ? '0' + month : month}-${dat < 10 ? '0' + dat : dat}`;

        return notes.filter(note => note.date === dateString);
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
                                    {getNotesForSelectedDate().length === 0 && (
                                        <div className="text-center text-muted py-4">
                                            No notes for this date. Create one now!
                                        </div>
                                    )}

                                    {getNotesForSelectedDate().map((note, index) => (
                                        <div className="accordion-item rounded overflow-hidden mb-2" key={note.id}>
                                            <h2 className="accordion-header border-primary" id={`heading${note.id}`}>
                                                <div className="d-flex align-items-center w-100">
                                                    <button
                                                        className="accordion-button collapsed py-3"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#collapse${note.id}`}
                                                        aria-expanded="false"
                                                        aria-controls={`collapse${note.id}`}
                                                    >
                                                        {note.title}
                                                    </button>
                                                    <button
                                                        className="btn btn-sm text-danger me-2 p-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(note.id, note.title);
                                                        }}
                                                        aria-label={`Delete event ${note.title}`}
                                                        title={`Delete event ${note.title}`}
                                                    >
                                                        <i className="bi bi-x-lg"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm text-warning p-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(note);
                                                        }}
                                                        aria-label={`Edit event ${note.title}`}
                                                        title={`Edit event ${note.title}`}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                </div>
                                            </h2>
                                            <div
                                                id={`collapse${note.id}`}
                                                className="accordion-collapse collapse"
                                                aria-labelledby={`heading${note.id}`}
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body ps-4">
                                                    {note.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {(adding || editing) && (
                                <div className="card card-body shadow-sm mb-3 m-3">
                                    <h6 className="card-title">{editing ? 'Edit Note' : 'Create Note'}</h6>
                                    <form onSubmit={handleSave}>
                                        <div className="mb-2">
                                            <label className="form-label" htmlFor="noteTitle">Title</label>
                                            <input
                                                id="noteTitle"
                                                className="form-control"
                                                placeholder="e.g. Buy flowers"
                                                required
                                                value={noteForm.title}
                                                onChange={(e) => handleFormChange('title', e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label" htmlFor="noteDesc">Description (optional)</label>
                                            <textarea
                                                id="noteDesc"
                                                rows="3"
                                                className="form-control"
                                                placeholder="Add any extra details…"
                                                value={noteForm.description}
                                                onChange={(e) => handleFormChange('description', e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="noteCat">Category</label>
                                            <select
                                                id="noteCat"
                                                className="form-select"
                                                value={noteForm.category}
                                                onChange={(e) => handleFormChange('category', e.target.value)}
                                            >
                                                <option value="birthday">Birthday</option>
                                                <option value="anniversary">Anniversary</option>
                                                <option value="holiday">Holiday</option>
                                                <option value="work">Work</option>
                                                <option value="personal">Personal</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="d-flex justify-content-between gap-5 mt-4">
                                            <SecondaryButton
                                                text={editing ? "Update" : "Create"}
                                                onHoverTextColor={"#FFFFFF"}
                                                onHoverBackgroundColor={"#91B58B"}
                                                className="flex-grow-1"
                                                onClick={handleSave}
                                            />
                                            <SecondaryButton
                                                text={"Cancel"}
                                                onHoverBackgroundColor={"#F0EEE6"}
                                                className="flex-grow-1"
                                                onClick={handleCancel}
                                            />
                                        </div>
                                    </form>
                                </div>
                            )}

                            {!adding && !editing && (
                                <SecondaryButton
                                    text="Create Note"
                                    onHoverTextColor={"#FFFFFF"}
                                    onHoverBackgroundColor={"#91B58B"}
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