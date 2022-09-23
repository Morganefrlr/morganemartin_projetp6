const express = require('express');
const userRoutes = require('./routes/user.routes');
const sauceRoutes= require('./routes/sauce.routes');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json());

app.use(cors());


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));



app.listen(process.env.PORT, () => {
  console.log(`connecter port ${process.env.PORT}`);
});
