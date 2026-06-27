import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BookingSuccess() {
  const { state } = useLocation();
  const booking = state?.booking;
  const [confetti] = useState(() => Array.from({length:16},(_,i)=>({
    id:i, left:Math.random()*100,
    color:['#0D7377','#D4A017','#14A3A8','#F0C040','#E05A2B'][i%5],
    delay:Math.random()*2, size:5+Math.random()*8, dur:2+Math.random()*2
  })));

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,var(--teal-pale) 0%,var(--off-white) 100%)', paddingTop:'clamp(80px,12vw,120px)', paddingBottom:'clamp(40px,6vw,80px)', position:'relative', overflow:'hidden' }}>
      {confetti.map(c=>(
        <div key={c.id} style={{ position:'fixed', top:'-20px', left:`${c.left}%`, width:c.size, height:c.size, background:c.color, borderRadius:c.id%2===0?'50%':'2px', animation:`fall ${c.dur}s ease-in ${c.delay}s infinite`, opacity:0.75, zIndex:0, pointerEvents:'none' }} />
      ))}
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:`0 clamp(16px,4vw,28px)`, textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ width:'clamp(72px,14vw,96px)', height:'clamp(72px,14vw,96px)', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(2rem,5vw,2.8rem)', margin:'0 auto 22px', boxShadow:'0 10px 40px rgba(13,115,119,0.4)', animation:'float 3s ease-in-out infinite' }}>🎉</div>
        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.8rem,5vw,2.2rem)', color:'var(--text-dark)', marginBottom:'10px' }}>Booking Submitted!</h1>
        <p style={{ color:'var(--text-mid)', fontSize:'clamp(0.88rem,2vw,0.97rem)', lineHeight:1.8, marginBottom:'28px' }}>
          Your booking is <strong>awaiting guide confirmation</strong>.<br/>
          You'll get a notification once confirmed (within 2 hours).
        </p>

        <div style={{ background:'var(--teal-pale)', borderRadius:'12px', padding:'clamp(12px,3vw,16px) clamp(14px,3vw,20px)', marginBottom:'22px', border:'1px solid var(--border)' }}>
          <div style={{ fontSize:'0.76rem', color:'var(--teal)', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'7px' }}>⏳ Status: Awaiting Confirmation</div>
          <p style={{ fontSize:'clamp(0.82rem,2vw,0.86rem)', color:'var(--text-mid)', lineHeight:1.7 }}>Check your <strong>My Bookings</strong> page or watch for the 🔔 notification bell in the top bar.</p>
        </div>

        {booking && (
          <div style={{ background:'#fff', borderRadius:'18px', padding:'clamp(18px,4vw,26px)', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)', textAlign:'left', marginBottom:'22px' }}>
            <div style={{ fontSize:'0.7rem', color:'var(--teal)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'12px' }}>Booking Details</div>
            <div style={{ background:'var(--teal-pale)', borderRadius:'9px', padding:'9px 12px', marginBottom:'12px', fontSize:'0.78rem', color:'var(--text-mid)' }}>
              ID: <span style={{ fontFamily:'monospace', color:'var(--teal)', fontWeight:700 }}>{booking.id?.slice(0,14).toUpperCase()}</span>
            </div>
            {[
              ['Tour', booking.tourType],
              ['Date', booking.visitDate ? new Date(booking.visitDate+'T00:00').toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) : ''],
              ['Group', `${booking.groupSize} person(s)`],
              ['Language', booking.language],
              ['Status', '⏳ Pending Confirmation'],
            ].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'8px 0', borderBottom:'1px solid var(--teal-pale)', fontSize:'clamp(0.82rem,2vw,0.87rem)', gap:'10px' }}>
                <span style={{ color:'var(--text-light)', flexShrink:0 }}>{k}</span>
                <span style={{ color:'var(--text-dark)', fontWeight:500, textAlign:'right' }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ background:'linear-gradient(135deg,var(--teal-deep),var(--teal-dark))', borderRadius:'14px', padding:'clamp(16px,3vw,22px)', marginBottom:'24px', textAlign:'left' }}>
          <div style={{ color:'var(--gold-light)', fontWeight:600, fontSize:'0.86rem', marginBottom:'11px' }}>📋 What happens next?</div>
          {['📞 Guide will call/WhatsApp within 2 hours','📍 Meeting point: Buland Darwaza (Main Gate)','💰 Payment in cash or UPI on arrival','🔄 Free cancellation up to 24 hours before'].map(item=>(
            <div key={item} style={{ color:'rgba(255,255,255,0.7)', fontSize:'clamp(0.8rem,2vw,0.84rem)', marginBottom:'7px' }}>{item}</div>
          ))}
        </div>

        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/my-bookings" style={{ padding:'clamp(10px,2vw,12px) clamp(18px,4vw,26px)', borderRadius:'50px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', fontWeight:600, fontSize:'clamp(0.84rem,2vw,0.9rem)', boxShadow:'0 6px 18px rgba(13,115,119,0.3)' }}>View My Bookings</Link>
          <Link to="/" style={{ padding:'clamp(10px,2vw,12px) clamp(18px,4vw,24px)', borderRadius:'50px', background:'#fff', color:'var(--teal)', fontWeight:600, fontSize:'clamp(0.84rem,2vw,0.9rem)', border:'1.5px solid var(--border)' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
