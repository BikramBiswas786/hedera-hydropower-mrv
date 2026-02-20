/**
 * Health check routes
 * GET /health - Basic health check
 * GET /health/ready - Readiness probe (checks dependencies)
 * GET /health/live - Liveness probe (server responding)
 */

const express = require('express');
const router = express.Router();

/**
 * GET /health
 * Basic health check
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * GET /health/ready
 * Readiness probe - checks if service is ready to accept traffic
 */
router.get('/ready', async (req, res) => {
  try {
    // TODO: Check Hedera client connectivity
    // TODO: Check database connectivity
    
    const checks = {
      hedera: 'unknown',
      database: 'unknown'
    };
    
    res.json({
      status: 'ready',
      checks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message
    });
  }
});

/**
 * GET /health/live
 * Liveness probe - server is alive
 */
router.get('/live', (req, res) => {
  res.json({ status: 'alive' });
});

module.exports = router;