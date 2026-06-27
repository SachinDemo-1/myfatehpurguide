import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background:'linear-gradient(135deg,var(--teal-deep) 0%,#041E20 100%)', color:'#fff', padding:'clamp(40px,6vw,64px) clamp(16px,4vw,40px) 28px' }}>
      <div style={{ maxWidth:'1140px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'32px', marginBottom:'40px' }}>
          <div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.3rem', color:'var(--gold-light)', marginBottom:'12px' }}>🏛️ Fatehpur Sikri Guide</div>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.86rem', lineHeight:1.8 }}>Certified expert guide for India's greatest Mughal heritage site. Bilingual, experienced, passionate.</p>
          </div>
          <div>
            <div style={{ fontSize:'0.7rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'14px', fontWeight:600 }}>Quick Links</div>
            {[['Home','/'],['Book a Tour','/book'],['My Bookings','/my-bookings'],['Register','/register']].map(([l,h])=>(
              <Link key={l} to={h} style={{ display:'block', color:'rgba(255,255,255,0.5)', fontSize:'0.86rem', marginBottom:'8px', transition:'color 0.2s' }}
                onMouseEnter={e=>e.target.style.color='var(--gold-light)'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.5)'}>{l}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize:'0.7rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'14px', fontWeight:600 }}>Contact</div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.86rem', lineHeight:2.1 }}>
              📍 Fatehpur Sikri, Agra UP 283110<br/>
              📞 +91 94114 04535<br/>
              📧 myfatehpurguide@gmail.com<br/>
              ⏰ Daily 6 AM – 6 PM
            </p>
          </div>
          <div>
            <div style={{ fontSize:'0.7rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'14px', fontWeight:600 }}>Tour Timings</div>
            {[['Sunrise Tour','6:00 AM'],['Morning Tour','9:00 AM'],['Afternoon Tour','1:00 PM'],['Sunset Tour','4:30 PM']].map(([t,h])=>(
              <div key={t} style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'0.84rem' }}>
                <span style={{ color:'rgba(255,255,255,0.5)' }}>{t}</span>
                <span style={{ color:'var(--gold-light)', fontWeight:600 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'20px', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'10px', alignItems:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.78rem' }}>© 2026 Fatehpur Sikri Guide. All rights reserved.</p>
          <Link to="/owner/login" style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.74rem', transition:'color 0.2s' }}
            onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.5)'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.2)'}>Owner Portal →</Link>
        </div>
      </div>
    </footer>
  );
}
