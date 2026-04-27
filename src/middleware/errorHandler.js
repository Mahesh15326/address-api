// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', err.message)
  console.error('STACK:', err.stack)

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      error: 'Database operation failed'
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    })
  }

  // Default error
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error'
  })
}

module.exports = errorHandler