import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, ChevronRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/product/ProductCard';
import HorizontalProductCarousel from '../components/product/HorizontalProductCarousel';
import CTAButton from '../components/ui/CTAButton';
import api from '../services/api';

/* ── Flash Sale Countdown ────────────────────────────────── */
function FlashSaleCountdown({ endsAt }) {
  const calc = () => {
    const diff = Math.max(0, endsAt - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const pad = (n) => String(n).padStart(2, '0');
  const Block = ({ v, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-navy rounded-xl flex items-center justify-center font-poppins font-bold text-xl sm:text-2xl text-white countdown-block">
        {pad(v)}
      </div>
      <span className="text-[10px] text-white/60 mt-1 uppercase tracking-wide">{label}</span>
    </div>
  );

  return (
    <div className="flex items-end gap-2 sm:gap-3">
      <Block v={time.h} label="hrs" />
      <span className="text-white font-bold text-xl mb-3">:</span>
      <Block v={time.m} label="min" />
      <span className="text-white font-bold text-xl mb-3">:</span>
      <Block v={time.s} label="sec" />
    </div>
  );
}

/* ── Home Page ───────────────────────────────────────────── */
const SALE_END = Date.now() + 6 * 3600 * 1000; // 6 hours from now

const categoryIcon = (slug) => {
  const map = {
    'giay-da-bong': '⚽',
    'day-giay': '🪢',
    've-sinh-giay': '🧴',
    'bang-quan-bao-ve': '🩹',
    'quan-ao-da-bong': '👕'
  };
  return map[slug] || '🛍️';
};

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
      setLoadingTop(true);
      setCategoryError(null);
      try {
        const [categoryRes, bestRes, viewRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/top-selling', { params: { limit: 10 } }),
          api.get('/products/most-viewed', { params: { limit: 10 } })
        ]);

        if (!isMounted) return;
        setCategories(categoryRes.data?.data?.items || []);
        setBestSellers(bestRes.data?.data?.items || []);
        setMostViewed(viewRes.data?.data?.items || []);
      } catch (error) {
        if (!isMounted) return;
        setCategoryError('Không thể tải dữ liệu trang chủ.');
      } finally {
        if (isMounted) setLoadingTop(false);
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredSource = bestSellers.length > 0 ? bestSellers : mostViewed;
  const saleSource = mostViewed.length > 0 ? mostViewed : bestSellers;
  const featured = featuredSource.slice(0, 4);
  const saleProducts = saleSource.slice(0, 6);

  return (
    <Layout>
      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="bg-navy overflow-hidden relative">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Emerald glow */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)', filter: 'blur(60px)', transform: 'translate(30%, -30%)' }} />

        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[580px] py-16 lg:py-24">

            {/* Left — Text */}
            <div className="hero-animate">
              <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-1.5 mb-6">
                <Zap size={14} className="text-primary-500" />
                <span className="text-primary-400 text-sm font-medium">Mẫu mới mỗi tuần ⚡</span>
              </div>

              <h1 className="font-poppins font-bold text-white mb-5" style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: '1.08', letterSpacing: '-0.02em' }}>
                Giày Đá Bóng<br />
                <span className="text-primary-500">Chính Hãng.</span>
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                Nike, Adidas, Puma, Mizuno — đầy đủ phụ kiện bóng đá. Giao hàng nhanh, đổi trả dễ dàng.
              </p>

              <div className="flex flex-wrap gap-4">
                <CTAButton
                  id="hero-shop-now"
                  onClick={() => navigate('/shop')}
                  size="lg"
                  variant="primary"
                >
                  Mua Ngay <ArrowRight size={18} />
                </CTAButton>
                <CTAButton
                  id="hero-sale"
                  onClick={() => navigate('/shop?tag=sale')}
                  size="lg"
                  variant="secondary"
                >
                  Giảm Giá Hot 🔥
                </CTAButton>
              </div>

              <div className="flex gap-8 mt-10">
                {[['5K+', 'Khách hàng'], ['56+', 'Sản phẩm'], ['4.8★', 'Đánh giá']].map(([val, label]) => (
                  <div key={label}>
                    <p className="font-poppins font-bold text-white text-xl">{val}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Featured product image */}
            <div className="hero-animate-delay flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border border-white/10" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
                  <img
                    src={featured[0]?.images?.[0] || 'https://placehold.co/600x600'}
                    alt={featured[0]?.title || 'Featured product'}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-hover">
                  <p className="font-poppins font-bold text-navy text-sm">
                    {featured[0]?.title ? featured[0].title.split(' ').slice(0, 3).join(' ') : 'Top Pick'}
                  </p>
                  <p className="text-primary-500 font-bold text-lg">
                    {featured[0]?.price ? `$${featured[0].price}` : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CATEGORY STRIP ─────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="section-container">
          <div className="flex items-center justify-between mb-7">
            <h2 className="section-title text-xl">Shop by Category</h2>
            <Link to="/shop" className="text-primary-500 hover:text-primary-dark text-sm font-semibold flex items-center gap-1 transition-colors">
              All <ChevronRight size={16} />
            </Link>
          </div>
          {categoryError ? (
            <p className="text-gray-400 text-sm">{categoryError}</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {categories.map((category) => (
              <Link
                key={category.id || category.slug}
                to={`/shop?category=${category.slug}`}
                id={`category-${category.slug}`}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
              >
                <span className="text-3xl leading-none">{categoryIcon(category.slug)}</span>
                <span className="font-inter font-medium text-xs text-gray-600 group-hover:text-primary-600 transition-colors text-center">{category.name}</span>
              </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. FEATURED PRODUCTS ─────────────────────────── */}
      <section className="py-14 bg-gray-50">
        <div className="section-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-inter font-medium text-primary-500 uppercase tracking-widest mb-1">Handpicked for You</p>
              <h2 className="section-title">Top Picks</h2>
            </div>
            <Link to="/shop?tag=featured" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-500 hover:text-primary-dark transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-6 flex justify-center sm:hidden">
            <CTAButton variant="secondary" onClick={() => navigate('/shop?tag=featured')}>
              View All <ArrowRight size={16} />
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ── 4. FLASH SALE BANNER ─────────────────────────── */}
      <section className="py-14 bg-navy overflow-hidden relative">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="section-container relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <Zap size={20} className="text-primary-500" />
                <span className="font-poppins font-bold text-primary-500 uppercase tracking-widest text-sm">Flash Sale</span>
              </div>
              <h2 className="font-poppins font-bold text-white text-3xl sm:text-4xl mb-3" style={{ letterSpacing: '-0.01em' }}>
                Up to 50% Off<br />
                <span className="text-primary-400">Today Only</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6">Limited stock. Ends when the timer does.</p>
              <CTAButton
                id="flash-sale-cta"
                onClick={() => navigate('/shop?tag=sale')}
                size="md"
                variant="primary"
              >
                Shop Sale Items <ArrowRight size={16} />
              </CTAButton>
            </div>

            {/* Right — Countdown + Products */}
            <div className="flex flex-col items-center lg:items-end gap-8">
              <FlashSaleCountdown endsAt={SALE_END} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {saleProducts.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-white/10 hover:border-primary-500 transition-colors"
                  >
                    <img src={p.images[0]} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HorizontalProductCarousel
        title="Best Sellers"
        products={bestSellers}
        isLoading={loadingTop}
        emptyMessage="No best sellers available yet."
      />

      <HorizontalProductCarousel
        title="Most Viewed"
        products={mostViewed}
        isLoading={loadingTop}
        emptyMessage="No most viewed products available yet."
      />

      {/* ── 5. TRUST STRIP ───────────────────────────────── */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="section-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { emoji: '🚚', title: 'Free Shipping',   sub: 'On orders over $50' },
              { emoji: '🔒', title: 'Secure Checkout', sub: '256-bit encryption' },
              { emoji: '↩️', title: 'Easy Returns',    sub: '30-day policy' },
              { emoji: '⭐', title: '4.9 Star Rating',  sub: 'Over 12,000 reviews' },
            ].map(({ emoji, title, sub }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{emoji}</span>
                <p className="font-poppins font-semibold text-navy text-sm">{title}</p>
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
