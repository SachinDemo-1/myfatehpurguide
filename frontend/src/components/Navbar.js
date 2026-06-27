import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (isLoggedIn && user?.role !== 'owner') {
      const fetch = () => api.get('/api/notifications').then(r => {
        setUnread(r.data.unread); setNotifs(r.data.notifications.slice(0,5));
      }).catch(() => {});
      fetch();
      const t = setInterval(fetch, 15000);
      return () => clearInterval(t);
    }
  }, [isLoggedIn, user]);

  const openNotif = () => {
    setNotifOpen(o => !o);
    if (unread > 0) {
      api.patch('/api/notifications/read-all').then(() => setUnread(0)).catch(() => {});
    }
  };

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const bg = scrolled || menuOpen ? 'rgba(250,255,254,0.97)' : 'transparent';
  const tc = scrolled || menuOpen ? 'var(--text-dark)' : '#fff';
  const lc = scrolled || menuOpen ? 'var(--teal)' : '#fff';

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Tours', to: '/#tours' },
    { label: 'Gallery', to: '/#gallery' },
    { label: 'About', to: '/#about' },
  ];

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:1000, transition:'all 0.35s ease', background:bg, backdropFilter:scrolled||menuOpen?'blur(14px)':'none', borderBottom:scrolled||menuOpen?'1px solid var(--border)':'none', boxShadow:scrolled||menuOpen?'var(--shadow-sm)':'none' }}>
      <div style={{ maxWidth:'1140px', margin:'0 auto', padding:'0 clamp(16px,4vw,28px)', display:'flex', alignItems:'center', justifyContent:'space-between', height: scrolled ? '58px' : '70px', transition:'height 0.3s' }}>

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:'0 4px 12px rgba(13,115,119,0.3)', flexShrink:0 }}>🏛️</div>
          <div>
            <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:'1.05rem', color:lc, lineHeight:1, transition:'color 0.3s' }}>Fatehpur Sikri</div>
            <div style={{ fontSize:'0.58rem', letterSpacing:'0.1em', textTransform:'uppercase', color:scrolled||menuOpen?'var(--text-light)':'rgba(255,255,255,0.65)', transition:'color 0.3s' }}>Expert Guide</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:'28px' }}>
          {navLinks.map(({ label, to }) => (
            <a key={label} href={to} style={{ color:tc, fontSize:'0.88rem', fontWeight:500, transition:'color 0.2s', textDecoration:'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--teal)'} onMouseLeave={e => e.target.style.color = tc}>{label}</a>
          ))}
          {isLoggedIn && user?.role !== 'owner' && (
            <Link to="/my-bookings" style={{ color:tc, fontSize:'0.88rem', fontWeight:500 }}>My Bookings</Link>
          )}
        </div>

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          {/* Notification bell */}
          {isLoggedIn && user?.role !== 'owner' && (
            <div ref={notifRef} style={{ position:'relative' }}>
              <button onClick={openNotif} style={{ background:'none', border:'none', cursor:'pointer', position:'relative', padding:'6px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:'1.25rem' }}>🔔</span>
                {unread > 0 && (
                  <span style={{ position:'absolute', top:'2px', right:'2px', background:'var(--coral)', color:'#fff', borderRadius:'50%', width:'16px', height:'16px', fontSize:'0.6rem', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, animation:'pulse 1.5s infinite' }}>{unread}</span>
                )}
              </button>
              {notifOpen && (
                <div style={{ position:'absolute', right:0, top:'44px', width:Math.min(320, window.innerWidth-32)+'px', background:'#fff', borderRadius:'14px', boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)', zIndex:999, overflow:'hidden', animation:'fadeIn 0.2s ease' }}>
                  <div style={{ padding:'12px 16px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', fontWeight:600, fontSize:'0.85rem' }}>🔔 Notifications</div>
                  {notifs.length === 0
                    ? <div style={{ padding:'20px', textAlign:'center', color:'var(--text-light)', fontSize:'0.84rem' }}>No notifications yet</div>
                    : notifs.map(n => (
                      <div key={n.id} style={{ padding:'12px 16px', borderBottom:'1px solid var(--teal-pale)', background:n.read?'#fff':'var(--off-white)' }}>
                        <div style={{ fontSize:'0.81rem', color:'var(--text-dark)', lineHeight:1.5 }}>{n.message}</div>
                        <div style={{ fontSize:'0.68rem', color:'var(--text-light)', marginTop:'3px' }}>{new Date(n.createdAt).toLocaleString('en-IN')}</div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}

          {/* Auth buttons - desktop */}
          <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {isLoggedIn ? (
              <>
                <div style={{ background:scrolled?'var(--teal-pale)':'rgba(255,255,255,0.15)', padding:'6px 12px', borderRadius:'50px', fontSize:'0.8rem', color:tc, fontWeight:500 }}>
                  👤 {user?.name?.split(' ')[0]}
                </div>
                <button onClick={handleLogout} style={{ background:'transparent', border:`1.5px solid ${scrolled?'var(--teal)':'rgba(255,255,255,0.45)'}`, color:tc, padding:'7px 14px', borderRadius:'50px', fontSize:'0.8rem', fontWeight:500 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color:tc, fontSize:'0.85rem', fontWeight:500, padding:'7px 14px', border:`1.5px solid ${scrolled?'var(--teal)':'rgba(255,255,255,0.45)'}`, borderRadius:'50px' }}>Login</Link>
                <Link to="/book" style={{ background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', padding:'8px 18px', borderRadius:'50px', fontWeight:600, fontSize:'0.85rem', boxShadow:'0 4px 14px rgba(13,115,119,0.35)' }}>Book Now</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} style={{ display:'none', background:'none', border:'none', padding:'6px', flexDirection:'column', gap:'5px', cursor:'pointer' }}
            className="hamburger-btn"
            aria-label="Menu">
            {[0,1,2].map(i => (
              <div key={i} style={{ width:'22px', height:'2px', background:tc, borderRadius:'2px', transition:'all 0.3s',
                transform: menuOpen ? (i===0?'rotate(45deg) translateY(7px)':i===2?'rotate(-45deg) translateY(-7px)':'scaleX(0)') : 'none',
                opacity: menuOpen && i===1 ? 0 : 1 }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background:'rgba(250,255,254,0.98)', borderTop:'1px solid var(--border)', padding:'16px 20px 24px', animation:'fadeIn 0.2s ease' }}>
          {navLinks.map(({ label, to }) => (
            <a key={label} href={to} onClick={() => setMenuOpen(false)} style={{ display:'block', padding:'12px 0', color:'var(--text-dark)', fontSize:'0.95rem', fontWeight:500, borderBottom:'1px solid var(--teal-pale)' }}>{label}</a>
          ))}
          {isLoggedIn && user?.role !== 'owner' && (
            <Link to="/my-bookings" onClick={() => setMenuOpen(false)} style={{ display:'block', padding:'12px 0', color:'var(--text-dark)', fontSize:'0.95rem', fontWeight:500, borderBottom:'1px solid var(--teal-pale)' }}>My Bookings</Link>
          )}
          <div style={{ marginTop:'16px', display:'flex', flexDirection:'column', gap:'10px' }}>
            {isLoggedIn ? (
              <button onClick={handleLogout} style={{ padding:'12px', background:'var(--teal-pale)', border:'1.5px solid var(--border)', borderRadius:'10px', color:'var(--teal)', fontWeight:600, fontSize:'0.92rem' }}>Logout ({user?.name?.split(' ')[0]})</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ padding:'12px', background:'var(--teal-pale)', border:'1.5px solid var(--border)', borderRadius:'10px', color:'var(--teal)', fontWeight:600, fontSize:'0.92rem', textAlign:'center' }}>Login</Link>
                <Link to="/book" onClick={() => setMenuOpen(false)} style={{ padding:'12px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', borderRadius:'10px', color:'#fff', fontWeight:700, fontSize:'0.92rem', textAlign:'center' }}>📅 Book Now</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hamburger-btn { display:flex !important; }
          .hide-mobile { display:none !important; }
        }
      `}</style>
    </nav>
  );
}
