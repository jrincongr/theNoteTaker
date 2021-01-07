const express = require("express");
const path = require("path");
const db = require("./db/db.json");
const fs = require("fs");

const app = express();
let PORT = process.env.PORT || 8080

//Express middleware

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get("/api/notes", (req, res) => {
    res.json(db);
})

app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    newNote["id"] = Math.floor(Math.random() * 10000000000)
    db.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(db), err => {
        if (err) throw err;
        res.json(db);
    })
})

app.delete("/api/notes/:id", (req, res) => {
    let idToDelete = req.params.id
    for (i = 0; i < db.length; i++) {
        if (idToDelete == db[i].id) {
            db.splice(i, 1);
            fs.writeFile("./db/db.json", JSON.stringify(db), err => {
                if (err) throw err;
                res.json(db);
            })
        }
    }
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
//Starting the server with the settings written above
app.listen(PORT, function () {
    console.log("server is now listening.")
})