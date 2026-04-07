const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key']
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key required. Pass it as x-api-key header.'
      })
    }

    // Find the API key in database
    const keyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true }
    })

    if (!keyRecord || !keyRecord.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or inactive API key.'
      })
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() }
    })

    req.apiKey = keyRecord
    req.user = keyRecord.user
    next()
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

module.exports = authenticateApiKey