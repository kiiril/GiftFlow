const express = require("express");
const {getNotesForDate, createNote, updateNote, deleteNote} = require("../controllers/noteController");
const notes = express.Router();

notes.get("/", getNotesForDate);

notes.post("/", createNote);

notes.put("/:id", updateNote);

notes.delete("/:id", deleteNote);

module.exports = notes;