const express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config({ path: './config/.env' });
require('./config/db');

const cors = require('cors');
const path = require('path');
app.use(cors());

const userRoutes = require('./routes/user.routes');
const sauceRoutes= require('./routes/sauce.routes');

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));



app.listen(process.env.PORT, () => {
  console.log(`connecter port ${process.env.PORT}`);
});
