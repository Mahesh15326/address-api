const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/states', require('./routes/states'))
app.use('/api/districts', require('./routes/districts'))
app.use('/api/subdistricts', require('./routes/subdistricts'))
app.use('/api/villages', require('./routes/villages'))

app.get('/', (req, res) => {
  res.json({ 
    message: 'Indian Address API 🇮🇳',
    version: '1.0.0',
    status: 'running'
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})