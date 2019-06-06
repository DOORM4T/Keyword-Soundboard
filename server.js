const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.static('src'));

app.get('/', (req, res) => {
  res.send('test');
});

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);
