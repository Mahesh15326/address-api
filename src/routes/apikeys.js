const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// MIDDLEWARE — Verify JWT
const jwt = require('jsonwebtoken')
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization token required (Bearer token)' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysupersecretkey123')
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' })
  }
}

// GENERATE API KEY
router.post('/generate', authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body || {}
    const randomPart = crypto.randomBytes(32).toString('hex')
    const fullApiKey = `ak_live_${randomPart}`
    const secretHash = await bcrypt.hash(fullApiKey, 10)

    const apiKey = await prisma.apiKey.create({
      data: {
        key: fullApiKey,
        secretHash,
        name: name || `API Key ${new Date().toISOString().slice(0, 10)}`,
        userId: req.user.userId,
        isActive: true
      }
    })

    res.status(201).json({
      success: true,
      message: 'API Key generated! Save this key — it will not be shown again.',
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: fullApiKey,
        createdAt: apiKey.createdAt
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET ALL MY API KEYS
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const keys = await prisma.apiKey.findMany({
      where: { userId: req.user.userId, isActive: true },
      select: {
        id: true,
        name: true,
        key: true,
        lastUsedAt: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: keys })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// REVOKE API KEY
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const keyId = parseInt(req.params.id)
    await prisma.apiKey.update({
      where: { id: keyId },
      data: { isActive: false }
    })
    res.json({ success: true, message: 'API Key revoked successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router