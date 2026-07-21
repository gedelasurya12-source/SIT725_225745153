const express = require("express");

const app = express();
const port = 3000;

// Serve static files from the public folder
app.use(express.static("public"));

// Home test endpoint
app.get("/hello", (req, res) => {
    res.send("Hello from the Express server!");
});

// Add two numbers using GET request
// Example: http://localhost:3000/add?num1=10&num2=20
app.get("/add", (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({
            error: "Please provide valid values for num1 and num2."
        });
    }

    const sum = num1 + num2;

    res.json({
        num1: num1,
        num2: num2,
        sum: sum
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});