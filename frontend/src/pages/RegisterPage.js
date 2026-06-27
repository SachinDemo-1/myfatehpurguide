import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', nationality:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const set = f => e => setForm(p=>({...p,[f]:e.target.value}));

  const inp = { width:'100%', padding:'11px 14px', borderRadius:'11px', border:'1.5px solid var(--border)', background:'var(--off-white)', color:'var(--text-dark)', fontSize:'clamp(0.85rem,2vw,0.91rem)', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name:form.name, email:form.email, phone:form.phone, nationality:form.nationality, password:form.password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome, ${res.data.user.name}!`);
      navigate('/');
    } catch(err) { toast.error(err.response?.data?.error||'Registration failed'); }
    finally { setLoading(false); }
  };

  const fields = [
    ['name','Full Name','text','Your full name',true],
    ['email','Email Address','email','your@email.com',true],
    ['phone','Phone / WhatsApp','tel','+91 or international',false],
    ['nationality','Nationality','text','e.g. Indian, British...',false],
    ['password','Password','password','Min. 6 characters',true],
    ['confirm','Confirm Password','password','Repeat your password',true],
  ];

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,var(--teal-deep) 0%,var(--teal) 50%,var(--teal-dark) 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(16px,4vw,24px)', position:'relative', overflow:'hidden' }}>
      {[300,520].map((s,i)=>(
        <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:s, height:s, border:`1px solid rgba(212,160,23,${0.06-i*0.02})`, borderRadius:'50%', transform:'translate(-50%,-50%)', animation:`spin ${20+i*12}s linear infinite`, pointerEvents:'none' }} />
      ))}
      <div style={{ background:'rgba(250,255,254,0.97)', borderRadius:'22px', padding:'clamp(24px,5vw,40px) clamp(20px,5vw,36px)', width:'100%', maxWidth:'460px', boxShadow:'0 30px 80px rgba(0,0,0,0.3)', position:'relative', zIndex:2, animation:'fadeUp 0.5s ease' }}>
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{ width:'60px', height:'60px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.7rem', margin:'0 auto 12px', boxShadow:'0 8px 24px rgba(212,160,23,0.35)' }}>✨</div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.5rem,4vw,1.8rem)', color:'var(--text-dark)', marginBottom:'4px' }}>Create Account</h1>
          <p style={{ color:'var(--text-light)', fontSize:'clamp(0.82rem,2vw,0.88rem)' }}>Join to book your heritage tour</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 14px' }}>
            {fields.map(([field, label, type, ph, req]) => (
              <div key={field} style={{ marginBottom:'14px', gridColumn: field==='name'||field==='email'||field==='password'||field==='confirm' ? 'auto' : 'auto' }}>
                <label style={{ display:'block', fontSize:'0.76rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'5px' }}>
                  {label}{req&&<span style={{color:'var(--coral)'}}> *</span>}
                </label>
                <div style={{ position:'relative' }}>
                  <input
                    type={(field==='password'||field==='confirm') ? (show?'text':'password') : type}
                    value={form[field]} onChange={set(field)} placeholder={ph} required={req}
                    style={inp}
                    onFocus={e=>e.target.style.borderColor='var(--teal)'}
                    onBlur={e=>e.target.style.borderColor='var(--border)'}
                  />
                  {field==='confirm' && (
                    <button type="button" onClick={()=>setShow(s=>!s)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', lineHeight:1 }}>{show?'🙈':'👁️'}</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:'12px', background:loading?'var(--border)':'linear-gradient(135deg,var(--teal),var(--teal-light))', color:loading?'#999':'#fff', border:'none', fontWeight:700, fontSize:'clamp(0.9rem,2vw,0.97rem)', cursor:loading?'not-allowed':'pointer', boxShadow:loading?'none':'0 6px 20px rgba(13,115,119,0.35)', marginTop:'4px' }}>
            {loading?'⏳ Creating...':'✨ Create Account'}
          </button>
        </form>
        <div style={{ textAlign:'center', marginTop:'18px', fontSize:'clamp(0.82rem,2vw,0.85rem)', color:'var(--text-light)' }}>
          Already have an account?{' '}<Link to="/login" style={{ color:'var(--teal)', fontWeight:600 }}>Sign in</Link>
        </div>
        <div style={{ textAlign:'center', marginTop:'8px' }}>
          <a href="/" style={{ color:'var(--text-light)', fontSize:'0.78rem' }}>← Back to Website</a>
        </div>
      </div>
      <style>{`@media(max-width:420px){ form > div { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
