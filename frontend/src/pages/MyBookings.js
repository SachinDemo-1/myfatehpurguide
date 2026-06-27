import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUS_COLORS = { Pending:{bg:'#FFF8E1',color:'#F57F17',dot:'#FFC107'}, Confirmed:{bg:'#E0F4F4',color:'var(--teal)',dot:'var(--teal-light)'}, Completed:{bg:'#E8F5E9',color:'#2E7D32',dot:'#4CAF50'}, Cancelled:{bg:'#FDECEA',color:'#C62828',dot:'#EF5350'} };
const Badge = ({s}) => { const c=STATUS_COLORS[s]||STATUS_COLORS.Pending; return <span style={{background:c.bg,color:c.color,padding:'4px 11px',borderRadius:'50px',fontSize:'0.74rem',fontWeight:600,display:'inline-flex',alignItems:'center',gap:'5px',whiteSpace:'nowrap'}}><span style={{width:'5px',height:'5px',background:c.dot,borderRadius:'50%',display:'inline-block'}}/>{s}</span>; };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(null);
  const [review, setReview] = useState({ rating:5, comment:'' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get('/api/bookings/my').then(r=>setBookings(r.data.bookings)).catch(()=>toast.error('Failed to load bookings')).finally(()=>setLoading(false));
  }, []);

  const submitReview = async (booking) => {
    if (!review.comment.trim()) { toast.error('Please write a review comment'); return; }
    setSubmitting(true);
    try {
      await axios.post('/api/reviews', { rating:review.rating, comment:review.comment, tourType:booking.tourType, bookingId:booking.id });
      toast.success('Review submitted! Thank you 🙏');
      setShowReview(null); setReview({ rating:5, comment:'' });
    } catch(err) { toast.error(err.response?.data?.error || 'Failed to submit review'); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,var(--teal-pale) 0%,var(--off-white) 100%)', paddingTop:'clamp(80px,12vw,110px)', paddingBottom:'clamp(40px,6vw,80px)' }}>
      <div style={{ maxWidth:'820px', margin:'0 auto', padding:`0 clamp(16px,4vw,28px)` }}>
        <div style={{ marginBottom:'clamp(24px,4vw,36px)' }}>
          <div style={{ fontSize:'0.72rem', letterSpacing:'0.14em', color:'var(--teal)', fontWeight:600, textTransform:'uppercase', marginBottom:'7px' }}>Your Journey</div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.8rem,5vw,2.4rem)', color:'var(--text-dark)' }}>My Bookings</h1>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'80px', color:'var(--text-light)' }}><div style={{ fontSize:'2rem', animation:'spin 1s linear infinite', display:'inline-block' }}>⏳</div><div style={{ marginTop:'10px' }}>Loading...</div></div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign:'center', padding:'clamp(40px,8vw,80px)', background:'#fff', borderRadius:'24px', boxShadow:'var(--shadow-sm)' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'14px' }}>🏛️</div>
            <h2 style={{ fontFamily:'Playfair Display,serif', color:'var(--text-dark)', marginBottom:'10px', fontSize:'clamp(1.3rem,4vw,1.6rem)' }}>No bookings yet</h2>
            <p style={{ color:'var(--text-light)', marginBottom:'22px', fontSize:'clamp(0.84rem,2vw,0.9rem)' }}>Explore our tours and book your Fatehpur Sikri experience!</p>
            <Link to="/book" style={{ padding:'11px 28px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', borderRadius:'50px', fontWeight:600, fontSize:'0.9rem', display:'inline-block' }}>Book a Tour</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'clamp(12px,2vw,18px)' }}>
            {bookings.map(b=>(
              <div key={b.id} style={{ background:'#fff', borderRadius:'18px', padding:'clamp(18px,3vw,24px)', boxShadow:'var(--shadow-sm)', border:'1px solid var(--border)', transition:'transform 0.2s,box-shadow 0.2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--shadow-sm)'; }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'10px', marginBottom:'14px' }}>
                  <div>
                    <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1rem,2.5vw,1.1rem)', color:'var(--text-dark)', marginBottom:'3px' }}>{b.tourType}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text-light)', fontFamily:'monospace' }}>ID: {b.id?.slice(0,12).toUpperCase()}</div>
                  </div>
                  <Badge s={b.status} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:'10px', marginBottom:'14px' }}>
                  {[['📅 Visit Date',b.visitDate?new Date(b.visitDate+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'-'],['👥 Group',`${b.groupSize} person(s)`],['🌍 Language',b.language],['🕐 Booked',new Date(b.bookedAt).toLocaleDateString('en-IN')]].map(([k,v])=>(
                    <div key={k} style={{ background:'var(--off-white)', borderRadius:'9px', padding:'9px 11px' }}>
                      <div style={{ fontSize:'0.68rem', color:'var(--text-light)', marginBottom:'2px' }}>{k}</div>
                      <div style={{ fontSize:'clamp(0.78rem,2vw,0.84rem)', color:'var(--text-dark)', fontWeight:500 }}>{v}</div>
                    </div>
                  ))}
                </div>
                {b.status==='Confirmed' && <div style={{ background:'var(--teal-pale)', borderRadius:'9px', padding:'10px 14px', fontSize:'clamp(0.8rem,2vw,0.85rem)', color:'var(--teal)', fontWeight:500, marginBottom:'10px' }}>✅ Booking <strong>confirmed</strong>! Meet at Buland Darwaza at your scheduled time.</div>}
                {b.status==='Pending' && <div style={{ background:'#FFF8E1', borderRadius:'9px', padding:'10px 14px', fontSize:'clamp(0.8rem,2vw,0.85rem)', color:'#F57F17', marginBottom:'10px' }}>⏳ Awaiting guide confirmation — usually within 2 hours.</div>}
                {b.payment?.paid && <div style={{ background:'#E8F5E9', borderRadius:'9px', padding:'10px 14px', fontSize:'clamp(0.8rem,2vw,0.85rem)', color:'#2E7D32', marginBottom:'10px' }}>💰 Payment: <strong>₹{b.payment.amount?.toLocaleString()}</strong> via <strong>{b.payment.method}</strong></div>}
                {b.status==='Completed' && showReview!==b.id && (
                  <button onClick={()=>setShowReview(b.id)} style={{ padding:'9px 20px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--text-dark)', border:'none', borderRadius:'50px', fontWeight:600, fontSize:'clamp(0.78rem,2vw,0.84rem)', cursor:'pointer', boxShadow:'0 4px 12px rgba(212,160,23,0.3)' }}>⭐ Leave a Review</button>
                )}
                {b.status==='Completed' && showReview===b.id && (
                  <div style={{ background:'var(--gold-pale)', borderRadius:'12px', padding:'clamp(14px,3vw,20px)', border:'1px solid rgba(212,160,23,0.25)', marginTop:'8px' }}>
                    <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(0.95rem,2.5vw,1rem)', color:'var(--text-dark)', marginBottom:'12px' }}>Share Your Experience</div>
                    <div style={{ display:'flex', gap:'6px', marginBottom:'12px' }}>
                      {[1,2,3,4,5].map(s=>(
                        <button key={s} onClick={()=>setReview(r=>({...r,rating:s}))} style={{ fontSize:'clamp(1.3rem,4vw,1.6rem)', background:'none', border:'none', cursor:'pointer', opacity:s<=review.rating?1:0.3, transition:'all 0.2s', transform:s<=review.rating?'scale(1.1)':'scale(1)' }}>⭐</button>
                      ))}
                    </div>
                    <textarea value={review.comment} onChange={e=>setReview(r=>({...r,comment:e.target.value}))} placeholder="Tell us about your experience..." rows={3}
                      style={{ width:'100%', padding:'11px', borderRadius:'9px', border:'1.5px solid rgba(212,160,23,0.3)', background:'#fff', fontSize:'clamp(0.84rem,2vw,0.88rem)', outline:'none', resize:'vertical', boxSizing:'border-box', marginBottom:'10px' }} />
                    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                      <button onClick={()=>submitReview(b)} disabled={submitting} style={{ flex:1, minWidth:'120px', padding:'10px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', border:'none', borderRadius:'9px', fontWeight:700, cursor:submitting?'not-allowed':'pointer', fontSize:'clamp(0.82rem,2vw,0.88rem)' }}>
                        {submitting?'⏳ Submitting...':'⭐ Submit Review'}
                      </button>
                      <button onClick={()=>setShowReview(null)} style={{ padding:'10px 16px', background:'#fff', border:'1px solid var(--border)', borderRadius:'9px', cursor:'pointer', fontSize:'clamp(0.82rem,2vw,0.88rem)', color:'var(--text-mid)' }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
