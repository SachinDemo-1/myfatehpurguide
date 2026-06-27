import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SC = { Pending:{bg:'#FFF8E1',color:'#F57F17',dot:'#FFC107'}, Confirmed:{bg:'#E0F4F4',color:'#0D7377',dot:'#14A3A8'}, Completed:{bg:'#E8F5E9',color:'#2E7D32',dot:'#4CAF50'}, Cancelled:{bg:'#FDECEA',color:'#C62828',dot:'#EF5350'} };
const Badge = ({s}) => { const c=SC[s]||SC.Pending; return <span style={{background:c.bg,color:c.color,padding:'3px 9px',borderRadius:'50px',fontSize:'0.72rem',fontWeight:600,display:'inline-flex',alignItems:'center',gap:'4px',whiteSpace:'nowrap'}}><span style={{width:'5px',height:'5px',background:c.dot,borderRadius:'50%'}}/>{s}</span>; };

export default function OwnerDashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const ownerName = user?.name;
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selected, setSelected] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [payForm, setPayForm] = useState({ method:'Cash', amount:'', notes:'', paid:false });
  const [mobileDetail, setMobileDetail] = useState(false);

  const hdr = useCallback(() => ({ headers:{ Authorization:`Bearer ${token}` } }), [token]);

  const fetchAll = useCallback(async () => {
    try {
      const [bRes, rRes] = await Promise.all([
        axios.get('/api/bookings', hdr()),
        axios.get('/api/reviews/all', hdr()),
      ]);
      setBookings(bRes.data.bookings);
      setReviews(rRes.data.reviews);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  }, [hdr]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const confirm = async id => {
    try { await axios.patch(`/api/bookings/${id}/confirm`, {}, hdr()); toast.success('Confirmed! User notified.'); fetchAll(); if(selected?.id===id) setSelected(p=>({...p,status:'Confirmed',ownerConfirmed:true})); }
    catch { toast.error('Failed'); }
  };
  const complete = async id => {
    try { await axios.patch(`/api/bookings/${id}/complete`, {}, hdr()); toast.success('Completed! User notified.'); fetchAll(); if(selected?.id===id) setSelected(p=>({...p,status:'Completed'})); }
    catch { toast.error('Failed'); }
  };
  const del = async id => {
    if(!window.confirm('Delete this booking?')) return;
    try { await axios.delete(`/api/bookings/${id}`, hdr()); setBookings(bs=>bs.filter(b=>b.id!==id)); if(selected?.id===id){setSelected(null);setMobileDetail(false);} toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };
  const savePayment = async () => {
    try { await axios.patch(`/api/bookings/${payModal.id}/payment`, {...payForm, amount:parseFloat(payForm.amount)||0}, hdr()); toast.success('Payment saved!'); setPayModal(null); fetchAll(); }
    catch { toast.error('Failed to save payment'); }
  };
  const deleteReview = async id => {
    if(!window.confirm('Delete this review?')) return;
    try { await axios.delete(`/api/reviews/${id}`, hdr()); setReviews(rs=>rs.filter(r=>r.id!==id)); toast.success('Deleted'); }
    catch { toast.error('Failed'); }
  };

  const openPayModal = (b) => { setPayModal(b); setPayForm({ method:b.payment?.method||'Cash', amount:b.payment?.amount||'', notes:b.payment?.notes||'', paid:b.payment?.paid||false }); };

  const stats = {
    total:bookings.length,
    pending:bookings.filter(b=>b.status==='Pending').length,
    confirmed:bookings.filter(b=>b.status==='Confirmed').length,
    completed:bookings.filter(b=>b.status==='Completed').length,
    revenue:bookings.filter(b=>b.payment?.paid).reduce((s,b)=>s+(b.payment?.amount||0),0),
    avgRating:reviews.length?(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1):'—',
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    return (!q||b.userName?.toLowerCase().includes(q)||b.userEmail?.toLowerCase().includes(q)||b.tourType?.toLowerCase().includes(q))
      && (filterStatus==='All'||b.status===filterStatus);
  }).sort((a,b)=>new Date(b.bookedAt)-new Date(a.bookedAt));

  const history = bookings.filter(b=>b.status==='Completed').sort((a,b)=>new Date(b.completedAt||b.bookedAt)-new Date(a.completedAt||a.bookedAt));

  const cardStyle = { background:'#fff', borderRadius:'clamp(12px,2vw,18px)', padding:'clamp(16px,3vw,22px)', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)' };
  const inpS = { width:'100%', padding:'10px 13px', borderRadius:'10px', border:'1.5px solid var(--border)', background:'var(--off-white)', fontSize:'0.87rem', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' };

  const tabs = [
    { id:'bookings', label:'Bookings', icon:'📋', count:bookings.length },
    { id:'pending', label:'Pending', icon:'⏳', count:stats.pending },
    { id:'history', label:'History', icon:'📜', count:stats.completed },
    { id:'payments', label:'Payments', icon:'💰', count:bookings.filter(b=>b.payment?.paid).length },
    { id:'reviews', label:'Reviews', icon:'⭐', count:reviews.length },
  ];

  const DetailPanel = ({ b, onClose }) => b && (
    <div style={{ ...cardStyle, height:'fit-content', position:'sticky', top:'76px', animation:'slideIn 0.25s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1rem', color:'var(--text-dark)' }}>Details</div>
        <button onClick={onClose} style={{ background:'var(--teal-pale)', border:'none', width:'26px', height:'26px', borderRadius:'50%', cursor:'pointer', color:'var(--teal)', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px', paddingBottom:'14px', borderBottom:'1px solid var(--teal-pale)' }}>
        <div style={{ width:'42px', height:'42px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'1.05rem', flexShrink:0 }}>{b.userName?.[0]}</div>
        <div>
          <div style={{ fontWeight:700, color:'var(--text-dark)', fontSize:'0.92rem' }}>{b.userName}</div>
          <div style={{ fontSize:'0.72rem', color:'var(--text-light)' }}>{b.nationality}</div>
        </div>
      </div>
      {[['📧',b.userEmail],['📞',b.phone||'—'],['🏛️',b.tourType],['📅',b.visitDate?new Date(b.visitDate+'T00:00').toLocaleDateString('en-IN',{weekday:'short',year:'numeric',month:'short',day:'numeric'}):'-'],['👥',`${b.groupSize} person(s)`],['🌍',b.language]].map(([icon,val])=>(
        <div key={icon} style={{ display:'flex', gap:'9px', marginBottom:'9px', fontSize:'0.82rem' }}><span style={{flexShrink:0}}>{icon}</span><span style={{color:'var(--text-dark)', wordBreak:'break-word'}}>{val}</span></div>
      ))}
      {b.specialRequests && <div style={{ background:'var(--teal-pale)', borderRadius:'9px', padding:'9px 11px', fontSize:'0.8rem', color:'var(--text-mid)', marginBottom:'12px', lineHeight:1.6 }}>📝 {b.specialRequests}</div>}
      <div style={{ marginBottom:'12px' }}><Badge s={b.status} /></div>
      {b.payment?.paid && <div style={{ background:'#E8F5E9', borderRadius:'9px', padding:'9px 11px', fontSize:'0.8rem', color:'#2E7D32', marginBottom:'12px' }}>💰 ₹{b.payment.amount} via {b.payment.method}</div>}
      <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
        {b.status==='Pending' && <button onClick={()=>confirm(b.id)} style={{ padding:'9px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', border:'none', borderRadius:'9px', fontWeight:600, cursor:'pointer', fontSize:'0.84rem' }}>✅ Confirm & Notify</button>}
        {b.status==='Confirmed' && <button onClick={()=>complete(b.id)} style={{ padding:'9px', background:'linear-gradient(135deg,#2E7D32,#4CAF50)', color:'#fff', border:'none', borderRadius:'9px', fontWeight:600, cursor:'pointer', fontSize:'0.84rem' }}>🏆 Mark Completed</button>}
        <button onClick={()=>openPayModal(b)} style={{ padding:'9px', background:'#FFF8E1', border:'1px solid rgba(212,160,23,0.3)', color:'#F57F17', borderRadius:'9px', fontWeight:600, cursor:'pointer', fontSize:'0.84rem' }}>💰 Record Payment</button>
        <button onClick={()=>del(b.id)} style={{ padding:'9px', background:'#FDECEA', border:'1px solid rgba(198,40,40,0.2)', color:'#C62828', borderRadius:'9px', fontWeight:600, cursor:'pointer', fontSize:'0.84rem' }}>🗑️ Delete</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#F0FBFB' }}>
      {/* Header */}
      <header style={{ background:'linear-gradient(135deg,var(--teal-deep),var(--teal-dark))', padding:'0 clamp(14px,3vw,28px)', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 20px rgba(0,0,0,0.2)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>🏛️</div>
          <div>
            <div style={{ color:'var(--gold-light)', fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:'clamp(0.9rem,2.5vw,1.05rem)', lineHeight:1 }}>Fatehpur Sikri</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'clamp(0.55rem,1.5vw,0.65rem)', letterSpacing:'0.08em' }}>OWNER DASHBOARD</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'clamp(8px,2vw,14px)' }}>
          <img src='/images/Guide.jpeg' alt="Guide" style={{ width:'clamp(3rem,2vw,2rem)', height:'max(40px , 2vh)', borderRadius:'50%'}}/><span style={{ color:'rgba(255,255,255,0.65)', fontSize:'clamp(0.74rem,2vw,0.84rem)' }}><span style={{ color:'#fff', fontWeight:800 }}>{ownerName}</span></span>
          <button onClick={fetchAll} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', color:'#fff', padding:'5px clamp(8px,2vw,13px)', borderRadius:'7px', fontSize:'clamp(0.7rem,1.8vw,0.78rem)', cursor:'pointer' }}>🔄</button>
          <button onClick={()=>{ logout(); navigate('/owner/login'); }} style={{ background:'rgba(224,90,43,0.18)', border:'1px solid rgba(224,90,43,0.3)', color:'#E05A2B', padding:'5px clamp(8px,2vw,13px)', borderRadius:'7px', fontSize:'clamp(0.7rem,1.8vw,0.78rem)', cursor:'pointer' }}>Logout</button>
        </div>
      </header>

      <div style={{ padding:'clamp(14px,3vw,28px)', maxWidth:'1360px', margin:'0 auto' }}>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:'clamp(8px,2vw,14px)', marginBottom:'clamp(14px,3vw,22px)' }}>
          {[
            { label:'Total', value:stats.total, icon:'📋', color:'var(--teal)', bg:'var(--teal-pale)' },
            { label:'Pending', value:stats.pending, icon:'⏳', color:'#F57F17', bg:'#FFF8E1' },
            { label:'Confirmed', value:stats.confirmed, icon:'✅', color:'var(--teal)', bg:'var(--teal-pale)' },
            { label:'Completed', value:stats.completed, icon:'🏆', color:'#2E7D32', bg:'#E8F5E9' },
            { label:'Revenue', value:`₹${stats.revenue.toLocaleString()}`, icon:'💰', color:'#F57F17', bg:'#FFF8E1' },
            { label:'Avg Rating', value:stats.avgRating+'★', icon:'⭐', color:'var(--gold)', bg:'var(--gold-pale)' },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} style={{ background:'#fff', borderRadius:'clamp(10px,2vw,14px)', padding:'clamp(12px,2vw,16px)', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ width:'32px', height:'32px', background:bg, borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', marginBottom:'7px' }}>{icon}</div>
              <div style={{ fontWeight:700, fontSize:'clamp(1.1rem,3vw,1.3rem)', color, lineHeight:1 }}>{value}</div>
              <div style={{ color:'var(--text-light)', fontSize:'clamp(0.65rem,1.5vw,0.72rem)', marginTop:'3px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'4px', background:'#fff', padding:'5px', borderRadius:'12px', border:'1px solid var(--border)', marginBottom:'clamp(14px,3vw,22px)', overflowX:'auto', boxShadow:'var(--shadow-sm)' }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>{ setTab(t.id); setSelected(null); setMobileDetail(false); }}
              style={{ display:'flex', alignItems:'center', gap:'5px', padding:'clamp(7px,1.5vw,10px) clamp(10px,2vw,16px)', borderRadius:'9px', border:'none', background:tab===t.id?'linear-gradient(135deg,var(--teal),var(--teal-light))':'transparent', color:tab===t.id?'#fff':'var(--text-mid)', fontWeight:tab===t.id?700:500, fontSize:'clamp(0.75rem,2vw,0.88rem)', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
              <span>{t.icon}</span>
              <span className="hide-mobile">{t.label}</span>
              <span style={{ background:tab===t.id?'rgba(255,255,255,0.2)':'var(--teal-pale)', color:tab===t.id?'#fff':'var(--teal)', borderRadius:'50px', padding:'1px 6px', fontSize:'0.68rem', fontWeight:700 }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ display:'grid', gridTemplateColumns: selected && !mobileDetail && (tab==='bookings'||tab==='pending') ? '1fr clamp(260px,30%,340px)' : '1fr', gap:'clamp(12px,2vw,20px)' }}>

          {/* ── BOOKINGS / PENDING TAB ── */}
          {(tab==='bookings'||tab==='pending') && !mobileDetail && (
            <div style={cardStyle}>
              <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap', alignItems:'center' }}>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1rem,2.5vw,1.1rem)', color:'var(--text-dark)', flex:1 }}>
                  {tab==='pending'?'Pending':'All Bookings'} <span style={{ color:'var(--text-light)', fontSize:'0.8rem', fontFamily:'Inter,sans-serif', fontWeight:400 }}>({tab==='pending'?stats.pending:filtered.length})</span>
                </div>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." style={{ ...inpS, width:'clamp(140px,30%,200px)' }} onFocus={e=>e.target.style.borderColor='var(--teal)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                {tab==='bookings' && (
                  <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ ...inpS, width:'auto', cursor:'pointer' }}>
                    {['All','Pending','Confirmed','Completed','Cancelled'].map(s=><option key={s}>{s}</option>)}
                  </select>
                )}
              </div>

              {loading ? <div style={{ textAlign:'center', padding:'50px', color:'var(--text-light)' }}>⏳ Loading...</div>
              : (tab==='pending'?bookings.filter(b=>b.status==='Pending'):filtered).length===0
                ? <div style={{ textAlign:'center', padding:'50px', color:'var(--text-light)' }}><div style={{ fontSize:'2rem', marginBottom:'10px' }}>📭</div>No bookings found</div>
                : (
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
                      <thead>
                        <tr style={{ borderBottom:'2px solid var(--teal-pale)' }}>
                          {['Tourist','Tour','Date','Pax','Status','Actions'].map(h=>(
                            <th key={h} style={{ textAlign:'left', padding:'9px 8px', fontSize:'0.68rem', letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--text-light)', fontWeight:600 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(tab==='pending'?bookings.filter(b=>b.status==='Pending').sort((a,b)=>new Date(b.bookedAt)-new Date(a.bookedAt)):filtered).map((b,idx)=>(
                          <tr key={b.id} onClick={()=>{ setSelected(selected?.id===b.id?null:b); setMobileDetail(window.innerWidth<768); }}
                            style={{ borderBottom:'1px solid var(--teal-pale)', background:selected?.id===b.id?'var(--teal-pale)':idx%2===0?'#fff':'#FAFFFE', cursor:'pointer', transition:'background 0.15s' }}>
                            <td style={{ padding:'10px 8px' }}>
                              <div style={{ fontWeight:600, fontSize:'0.84rem', color:'var(--text-dark)' }}>{b.userName}</div>
                              <div style={{ fontSize:'0.7rem', color:'var(--text-light)' }}>{b.userEmail}</div>
                            </td>
                            <td style={{ padding:'10px 8px', fontSize:'0.79rem', color:'var(--text-mid)', maxWidth:'140px' }}>{b.tourType}</td>
                            <td style={{ padding:'10px 8px', fontSize:'0.79rem', color:'var(--text-mid)', whiteSpace:'nowrap' }}>{b.visitDate?new Date(b.visitDate+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'}):'-'}</td>
                            <td style={{ padding:'10px 8px', fontSize:'0.84rem', color:'var(--text-dark)', fontWeight:600, textAlign:'center' }}>{b.groupSize}</td>
                            <td style={{ padding:'10px 8px' }}><Badge s={b.status} /></td>
                            <td style={{ padding:'10px 8px' }} onClick={e=>e.stopPropagation()}>
                              <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                                {b.status==='Pending' && <button onClick={()=>confirm(b.id)} style={{ padding:'4px 8px', background:'var(--teal-pale)', border:'none', borderRadius:'6px', color:'var(--teal)', fontSize:'0.7rem', fontWeight:600, cursor:'pointer' }}>✅</button>}
                                {b.status==='Confirmed' && <button onClick={()=>complete(b.id)} style={{ padding:'4px 8px', background:'#E8F5E9', border:'none', borderRadius:'6px', color:'#2E7D32', fontSize:'0.7rem', fontWeight:600, cursor:'pointer' }}>🏆</button>}
                                <button onClick={()=>openPayModal(b)} style={{ padding:'4px 8px', background:'#FFF8E1', border:'none', borderRadius:'6px', color:'#F57F17', fontSize:'0.7rem', cursor:'pointer' }}>💰</button>
                                <button onClick={()=>del(b.id)} style={{ padding:'4px 8px', background:'#FDECEA', border:'none', borderRadius:'6px', color:'#C62828', fontSize:'0.7rem', cursor:'pointer' }}>✕</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          )}

          {/* Mobile detail view */}
          {mobileDetail && selected && (tab==='bookings'||tab==='pending') && (
            <div style={cardStyle}>
              <button onClick={()=>{ setMobileDetail(false); setSelected(null); }} style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', color:'var(--teal)', fontWeight:600, cursor:'pointer', marginBottom:'14px', fontSize:'0.88rem' }}>← Back to list</button>
              <DetailPanel b={selected} onClose={()=>{ setMobileDetail(false); setSelected(null); }} />
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {tab==='history' && (
            <div style={cardStyle}>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1rem,2.5vw,1.2rem)', color:'var(--text-dark)', marginBottom:'18px' }}>Tour History <span style={{ fontSize:'0.82rem', fontFamily:'Inter,sans-serif', color:'var(--text-light)', fontWeight:400 }}>({history.length} completed)</span></div>
              {history.length===0
                ? <div style={{ textAlign:'center', padding:'50px', color:'var(--text-light)' }}><div style={{ fontSize:'2.5rem', marginBottom:'10px' }}>📜</div>No completed tours yet</div>
                : <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {history.map(b=>(
                    <div key={b.id} style={{ background:'linear-gradient(135deg,#E8F5E9,#F0FBF0)', borderRadius:'12px', padding:'clamp(14px,3vw,18px)', border:'1px solid rgba(46,125,50,0.15)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'8px', marginBottom:'10px' }}>
                        <div>
                          <div style={{ fontWeight:700, color:'var(--text-dark)', fontSize:'clamp(0.88rem,2vw,0.95rem)' }}>{b.userName}</div>
                          <div style={{ fontSize:'0.76rem', color:'var(--text-light)' }}>{b.userEmail}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <Badge s="Completed" />
                          {b.completedAt && <div style={{ fontSize:'0.68rem', color:'var(--text-light)', marginTop:'3px' }}>{new Date(b.completedAt).toLocaleDateString('en-IN')}</div>}
                        </div>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:'8px' }}>
                        {[['🏛️',b.tourType],['📅',b.visitDate?new Date(b.visitDate+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'-'],['👥',`${b.groupSize} pax`],['💰',b.payment?.paid?`₹${b.payment.amount} (${b.payment.method})`:'Not recorded']].map(([icon,val])=>(
                          <div key={icon} style={{ background:'rgba(255,255,255,0.7)', borderRadius:'7px', padding:'7px 9px' }}>
                            <div style={{ fontSize:'0.7rem', color:'var(--text-light)', marginBottom:'2px' }}>{icon}</div>
                            <div style={{ fontSize:'clamp(0.75rem,2vw,0.82rem)', color:'var(--text-dark)', fontWeight:500 }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>}
            </div>
          )}

          {/* ── PAYMENTS TAB ── */}
          {tab==='payments' && (
            <div style={cardStyle}>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1rem,2.5vw,1.2rem)', color:'var(--text-dark)', marginBottom:'6px' }}>Payment Records</div>
              <div style={{ fontSize:'0.84rem', color:'var(--text-light)', marginBottom:'18px' }}>Collected: <strong style={{color:'var(--teal)'}}>₹{stats.revenue.toLocaleString()}</strong> from {bookings.filter(b=>b.payment?.paid).length} bookings</div>
              {bookings.length===0
                ? <div style={{ textAlign:'center', padding:'50px', color:'var(--text-light)' }}><div style={{fontSize:'2.5rem',marginBottom:'10px'}}>💰</div>No records yet</div>
                : <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'480px' }}>
                    <thead>
                      <tr style={{ borderBottom:'2px solid var(--teal-pale)' }}>
                        {['Tourist','Tour','Date','Amount','Method','Status','Action'].map(h=>(
                          <th key={h} style={{ textAlign:'left', padding:'9px 8px', fontSize:'0.68rem', letterSpacing:'0.07em', textTransform:'uppercase', color:'var(--text-light)', fontWeight:600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b,idx)=>(
                        <tr key={b.id} style={{ borderBottom:'1px solid var(--teal-pale)', background:idx%2===0?'#fff':'#FAFFFE' }}>
                          <td style={{ padding:'10px 8px' }}>
                            <div style={{ fontWeight:600, fontSize:'0.83rem', color:'var(--text-dark)' }}>{b.userName}</div>
                            <div style={{ fontSize:'0.7rem', color:'var(--text-light)' }}>{b.groupSize} pax</div>
                          </td>
                          <td style={{ padding:'10px 8px', fontSize:'0.79rem', color:'var(--text-mid)', maxWidth:'130px' }}>{b.tourType}</td>
                          <td style={{ padding:'10px 8px', fontSize:'0.78rem', color:'var(--text-mid)', whiteSpace:'nowrap' }}>{b.visitDate?new Date(b.visitDate+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'-'}</td>
                          <td style={{ padding:'10px 8px', fontSize:'0.86rem', fontWeight:700, color:b.payment?.paid?'#2E7D32':'var(--text-light)' }}>{b.payment?.paid?`₹${b.payment.amount?.toLocaleString()}`:'—'}</td>
                          <td style={{ padding:'10px 8px', fontSize:'0.8rem', color:'var(--text-mid)' }}>{b.payment?.method||'—'}</td>
                          <td style={{ padding:'10px 8px' }}>
                            {b.payment?.paid
                              ? <span style={{ background:'#E8F5E9', color:'#2E7D32', padding:'3px 9px', borderRadius:'50px', fontSize:'0.71rem', fontWeight:600 }}>✅ Paid</span>
                              : <span style={{ background:'#FFF8E1', color:'#F57F17', padding:'3px 9px', borderRadius:'50px', fontSize:'0.71rem', fontWeight:600 }}>⏳ Pending</span>}
                          </td>
                          <td style={{ padding:'10px 8px' }}>
                            <button onClick={()=>openPayModal(b)} style={{ padding:'5px 10px', background:'var(--teal-pale)', border:'none', borderRadius:'7px', color:'var(--teal)', fontSize:'0.74rem', fontWeight:600, cursor:'pointer' }}>
                              {b.payment?.paid?'✏️ Edit':'+ Record'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>}
            </div>
          )}

          {/* ── REVIEWS TAB ── */}
          {tab==='reviews' && (
            <div style={cardStyle}>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1rem,2.5vw,1.2rem)', color:'var(--text-dark)', marginBottom:'6px' }}>Guest Reviews</div>
              <div style={{ fontSize:'0.84rem', color:'var(--text-light)', marginBottom:'18px' }}>Average: <strong style={{color:'var(--gold)'}}>{stats.avgRating}★</strong> from {reviews.length} reviews</div>
              {reviews.length===0
                ? <div style={{ textAlign:'center', padding:'50px', color:'var(--text-light)' }}><div style={{fontSize:'2.5rem',marginBottom:'10px'}}>⭐</div>No reviews yet</div>
                : <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  {reviews.map(r=>(
                    <div key={r.id} style={{ background:'var(--gold-pale)', borderRadius:'12px', padding:'clamp(14px,3vw,18px)', border:'1px solid rgba(212,160,23,0.18)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px', marginBottom:'10px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'9px' }}>
                          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'0.95rem', flexShrink:0 }}>{r.userName?.[0]}</div>
                          <div>
                            <div style={{ fontWeight:600, color:'var(--text-dark)', fontSize:'0.88rem' }}>{r.userName}</div>
                            {r.userCountry && <div style={{ fontSize:'0.72rem', color:'var(--text-light)' }}>{r.userCountry}</div>}
                          </div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                          <span style={{ color:'var(--gold)', fontSize:'0.9rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                          <button onClick={()=>deleteReview(r.id)} style={{ padding:'3px 7px', background:'#FDECEA', border:'none', borderRadius:'5px', color:'#C62828', fontSize:'0.7rem', cursor:'pointer' }}>✕</button>
                        </div>
                      </div>
                      <p style={{ fontSize:'clamp(0.82rem,2vw,0.88rem)', color:'var(--text-mid)', lineHeight:1.7, fontStyle:'italic' }}>"{r.comment}"</p>
                      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px', fontSize:'0.7rem', color:'var(--text-light)', flexWrap:'wrap', gap:'6px' }}>
                        <span>🏛️ {r.tourType}</span>
                        <span>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>}
            </div>
          )}

          {/* Desktop detail panel */}
          {selected && !mobileDetail && (tab==='bookings'||tab==='pending') && (
            <DetailPanel b={selected} onClose={()=>setSelected(null)} />
          )}
        </div>
      </div>

      {/* ── PAYMENT MODAL ── */}
      {payModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(14px,4vw,24px)' }} onClick={()=>setPayModal(null)}>
          <div style={{ background:'#fff', borderRadius:'20px', padding:'clamp(22px,4vw,32px)', width:'100%', maxWidth:'400px', boxShadow:'0 30px 80px rgba(0,0,0,0.3)', animation:'fadeUp 0.25s ease' }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.1rem,3vw,1.3rem)', color:'var(--text-dark)', marginBottom:'5px' }}>💰 Record Payment</div>
            <div style={{ fontSize:'0.82rem', color:'var(--text-light)', marginBottom:'20px' }}>For: <strong>{payModal.userName}</strong></div>
            {[['Payment Method','method','select'],['Amount (₹)','amount','number'],['Notes','notes','text']].map(([label,field,type])=>(
              <div key={field} style={{ marginBottom:'14px' }}>
                <label style={{ display:'block', fontSize:'0.76rem', fontWeight:600, color:'var(--text-mid)', marginBottom:'5px' }}>{label}</label>
                {type==='select'
                  ? <select value={payForm[field]} onChange={e=>setPayForm(p=>({...p,[field]:e.target.value}))} style={{ ...inpS }}><option>Cash</option><option>UPI</option><option>Card</option><option>Bank Transfer</option></select>
                  : <input type={type} value={payForm[field]} onChange={e=>setPayForm(p=>({...p,[field]:e.target.value}))} placeholder={field==='amount'?'e.g. 1600':'Optional notes'} style={inpS} onFocus={e=>e.target.style.borderColor='var(--teal)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                }
              </div>
            ))}
            <label style={{ display:'flex', alignItems:'center', gap:'9px', fontSize:'0.86rem', color:'var(--text-mid)', marginBottom:'20px', cursor:'pointer' }}>
              <input type="checkbox" checked={payForm.paid} onChange={e=>setPayForm(p=>({...p,paid:e.target.checked}))} style={{ width:'15px', height:'15px', accentColor:'var(--teal)' }} />
              Mark as Paid
            </label>
            <div style={{ display:'flex', gap:'9px' }}>
              <button onClick={savePayment} style={{ flex:1, padding:'12px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', border:'none', borderRadius:'10px', fontWeight:700, cursor:'pointer', fontSize:'0.9rem' }}>Save Payment</button>
              <button onClick={()=>setPayModal(null)} style={{ padding:'12px 18px', background:'var(--off-white)', border:'1.5px solid var(--border)', borderRadius:'10px', cursor:'pointer', color:'var(--text-mid)', fontWeight:500, fontSize:'0.9rem' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
