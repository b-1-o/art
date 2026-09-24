
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, ExternalLink, Menu, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { artworks, collections, courses, navItems, studioFacts, type Artwork, type ArtworkCategory } from './data'

type Path = '/' | '/works' | '/shop' | '/learn' | '/studio' | '/contact' | '/not-found'

const titles: Record<Path, string> = {
  '/': 'AER — Art Studio',
  '/works': 'Works — AER',
  '/shop': 'Shop — AER',
  '/learn': 'Learn — AER',
  '/studio': 'Studio — AER',
  '/contact': 'Contact — AER',
  '/not-found': 'Not Found — AER',
}

function hashPath() {
  return window.location.hash.replace(/^#/, '') || '/'
}

function go(path: string) {
  window.location.hash = path === '/' ? '#/' : '#' + path
}

export default function App() {
  const [location, setLocation] = useState(hashPath())
  const [menu, setMenu] = useState(false)
  const [bagOpen, setBagOpen] = useState(false)
  const [bag, setBag] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('aer-bag') || '[]') } catch { return [] }
  })
  const [toast, setToast] = useState('')

  useEffect(() => {
    const onHash = () => {
      setLocation(hashPath())
      setMenu(false)
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    localStorage.setItem('aer-bag', JSON.stringify(bag))
  }, [bag])

  useEffect(() => {
    const base = location.indexOf('/works/') === 0 ? 'Work — AER' : (titles[location as Path] || 'AER — Art Studio')
    document.title = base
  }, [location])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const add = (artwork: Artwork) => {
    setBag((items) => items.concat(artwork.id))
    setBagOpen(true)
    setToast(artwork.title + ' added to inquiry bag')
  }

  const remove = (id: string) => {
    setBag((items) => {
      const index = items.indexOf(id)
      return index < 0 ? items : items.slice(0, index).concat(items.slice(index + 1))
    })
  }

  const detailId = location.indexOf('/works/') === 0 ? decodeURIComponent(location.slice('/works/'.length)) : ''
  const detail = detailId ? artworks.find((item) => item.id === detailId) : undefined
  const path: Path = detailId ? '/works' : location as Path
  const contentPath = path === '/works' && detailId ? '/works' : path

  const body = detail
    ? <WorkDetail artwork={detail} onBack={() => go('/works')} add={add} />
    : contentPath === '/' ? <Home onNavigate={go} />
    : contentPath === '/works' ? <Works onNavigate={go} />
    : contentPath === '/shop' ? <Shop onNavigate={go} add={add} />
    : contentPath === '/learn' ? <Learn onNavigate={go} />
    : contentPath === '/studio' ? <Studio onNavigate={go} />
    : contentPath === '/contact' ? <Contact onNavigate={go} />
    : <NotFound onNavigate={go} />

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="noise" aria-hidden="true" />
      <Header path={path} bagCount={bag.length} menu={menu} setMenu={setMenu} onBag={() => setBagOpen(true)} />
      <main id="main-content">
        <div key={location} className="page page-static">
          {body}
        </div>
      </main>
      <Footer />
      {bagOpen && <BagDrawer bag={bag} onClose={() => setBagOpen(false)} onRemove={remove} onCheckout={() => { setBagOpen(false); go('/contact'); setToast('Inquiry bag ready — complete the form below.') }} />}
      {toast && <div className="toast">{toast}<Check size={14} /></div>}
    </div>
  )
}

function Header({ path, bagCount, menu, setMenu, onBag }: { path: Path; bagCount: number; menu: boolean; setMenu: (v: boolean) => void; onBag: () => void }) {
  return (
    <>
      <header className="site-header">
        <button className="brand" onClick={() => go('/')} aria-label="AER home"><span className="brand-symbol">A</span><span><b>AER</b><small>ART STUDIO</small></span></button>
        <nav className="desktop-nav">{navItems.map(([href, label]) => <button key={href} className={path === href ? 'active' : ''} onClick={() => go(href)}>{label}</button>)}</nav>
        <div className="header-actions">
          <button className="catalog-trigger" onClick={() => go('/works')}>Catalog <ArrowUpRight size={13} /></button>
          <button className="bag-trigger" onClick={onBag}><ShoppingBag size={15} /> Bag {bagCount > 0 && <i>{bagCount}</i>}</button>
          <button className="menu-trigger" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </header>
      {menu && <div className="mobile-menu"><div><p>MENU / 06</p>{navItems.map(([href, label], i) => <button key={href} onClick={() => go(href)}><span>0{i + 1}</span><b>{label}</b><ArrowUpRight size={16} /></button>)}</div></div>}
    </>
  )
}

function Intro({ eyebrow, title, body }: { eyebrow: string; title: ReactNode; body: string }) {
  return <section className="page-intro"><p>{eyebrow}</p><h1>{title}</h1><div className="intro-body">{body}</div></section>
}

function Image({ artwork, className = '', priority = false }: { artwork: Artwork; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false)
  const style = { '--art-accent': artwork.accent } as CSSProperties
  return <div className={'art-image ' + className} style={style}>{failed ? <div className="image-fallback"><span>{artwork.title.charAt(0)}</span><small>IMAGE PREVIEW</small></div> : <img src={artwork.image} alt={artwork.title} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" sizes={priority ? '100vw' : '(max-width: 640px) 92vw, (max-width: 980px) 46vw, 30vw'} width={1600} height={1200} onError={() => setFailed(true)} />}<small className="image-credit"><a href={artwork.creditUrl} target="_blank" rel="noreferrer">{artwork.credit}</a></small></div>
}

function Card({ artwork, compact = false }: { artwork: Artwork; compact?: boolean }) {
  const price = artwork.status === 'Sold' ? 'MUSEUM / ARCHIVE' : artwork.status === 'Edition' ? 'LIMITED EDITION' : 'PRIVATE VIEWING'
  return <article className={'art-card ' + (compact ? 'compact' : '')}>
    <button className="art-card-image" onClick={() => go('/works/' + artwork.id)}><Image artwork={artwork} /><span className="card-index">{artwork.number}</span><span className="card-arrow"><ArrowUpRight size={16} /></span></button>
    <div className="art-card-meta"><div><p>{artwork.category} / {artwork.year}</p><h3>{artwork.title}</h3><span>{artwork.subtitle}</span></div><strong>{price}</strong></div>
  </article>
}

function ShowroomHero({ onNavigate }: { onNavigate: (p: string) => void }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const dragOrigin = useRef({ x: 0, y: 0 })
  const [activeIndex, setActiveIndex] = useState(0)

  const showcase = [0, 3, 6, 10].map((index) => artworks[index])
  const active = showcase[activeIndex]
  const left = showcase[(activeIndex + 1) % showcase.length]
  const right = showcase[(activeIndex + 2) % showcase.length]
  const depth = showcase[(activeIndex + 3) % showcase.length]

  useEffect(() => {
    const el = sceneRef.current
    if (!el) return

    const update = () => {
      frameRef.current = null
      current.current.x += (target.current.x - current.current.x) * 0.14
      current.current.y += (target.current.y - current.current.y) * 0.14
      el.style.setProperty('--tilt-x', current.current.x.toFixed(2) + 'deg')
      el.style.setProperty('--tilt-y', current.current.y.toFixed(2) + 'deg')

      if (Math.abs(target.current.x - current.current.x) > 0.02 || Math.abs(target.current.y - current.current.y) > 0.02) {
        frameRef.current = requestAnimationFrame(update)
      }
    }

    const requestUpdate = () => {
      if (frameRef.current === null) frameRef.current = requestAnimationFrame(update)
    }

    const onMove = (event: PointerEvent) => {
      if (dragging.current) {
        const dx = (event.clientX - dragStart.current.x) * 0.055
        const dy = (event.clientY - dragStart.current.y) * 0.055
        target.current = {
          x: Math.max(-12, Math.min(12, dragOrigin.current.x - dy)),
          y: Math.max(-14, Math.min(14, dragOrigin.current.y + dx)),
        }
      } else if (!window.matchMedia('(pointer: coarse)').matches) {
        const rect = el.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        target.current = { x: y * -7, y: x * 9 }
      }
      requestUpdate()
    }

    const onDown = (event: PointerEvent) => {
      const targetElement = event.target as HTMLElement
      if (targetElement.closest('button')) return
      dragging.current = true
      dragStart.current = { x: event.clientX, y: event.clientY }
      dragOrigin.current = { ...target.current }
      el.setPointerCapture(event.pointerId)
      el.classList.add('is-dragging')
      requestUpdate()
    }

    const onUp = (event: PointerEvent) => {
      dragging.current = false
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
      el.classList.remove('is-dragging')
      target.current = { x: 0, y: 0 }
      requestUpdate()
    }

    const onLeave = () => {
      if (dragging.current) return
      target.current = { x: 0, y: 0 }
      requestUpdate()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('pointerleave', onLeave)

    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('pointerleave', onLeave)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const openActive = () => onNavigate('/works/' + active.id)

  return (
    <section className="showroom-hero">
      <div ref={sceneRef} className="showroom-scene">
        <div className="showroom-copy">
          <p className="hero-kicker">AER / PRIVATE DIGITAL SHOWROOM</p>
          <div className="showroom-index">{String(activeIndex + 1).padStart(2, '0')} <span>/ 04</span></div>
          <h1>Art,<br /><em>with depth.</em></h1>
          <p className="showroom-description">An interactive luxury room: move the scene, drag the perspective, select a work, then open its full record.</p>
          <div className="showroom-actions">
            <button className="dark-button" onClick={() => onNavigate('/shop')}>Enter the vault <ArrowRight size={15} /></button>
            <button className="showroom-link" onClick={() => onNavigate('/works')}>Browse archive <ArrowUpRight size={15} /></button>
          </div>
        </div>

        <div
          className="showroom-stage"
          aria-label="Interactive 3D artwork showroom"
          onWheel={(event) => {
            if (window.matchMedia('(pointer: coarse)').matches) return
            event.preventDefault()
            if (Math.abs(event.deltaY) < 8) return
            const direction = event.deltaY > 0 ? 1 : -1
            setActiveIndex((currentIndex) => (currentIndex + direction + showcase.length) % showcase.length)
          }}
        >
          <div className="showroom-floor" />
          <div className="showroom-orbit orbit-a" />
          <div className="showroom-orbit orbit-b" />

          <button key={depth.id} type="button" className="art-plane plane-depth showroom-interactive" onClick={() => setActiveIndex((activeIndex + 3) % showcase.length)} aria-label={'Bring ' + depth.title + ' forward'}>
            <img src={depth.image} alt="" loading="lazy" decoding="async" />
          </button>
          <button key={left.id} type="button" className="art-plane plane-left showroom-interactive" onClick={() => setActiveIndex((activeIndex + 1) % showcase.length)} aria-label={'Bring ' + left.title + ' forward'}>
            <img src={left.image} alt="" loading="lazy" decoding="async" />
          </button>
          <button key={right.id} type="button" className="art-plane plane-right showroom-interactive" onClick={() => setActiveIndex((activeIndex + 2) % showcase.length)} aria-label={'Bring ' + right.title + ' forward'}>
            <img src={right.image} alt="" loading="lazy" decoding="async" />
          </button>
          <button key={active.id} type="button" className="art-plane plane-main showroom-interactive" onClick={openActive} aria-label={'Open ' + active.title}>
            <img src={active.image} alt={active.title} fetchPriority="high" decoding="async" />
            <span className="plane-label">AER / {active.number}</span>
            <span className="plane-title">{active.title}<small>{active.subtitle}</small></span>
          </button>
          <div className="showroom-reflection" />

          <div className="showroom-controls">
            <button type="button" onClick={() => setActiveIndex((activeIndex + showcase.length - 1) % showcase.length)} aria-label="Previous artwork"><ArrowLeft size={15} /></button>
            <span>WHEEL / DRAG</span>
            <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % showcase.length)} aria-label="Next artwork"><ArrowRight size={15} /></button>
          </div>
          <button type="button" className="showroom-reset" onClick={() => {
            target.current = { x: 0, y: 0 }
            setActiveIndex(0)
          }}>RESET VIEW</button>
        </div>

        <div className="showroom-bottom">
          <span>WHEEL / DRAG TO ROTATE · CLICK AN ARTWORK TO CENTER IT · CLICK CENTER TO OPEN</span>
          <span>12 WORKS / 08 ARTISTS / PRIVATE ARCHIVE</span>
        </div>
      </div>
    </section>
  )
}
function Home({ onNavigate }: { onNavigate: (p: string) => void }) {
  return <>
    <ShowroomHero onNavigate={onNavigate} />

    <section className="section manifesto">
      <div className="eyebrow-row"><span>THE CONCEPT</span><span>01 / 04</span></div>
      <div className="manifesto-grid">
        <h2>Not a catalogue.<br /><em>A digital object.</em></h2>
        <div>
          <p>The interface treats every artwork like a collectible product: controlled perspective, physical scale, material contrast and deliberate motion.</p>
          <button className="text-button" onClick={() => onNavigate('/studio')}>See the studio system <ArrowUpRight size={15} /></button>
        </div>
      </div>
    </section>

    <section className="section featured showroom-featured">
      <div className="section-heading">
        <div><p className="eyebrow">SELECTED ABSTRACTIONS</p><h2>Objects for the<br /><em>digital room.</em></h2></div>
        <button className="outline-button" onClick={() => onNavigate('/works')}>View archive <ArrowRight size={15} /></button>
      </div>
      <div className="featured-grid">{artworks.slice(0, 6).map((a, i) => <Card key={a.id} artwork={a} compact={i % 2 === 1} />)}</div>
    </section>

    <section className="collection-band showroom-band">
      <div className="band-index">02 / 04</div>
      <div><p className="eyebrow">PRIVATE EDITIONS</p><h2>THE<br /><em>VAULT.</em></h2></div>
      <div>
        <p>Archival prints, museum-grade studies and digital presentation experiments — built as a complete commerce experience.</p>
        <button className="light-button" onClick={() => onNavigate('/shop')}>Open the vault <ArrowUpRight size={15} /></button>
      </div>
    </section>

    <section className="section education-cta">
      <div>
        <p className="eyebrow">ENGINEERING NOTE</p>
        <h2>Every layer<br /><em>has a reason.</em></h2>
        <p>Responsive 3D transforms, low-cost pointer tracking, lazy image loading and CSS-driven motion keep the experience expressive without turning the page into a GPU benchmark.</p>
        <button className="text-button dark" onClick={() => onNavigate('/studio')}>Read the system <ArrowUpRight size={15} /></button>
      </div>
      <div className="education-orbit showroom-orbit-static"><span>DEPTH</span><span>MOTION</span><span>TYPE</span><span>RENDER</span></div>
    </section>
  </>
}
function Works({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [category, setCategory] = useState<'All' | ArtworkCategory>('All')
  const [sort, setSort] = useState<'Featured' | 'Newest' | 'Price'>('Featured')
  const items = useMemo(() => {
    const list = artworks.filter((a) => category === 'All' || a.category === category)
    if (sort === 'Newest') return list.slice().sort((a, b) => b.year - a.year)
    if (sort === 'Price') return list.slice().sort((a, b) => a.price - b.price)
    return list.slice().sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  }, [category, sort])
  return <div className="page-wrap"><Intro eyebrow="01 / WORKS" title={<>A living catalogue<br /><em>of the studio.</em></>} body="Paintings selected for material presence, composition, light and enduring visual character." />
    <section className="section-tight catalogue">
      <div className="catalogue-headline">
        <div><span>ARCHIVE / 12 WORKS</span><strong>CATALOGUE</strong></div>
        <p>Original public-domain references presented as a fictional museum-edition commerce interface.</p>
      </div>
      <div className="catalogue-toolbar"><div className="filter-row">{(['All', 'Painting'] as const).map((item) => <button className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="sort-select"><span>Sort</span><select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option>Featured</option><option>Newest</option><option>Price</option></select><ChevronDown size={14} /></label></div><div className="catalogue-grid">{items.map((a, i) => <Card key={a.id} artwork={a} compact={i % 3 === 1} />)}</div><div className="collection-list"><div className="eyebrow-row"><span>COLLECTIONS</span><span>03 / 03</span></div>{collections.map((c, i) => <div className="collection-row" key={c.title}><span>0{i + 1}</span><h3>{c.title}</h3><p>{c.description}</p><b>{c.count}</b><ArrowUpRight size={18} /></div>)}</div></section>
  </div>
}

function WorkDetail({ artwork, onBack, add }: { artwork: Artwork; onBack: () => void; add: (a: Artwork) => void }) {
  const related = artworks.filter((a) => a.id !== artwork.id && a.category === artwork.category).slice(0, 2)
  return <div className="page-wrap detail-page"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to works</button><section className="detail-hero"><Image artwork={artwork} priority /><div className="detail-sidebar"><p className="eyebrow">{artwork.number} / {artwork.category}</p><h1>{artwork.title}</h1><p className="detail-subtitle">{artwork.subtitle}</p><div className="detail-divider" /><dl className="specs"><div><dt>Year</dt><dd>{artwork.year}</dd></div><div><dt>Medium</dt><dd>{artwork.medium}</dd></div><div><dt>Size</dt><dd>{artwork.dimensions}</dd></div><div><dt>Status</dt><dd>{artwork.status}</dd></div></dl><p className="detail-description">{artwork.description}</p><div className="detail-purchase"><div><small>Collection record</small><strong>PUBLIC DOMAIN / ARCHIVE</strong></div>{artwork.status !== 'Sold' && <button className="dark-button" onClick={() => go('/contact')}>Private viewing <ArrowUpRight size={15} /></button>}</div></div></section><section className="section-tight detail-notes"><div><p className="eyebrow">THE NOTE</p><h2>“The piece should feel like a room you remember without knowing why.”</h2></div><div><p>Works are shipped with a signed studio certificate and catalogue entry. Framing and international shipping are quoted separately.</p><button className="text-button" onClick={() => go('/contact')}>Ask about this work <ArrowUpRight size={15} /></button></div></section>{related.length > 0 && <section className="section related"><div className="section-heading"><div><p className="eyebrow">CONTINUE LOOKING</p><h2>More from <em>this series.</em></h2></div></div><div className="featured-grid">{related.map((a) => <Card key={a.id} artwork={a} compact />)}</div></section>}</div>
}

function Shop({ onNavigate, add }: { onNavigate: (p: string) => void; add: (a: Artwork) => void }) {
  const items = artworks.slice(0, 9)
  return <div className="page-wrap shop-page">
    <Intro eyebrow="02 / VAULT" title={<>Editions.<br /><em>Built to be touched.</em></>} body="A fictional luxury archive shop for this portfolio experience — each work is presented as a numbered museum edition rather than a claimed original." />
    <section className="section-tight vault-grid">
      {items.map((a, i) => <article className="vault-card" key={a.id} style={{ '--vault-index': i } as CSSProperties}>
        <button className="vault-art" onClick={() => onNavigate('/works/' + a.id)}>
          <div className="vault-ring" />
          <img src={a.image} alt={a.title} loading="lazy" decoding="async" />
          <span className="vault-number">0{i + 1}</span>
          <span className="vault-open"><ArrowUpRight size={15} /></span>
        </button>
        <div className="vault-info">
          <div><p>{a.subtitle}</p><h3>{a.title}</h3><span>{a.year} / {a.medium}</span></div>
          <div className="vault-buy">
            <strong>${a.price.toLocaleString()}</strong>
            <button className="dark-button small-dark" onClick={() => add(a)}>Add edition <Plus size={13} /></button>
          </div>
        </div>
      </article>)}
    </section>
    <section className="section shipping-note">
      <div><p className="eyebrow">COMMERCE SYSTEM</p><h2>Physical feel.<br /><em>Digital speed.</em></h2></div>
      <div className="shipping-grid">
        {[
          ['01', 'Select', 'Inspect the artwork, move through depth and open the full record.'],
          ['02', 'Reserve', 'Add an edition to the inquiry tray without interrupting the showroom.'],
          ['03', 'Confirm', 'Review the selected works and prepare a private request.'],
        ].map(([n, t, d]) => <div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}
      </div>
    </section>
  </div>
}
function Learn({ onNavigate }: { onNavigate: (p: string) => void }) {
  return <div className="page-wrap"><Intro eyebrow="03 / LEARN" title={<>Practice before<br /><em>perfection.</em></>} body="Education is built around observation, process and repetition — not a single correct style." /><section className="section-tight learn-intro"><div><p className="eyebrow">THE METHOD</p><h2>Look longer.<br />Edit less.<br /><em>Make more.</em></h2></div><div className="learn-method-list">{['References become vocabulary.', 'Color becomes structure.', 'Process becomes evidence.', 'Critique becomes direction.'].map((item, i) => <div key={item}><span>0{i + 1}</span><p>{item}</p><ArrowUpRight size={15} /></div>)}</div></section><section className="section course-list"><div className="section-heading"><div><p className="eyebrow">COURSES &amp; MENTORSHIP</p><h2>Choose your <em>scale.</em></h2></div></div>{courses.map((course) => <article className="course-row" key={course.id}><div className="course-index">{course.id.slice(0, 2).toUpperCase()}</div><div className="course-main"><p>{course.eyebrow} / {course.duration}</p><h3>{course.title}</h3><span>{course.description}</span></div><strong>{String.fromCharCode(36)}{course.price}</strong><button className="outline-button" onClick={() => onNavigate('/contact')}>Ask about it <ArrowUpRight size={15} /></button></article>)}</section><section className="section learn-faq"><div className="eyebrow-row"><span>COMMON QUESTIONS</span><span>04 / 04</span></div><Faq q="Do I need formal art training?" a="No. The workshops are built around observation, practice and a willingness to make work. Previous study can help, but it is not required." /><Faq q="Are the sessions online?" a="Yes. The current programme is remote-first and uses image reviews, reference boards and live studio conversation." /><Faq q="Can I bring an existing project?" a="Absolutely. The one-to-one session is designed around a specific body of work, portfolio question or creative block." /></section></div>
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return <div className={'faq ' + (open ? 'open' : '')}><button onClick={() => setOpen(!open)} aria-expanded={open}><span>{q}</span>{open ? <Minus size={17} /> : <Plus size={17} />}</button>{open && <div className="faq-answer"><p>{a}</p></div>}</div>
}

function Studio({ onNavigate }: { onNavigate: (p: string) => void }) {
  return <div className="page-wrap"><Intro eyebrow="04 / STUDIO" title={<>A practice built<br /><em>around attention.</em></>} body="The AER studio is a fictional contemporary practice for this portfolio project — designed as a complete artist identity, catalogue and commercial experience." /><section className="section-tight studio-feature"><div className="studio-image"><Image artwork={artworks[4]} priority /></div><div className="studio-copy"><p className="eyebrow">STATEMENT</p><h2>Nothing is finished until the eye knows where to rest.</h2><p>The studio moves between painting, paper and object-making. Each medium asks for a different pace: painting can accumulate; paper can stay provisional; objects can interrupt the room.</p><p>The visual language is intentionally restrained so the work can remain the loudest thing on the page.</p><button className="dark-button" onClick={() => onNavigate('/contact')}>Commission a work <ArrowUpRight size={15} /></button></div></section><section className="section facts-grid">{studioFacts.map(([n, t]) => <div key={t}><strong>{n}</strong><span>{t}</span></div>)}</section><section className="section process"><div className="section-heading"><div><p className="eyebrow">PROCESS</p><h2>From first <em>gesture.</em></h2></div></div>{[['01', 'Gather', 'References, fragments, places and accidents become the first layer.'], ['02', 'Reduce', 'The work is edited until the unnecessary parts stop competing for attention.'], ['03', 'Hold', 'The final surface stays open enough for the viewer to enter it.']].map(([n, t, d]) => <div className="process-row" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><ArrowUpRight size={17} /></div>)}</section></div>
}

function Contact({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true) }
  return <div className="page-wrap"><Intro eyebrow="05 / CONTACT" title={<>Start a conversation<br /><em>with the studio.</em></>} body="For acquisitions, commissions, collaborations and learning sessions." /><section className="section-tight contact-grid"><div className="contact-copy"><p className="eyebrow">DIRECT</p><a href="mailto:studio@aer.art" className="contact-email">studio@aer.art <ArrowUpRight size={18} /></a><div className="contact-detail"><span>STUDIO HOURS</span><p>Tuesday — Friday<br />10:00 — 17:00 PT</p></div><div className="contact-detail"><span>SOCIAL</span><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></div><button className="text-button" onClick={() => onNavigate('/shop')}>See available works <ArrowUpRight size={15} /></button></div><form className="contact-form" onSubmit={submit}><label><span>Your name</span><input required name="name" placeholder="Jane Doe" /></label><label><span>Email</span><input required type="email" name="email" placeholder="you@example.com" /></label><label><span>I’m writing about</span><select defaultValue="acquisition"><option value="acquisition">Acquiring a work</option><option value="commission">A commission</option><option value="learning">A learning session</option><option value="collaboration">A collaboration</option></select></label><label><span>Message</span><textarea required name="message" rows={7} placeholder="Tell the studio a little about what you’re looking for..." /></label><button className="dark-button" type="submit">{sent ? <>Message prepared <Check size={15} /></> : <>Prepare inquiry <Plus size={15} /></>}</button>{sent && <p className="form-success">Showcase form complete. Connect this handler to Formspree, Resend or your preferred backend for production.</p>}</form></section></div>
}

function BagDrawer({ bag, onClose, onRemove, onCheckout }: { bag: string[]; onClose: () => void; onRemove: (id: string) => void; onCheckout: () => void }) {
  const items = bag.map((id, index) => { const item = artworks.find((a) => a.id === id); return item ? { item, key: item.id + '-' + index } : null }).filter(Boolean) as { item: Artwork; key: string }[]
  const total = items.reduce((sum, entry) => sum + entry.item.price, 0)
  return <div className="drawer-backdrop" onClick={onClose}><aside className="bag-drawer" onClick={(e) => e.stopPropagation()}><header><div><p className="eyebrow">SELECTED WORKS / BAG</p><h2>{items.length} {items.length === 1 ? 'work' : 'works'}</h2></div><button onClick={onClose}><X size={19} /></button></header><div className="bag-items">{items.length === 0 && <div className="empty-cart"><ShoppingBag size={22} /><p>Your bag is empty.</p><span>Add a work from the catalogue to start an inquiry.</span></div>}{items.map((entry) => <div className="bag-item" key={entry.key}><div className="bag-thumb"><Image artwork={entry.item} /></div><div><p>{entry.item.category}</p><h3>{entry.item.title}</h3><strong>{String.fromCharCode(36)}{entry.item.price.toLocaleString()}</strong></div><button onClick={() => onRemove(entry.item.id)}><X size={14} /></button></div>)}</div><footer><div><span>Estimated value</span><strong>{items.length ? '$' + total.toLocaleString() : '$0'}</strong></div><button className="dark-button full-width" disabled={!items.length} onClick={onCheckout}>Continue to inquiry <ArrowRight size={15} /></button><small>No payment is taken here. The studio confirms availability, shipping and framing first.</small></footer></aside></div>
}

function NotFound({ onNavigate }: { onNavigate: (p: string) => void }) { return <div className="page-wrap not-found"><span>404</span><h1>This room<br /><em>doesn’t exist.</em></h1><button className="dark-button" onClick={() => onNavigate('/')}>Return to index <ArrowLeft size={15} /></button></div> }

function Footer() {
  return <footer className="site-footer"><div><span className="footer-mark">AER</span><p>Contemporary art studio / portfolio experience.</p></div><div className="footer-links"><div><span>EXPLORE</span><button onClick={() => go('/works')}>Works</button><button onClick={() => go('/works')}>Collection</button><button onClick={() => go('/studio')}>Studio</button></div><div><span>CONNECT</span><button onClick={() => go('/contact')}>Contact</button><a href="https://github.com/b-1-o/art" target="_blank" rel="noreferrer">Source <ExternalLink size={12} /></a></div></div><div className="footer-bottom"><span>REACT / TYPESCRIPT</span><span>PUBLIC-DOMAIN IMAGE ARCHIVE</span><span>© 2026 AER</span></div></footer>
}
