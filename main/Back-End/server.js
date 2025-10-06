const express = require("express");
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Main running');
});

app.listen(PORT, () =>{
    console.log(`Server is running locally on http://localhost:${PORT}`);
});