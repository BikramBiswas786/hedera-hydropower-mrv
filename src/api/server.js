/**
 * Production REST API Server for Hedera Hydropower MRV
 * Exposes telemetry submission, verification, and metrics endpoints
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { authenticateAPI } = require('../middleware/auth');
const { getMetrics } = require('../monitoring/metrics');
const telemetryRoutes = require('./routes/telemetry');
const verificationRoutes = require('./routes/verification');
const plantRoutes = require('./routes/plants');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check (no auth required)
app.use('/health', healthRoutes);

// Prometheus metrics endpoint (no auth for monitoring systems)
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await getMetrics();
    res.set('Content-Type', 'text/plain; version=0.0.4');
    res.send(metrics);
  } catch (error) {
    console.error('[API] Error generating metrics:', error);
    res.status(500).json({ error: 'Failed to generate metrics' });
  }
});

// API routes (all require authentication)
app.use('/api/telemetry', authenticateAPI, telemetryRoutes);
app.use('/api/verification', authenticateAPI, verificationRoutes);
app.use('/api/plants', authenticateAPI, plantRoutes);

// OpenAPI/Swagger documentation
app.get('/api/docs', (req, res) => {
  res.json(require('./openapi.json'));
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Hedera Hydropower MRV API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      docs: '/api/docs',
      telemetry: '/api/telemetry',
      verification: '/api/verification',
      plants: '/api/plants'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[API] Unhandled error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[API] SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('[API] Server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.log(`[API] Server running on port ${PORT}`);
  console.log(`[API] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[API] Health check: http://localhost:${PORT}/health`);
  console.log(`[API] Metrics: http://localhost:${PORT}/metrics`);
  console.log(`[API] Docs: http://localhost:${PORT}/api/docs`);
});

module.exports = app;