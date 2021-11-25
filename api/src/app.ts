import express from 'express';
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const db = require('./models/db');
const routes = require('./routes/routes');
const { NODE_ENV } = process.env;
export const ENDPOINT = NODE_ENV === 'test' ? '/api' : '/';

const corsOptions = {
  origin:
    process.env.CLIENT_ORIGIN ||
    'http://localhost:3000' ||
    'http://0.0.0.0:3000',
};

// app.use(cors(corsOptions));

console.log(ENDPOINT, 'ENDPOINT');

app.use(cors());
app.use(express.json());
app.use('/api', routes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Drop and Resync Dbasssssxs');
  })
  .catch((e: any) => console.log(e));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
