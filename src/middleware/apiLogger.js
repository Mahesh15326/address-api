// API Usage Logging Middleware
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const apiLogger = async (req, res, next) => {
  const startTime = Date.now()
  
  // Capture original json method
  const originalJson = res.json.bind(res)
  
  // Override json to log after response
  res.json = async function(data) {
    const responseTime = Date.now() - startTime
    
    // Log only for authenticated API key requests
    if (req.apiKey && req.user) {
      try {
        await prisma.apiLog.create({
          data: {
            endpoint: req.originalUrl || req.url,
            responseTime,
            statusCode: res.statusCode,
            userId: req.user.id,
            apiKeyId: req.apiKey.id
          }
        })
      } catch (logError) {
        console.error('API Log Error:', logError.message)
      }
    }
    
    return originalJson(data)
  }
  
  next()
}

module.exports = apiLogger