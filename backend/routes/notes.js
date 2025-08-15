const express = require("express");
const {createNote, updateNote, deleteNote, getNotesForMonth} = require("../controllers/noteController");
const notes = express.Router();

// notes.get("/", getNotesForDate);

notes.get("/month", getNotesForMonth);

notes.post("/", createNote);

notes.put("/:id", updateNote);

notes.delete("/:id", deleteNote);

module.exports = notes;