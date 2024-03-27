import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from "body-parser";
import fs from 'fs';

// Create Express app
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Define route to serve the index.ejs file
app.get('/', (req, res) => {
    // Assuming you have postsData and fileList available here
    const postsData = []; // Fetch posts from database or any storage

    // Read the list of .txt files in the posts directory
    const postsDirectory = path.join(__dirname, 'posts');
    let fileList = [];
    if (fs.existsSync(postsDirectory)) {
        fileList = fs.readdirSync(postsDirectory);
    }

    // Render the index.ejs template and pass necessary data to it
    res.render('index', { posts: postsData, fileList });
});

// Middleware to handle Create Post request
app.post('/create-post', (req, res) => {
    const { postTitle, postContent } = req.body;

    // Check if the posts directory exists, create it if it doesn't
    const postsDirectory = path.join(__dirname, 'posts');
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory);
    }

    // Generate a unique filename based on the current timestamp
    const fileName = `post_${Date.now()}.txt`;

    // Set the file path where the new .txt file will be created
    const filePath = path.join(postsDirectory, fileName);

    // Create the content of the .txt file
    const fileContent = `Title: ${postTitle}\nContent: ${postContent}`;

    // Write the content to the .txt file
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error('Error creating the file:', err);
            res.status(500).send('Error creating the file');
        } else {
            console.log('File created successfully:', fileName);
            res.redirect('/'); // Redirect back to the home page after creating the post
        }
    });
});







// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});