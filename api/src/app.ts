import express from 'express';
import { env } from 'process';
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors');
const db = require('./models/db');
const routes = require('./routes/routes');

var corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', routes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Drop and Resync Dbasssssxs');
  })
  .catch((e: any) => console.log(e));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
