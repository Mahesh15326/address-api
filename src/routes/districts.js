const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  try {
    const { stateId } = req.query
    if (!stateId) return res.status(400).json({ success: false, error: 'stateId is required' })
    const districts = await prisma.district.findMany({
      where: { stateId: parseInt(stateId) },
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' }
    })
    res.json({ success: true, count: districts.length, data: districts })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router