const express = require('express');
const path = require('path');
const notesData = require('./db/db.json')
const PORT = 3001;

const app = express();

app.use(express.static('public'));

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



// GET wildcard route
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));