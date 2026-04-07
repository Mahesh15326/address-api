import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) navigate('/')
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const res = await axios.get('https://address-api-kappa.vercel.app/api/apikeys', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setApiKeys(res.data.data)
    } catch (err) { console.error(err) }
  }

  const generateKey = async () => {
    setLoading(true)
    try {
      const res = await axios.post('https://address-api-kappa.vercel.app/api/apikeys/generate',
        { name: `Key ${new Date().toLocaleDateString()}` },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert(`Your API Key: ${res.data.data.key}`)
      fetchKeys()
    } catch (err) { alert('Failed to generate key!') }
    setLoading(false)
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const endpoints = [
    { method: 'GET', path: '/api/states', desc: 'All states' },
    { method: 'GET', path: '/api/districts?stateId=1', desc: 'Districts by state' },
    { method: 'GET', path: '/api/subdistricts?districtId=1', desc: 'Subdistricts' },
    { method: 'GET', path: '/api/villages?search=Delhi', desc: 'Search villages' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a2e 0%, #1a1a6e 50%, #0d0d3d 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>

      {/* Background glows */}
      <div style={{ position: 'fixed', top: '-200px', left: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(220,20,60,0.1)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(0,85,255,0.1)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '32px' }}>🇮🇳</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #DC143C, #0055FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Indian Address API</h1>
            <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Developer Dashboard</p>
          </div>
        </div>
        <button onClick={logout}
          style={{ padding: '9px 22px', background: 'rgba(220,20,60,0.2)', color: '#ff6b8a', border: '1px solid rgba(220,20,60,0.4)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
          onMouseOver={e => e.target.style.background = 'rgba(220,20,60,0.35)'}
          onMouseOut={e => e.target.style.background = 'rgba(220,20,60,0.2)'}
        >Logout</button>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '36px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'States', value: '36', icon: '🗺️', color: '#DC143C' },
            { label: 'Districts', value: '700+', icon: '📍', color: '#0055FF' },
            { label: 'Subdistricts', value: '6K+', icon: '🏙️', color: '#FF9900' },
            { label: 'Villages', value: '600K+', icon: '🏘️', color: '#00AA55' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: `1px solid ${s.color}33`, borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ color: s.color, fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Endpoints */}
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>⚡ API Endpoints</h2>
          <div style={{ background: 'rgba(0,85,255,0.1)', border: '1px solid rgba(0,85,255,0.3)', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '13px', color: '#6699FF' }}>
            🌐 https://address-api-kappa.vercel.app
          </div>
          {endpoints.map((ep, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: i < endpoints.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <span style={{ background: 'rgba(220,20,60,0.2)', color: '#ff6b8a', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>{ep.method}</span>
              <code style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', flex: 1 }}>{ep.path}</code>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{ep.desc}</span>
            </div>
          ))}
        </div>

        {/* API Keys */}
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>🔑 Your API Keys</h2>
            <button onClick={generateKey} disabled={loading}
              style={{ padding: '11px 24px', background: 'linear-gradient(135deg, #DC143C, #0055FF)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', boxShadow: '0 4px 15px rgba(220,20,60,0.3)' }}
              onMouseOver={e => e.target.style.opacity = '0.85'}
              onMouseOut={e => e.target.style.opacity = '1'}
            >{loading ? 'Generating...' : '+ Generate Key'}</button>
          </div>

          {apiKeys.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
              <p style={{ fontSize: '14px' }}>No API keys yet. Generate your first key!</p>
            </div>
          ) : apiKeys.map(key => (
            <div key={key.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '18px', borderRadius: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong style={{ color: 'white', fontSize: '14px' }}>{key.name}</strong>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <code style={{ flex: 1, background: 'rgba(0,85,255,0.1)', border: '1px solid rgba(0,85,255,0.2)', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: '#6699FF', wordBreak: 'break-all' }}>{key.key}</code>
                <button onClick={() => copyToClipboard(key.key, key.id)}
                  style={{ padding: '10px 16px', background: copied === key.id ? 'rgba(0,200,100,0.2)' : 'rgba(255,255,255,0.08)', color: copied === key.id ? '#00cc66' : 'rgba(255,255,255,0.6)', border: `1px solid ${copied === key.id ? 'rgba(0,200,100,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}
                >{copied === key.id ? '✅ Copied' : '📋 Copy'}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}