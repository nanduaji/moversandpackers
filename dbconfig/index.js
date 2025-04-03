const mongoose = require('mongoose');
const mongodburiString = process.env.MONGO_URI;
mongoose.connect(mongodburiString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));