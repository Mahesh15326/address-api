const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ====================== ROUTES ======================
const { router: authRoutes } = require('./routes/auth');
const statesRoutes = require('./routes/states');
const districtsRoutes = require('./routes/districts');
const subdistrictsRoutes = require('./routes/subdistricts');
const villagesRoutes = require('./routes/villages');
const apiKeysRoutes = require('./routes/apikeys');

// Mount all routes correctly
app.use('/api/auth', authRoutes);
app.use('/api/states', statesRoutes);
app.use('/api/districts', districtsRoutes);
app.use('/api/subdistricts', subdistrictsRoutes);
app.use('/api/villages', villagesRoutes);
app.use('/api/apikeys', apiKeysRoutes);     // ← Only once

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Indian Address API 🇮🇳',
    version: '1.0.0',
    status: 'running'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});