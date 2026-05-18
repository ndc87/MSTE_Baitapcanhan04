import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Camera, Code, Mail, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const FOOTER_LINKS = {
  Shop: [
    { label: 'New Arrivals', to: '/shop?tag=new' },
    { label: 'Best Sellers', to: '/shop?tag=featured' },
    { label: 'Sale',         to: '/shop?tag=sale' },
    { label: 'All Products', to: '/shop' },
  ],
  Support: [
    { label: 'FAQ',             to: '/faq' },
    { label: 'Shipping Policy', to: '/shipping' },
    { label: 'Returns',         to: '/returns' },
    { label: 'Contact Us',      to: '/contact' },
  ],
  Company: [
    { label: 'About Us',      to: '/about' },
    { label: 'Careers',       to: '/careers' },
    { label: 'Privacy Policy',to: '/privacy' },
    { label: 'Terms',         to: '/terms' },
  ],
};

const TRUST_ITEMS = [
  { icon: Truck,        label: 'Free Shipping', sub: 'On orders over $50' },
  { icon: Shield,       label: 'Secure Payment', sub: '256-bit SSL encryption' },
  { icon: RotateCcw,   label: 'Easy Returns',  sub: '30-day return policy' },
  { icon: Headphones,  label: '24/7 Support',  sub: 'Chat & email support' },
];

const Footer = () => {
  return (
    <footer className="bg-navy text-white mt-auto">
      {/* Trust strip */}
      <div className="border-b border-navy-light">
        <div className="section-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary-500" />
                </div>
                <div>
                  <p className="font-poppins font-semibold text-sm text-white">{label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-poppins font-black text-sm">U</span>
              </div>
              <span className="font-poppins font-bold text-white text-xl">
                UTE<span className="text-primary-500">Shop</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Premium tech & lifestyle products, curated for modern living.
            </p>
            <div className="flex gap-3">
              {[
                { href: '#', icon: MessageCircle,   label: 'Twitter' },
                { href: '#', icon: Camera, label: 'Instagram' },
                { href: '#', icon: Code,    label: 'GitHub' },
                { href: '#', icon: Mail,      label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-navy-light hover:bg-primary-500 flex items-center justify-center transition-colors group"
                >
                  <Icon size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-poppins font-semibold text-sm text-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-gray-400 hover:text-primary-500 text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-light">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">© 2025 UTEShop. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Built with ❤️ for Tech & Lifestyle</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
