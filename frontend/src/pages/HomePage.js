import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

/* ── scroll-reveal hook ── */
const useReveal = (delay = 0) => {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, { opacity: vis?1:0, transform: vis?'translateY(0)':'translateY(32px)', transition:`opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s` }];
};

/* ── animated counter ── */
const Counter = ({ target, suffix='' }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null); const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let s=0; const step=target/55;
        const t = setInterval(() => { s+=step; if(s>=target){setN(target);clearInterval(t);}else setN(Math.floor(s)); }, 28);
      }
    });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
};

/* ── DATA ── */
const SIKRI_PHOTOS = [
  { url:'/images/paranoma.jpg', label:'Fatehpur Sikri Panorama' },
  { url:'/images/Bulanddarwaza.webp', label:'Buland Darwaza' },
  { url:'/images/PanchMahal.JPG', label:'Panch Mahal' },
  { url:'/images/JamaMasjid.jpg', label:'Jama Masjid' },
  { url:'/images/deewanekhas.jpg', label:'Diwan-i-Khas' },
  { url:'/images/birbalspalace.jpg', label:"Birbal's Palace" },
];

/* Guide with celebrities – image gallery data */
const GUIDE_GALLERY = [
  { url:'/images/rahul.png', label:'Guiding a legendary former Indian crickete', tag:'VIP Tour' },
  { url:'/images/coachrahul.jpeg', label:'Guiding a legendary former Indian crickete Team Coach', tag:'ᴠɪᴘ 𓆩♛𓆪' },
  { url:'/images/ManyGestus.jpeg', label:'With International Visitors', tag:'Visitors' },
  { url:'/images/guest1.jpeg', label:'International Visitor', tag:'『ɢᴜᴇꜱᴛ』' },
  { url:'/images/guest2.jpeg', label:'With foreign tourist', tag:'Tourist' },
  { url:'/images/Guest3.jpeg', label:'Featured on National TV', tag:'『ɢᴜᴇꜱᴛ』' },
  { url:'/images/guest4.jpeg', label:'Withc Guests', tag:'『ɢᴜᴇꜱᴛ』' },
  { url:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80', label:'Tourism Board Recognition', tag:'Tourism' },
];

const TOURS = [
  { icon:'🕌', title:'Complete Heritage Tour', dur:'3–4 hrs', price:800, desc:"All major monuments: Buland Darwaza, Jama Masjid, Diwan-i-Khas, Panch Mahal and more with full historical context." },
  { icon:'📸', title:'Photography Special Tour', dur:'2–3 hrs', price:600, desc:"Curated stops at the most photogenic spots timed for golden hour. Perfect for travel photographers." },
  { icon:'👶', title:'Family & Kids Tour', dur:'2 hrs', price:500, desc:"Story-telling style tour designed to engage children with fun facts, legends and interactive experiences." },
  { icon:'🌅', title:'Sunrise Special', dur:'1.5 hrs', price:700, desc:"Witness majestic sandstone glow at dawn. Early bird tour for tranquility and stunning warm light." },
  { icon:'🏛️', title:'Deep History Tour', dur:'4–5 hrs', price:1200, desc:"Scholarly deep-dive into Akbar's Mughal architecture, court life, religion and legacy." },
  { icon:'🌙', title:'Evening Sunset Tour', dur:'2 hrs', price:650, desc:"The golden sandstone transforms at dusk. Cooler evening light with fewer crowds." },
];

const FACTS = [
  { icon:'👑', title:'Built by Emperor Akbar', desc:'Fatehpur Sikri was built in 1571 as the grand Mughal capital — abandoned just 14 years later due to water scarcity.' },
  { icon:'🏗️', title:'Red Sandstone Marvel', desc:'Entirely constructed from locally quarried red sandstone, showcasing the pinnacle of Mughal architectural genius.' },
  { icon:'🌍', title:'UNESCO World Heritage', desc:"Inscribed on UNESCO's World Heritage List in 1986, it remains one of the finest preserved Mughal cities on Earth." },
  { icon:'🕌', title:'Buland Darwaza', desc:'At 54 metres, the Gate of Magnificence is the highest gateway in Asia — built to celebrate Akbar\'s victory over Gujarat.' },
];

/* ── Lightbox component ── */
const Lightbox = ({ images, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext]);

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(4,30,32,0.96)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px', animation:'fadeIn 0.2s ease' }}>
      <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'rgba(255,255,255,0.12)', border:'none', color:'#fff', width:'40px', height:'40px', borderRadius:'50%', fontSize:'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>

      <button onClick={e=>{ e.stopPropagation(); onPrev(); }} style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.12)', border:'none', color:'#fff', width:'48px', height:'48px', borderRadius:'50%', fontSize:'1.4rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
        onMouseEnter={e=>e.target.style.background='rgba(255,255,255,0.25)'} onMouseLeave={e=>e.target.style.background='rgba(255,255,255,0.12)'}>‹</button>

      <div onClick={e=>e.stopPropagation()} style={{ maxWidth:'900px', width:'100%', animation:'zoomIn 0.25s ease' }}>
        <img src={images[index].url} alt={images[index].label}
          style={{ width:'100%', maxHeight:'75vh', objectFit:'contain', borderRadius:'12px', boxShadow:'0 30px 80px rgba(0,0,0,0.5)' }}
          onError={e=>{ e.target.src='https://via.placeholder.com/800x500/0D7377/fff?text=Guide+Photo'; }} />
        <div style={{ textAlign:'center', marginTop:'16px' }}>
          <div style={{ color:'#fff', fontFamily:'Playfair Display,serif', fontSize:'1.1rem', marginBottom:'4px' }}>{images[index].label}</div>
          {images[index].tag && <span style={{ background:'var(--gold)', color:'var(--text-dark)', padding:'3px 12px', borderRadius:'50px', fontSize:'0.74rem', fontWeight:600 }}>{images[index].tag}</span>}
          <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', marginTop:'10px' }}>{index+1} / {images.length}</div>
        </div>
      </div>

      <button onClick={e=>{ e.stopPropagation(); onNext(); }} style={{ position:'absolute', right:'16px', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.12)', border:'none', color:'#fff', width:'48px', height:'48px', borderRadius:'50%', fontSize:'1.4rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
        onMouseEnter={e=>e.target.style.background='rgba(255,255,255,0.25)'} onMouseLeave={e=>e.target.style.background='rgba(255,255,255,0.12)'}>›</button>

      {/* Dot indicators */}
      <div style={{ position:'absolute', bottom:'16px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px' }}>
        {images.map((_,i)=>(
          <button key={i} onClick={e=>{ e.stopPropagation(); /* handled by parent */ }} style={{ width:i===index?'20px':'7px', height:'7px', borderRadius:'4px', background:i===index?'var(--gold)':'rgba(255,255,255,0.3)', border:'none', cursor:'pointer', transition:'all 0.3s' }} />
        ))}
      </div>
    </div>
  );
};

/* ══ MAIN COMPONENT ══════════════════════════════════════════════════════ */
export default function HomePage() {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState('5.0');
  const [activeSikri, setActiveSikri] = useState(0);
  const [lightbox, setLightbox] = useState({ open:false, index:0 });
  const [hoveredTour, setHoveredTour] = useState(null);

  // Gallery lightbox helpers
  const openLightbox = useCallback((i) => { setLightbox({ open:true, index:i }); }, []);
  const closeLightbox = useCallback(() => setLightbox({ open:false, index:0 }), []);
  const prevImg = useCallback(() => setLightbox(l => ({ ...l, index:(l.index-1+GUIDE_GALLERY.length)%GUIDE_GALLERY.length })), []);
  const nextImg = useCallback(() => setLightbox(l => ({ ...l, index:(l.index+1)%GUIDE_GALLERY.length })), []);

  useEffect(() => {
    api.get('/api/reviews').then(r => { setReviews(r.data.reviews); setAvgRating(r.data.avgRating); }).catch(()=>{});
    const t = setInterval(() => setActiveSikri(g=>(g+1)%SIKRI_PHOTOS.length), 4200);
    return () => clearInterval(t);
  }, []);

  const [heroRef, heroStyle] = useReveal(0.1);
  const [statsRef, statsStyle] = useReveal(0);
  const [aboutRef, aboutStyle] = useReveal(0);
  const [factsRef, factsStyle] = useReveal(0);
  const [galleryRef, galleryStyle] = useReveal(0);
  const [guideRef, guideStyle] = useReveal(0);
  const [toursRef, toursStyle] = useReveal(0);
  const [reviewsRef, reviewsStyle] = useReveal(0);

  return (
    <div>
      {/* Lightbox */}
      {lightbox.open && <Lightbox images={GUIDE_GALLERY} index={lightbox.index} onClose={closeLightbox} onPrev={prevImg} onNext={nextImg} />}

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{ minHeight:'100vh', background:'linear-gradient(150deg,#041E20 0%,#0A5C60 40%,#0D7377 70%,#063B3E 100%)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', padding:'0 clamp(16px,4vw,40px)' }}>
        {[250,450,650,850].map((s,i)=>(
          <div key={i} style={{ position:'absolute', top:'50%', left:'50%', width:s, height:s, border:`1px solid rgba(212,160,23,${0.07-i*0.013})`, borderRadius:'50%', transform:'translate(-50%,-50%)', animation:`spin ${24+i*8}s linear infinite`, pointerEvents:'none' }} />
        ))}
        {[{t:'10%',l:'6%',s:9},{t:'22%',r:'10%',s:5},{b:'28%',l:'12%',s:6},{b:'16%',r:'6%',s:8},{t:'58%',l:'2%',s:4}].map((d,i)=>(
          <div key={i} style={{ position:'absolute', top:d.t, left:d.l, right:d.r, bottom:d.b, width:d.s, height:d.s, background:'var(--gold)', borderRadius:'50%', animation:`float ${3+i*0.6}s ease-in-out ${i*0.4}s infinite`, boxShadow:'0 0 16px rgba(212,160,23,0.5)', pointerEvents:'none' }} />
        ))}
        <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'clamp(280px,70vw,700px)', height:'clamp(140px,35vw,350px)', borderRadius:'350px 350px 0 0', border:'1px solid rgba(212,160,23,0.08)', borderBottom:'none', background:'linear-gradient(to top,rgba(212,160,23,0.04),transparent)', pointerEvents:'none' }} />

        <div ref={heroRef} style={{ ...heroStyle, textAlign:'center', position:'relative', zIndex:2, maxWidth:'820px', width:'100%' }}>
          <div style={{ display:'inline-block', background:'rgba(212,160,23,0.12)', border:'1px solid rgba(212,160,23,0.32)', borderRadius:'50px', padding:'7px 18px', marginBottom:'20px' }}>
            <span style={{ color:'var(--gold-light)', fontSize:'clamp(0.65rem,2vw,0.78rem)', letterSpacing:'0.1em', fontWeight:600, textTransform:'uppercase' }}>🏆 UNESCO World Heritage Site · Est. 1571</span>
          </div>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,7vw,4.4rem)', fontWeight:900, color:'#FAFFFE', lineHeight:1.12, marginBottom:'18px' }}>
            Step Inside the<br />
            <span style={{ background:'linear-gradient(135deg,var(--gold),var(--gold-light))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Mughal Capital</span><br />
            of Fatehpur Sikri
          </h1>
          <p style={{ fontSize:'clamp(0.9rem,2.5vw,1.05rem)', color:'rgba(255,255,255,0.72)', lineHeight:1.85, marginBottom:'32px' }}>
            Certified expert guide · 15+ years · Bilingual Hindi & English<br className="hide-mobile" />
            5,000+ happy tourists from 30+ countries
          </p>
          <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/book" style={{ background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--text-dark)', padding:'clamp(12px,3vw,16px) clamp(22px,5vw,36px)', borderRadius:'50px', fontWeight:700, fontSize:'clamp(0.88rem,2.5vw,1rem)', boxShadow:'0 8px 28px rgba(212,160,23,0.4)', display:'inline-block' }}>📅 Book Your Guide</Link>
            <a href="#about" style={{ background:'rgba(255,255,255,0.1)', color:'#fff', padding:'clamp(12px,3vw,16px) clamp(18px,4vw,28px)', borderRadius:'50px', fontWeight:500, fontSize:'clamp(0.88rem,2.5vw,0.97rem)', border:'1px solid rgba(255,255,255,0.22)', display:'inline-block' }}>Learn More ↓</a>
          </div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,0.09)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'50px', padding:'10px 20px', marginTop:'36px' }}>
            <span style={{ color:'var(--gold-light)', fontSize:'clamp(0.85rem,2vw,1rem)' }}>{'⭐'.repeat(5)}</span>
            <span style={{ color:'#fff', fontWeight:700, fontSize:'clamp(0.88rem,2vw,1rem)' }}>{avgRating}/5</span>
            <span style={{ color:'rgba(255,255,255,0.55)', fontSize:'clamp(0.75rem,2vw,0.82rem)' }}>({reviews.length || '200+'} reviews)</span>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)', animation:'float 2s ease-in-out infinite', pointerEvents:'none' }}>
          <div style={{ width:'22px', height:'36px', border:'1.5px solid rgba(212,160,23,0.35)', borderRadius:'11px', display:'flex', justifyContent:'center', paddingTop:'7px' }}>
            <div style={{ width:'2.5px', height:'7px', background:'var(--gold)', borderRadius:'2px', animation:'float 1.5s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ══ STATS ══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ ...statsStyle, background:'linear-gradient(90deg,var(--teal-dark),var(--teal),var(--teal-dark))', padding:'clamp(24px,5vw,36px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'20px', textAlign:'center' }}>
          {[{v:5000,s:'+',l:'Happy Tourists'},{v:15,s:'+',l:'Years Experience'},{v:30,s:'+',l:'Countries Served'},{v:100,s:'%',l:'Satisfaction'}].map(({v,s,l})=>(
            <div key={l}>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.8rem,5vw,2.4rem)', fontWeight:900, color:'#fff' }}><Counter target={v} suffix={s} /></div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'clamp(0.65rem,2vw,0.8rem)', textTransform:'uppercase', letterSpacing:'0.07em', fontWeight:500 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ABOUT ══════════════════════════════════════════════════════════ */}
      <section id="about" className="section" style={{ background:'var(--off-white)' }}>
        <div className="container grid-2" ref={aboutRef} style={aboutStyle}>
          <div>
            <div className="section-label">Your Expert Guide</div>
            <h2 className="section-title" style={{ marginBottom:'18px' }}>Dinesh Chand Gola<br /><span style={{ color:'var(--teal)', fontSize:'0.62em' }}>ASI Certified Heritage Guide</span></h2>
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px' }}>
              {['ASI Certified','Bilingual','15+ Years','Award Winner','5⭐ Rated'].map(t=>(
                <span key={t} style={{ background:'var(--teal-pale)', color:'var(--teal)', padding:'4px 12px', borderRadius:'50px', fontSize:'0.76rem', fontWeight:600, border:'1px solid var(--border)' }}>{t}</span>
              ))}
            </div>
            <p style={{ color:'var(--text-mid)', lineHeight:1.85, fontSize:'clamp(0.88rem,2vw,0.95rem)', marginBottom:'18px' }}>
              Born near Fatehpur Sikri, I grew up listening to the stories of Akbar's legendary court from my grandfather — himself a guide for 30 years.I have guided over 5,000 tourists from 30+ countries since 2009.
            </p>
            <p style={{ color:'var(--text-mid)', lineHeight:1.85, fontSize:'clamp(0.88rem,2vw,0.95rem)', marginBottom:'26px' }}>
              Every tour is personal. I bring history alive through stories, legends and passion — not just facts.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              {[['🌍','Languages','Hindi, English'],['🎓','Tranning','Lucknow , UP Toursim'],['🏆','ACHIvment','Best Guide of Fatehpur Sikari'],['📅','Available','Daily 5 AM – 7 PM']].map(([icon,title,val])=>(
                <div key={title} style={{ background:'#fff', borderRadius:'12px', padding:'13px 14px', border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)' }}>
                  <div style={{ fontSize:'1.1rem', marginBottom:'3px' }}>{icon}</div>
                  <div style={{ fontSize:'0.68rem', color:'var(--text-light)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'2px' }}>{title}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-dark)', fontWeight:500 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Guide card */}
          <div style={{ position:'relative' }}>
            <div style={{ background:'linear-gradient(135deg,var(--teal-deep),var(--teal-dark))', borderRadius:'24px', padding:'clamp(28px,5vw,40px)', color:'#fff', boxShadow:'var(--shadow-lg)' }}>
              <div style={{ fontSize:'clamp(3rem,8vw,5rem)', textAlign:'center', marginBottom:'14px', animation:'float 3s ease-in-out infinite' }}><img src='/images/Guide.jpeg' alt="Guide" style={{ width:'clamp(10rem,10vw,10rem)', height:'max(180px, 10vh)', borderRadius:'50%'}}/></div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.1rem,3vw,1.4rem)', color:'var(--gold-light)', textAlign:'center', marginBottom:'4px' }}>Dinesh Chand Gola</div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.8rem', textAlign:'center', marginBottom:'24px' }}>Expert Heritage Guide · Since 2009</div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.8rem', textAlign:'center', marginBottom:'24px' }}>Contact Number - +91 9411404535</div>
              {[{icon:'🏛️',label:'Heritage Expert',sub:'Deep specialist knowledge'},{icon:'📸',label:'Photography Guide',sub:'Best spots & timing'},{icon:'👨‍👩‍👧',label:'Family Tours',sub:'Kid-friendly storytelling'}].map(({icon,label,sub})=>(
                <div key={label} style={{ display:'flex', gap:'12px', alignItems:'center', padding:'11px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize:'1.3rem' }}>{icon}</span>
                  <div><div style={{ color:'#fff', fontWeight:600, fontSize:'0.85rem' }}>{label}</div><div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.73rem' }}>{sub}</div></div>
                </div>
              ))}
            </div>
            <div style={{ position:'absolute', top:'-12px', right:'-12px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--text-dark)', padding:'11px 14px', borderRadius:'14px', textAlign:'center', fontWeight:700, fontSize:'0.8rem', boxShadow:'0 8px 24px rgba(212,160,23,0.35)', animation:'float 2.5s ease-in-out infinite' }}>
              <div style={{ fontSize:'1.1rem' }}>⭐</div><div>{avgRating}/5</div><div style={{ fontSize:'0.68rem', fontWeight:400, opacity:0.8 }}>Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FACTS ══════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background:'linear-gradient(135deg,var(--teal-deep) 0%,var(--teal-dark) 100%)' }}>
        <div className="container" ref={factsRef}>
          <div style={{ textAlign:'center', marginBottom:'48px', ...factsStyle }}>
            <div style={{ fontSize:'0.72rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', fontWeight:600, marginBottom:'10px' }}>About the Destination</div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.6rem,4vw,2.6rem)', color:'#fff', marginBottom:'14px' }}>Fatehpur Sikri — The Ghost City</h2>
            <p style={{ color:'rgba(255,255,255,0.6)', maxWidth:'540px', margin:'0 auto', fontSize:'clamp(0.86rem,2vw,0.95rem)', lineHeight:1.8 }}>
              Built in 1571 by Emperor Akbar, this abandoned Mughal capital is one of the best-preserved examples of Mughal architecture — frozen in time.
            </p>
          </div>
          <div className="grid-4" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))' }}>
            {FACTS.map((f,i)=>(
              <div key={f.title} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(212,160,23,0.15)', borderRadius:'18px', padding:'clamp(20px,3vw,28px)', transition:'all 0.3s', cursor:'default', ...factsStyle, transitionDelay:`${i*0.1}s` }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(212,160,23,0.12)'; e.currentTarget.style.transform='translateY(-5px)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.transform=''; }}>
                <div style={{ fontSize:'2rem', marginBottom:'12px' }}>{f.icon}</div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(0.95rem,2.5vw,1.05rem)', color:'var(--gold-light)', marginBottom:'8px' }}>{f.title}</div>
                <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'clamp(0.8rem,2vw,0.86rem)', lineHeight:1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FATEHPUR SIKRI PHOTO GALLERY ══════════════════════════════════ */}
      <section id="gallery" className="section" style={{ background:'var(--off-white)' }}>
        <div className="container" ref={galleryRef} style={galleryStyle}>
          <div style={{ textAlign:'center', marginBottom:'40px' }}>
            <div className="section-label">Gallery</div>
            <h2 className="section-title">Fatehpur Sikri in Photos</h2>
          </div>
          {/* Big featured image */}
          <div style={{ borderRadius:'20px', overflow:'hidden', marginBottom:'12px', height:'clamp(200px,40vw,400px)', position:'relative', boxShadow:'var(--shadow-lg)', cursor:'pointer' }} onClick={()=>{}}>
            <img src={SIKRI_PHOTOS[activeSikri].url} alt={SIKRI_PHOTOS[activeSikri].label}
              style={{ width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.5s ease' }}
              onError={e=>{ e.target.style.display='none'; }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top,rgba(4,30,32,0.8),transparent)', padding:'clamp(14px,3vw,24px)' }}>
              <div style={{ color:'#fff', fontFamily:'Playfair Display,serif', fontSize:'clamp(1rem,3vw,1.3rem)' }}>{SIKRI_PHOTOS[activeSikri].label}</div>
            </div>
          </div>
          {/* Thumbnails */}
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${SIKRI_PHOTOS.length},1fr)`, gap:'clamp(6px,1.5vw,10px)', marginBottom:'14px' }}>
            {SIKRI_PHOTOS.map((p,i)=>(
              <div key={i} onClick={()=>setActiveSikri(i)} style={{ borderRadius:'10px', overflow:'hidden', height:'clamp(44px,8vw,80px)', cursor:'pointer', border:i===activeSikri?'2.5px solid var(--teal)':'2.5px solid transparent', transition:'all 0.2s', transform:i===activeSikri?'scale(0.96)':'scale(1)' }}>
                <img src={p.url} alt={p.label} style={{ width:'100%', height:'100%', objectFit:'cover', filter:i===activeSikri?'none':'brightness(0.75)' }} onError={e=>{ e.target.parentElement.style.background='var(--teal-pale)'; e.target.style.display='none'; }} />
              </div>
            ))}
          </div>
          {/* Dot indicators */}
          <div style={{ display:'flex', justifyContent:'center', gap:'6px' }}>
            {SIKRI_PHOTOS.map((_,i)=>(
              <button key={i} onClick={()=>setActiveSikri(i)} style={{ width:i===activeSikri?'22px':'7px', height:'7px', borderRadius:'4px', background:i===activeSikri?'var(--teal)':'var(--border)', border:'none', cursor:'pointer', transition:'all 0.3s' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ GUIDE IMAGE GALLERY (celebrity/famous persons) ════════════════ */}
      <section className="section" style={{ background:'linear-gradient(135deg,var(--teal-pale) 0%,var(--off-white) 100%)' }}>
        <div className="container" ref={guideRef} style={guideStyle}>
          <div style={{ textAlign:'center', marginBottom:'42px' }}>
            <div className="section-label">Behind the Lens</div>
            <h2 className="section-title" style={{ marginBottom:'12px' }}>Guide with Famous Visitors</h2>
            <p style={{ color:'var(--text-mid)', maxWidth:'520px', margin:'0 auto', fontSize:'clamp(0.86rem,2vw,0.93rem)', lineHeight:1.7 }}>
              From Bollywood stars to international diplomats and media personalities — our guide has been the trusted companion for hundreds of notable guests.
            </p>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginTop:'14px', background:'rgba(13,115,119,0.08)', padding:'7px 16px', borderRadius:'50px', fontSize:'0.8rem', color:'var(--teal)', border:'1px solid var(--border)' }}>
              🖼️ Click any photo to view full size
            </div>
          </div>

          {/* ── Masonry-style responsive image grid ── */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(clamp(140px,22vw,220px),1fr))', gap:'clamp(8px,2vw,14px)', marginBottom:'28px' }}>
            {GUIDE_GALLERY.map((img, i) => (
              <div key={i} onClick={() => openLightbox(i)}
                style={{ borderRadius:'clamp(10px,2vw,16px)', overflow:'hidden', aspectRatio:'1/1', cursor:'pointer', position:'relative', boxShadow:'var(--shadow-sm)', transition:'all 0.3s ease', animation:`fadeUp 0.5s ease ${i*0.07}s both` }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.querySelector('.img-overlay').style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.querySelector('.img-overlay').style.opacity = '0'; }}>
                <img src={img.url} alt={img.label}
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform 0.4s ease' }}
                  onError={e => { e.target.src = `https://via.placeholder.com/400x400/0D7377/fff?text=${encodeURIComponent(img.label)}`; }} />
                {/* Overlay */}
                <div className="img-overlay" style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(4,30,32,0.88) 0%,rgba(4,30,32,0.2) 60%,transparent 100%)', opacity:0, transition:'opacity 0.3s ease', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'clamp(10px,2vw,16px)' }}>
                  <div style={{ color:'#fff', fontFamily:'Playfair Display,serif', fontSize:'clamp(0.8rem,2vw,0.95rem)', fontWeight:600, lineHeight:1.3, marginBottom:'5px' }}>{img.label}</div>
                  <span style={{ background:'var(--gold)', color:'var(--text-dark)', padding:'2px 8px', borderRadius:'50px', fontSize:'0.68rem', fontWeight:700, alignSelf:'flex-start' }}>{img.tag}</span>
                </div>
                {/* Tag badge (always visible) */}
                <div style={{ position:'absolute', top:'clamp(6px,1.5vw,10px)', right:'clamp(6px,1.5vw,10px)', background:'rgba(4,30,32,0.7)', backdropFilter:'blur(4px)', color:'#fff', padding:'3px 8px', borderRadius:'50px', fontSize:'0.65rem', fontWeight:600 }}>{img.tag}</div>
              </div>
            ))}
          </div>

          {/* View all button */}
          <div style={{ textAlign:'center' }}>
            <button onClick={() => openLightbox(0)} style={{ padding:'12px 32px', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', border:'none', borderRadius:'50px', fontWeight:600, fontSize:'0.9rem', cursor:'pointer', boxShadow:'var(--shadow-md)', display:'inline-flex', alignItems:'center', gap:'8px' }}>
              🖼️ View All Photos in Gallery
            </button>
          </div>
        </div>
      </section>

      {/* ══ TOURS ══════════════════════════════════════════════════════════ */}
      <section id="tours" className="section" style={{ background:'var(--off-white)' }}>
        <div className="container" ref={toursRef} style={toursStyle}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <div className="section-label">What We Offer</div>
            <h2 className="section-title" style={{ marginBottom:'12px' }}>Choose Your Tour</h2>
            <p style={{ color:'var(--text-mid)', maxWidth:'500px', margin:'0 auto', fontSize:'clamp(0.86rem,2vw,0.93rem)', lineHeight:1.7 }}>From sunrise photography to deep historical exploration — every tour is a unique, memorable experience crafted for you.</p>
          </div>
          <div className="grid-auto">
            {TOURS.map((t,i)=>(
              <div key={t.title} onMouseEnter={()=>setHoveredTour(i)} onMouseLeave={()=>setHoveredTour(null)}
                style={{ background:hoveredTour===i?'linear-gradient(135deg,var(--teal),var(--teal-light))':'#fff', border:'1px solid var(--border)', borderRadius:'18px', padding:'clamp(20px,3vw,28px)', transition:'all 0.35s ease', transform:hoveredTour===i?'translateY(-7px)':'translateY(0)', boxShadow:hoveredTour===i?'var(--shadow-lg)':'var(--shadow-sm)', cursor:'pointer' }}>
                <div style={{ fontSize:'clamp(2rem,5vw,2.6rem)', marginBottom:'12px' }}>{t.icon}</div>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1rem,2.5vw,1.15rem)', color:hoveredTour===i?'#fff':'var(--text-dark)', marginBottom:'7px' }}>{t.title}</h3>
                <div style={{ display:'flex', gap:'12px', marginBottom:'10px' }}>
                  <span style={{ fontSize:'0.74rem', color:hoveredTour===i?'rgba(255,255,255,0.7)':'var(--text-light)', fontWeight:500 }}>⏱ {t.dur}</span>
                  <span style={{ fontSize:'0.76rem', color:hoveredTour===i?'var(--gold-light)':'var(--teal)', fontWeight:700 }}>₹{t.price}/person</span>
                </div>
                <p style={{ fontSize:'clamp(0.82rem,2vw,0.87rem)', color:hoveredTour===i?'rgba(255,255,255,0.85)':'var(--text-mid)', lineHeight:1.7, marginBottom:'18px' }}>{t.desc}</p>
                <Link to="/book" style={{ display:'inline-block', padding:'8px 18px', background:hoveredTour===i?'rgba(255,255,255,0.18)':'var(--teal-pale)', color:hoveredTour===i?'#fff':'var(--teal)', borderRadius:'50px', fontSize:'0.8rem', fontWeight:600, border:hoveredTour===i?'1px solid rgba(255,255,255,0.25)':'1px solid var(--border)' }}>Book This Tour →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ REVIEWS ══════════════════════════════════════════════════════ */}
      <section className="section" style={{ background:'linear-gradient(135deg,var(--teal-deep) 0%,var(--teal-dark) 100%)' }}>
        <div className="container" ref={reviewsRef} style={reviewsStyle}>
          <div style={{ textAlign:'center', marginBottom:'44px' }}>
            <div style={{ fontSize:'0.72rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--gold)', fontWeight:600, marginBottom:'10px' }}>Traveller Stories</div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.6rem,4vw,2.6rem)', color:'#fff', marginBottom:'12px' }}>What Our Guests Say</h2>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', flexWrap:'wrap', color:'rgba(255,255,255,0.65)', fontSize:'clamp(0.84rem,2vw,0.92rem)' }}>
              <span style={{ color:'var(--gold-light)', fontSize:'clamp(0.9rem,2vw,1.1rem)' }}>{'⭐'.repeat(5)}</span>
              <span><strong style={{ color:'#fff' }}>{avgRating}</strong>/5 · <strong style={{ color:'#fff' }}>{reviews.length || '200+'}</strong> verified reviews</span>
            </div>
          </div>
          {reviews.length === 0
            ? <div style={{ textAlign:'center', color:'rgba(255,255,255,0.4)', padding:'36px', fontSize:'0.9rem' }}>Loading reviews...</div>
            : (
              <div className="grid-auto">
                {reviews.slice(0,6).map((r,i)=>(
                  <div key={r.id} style={{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(10px)', border:'1px solid rgba(212,160,23,0.15)', borderRadius:'16px', padding:'clamp(18px,3vw,24px)', transition:'all 0.3s' }}
                    onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.13)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.transform=''; }}>
                    <div style={{ color:'var(--gold-light)', fontSize:'clamp(0.85rem,2vw,1rem)', marginBottom:'10px' }}>{'⭐'.repeat(r.rating)}</div>
                    <p style={{ color:'rgba(255,255,255,0.82)', fontSize:'clamp(0.82rem,2vw,0.9rem)', lineHeight:1.75, fontStyle:'italic', marginBottom:'16px' }}>"{r.comment}"</p>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-dark)', fontWeight:700, fontSize:'0.9rem', flexShrink:0 }}>{r.userName?.[0]}</div>
                      <div>
                        <div style={{ color:'#fff', fontWeight:600, fontSize:'0.86rem' }}>{r.userName}</div>
                        {r.userCountry && <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.74rem' }}>{r.userCountry}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
          <div style={{ textAlign:'center', marginTop:'32px' }}>
            <Link to="/register" style={{ display:'inline-block', padding:'12px 30px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--text-dark)', borderRadius:'50px', fontWeight:700, fontSize:'clamp(0.84rem,2vw,0.92rem)', boxShadow:'0 6px 20px rgba(212,160,23,0.35)' }}>⭐ Write a Review After Your Tour</Link>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ════════════════════════════════════════════════════ */}
      <section className="section" style={{ background:'linear-gradient(135deg,var(--gold-pale) 0%,#fff 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'280px', height:'280px', background:'linear-gradient(135deg,rgba(13,115,119,0.06),transparent)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:2, maxWidth:'560px', margin:'0 auto' }}>
          <div style={{ fontSize:'clamp(2.5rem,7vw,3.5rem)', marginBottom:'14px', animation:'float 3s ease-in-out infinite' }}>🏛️</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.6rem,4vw,2.4rem)', color:'var(--text-dark)', marginBottom:'12px' }}>Ready to Explore History?</h2>
          <p style={{ color:'var(--text-mid)', marginBottom:'28px', fontSize:'clamp(0.88rem,2vw,0.97rem)', lineHeight:1.7 }}>Register for free, book your tour, and get confirmed within 2 hours. Limited daily slots available.</p>
          <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register" style={{ padding:'clamp(12px,3vw,15px) clamp(20px,5vw,32px)', background:'linear-gradient(135deg,var(--teal),var(--teal-light))', color:'#fff', borderRadius:'50px', fontWeight:700, fontSize:'clamp(0.88rem,2vw,0.97rem)', boxShadow:'var(--shadow-md)' }}>Create Free Account →</Link>
            <Link to="/book" style={{ padding:'clamp(12px,3vw,15px) clamp(18px,4vw,26px)', background:'#fff', color:'var(--teal)', borderRadius:'50px', fontWeight:600, fontSize:'clamp(0.88rem,2vw,0.97rem)', border:'1.5px solid var(--border)' }}>Book Directly</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
