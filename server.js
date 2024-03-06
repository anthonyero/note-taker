const express = require('express');
const path = require('path');
const UUID = require('uuid'); // Utilized to generate a note id
const fs = require('fs'); // 
const notesData = require('./db/db.json')
const PORT = 3001;

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json())


// GET Route for the homepage
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
); 

// HTML Routes
    // GET route to the "Notes" page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// API Routes
    // API GET route to retrieve notes
app.get('/api/notes', (req, res) => res.json(notesData));

    // API POST route to add a note to the db.json file
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title, 
            text,
            id: UUID.v4()
        };

        // Appends newNote object to existing notesData
        notesData.push(newNote);
        // Convert newNote object to a string
        let updatedDataString = JSON.parse(notesData);

        fs.writeFile('./db/db.json', updatedDataString, (err) => 
            err
            ? console.error(err)
            : console.log(
                `${newNote} has been written to JSON file`
              ) 
        );
        
        const response = {
            status: 'success',
            body: newNote
        };
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in adding note')
    };
});



// GET wildcard route
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));