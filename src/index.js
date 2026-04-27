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

// Rate limiter (after app is created)
const limiter = require('./middleware/rateLimit');
app.use('/api/states', limiter);
app.use('/api/districts', limiter);
app.use('/api/subdistricts', limiter);
app.use('/api/villages', limiter);

// API Logger middleware
const apiLogger = require('./middleware/apiLogger');
app.use('/api/states', apiLogger);
app.use('/api/districts', apiLogger);
app.use('/api/subdistricts', apiLogger);
app.use('/api/villages', apiLogger);

// Mount all routes
app.use('/api/auth', authRoutes);
app.use('/api/states', statesRoutes);
app.use('/api/districts', districtsRoutes);
app.use('/api/subdistricts', subdistrictsRoutes);
app.use('/api/villages', villagesRoutes);
app.use('/api/apikeys', apiKeysRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Indian Address API 🇮🇳',
    version: '1.0.0',
    status: 'running'
  });
});

// Global error handler (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});