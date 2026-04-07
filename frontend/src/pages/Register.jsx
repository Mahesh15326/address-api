import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post('https://address-api-kappa.vercel.app/api/auth/register', { email, password })
      setSuccess('Account created! Redirecting...')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError('Registration failed! Email may already exist.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a2e 0%, #1a1a6e 50%, #0d0d3d 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(220,20,60,0.15)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(0,90,255,0.15)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '400px', opacity: 0.03, userSelect: 'none', pointerEvents: 'none' }}>🇮🇳</div>

      <div style={{
        width: '440px', background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '44px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,85,255,0.2)',
        position: 'relative', zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '52px', marginBottom: '12px' }}>🇮🇳</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>
            Create <span style={{ color: '#0055FF' }}>Account</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Join the Indian Address API platform</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,20,60,0.15)', border: '1px solid rgba(220,20,60,0.4)', color: '#ff6b8a', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(0,200,100,0.15)', border: '1px solid rgba(0,200,100,0.4)', color: '#00cc66', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#0055FF'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'white', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#0055FF'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>
          <button type="submit"
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0055FF, #DC143C)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,85,255,0.4)' }}
            onMouseOver={e => e.target.style.opacity = '0.9'}
            onMouseOut={e => e.target.style.opacity = '1'}
          >Create Account →</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color: '#0055FF', textDecoration: 'none', fontWeight: '700' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}