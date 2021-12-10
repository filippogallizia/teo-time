import cors from 'cors';
import express from 'express';

import { runEveryMinute } from './helpers/cronJobs';
import routes from './routes/routes';

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const db = require('./models/db');
const { NODE_ENV } = process.env;
export const ENDPOINT = NODE_ENV === 'test' ? '/api' : '/';

const corsOptions = {
  origin:
    process.env.CLIENT_ORIGIN ||
    'http://localhost:3000' ||
    'http://0.0.0.0:3000',
};

// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());
app.use(ENDPOINT, routes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    // chronJob to delete past bookings
    runEveryMinute();
    console.log('Drop and Resync Dbasssssxs');
  })
  .catch((e: any) => console.log(e));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
