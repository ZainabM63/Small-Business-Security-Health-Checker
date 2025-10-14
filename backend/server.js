const express = require('express');
const cors = require('cors');
const scanRouter = require('./routes/scanRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/scan', scanRouter);

// basic health
app.get('/', (req, res) => res.send('Small Business Security Health Checker API'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
