const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// GENERATE API KEY
router.post('/generate', async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ success: false, error: 'userId is required' })

    const key = crypto.randomBytes(32).toString('hex')
    const secret = crypto.randomBytes(32).toString('hex')
    const secretHash = crypto.createHash('sha256').update(secret).digest('hex')

    const apiKey = await prisma.apiKey.create({
      data: {
        key,
        secretHash,
        userId: parseInt(userId)
      }
    })

    res.json({
      success: true,
      message: 'API Key generated!',
      apiKey: key,
      secret: secret
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// GET ALL KEYS FOR USER
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const keys = await prisma.apiKey.findMany({
      where: { userId: parseInt(userId) },
      select: { id: true, key: true, isActive: true, createdAt: true }
    })
    res.json({ success: true, data: keys })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router