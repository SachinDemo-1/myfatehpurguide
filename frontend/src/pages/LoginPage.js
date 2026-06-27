import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const set = f => e => setForm(p=>({...p,[f]:e.target.value}));

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', form);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate(res.data.user.role==='owner'?'/owner/dashboard':from);
    } catch(err) { toast.error(err.response?.data?.error||'Login failed'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'12px 16px', borderRadius:'12px', border:'1.5px solid var(--border)', background:'var(--off-white)', color:'var(--text-dark)', fontSize:'clamp(0.88rem,2vw,0.93rem)', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,var(--teal-deep) 0%,var(--teal) 50%,var(--teal-dark) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,24px)', position:'relative', overflow:'hidden' }}>
      {[300,500,700].map((s,i)=>(
        <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:s, height:s, border:`1px solid rgba(212,160,23,${0.07-i*0.02})`, borderRadius:'50%', transform:'translate(-50%,-50%)', animation:`spin ${25+i*10}s linear infinite`, pointerEvents:'none' }} />
      ))}
      <div style={{ background:'rgba(250,255,254,0.97)', borderRadius:'22px', padding:'clamp(28px,5vw,44px) clamp(24px,5vw,40px)', width:'100%', maxWidth:'400px', boxShadow:'0 30px 80px rgba(0,0,0,0.3)', position:'relative', zIndex:2, animation:'fadeUp 0.5s ease' }}>
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ width:'60px', height:'60px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.7rem', margin:'0 auto 14px', boxShadow:'0 8px 24px rgba(13,115,119,0.3)' }}>🗝️</div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.5rem,4vw,1.8rem)', color:'var(--text-dark)', marginBottom:'5px' }}>Welcome Back</h1>
          <p style={{ color:'var(--text-light)', fontSize:'clamp(0.82rem,2vw,0.88rem)' }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', fontSize:'0.78rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'6px' }}>Email Address</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required style={inp}
              onFocus={e=>e.target.style.borderColor='var(--teal)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
          </div>
          <div style={{ marginBottom:'22px' }}>
            <label style={{ display:'block', fontSize:'0.78rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'6px' }}>Password</label>
            <div style={{ position:'relative' }}>
              <input type={show?'text':'password'} value={form.password} onChange={set('password')} placeholder="Your password" required style={{ ...inp, paddingRight:'44px' }}
                onFocus={e=>e.target.style.borderColor='var(--teal)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <button type="button" onClick={()=>setShow(s=>!s)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1.1rem', lineHeight:1 }}>{show?'🙈':'👁️'}</button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:'12px', background:loading?'var(--border)':'linear-gradient(135deg,var(--teal),var(--teal-light))', color:loading?'#999':'#fff', border:'none', fontWeight:700, fontSize:'clamp(0.9rem,2vw,0.97rem)', cursor:loading?'not-allowed':'pointer', boxShadow:loading?'none':'0 6px 20px rgba(13,115,119,0.35)' }}>
            {loading?'⏳ Signing in...':'→ Sign In'}
          </button>
        </form>
        <div style={{ textAlign:'center', marginTop:'20px', fontSize:'clamp(0.82rem,2vw,0.85rem)', color:'var(--text-light)' }}>
          Don't have an account?{' '}<Link to="/register" style={{ color:'var(--teal)', fontWeight:600 }}>Register here</Link>
        </div>
        <div style={{ textAlign:'center', marginTop:'10px' }}>
          <a href="/" style={{ color:'var(--text-light)', fontSize:'0.78rem' }}>← Back to Website</a>
        </div>
      </div>
    </div>
  );
}
