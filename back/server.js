const express = require('express')
const cors = require('cors')
const { AccessToken } = require('livekit-server-sdk')

const app = express()
app.use(cors())
app.use(express.json())

const LIVEKIT_API_KEY = 'YOUR_API_KEY'
const LIVEKIT_API_SECRET = 'YOUR_API_SECRET'

app.post('/token', async (req, res) => {
  const { room, identity } = req.body
  if (!room || !identity) return res.status(400).json({ error: 'room and identity required' })

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
  })
  at.addGrant({ roomJoin: true, room })
  const token = await at.toJwt()
  console.log('tome', token);

  res.json({ token })
})

app.listen(3001, () => {
  console.log('Token server running on http://localhost:3001')
})