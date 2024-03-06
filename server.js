const express = require('express');
const path = require('path');
const UUID = require('uuid'); // Utilized to generate a note id
const fs = require('fs'); // Imported to use the writeFile method
const notesData = require('./db/db.json')
const PORT = 3001;

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json())  // Required to access the request body. This is the JSON middleware
app.use(express.urlencoded({ extended: true })); // Required for the `DELETE` route

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
        notesData.push(newNote); //notesData has a typeof object (array)
        // Convert newNote object to a string
        let updatedDataString = JSON.stringify(notesData);

        fs.writeFile('./db/db.json', updatedDataString, (err) => 
            err
            ? console.error(err)
            : console.log(
                `${JSON.stringify(newNote)} has been written to JSON file` // Stringify to view the actual value in the console. Otherwise, it's "object object"
              ) 
        );
        
        const response = {
            status: 'success',
            body: newNote
        };
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in adding note')
    };
});

    // API DELETE Route
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    let noteIndex; 

    for (let i = 0; i < notesData.length; i++) {
        if (notesData[i]["id"] === noteId) {
            noteIndex = i;
            break; // `return` caused a timeout; switched to `break` to break out of the loop and it functions
        };
    };

    // If the value exists, then it'll execute the following code
    // index > -1 ensures that the the we received an index >= 0.
    // Thus, the index is valid and can be utilized 
    if (noteIndex > -1) {
        // Splice: (index, delete 1 element);
        notesData.splice(noteIndex, 1);

        let updatedDataString = JSON.stringify(notesData);

        fs.writeFile('./db/db.json', updatedDataString, (err) => 
                err
                ? console.error(err)
                : console.log(
                    `Note '${noteId}' has been deleted from the JSON file` 
                ) 
            );

        const response = {
            status: 'success',
            body: `Note '${noteId}' has been deleted from the JSON file` 
        };
        res.status(202).json(response);

    } else {
        res.status(404).json('Note ID not found.')
    };
});


// GET wildcard route
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));