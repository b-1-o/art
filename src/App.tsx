
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
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
          <button className="bag-trigger" onClick={onBag}><ShoppingBag size={15} /> Inquiry {bagCount > 0 && <i>{bagCount}</i>}</button>
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
  return <div className={'art-image ' + className} style={style}>{failed ? <div className="image-fallback"><span>{artwork.title.charAt(0)}</span><small>IMAGE PREVIEW</small></div> : <img src={artwork.image + (artwork.image.includes('?') ? '&' : '?') + 'width=' + (priority ? 1280 : 960)} alt={artwork.title} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" sizes={priority ? '100vw' : '(max-width: 640px) 92vw, (max-width: 980px) 46vw, 30vw'} width={1600} height={1200} onError={() => setFailed(true)} />}<small className="image-credit"><a href={artwork.creditUrl} target="_blank" rel="noreferrer">{artwork.credit}</a></small></div>
}

function Card({ artwork, compact = false }: { artwork: Artwork; compact?: boolean }) {
  const price = artwork.status === 'Sold' ? 'MUSEUM / ARCHIVE' : artwork.status === 'Edition' ? 'LIMITED EDITION' : 'PRIVATE VIEWING'
  return <article className={'art-card ' + (compact ? 'compact' : '')}>
    <button className="art-card-image" onClick={() => go('/works/' + artwork.id)}><Image artwork={artwork} /><span className="card-index">{artwork.number}</span><span className="card-arrow"><ArrowUpRight size={16} /></span></button>
    <div className="art-card-meta"><div><p>{artwork.category} / {artwork.year}</p><h3>{artwork.title}</h3><span>{artwork.subtitle}</span></div><strong>{price}</strong></div>
  </article>
}

function Home({ onNavigate }: { onNavigate: (p: string) => void }) {
  return <>
    <section className="hero"><Image artwork={artworks[7]} priority /><div className="hero-scrim" /><div className="hero-grid"><div className="hero-kicker">AER / PRIVATE ART SALON</div><div className="hero-title"><p>THE IMAGE LIVES<br /><em>BEYOND THE MOMENT.</em></p><h1>Seen slowly.<br />Held <em>closely.</em></h1></div><div className="hero-note"><span>01—06</span><p>A private digital salon for paintings chosen for light, material, composition and lasting visual presence.</p></div><button className="hero-scroll" onClick={() => onNavigate('/works')}>ENTER THE WORK <ArrowDown /></button></div><div className="hero-bottom"><span>PRIVATE SALON / 2026</span><span>SCROLL TO EXPLORE <i /></span></div></section>

    <section className="section manifesto"><div className="eyebrow-row"><span>THE STUDIO NOTE</span><span>01 / 06</span></div><div className="manifesto-grid"><h2>Form can be silent<br /><em>and still command the room.</em></h2><div><p>Geometric studies, colour fields and symbolic forms from the early language of abstraction.</p><button className="text-button" onClick={() => onNavigate('/studio')}>Inside the studio <ArrowUpRight size={15} /></button></div></div></section>

    <section className="section featured"><div className="section-heading"><div><p className="eyebrow">SELECTED ABSTRACTIONS</p><h2>Selected <em>abstractions.</em></h2></div><button className="outline-button" onClick={() => onNavigate('/works')}>View catalogue <ArrowRight size={15} /></button></div><div className="featured-grid">{artworks.filter((a) => a.featured).map((a) => <Card key={a.id} artwork={a} />)}</div></section>

    <section className="collection-band"><div className="band-index">02 / 03</div><div><p className="eyebrow">PRIVATE COLLECTION</p><h2>BLACK<br /><em>GALLERY.</em></h2></div><div><p>A curated room of paintings, reduced to light, surface, scale and silence — presented without visual noise.</p><button className="light-button" onClick={() => onNavigate('/works')}>Enter collection <ArrowUpRight size={15} /></button></div></section>

    <section className="section education-cta"><div><p className="eyebrow">ART JOURNAL</p><h2>Look closer.<br /><em>Read the image.</em></h2><p>Notes on artists, materials, composition and the visual language behind the collection.</p><button className="text-button dark" onClick={() => onNavigate('/learn')}>Explore learning <ArrowUpRight size={15} /></button></div><div className="education-orbit"><span>PROCESS</span><span>COLOR</span><span>FORM</span><span>ATTENTION</span></div></section>
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
    <section className="section-tight catalogue"><div className="catalogue-toolbar"><div className="filter-row">{(['All', 'Painting'] as const).map((item) => <button className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="sort-select"><span>Sort</span><select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option>Featured</option><option>Newest</option><option>Price</option></select><ChevronDown size={14} /></label></div><div className="catalogue-grid">{items.map((a, i) => <Card key={a.id} artwork={a} compact={i % 3 === 1} />)}</div><div className="collection-list"><div className="eyebrow-row"><span>COLLECTIONS</span><span>03 / 03</span></div>{collections.map((c, i) => <div className="collection-row" key={c.title}><span>0{i + 1}</span><h3>{c.title}</h3><p>{c.description}</p><b>{c.count}</b><ArrowUpRight size={18} /></div>)}</div></section>
  </div>
}

function WorkDetail({ artwork, onBack, add }: { artwork: Artwork; onBack: () => void; add: (a: Artwork) => void }) {
  const related = artworks.filter((a) => a.id !== artwork.id && a.category === artwork.category).slice(0, 2)
  return <div className="page-wrap detail-page"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to works</button><section className="detail-hero"><Image artwork={artwork} priority /><div className="detail-sidebar"><p className="eyebrow">{artwork.number} / {artwork.category}</p><h1>{artwork.title}</h1><p className="detail-subtitle">{artwork.subtitle}</p><div className="detail-divider" /><dl className="specs"><div><dt>Year</dt><dd>{artwork.year}</dd></div><div><dt>Medium</dt><dd>{artwork.medium}</dd></div><div><dt>Size</dt><dd>{artwork.dimensions}</dd></div><div><dt>Status</dt><dd>{artwork.status}</dd></div></dl><p className="detail-description">{artwork.description}</p><div className="detail-purchase"><div><small>Collection record</small><strong>PUBLIC DOMAIN / ARCHIVE</strong></div>{artwork.status !== 'Sold' && <button className="dark-button" onClick={() => go('/contact')}>Private viewing <ArrowUpRight size={15} /></button>}</div></div></section><section className="section-tight detail-notes"><div><p className="eyebrow">THE NOTE</p><h2>“The piece should feel like a room you remember without knowing why.”</h2></div><div><p>Works are shipped with a signed studio certificate and catalogue entry. Framing and international shipping are quoted separately.</p><button className="text-button" onClick={() => go('/contact')}>Ask about this work <ArrowUpRight size={15} /></button></div></section>{related.length > 0 && <section className="section related"><div className="section-heading"><div><p className="eyebrow">CONTINUE LOOKING</p><h2>More from <em>this series.</em></h2></div></div><div className="featured-grid">{related.map((a) => <Card key={a.id} artwork={a} compact />)}</div></section>}</div>
}

function Shop({ onNavigate, add }: { onNavigate: (p: string) => void; add: (a: Artwork) => void }) {
  const items = artworks.filter((a) => a.status !== 'Sold')
  return <div className="page-wrap"><Intro eyebrow="02 / SHOP" title={<>Originals.<br /><em>Limited editions.</em></>} body="A small release of studio works. Acquisition begins with an inquiry so every piece can be packed, framed and shipped correctly." /><section className="section-tight shop-grid">{items.map((a) => <article className="shop-card" key={a.id}><Image artwork={a} /><div className="shop-card-body"><div><p>{a.category} / {a.year}</p><h3>{a.title}</h3><span>{a.medium}</span></div><div className="shop-card-bottom"><strong>{a.status === 'Edition' ? 'From $' : '$'}{a.price.toLocaleString()}</strong><div><button className="small-button" onClick={() => onNavigate('/works/' + a.id)}>Details</button><button className="dark-button small-dark" onClick={() => add(a)}>Add <Plus size={14} /></button></div></div></div></article>)}</section><section className="section shipping-note"><div><p className="eyebrow">STUDIO COMMERCE</p><h2>Human-first,<br /><em>not checkout-first.</em></h2></div><div className="shipping-grid">{[['01', 'Inquiry', 'Tell the studio which work you’re interested in and where it needs to go.'], ['02', 'Confirmation', 'You’ll receive availability, shipping and framing details before any payment.'], ['03', 'Delivery', 'Every original is packed individually and leaves with its studio documentation.']].map(([n, t, d]) => <div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section></div>
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
  return <div className="drawer-backdrop" onClick={onClose}><aside className="bag-drawer" onClick={(e) => e.stopPropagation()}><header><div><p className="eyebrow">INQUIRY BAG</p><h2>{items.length} {items.length === 1 ? 'work' : 'works'}</h2></div><button onClick={onClose}><X size={19} /></button></header><div className="bag-items">{items.length === 0 && <div className="empty-cart"><ShoppingBag size={22} /><p>Your bag is empty.</p><span>Add a work from the catalogue to start an inquiry.</span></div>}{items.map((entry) => <div className="bag-item" key={entry.key}><div className="bag-thumb"><Image artwork={entry.item} /></div><div><p>{entry.item.category}</p><h3>{entry.item.title}</h3><strong>{String.fromCharCode(36)}{entry.item.price.toLocaleString()}</strong></div><button onClick={() => onRemove(entry.item.id)}><X size={14} /></button></div>)}</div><footer><div><span>Estimated value</span><strong>{items.length ? '$' + total.toLocaleString() : '$0'}</strong></div><button className="dark-button full-width" disabled={!items.length} onClick={onCheckout}>Continue to inquiry <ArrowRight size={15} /></button><small>No payment is taken here. The studio confirms availability, shipping and framing first.</small></footer></aside></div>
}

function NotFound({ onNavigate }: { onNavigate: (p: string) => void }) { return <div className="page-wrap not-found"><span>404</span><h1>This room<br /><em>doesn’t exist.</em></h1><button className="dark-button" onClick={() => onNavigate('/')}>Return to index <ArrowLeft size={15} /></button></div> }

function Footer() {
  return <footer className="site-footer"><div><span className="footer-mark">AER</span><p>Contemporary art studio / portfolio experience.</p></div><div className="footer-links"><div><span>EXPLORE</span><button onClick={() => go('/works')}>Works</button><button onClick={() => go('/shop')}>Shop</button><button onClick={() => go('/studio')}>Studio</button></div><div><span>CONNECT</span><button onClick={() => go('/contact')}>Contact</button><a href="https://github.com/b-1-o/art" target="_blank" rel="noreferrer">Source <ExternalLink size={12} /></a></div></div><div className="footer-bottom"><span>REACT / TYPESCRIPT</span><span>PUBLIC-DOMAIN IMAGE ARCHIVE</span><span>© 2026 AER</span></div></footer>
}
