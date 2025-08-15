const db = require("../db/dbConn");

async function createNote(req, res) {
    const { title, description, category, date } = req.body;
    const userId = req.session.user_id;

    if (!title || !date || !category) {
        return res.status(400).json({ message: "Title, category and date are required." });
    }

    try {
        const newNote = await db.createNote(userId, title, description || null, category, date);
        res.status(201).json(newNote);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "An error occurred while creating the note." });
    }
}

async function updateNote(req, res) {
    const { id } = req.params;
    const { title, description, category, date } = req.body;
    const userId = req.session.user_id;

    if (!id || !title || !date || !category) {
        return res.status(400).json({ message: "ID, title, category, and date are required." });
    }

    try {
        const updatedNote = await db.updateNote(id, userId, title, description || null, category, date);
        if (updatedNote) {
            res.status(200).json(updatedNote);
        } else {
            res.status(404).json({ message: "Note not found." });
        }
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ message: "An error occurred while updating the note." });
    }
}

// async function getNotesForDate(req, res) {
//     const { date } = req.query;  // Changed from req.params to req.query
//
//     if (!date) {
//         return res.status(400).json({ message: "Date parameter is required." });
//     }
//
//     try {
//         const notes = await db.getNotesForDate(req.session.user_id, date);
//         res.status(200).json(notes);
//     } catch (error) {
//         console.error("Error fetching notes for date:", error);
//         res.status(500).json({ message: "An error occurred while fetching notes." });
//     }
// }

async function deleteNote(req, res) {
    const { id } = req.params;
    const userId = req.session.user_id;

    if (!id) {
        return res.status(400).json({ message: "ID is required." });
    }

    try {
        const deleted = await db.deleteNote(id, userId);
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: "Note not found." });
        }
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "An error occurred while deleting the note." });
    }
}

async function getNotesForMonth(req, res) {
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({ message: "Year and month parameters are required." });
    }

    try {
        const notes = await db.getNotesForMonth(req.session.user_id, year, month);
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes for month:", error);
        res.status(500).json({ message: "An error occurred while fetching notes." });
    }
}

module.exports = {
    createNote,
    getNotesForMonth,
    updateNote,
    deleteNote,
}