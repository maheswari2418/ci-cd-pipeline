import './App.css'
import logo from './assets/logo.png'
import heroBanner from './assets/hero-banner.png'
import product1 from './assets/product1.png'
import product2 from './assets/product2.png'
import product3 from './assets/product3.png'
import product4 from './assets/product4.png'
import testimonial1 from './assets/testimonial1.png'
import testimonial2 from './assets/testimonial2.png'
import testimonial3 from './assets/testimonial3.png'
import testimonial4 from './assets/testimonial4.png'

const products = [
  { img: product1, name: 'Organic Skincare Set', price: '$29.99', original: '$39.99', desc: 'Natural ingredients for glowing skin' },
  { img: product2, name: 'Handmade Soap Collection', price: '$14.99', original: '$19.99', desc: 'Pure herbs & dried flowers' },
  { img: product3, name: 'Herbal Tea Collection', price: '$18.99', original: '$24.99', desc: 'Premium organic blends' },
  { img: product4, name: 'Essential Oil Kit', price: '$34.99', original: '$44.99', desc: 'Aromatherapy & wellness' },
]

const testimonials = [
  { img: testimonial1, text: 'Outstanding selection of eco-friendly products. User-friendly interface and premium quality make it a go-to for conscious consumers.', author: 'Sarah M.' },
  { img: testimonial2, text: 'The quality exceeded my expectations. Love the sustainable packaging and the products feel truly natural on my skin.', author: 'James R.' },
  { img: testimonial3, text: 'Best natural products I have ever used. The herbal tea collection is absolutely delightful. Highly recommend!', author: 'Priya K.' },
  { img: testimonial4, text: 'I switched to all-natural products and never looked back. This store has everything I need. Wonderful experience!', author: 'Martha L.' },
]

function App() {
  return (
    <>
      {/* ── Top Announcement Bar ──────────────────────────── */}
      <div className="top-bar" id="top-bar">
        <p>The products all are made with natural and sustainable</p>
        <div className="top-bar-badges">
          <span className="eco-badge">🌿 Eco</span>
          <span className="eco-badge">♻️ Sustainable</span>
          <span className="eco-badge">🏷️ 100% Natural</span>
        </div>
      </div>

      {/* ── Navigation Header ─────────────────────────────── */}
      <header className="main-header" id="main-header">
        <div className="header-container">
          <div className="header-logo">
            <img src={logo} alt="Eco-Alchemy" />
          </div>
          <div className="header-search">
            <input type="text" placeholder="Search products..." id="search-input" />
            <button className="search-btn" id="search-btn">search</button>
          </div>
          <nav className="header-nav" id="main-nav">
            <a href="#hero" className="nav-link active">HOME</a>
            <a href="#products" className="nav-link">SHOP</a>
            <a href="#testimonials" className="nav-link">BLOG</a>
            <a href="#deals" className="nav-link">ABOUT</a>
            <a href="#promo" className="nav-link">CONTACT</a>
          </nav>
          <div className="header-icons">
            <button className="icon-btn" aria-label="Wishlist">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <button className="icon-btn" aria-label="Account">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <button className="icon-btn" aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ───────────────────────────────────── */}
      <section className="hero-banner" id="hero">
        <div className="hero-content">
          <p className="hero-subtitle">Made with Natural</p>
          <h1>Save upto 10%</h1>
          <h2>On all products</h2>
          <p>Save more today with us</p>
          <button className="btn-primary" id="shop-now-btn">Shop Now</button>
        </div>
        <div className="hero-image">
          <img src={heroBanner} alt="Natural eco-friendly products" />
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="section products-section" id="products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>All Weather New Modern Designs</p>
          </div>
          <div className="products-grid">
            {products.map((p, i) => (
              <div className="product-card" key={i}>
                <div style={{ overflow: 'hidden' }}>
                  <img className="product-card-img" src={p.img} alt={p.name} />
                </div>
                <div className="product-card-body">
                  <h3>{p.name}</h3>
                  <div>
                    <span className="price">{p.price}</span>
                    <span className="original-price">{p.original}</span>
                  </div>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ──────────────────────────────────── */}
      <section className="promo-banner" id="promo">
        <h3>Natural Products</h3>
        <h2>60% Off on All Products</h2>
        <button className="btn-outline">Explore Now</button>
      </section>

      {/* ── Deals ─────────────────────────────────────────── */}
      <section className="section deals-section" id="deals">
        <div className="container">
          <div className="section-header">
            <h2>Hot Deals</h2>
            <p>Limited time offers you don't want to miss</p>
          </div>
          <div className="deals-grid">
            <div className="deal-card">
              <img className="deal-card-img" src={product1} alt="Best Deals" />
              <div className="deal-card-body">
                <span className="badge">Best Deal</span>
                <h3>Buy One Get One Free</h3>
                <p>The latest best products with biodegradable material. Feel happy with our products.</p>
                <button className="btn-small">Learn More</button>
              </div>
            </div>
            <div className="deal-card">
              <img className="deal-card-img" src={product3} alt="Season In" />
              <div className="deal-card-body">
                <span className="badge">Season-In</span>
                <h3>All Weather Attire</h3>
                <p>It never matters which season it is — we've got you covered with the best.</p>
                <button className="btn-small">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="section testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Our customers never miss a bit on providing feedback</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <img className="testimonial-card-img" src={t.img} alt={t.author} />
                <div className="testimonial-card-body">
                  <div className="stars">★★★★★</div>
                  <p>"{t.text}"</p>
                  <span className="author">— {t.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="footer">
        <p>© 2026 Natural Store. Made with <span>♥</span> for a sustainable future.</p>
      </footer>
    </>
  )
}

export default App
