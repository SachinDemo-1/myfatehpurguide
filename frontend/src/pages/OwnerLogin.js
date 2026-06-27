import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function OwnerLogin() {
  const [form, setForm] = useState({ username:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await axios.post('/api/auth/owner-login', form);
      login(res.data.token, { name:res.data.name, role:'owner' });
      toast.success(`Welcome, ${res.data.name}!`);
      navigate('/owner/dashboard');
    } catch(err) { toast.error(err.response?.data?.error||'Login failed'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'12px 42px 12px 16px', borderRadius:'12px', border:'1.5px solid var(--border)', background:'var(--off-white)', color:'var(--text-dark)', fontSize:'0.93rem', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,var(--teal-deep) 0%,var(--teal-dark) 60%,#041E20 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,24px)', position:'relative', overflow:'hidden' }}>
      {[200,400,600].map((s,i)=>(
        <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:s, height:s, border:`1px solid rgba(212,160,23,${0.07-i*0.02})`, borderRadius:'50%', transform:'translate(-50%,-50%)', animation:`spin ${20+i*10}s linear infinite`, pointerEvents:'none' }} />
      ))}
      <div style={{ background:'rgba(250,255,254,0.97)', borderRadius:'22px', padding:'clamp(28px,5vw,44px) clamp(24px,5vw,40px)', width:'100%', maxWidth:'390px', boxShadow:'0 30px 80px rgba(0,0,0,0.4)', position:'relative', zIndex:2, animation:'fadeUp 0.5s ease' }}>
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ width:'64px', height:'64px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', margin:'0 auto 14px', boxShadow:'0 8px 24px rgba(212,160,23,0.4)' }}>🔑</div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.5rem,4vw,1.8rem)', color:'var(--text-dark)', marginBottom:'5px' }}>Owner Portal</h1>
          <p style={{ color:'var(--text-light)', fontSize:'clamp(0.82rem,2vw,0.88rem)' }}>Sign in to manage bookings</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[['username','Username','text','admin'],['password','Password','password','']].map(([field,label,type,ph])=>(
            <div key={field} style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'6px' }}>{label}</label>
              <div style={{ position:'relative' }}>
                <input type={field==='password'?(show?'text':'password'):type} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph} required
                  style={inp} onFocus={e=>e.target.style.borderColor='var(--teal)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                {field==='password' && <button type="button" onClick={()=>setShow(s=>!s)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1.1rem', lineHeight:1 }}>{show?'🙈':'👁️'}</button>}
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:'12px', background:loading?'var(--border)':'linear-gradient(135deg,var(--gold),var(--gold-light))', color:loading?'#999':'var(--text-dark)', border:'none', fontWeight:700, fontSize:'0.97rem', cursor:loading?'not-allowed':'pointer', boxShadow:loading?'none':'0 6px 20px rgba(212,160,23,0.4)', marginTop:'6px' }}>
            {loading?'⏳ Signing in...':'→ Sign In'}
          </button>
        </form>
        <div style={{ marginTop:'20px', background:'var(--teal-pale)', borderRadius:'9px', padding:'11px 13px', fontSize:'0.76rem', color:'var(--text-light)', textAlign:'center', border:'1px solid var(--border)' }}>
          Credentials: <strong style={{color:'var(--text-dark)'}}>admin</strong> / <strong style={{color:'var(--text-dark)'}}>guide@sikri123</strong>
        </div>
        <div style={{ textAlign:'center', marginTop:'14px' }}>
          <a href="/" style={{ color:'var(--text-light)', fontSize:'0.78rem' }}>← Back to Website</a>
        </div>
      </div>
    </div>
  );
}
