const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const authenticateApiKey = require('../middleware/apiKeyAuth')

router.get('/', authenticateApiKey, async (req, res) => {
  try {
    const { districtId } = req.query
    if (!districtId) return res.status(400).json({ success: false, error: 'districtId is required' })
    const subdistricts = await prisma.subDistrict.findMany({
      where: { districtId: parseInt(districtId) },
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' }
    })
    res.json({ success: true, count: subdistricts.length, data: subdistricts })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router