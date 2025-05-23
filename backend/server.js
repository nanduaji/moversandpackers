const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors());
app.use(cors({
  origin: ['http://localhost:3000', 'https://moversandpackers-frontend.onrender.com'],
}));
require('dotenv').config();
const dbConfig = require('./dbconfig');
// dbConfig.connect();
app.use(express.json());
const PORT = process.env.PORT || 3001;
const routes = require('./router/routes');

app.use('/api', routes);
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});