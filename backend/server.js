const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { seedTransactions } = require('./services/transaction.service');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const transactionRoutes = require('./routes/transaction.routes');
const engineRoutes = require('./routes/engine.routes');
const resultsRoutes = require('./routes/results.routes');

app.use('/api/transactions', transactionRoutes);
app.use('/api/engine', engineRoutes);
app.use('/api/results', resultsRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    console.log('MongoDB connected');
    await seedTransactions();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});
