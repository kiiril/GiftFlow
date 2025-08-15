const db = require("../db/dbConn");

async function createNote(req, res) {
    const { title, description, date } = req.body;
    const userId = req.session.user_id;

    if (!title || !date) {
        return res.status(400).json({ message: "Title and date are required." });
    }

    try {
        const newNote = await db.createNote(userId, title, description || null, date);
        res.status(201).json(newNote);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "An error occurred while creating the note." });
    }
}

async function updateNote(req, res) {
    const { id } = req.params;
    const { title, description, date } = req.body;
    const userId = req.session.user_id;

    if (!id || !title || !date) {
        return res.status(400).json({ message: "ID, title, and date are required." });
    }

    try {
        const updatedNote = await db.updateNote(id, userId, title, description || null, date);
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

async function getNotesForDate(req, res) {
    const { date } = req.query;  // Changed from req.params to req.query

    if (!date) {
        return res.status(400).json({ message: "Date parameter is required." });
    }

    try {
        const notes = await db.getNotesForDate(req.session.user_id, date);
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes for date:", error);
        res.status(500).json({ message: "An error occurred while fetching notes." });
    }
}

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

module.exports = {
    createNote,
    getNotesForDate,
    updateNote,
    deleteNote,
}