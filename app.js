const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World! CI/CD Pipeline is working perfectly.');
});

// A small function to test
function add(a, b) {
    return a + b;
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, add };
