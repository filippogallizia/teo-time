import express from 'express';
require('dotenv').config();
const app = express();
const port = 5000;
var cors = require('cors');
const db = require('./models/db');
const sgMail = require('@sendgrid/mail');

const MysgMail = require('./config/sgMail.config');

const filo = new MysgMail('2', 2);

console.log(filo.sendMessage, 'ciao');

const routes = require('./routes/routes');

var corsOptions = {
  origin: 'http://localhost:5000',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', routes);

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Drop and Resync Dbasssssxs');
  })
  .catch((e) => console.log(e));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
