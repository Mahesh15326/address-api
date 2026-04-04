const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  try {
    const states = await prisma.state.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' }
    })
    res.json({ success: true, count: states.length, data: states })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router