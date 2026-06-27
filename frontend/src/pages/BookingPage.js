import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const tourPrices = { 'Complete Heritage Tour':800, 'Photography Special Tour':600, 'Family & Kids Tour':500, 'Sunrise Special':700, 'Deep History Tour':1200, 'Evening Sunset Tour':650 };
const inp = { width:'100%', padding:'clamp(10px,2vw,13px) clamp(12px,2vw,16px)', borderRadius:'12px', border:'1.5px solid var(--border)', background:'var(--off-white)', color:'var(--text-dark)', fontSize:'clamp(0.86rem,2vw,0.93rem)', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' };

export default function BookingPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ phone:'', nationality:'', visitDate:'', groupSize:'1', language:'English', tourType:'Complete Heritage Tour', specialRequests:'' });
  const set = f => e => setForm(p=>({...p,[f]:e.target.value}));
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const total = (tourPrices[form.tourType]||0) * parseInt(form.groupSize||1);

  if (!isLoggedIn) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--off-white)', padding:'100px clamp(16px,4vw,40px) 40px' }}>
      <div style={{ textAlign:'center', padding:'clamp(28px,5vw,48px)', background:'#fff', borderRadius:'24px', boxShadow:'var(--shadow-md)', maxWidth:'400px', width:'100%' }}>
        <div style={{ fontSize:'3.5rem', marginBottom:'14px' }}>🔒</div>
        <h2 style={{ fontFamily:'Playfair Display,serif', color:'var(--text-dark)', marginBottom:'12px', fontSize:'clamp(1.4rem,4vw,1.8rem)' }}>Login Required</h2>
        <p style={{ color:'var(--text-light)', marginBottom:'26px', fontSize:'clamp(0.84rem,2vw,0.92rem)' }}>Please login or create an account to book a tour.</p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/login" state={{ from:'/book' }} style={{ padding:'11px 24px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', borderRadius:'50px', fontWeight:600, fontSize:'0.9rem' }}>Login</Link>
          <Link to="/register" style={{ padding:'11px 24px', background:'var(--teal-pale)', color:'var(--teal)', borderRadius:'50px', fontWeight:600, border:'1.5px solid var(--border)', fontSize:'0.9rem' }}>Register</Link>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const res = await axios.post('/api/bookings', form);
      toast.success('Booking submitted! Awaiting confirmation.');
      navigate('/booking-success', { state:{ booking:res.data.booking } });
    } catch(err) { toast.error(err.response?.data?.error || 'Booking failed'); }
    finally { setLoading(false); }
  };

  const stepStyle = { background:'#fff', borderRadius:'20px', padding:'clamp(24px,4vw,36px)', boxShadow:'var(--shadow-md)', border:'1px solid var(--border)' };
  const btnPrimary = { padding:'clamp(12px,2vw,14px)', borderRadius:'12px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', border:'none', fontWeight:700, fontSize:'clamp(0.88rem,2vw,0.95rem)', cursor:'pointer', boxShadow:'0 6px 20px rgba(13,115,119,0.28)' };
  const btnSecondary = { padding:'clamp(12px,2vw,14px)', borderRadius:'12px', background:'var(--teal-pale)', color:'var(--teal)', border:'1.5px solid var(--border)', fontWeight:600, cursor:'pointer', fontSize:'clamp(0.88rem,2vw,0.93rem)' };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,var(--teal-pale) 0%,var(--off-white) 100%)', paddingTop:'clamp(80px,12vw,110px)', paddingBottom:'clamp(40px,6vw,80px)' }}>
      <div style={{ maxWidth:'920px', margin:'0 auto', padding:`0 clamp(16px,4vw,28px)` }}>
        <div style={{ textAlign:'center', marginBottom:'clamp(28px,5vw,44px)' }}>
          <div style={{ display:'inline-block', background:'var(--teal-pale)', border:'1px solid var(--border)', borderRadius:'50px', padding:'6px 16px', marginBottom:'10px' }}>
            <span style={{ color:'var(--teal)', fontSize:'0.76rem', letterSpacing:'0.1em', fontWeight:600, textTransform:'uppercase' }}>Reserve Your Experience</span>
          </div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.7rem,5vw,2.6rem)', color:'var(--text-dark)', marginBottom:'8px' }}>Book Your Expert Guide</h1>
          <p style={{ color:'var(--text-mid)', fontSize:'clamp(0.84rem,2vw,0.95rem)' }}>Hello, <strong>{user?.name}</strong>! Confirmed within 2 hours.</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr clamp(260px,32%,320px)', gap:'clamp(16px,3vw,28px)', alignItems:'start' }}>
          <div style={stepStyle}>
            {/* Progress */}
            <div style={{ display:'flex', gap:'7px', marginBottom:'28px' }}>
              {[1,2,3].map(s=>(
                <div key={s} style={{ flex:1, height:'4px', borderRadius:'2px', background:s<=step?'linear-gradient(90deg,var(--teal),var(--teal-light))':'var(--teal-pale)', transition:'background 0.4s' }} />
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              {step===1 && (
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                    <div style={{ width:'26px', height:'26px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.72rem', fontWeight:700, flexShrink:0 }}>1</div>
                    <h3 style={{ fontFamily:'Playfair Display,serif', color:'var(--text-dark)', fontSize:'clamp(1rem,2.5vw,1.1rem)' }}>Contact Details</h3>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0 16px' }}>
                    {[['Phone / WhatsApp','phone','tel','+91 or international'],['Nationality','nationality','text','e.g. Indian, British...']].map(([l,f,t,p])=>(
                      <div key={f} style={{ marginBottom:'16px' }}>
                        <label style={{ display:'block', fontSize:'0.76rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'6px' }}>{l}</label>
                        <input style={inp} type={t} value={form[f]} onChange={set(f)} placeholder={p} onFocus={e=>e.target.style.borderColor='var(--teal)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={()=>setStep(2)} style={{ ...btnPrimary, width:'100%' }}>Continue →</button>
                </div>
              )}
              {step===2 && (
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                    <div style={{ width:'26px', height:'26px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.72rem', fontWeight:700, flexShrink:0 }}>2</div>
                    <h3 style={{ fontFamily:'Playfair Display,serif', color:'var(--text-dark)', fontSize:'clamp(1rem,2.5vw,1.1rem)' }}>Tour Details</h3>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0 16px' }}>
                    <div style={{ marginBottom:'16px' }}>
                      <label style={{ display:'block', fontSize:'0.76rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'6px' }}>Visit Date <span style={{color:'var(--coral)'}}>*</span></label>
                      <input style={inp} type="date" value={form.visitDate} onChange={set('visitDate')} min={minDate} required onFocus={e=>e.target.style.borderColor='var(--teal)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                    </div>
                    <div style={{ marginBottom:'16px' }}>
                      <label style={{ display:'block', fontSize:'0.76rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'6px' }}>Group Size <span style={{color:'var(--coral)'}}>*</span></label>
                      <select style={inp} value={form.groupSize} onChange={set('groupSize')} required>{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} {n===1?'Person':'People'}</option>)}</select>
                    </div>
                    <div style={{ marginBottom:'16px' }}>
                      <label style={{ display:'block', fontSize:'0.76rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'6px' }}>Tour Type <span style={{color:'var(--coral)'}}>*</span></label>
                      <select style={inp} value={form.tourType} onChange={set('tourType')} required>{Object.keys(tourPrices).map(t=><option key={t}>{t}</option>)}</select>
                    </div>
                    <div style={{ marginBottom:'16px' }}>
                      <label style={{ display:'block', fontSize:'0.76rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'6px' }}>Language <span style={{color:'var(--coral)'}}>*</span></label>
                      <select style={inp} value={form.language} onChange={set('language')} required><option>English</option><option>Hindi</option><option>Both Hindi & English</option></select>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'10px' }}>
                    <button type="button" onClick={()=>setStep(1)} style={{ ...btnSecondary, flex:1 }}>← Back</button>
                    <button type="button" onClick={()=>{ if(!form.visitDate||!form.groupSize){toast.error('Fill required fields');return;} setStep(3); }} style={{ ...btnPrimary, flex:2 }}>Continue →</button>
                  </div>
                </div>
              )}
              {step===3 && (
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                    <div style={{ width:'26px', height:'26px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.72rem', fontWeight:700, flexShrink:0 }}>3</div>
                    <h3 style={{ fontFamily:'Playfair Display,serif', color:'var(--text-dark)', fontSize:'clamp(1rem,2.5vw,1.1rem)' }}>Special Requests</h3>
                  </div>
                  <div style={{ marginBottom:'20px' }}>
                    <label style={{ display:'block', fontSize:'0.76rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'6px' }}>Any special requirements?</label>
                    <textarea style={{ ...inp, resize:'vertical' }} rows={4} value={form.specialRequests} onChange={set('specialRequests')} placeholder="Wheelchair access, photography focus, dietary preferences..." onFocus={e=>e.target.style.borderColor='var(--teal)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                  </div>
                  <div style={{ display:'flex', gap:'10px' }}>
                    <button type="button" onClick={()=>setStep(2)} style={{ ...btnSecondary, flex:1 }}>← Back</button>
                    <button type="submit" disabled={loading} style={{ ...btnPrimary, flex:2, opacity:loading?0.6:1, cursor:loading?'not-allowed':'pointer' }}>{loading?'⏳ Submitting...':'✅ Submit Booking'}</button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ background:'linear-gradient(135deg,var(--teal-deep),var(--teal-dark))', borderRadius:'18px', padding:'clamp(18px,3vw,26px)', color:'#fff', marginBottom:'12px' }}>
              <div style={{ fontFamily:'Playfair Display,serif', color:'var(--gold-light)', fontSize:'clamp(0.95rem,2.5vw,1.05rem)', marginBottom:'16px' }}>Booking Summary</div>
              {[['Tour',form.tourType],['Date',form.visitDate||'Not selected'],['Group',`${form.groupSize} person(s)`],['Language',form.language]].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:'9px', fontSize:'clamp(0.78rem,2vw,0.85rem)' }}>
                  <span style={{ color:'rgba(255,255,255,0.5)' }}>{k}</span>
                  <span style={{ color:'#fff', fontWeight:500, textAlign:'right', maxWidth:'55%', fontSize:'clamp(0.74rem,1.8vw,0.82rem)' }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.12)', paddingTop:'12px', marginTop:'6px', display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:'rgba(255,255,255,0.65)', fontWeight:600, fontSize:'0.86rem' }}>Estimated</span>
                <span style={{ color:'var(--gold-light)', fontWeight:700, fontSize:'clamp(1rem,2.5vw,1.1rem)' }}>₹{total.toLocaleString()}</span>
              </div>
              <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.68rem', marginTop:'5px' }}>*Payment on arrival. Cash or UPI.</div>
            </div>
            <div style={{ background:'#fff', borderRadius:'16px', padding:'clamp(16px,3vw,20px)', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:'0.7rem', color:'var(--teal)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'10px' }}>Why Book With Us</div>
              {['✅ ASI Certified Guide','🌍 Hindi & English Tours','📸 Photo assistance','🔄 Free cancellation 24hrs','💯 5-star rated','📞 Confirmed within 2 hrs'].map(i=>(
                <div key={i} style={{ fontSize:'clamp(0.78rem,2vw,0.82rem)', color:'var(--text-mid)', marginBottom:'7px' }}>{i}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: hide sidebar below form on small screens */}
      <style>{`
        @media (max-width: 660px) {
          div[style*="grid-template-columns: 1fr clamp"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
