const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const path = require("path")
const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('/public'))
}

mongoose.connect("mongodb://localhost/budgetDB", {
  useNewUrlParser: true,
  useFindAndModify: false
});

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, '/public', 'index.html'));
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});