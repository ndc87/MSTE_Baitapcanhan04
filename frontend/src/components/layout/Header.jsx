import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Search, User, Menu, X, Zap, Heart } from 'lucide-react';
import { openCart } from '../../features/cart/cartSlice';

const Header = () => {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [mobileMenuOpen, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');

  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useSelector((state) => state.auth);
  const cartItems  = useSelector((state) => state.cart?.items ?? []);
  const cartCount  = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Determine if we're on an auth page (keep Bootstrap-styled look)
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-otp'].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenu(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // Auth pages: minimal Bootstrap header (unchanged)
  if (isAuthPage) {
    return (
      <header className="bg-white border-bottom py-3 px-4 w-100 shadow-sm sticky-top" style={{ zIndex: 1030 }}>
        <div className="container-xl d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none" style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
            <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: '30px', height: '30px', background: '#10b981' }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: '800' }}>U</span>
            </div>
            UTEShop
          </Link>
          <div className="d-flex gap-3">
            <Link to="/login" className="text-dark text-decoration-none small fw-semibold">Login</Link>
            <Link to="/register" className="btn btn-sm px-3 fw-bold text-white rounded-pill" style={{ background: '#10b981' }}>Join</Link>
          </div>
        </div>
      </header>
    );
  }

  // Main e-commerce header
  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-navy/98 backdrop-blur-md shadow-lg'
            : 'bg-navy'
        }`}
      >
        {/* Flash sale bar */}
        <div className="bg-primary-500 text-white text-center py-2 px-4 text-xs font-inter font-medium tracking-wide">
          <Zap size={12} className="inline mr-1 -mt-0.5" />
          Flash Sale — Giảm đến 50% giày đá bóng chính hãng.{' '}
          <Link to="/shop?tag=sale" className="underline font-semibold hover:text-white/80 transition-colors">
            Mua ngay →
          </Link>
        </div>

        <div className="section-container">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center group-hover:bg-primary-dark transition-colors">
                <span className="text-white font-poppins font-black text-sm">U</span>
              </div>
              <span className="font-poppins font-bold text-white text-lg leading-none">
                Boot<span className="text-primary-500">Zone</span>
              </span>
            </Link>

            {/* Search bar — desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md items-center bg-navy-light border border-navy-lighter rounded-xl px-4 h-10 gap-3 group focus-within:border-primary-500 transition-colors"
            >
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-400 outline-none font-inter"
              />
            </form>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {/* Mobile search toggle */}
              <button
                id="header-search-mobile"
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-navy-light rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <button
                id="header-cart-btn"
                onClick={() => dispatch(openCart())}
                className="relative w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-navy-light rounded-lg transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              {user && (
                <Link
                  to="/wishlist"
                  id="header-wishlist-btn"
                  className="relative w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-navy-light rounded-lg transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                </Link>
              )}

              {/* User */}
              {user ? (
                <Link
                  to="/user/profile"
                  className="w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-500 transition-colors"
                  aria-label="Profile"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=10b981&color=fff`}
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-4 h-9 bg-primary-500 hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <User size={15} />
                  Login
                </Link>
              )}

              {/* Mobile menu */}
              <button
                id="header-mobile-menu"
                onClick={() => setMobileMenu(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-navy-light rounded-lg transition-colors ml-1"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 pb-3 -mt-1">
            {[
              { label: 'Home',        to: '/' },
              { label: 'Shop',        to: '/shop' },
              { label: 'New Arrivals',to: '/shop?tag=new' },
              { label: 'Sale',        to: '/shop?tag=sale', highlight: true },
            ].map(({ label, to, highlight }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                  location.pathname === to
                    ? 'text-primary-500 border-primary-500'
                    : highlight
                    ? 'text-primary-400 border-transparent hover:text-primary-300'
                    : 'text-gray-300 border-transparent hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile search expand */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 bg-navy border-t border-navy-light">
            <form onSubmit={handleSearch} className="flex items-center bg-navy-light border border-navy-lighter rounded-xl px-4 h-11 gap-3">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-400 outline-none"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile nav menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-navy border-t border-navy-light px-4 py-4 flex flex-col gap-1">
            {[
              { label: 'Home',         to: '/' },
              { label: 'Shop All',     to: '/shop' },
              { label: 'New Arrivals', to: '/shop?tag=new' },
              { label: 'Sale 🔥',      to: '/shop?tag=sale' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-gray-200 hover:text-primary-500 transition-colors py-3 border-b border-navy-light text-sm font-medium last:border-0"
              >
                {label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-3 mt-3">
                <Link to="/login" className="flex-1 text-center py-2.5 border border-primary-500 text-primary-500 rounded-xl text-sm font-semibold">Login</Link>
                <Link to="/register" className="flex-1 text-center py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold">Sign Up</Link>
              </div>
            )}
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
