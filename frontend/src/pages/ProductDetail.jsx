import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ChevronRight, Package, RotateCcw, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductCard from '../components/product/ProductCard';
import StarRating from '../components/ui/StarRating';
import QuantitySelector from '../components/ui/QuantitySelector';
import CTAButton from '../components/ui/CTAButton';
import Badge from '../components/ui/Badge';
import { addItem, openCart } from '../features/cart/cartSlice';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import api from '../services/api';

const ProductDetail = () => {
  const { slug }    = useParams();
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const [qty, setQty]     = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/products/${slug}`);
        if (!isMounted) return;
        setProduct(data?.data || null);
      } catch (err) {
        if (!isMounted) return;
        setError('Không thể tải sản phẩm.');
        setProduct(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!product?.category) return;
    let isMounted = true;
    const fetchRelated = async () => {
      try {
        const { data } = await api.get('/products', {
          params: { category: product.category, limit: 5 }
        });
        if (!isMounted) return;
        const items = data?.data?.items || [];
        setRelated(items.filter((item) => item.id !== product.id).slice(0, 4));
      } catch (err) {
        if (isMounted) setRelated([]);
      }
    };
    fetchRelated();
    return () => {
      isMounted = false;
    };
  }, [product?.category, product?.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="section-container py-20">
          <SkeletonLoader variant="text" count={3} />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <h1 className="font-poppins font-bold text-2xl text-navy mb-4">Product Not Found</h1>
          <CTAButton onClick={() => navigate('/shop')}>Back to Shop</CTAButton>
        </div>
      </Layout>
    );
  }

  const { title, price, oldPrice, discount, stock, rating, reviewCount, images, tags = [], brand, description, specs, category } = product;
  const outOfStock = stock === 0;
  const lowStock   = stock > 0 && stock <= 5;

  const handleAddToCart = () => {
    dispatch(addItem({ ...product, quantity: qty }));
    dispatch(openCart());
  };

  const handleBuyNow = () => {
    dispatch(addItem({ ...product, quantity: qty }));
    navigate('/cart');
  };

  return (
    <Layout>
      <div className="section-container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-inter" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-primary-500 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/shop?category=${category}`} className="hover:text-primary-500 transition-colors capitalize">{category}</Link>
          <ChevronRight size={14} />
          <span className="text-navy font-medium line-clamp-1">{title}</span>
        </nav>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left — gallery */}
          <ProductImageGallery images={images} title={title} />

          {/* Right — info */}
          <div className="flex flex-col gap-5">
            {/* Brand + badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-inter font-semibold text-primary-500 uppercase tracking-widest">{brand}</span>
              {tags.includes('new')  && <Badge variant="new">New</Badge>}
              {tags.includes('sale') && discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
              {tags.includes('hot')  && <Badge variant="hot">Hot</Badge>}
            </div>

            {/* Title */}
            <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-navy leading-snug">{title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={rating} reviewCount={reviewCount} size={16} />
              <span className="text-sm font-inter text-gray-400">| {brand}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-poppins font-bold text-3xl text-primary-500">${price}</span>
              {oldPrice && (
                <>
                  <span className="text-base text-gray-400 line-through">${oldPrice}</span>
                  <span className="text-sm font-semibold text-red-500">{discount}% off</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div>
              {outOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Out of Stock
                </span>
              ) : lowStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Only {stock} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600">
                  <span className="w-2 h-2 rounded-full bg-primary-500 inline-block" />In Stock
                </span>
              )}
            </div>

            {/* Qty + CTA row */}
            {!outOfStock && (
              <div className="flex flex-wrap items-center gap-4">
                <QuantitySelector value={qty} onChange={setQty} min={1} max={stock} />
                <CTAButton
                  id="add-to-cart-detail"
                  onClick={handleAddToCart}
                  size="lg"
                  variant="primary"
                  className="flex-1 min-w-40"
                >
                  Add to Cart
                </CTAButton>
              </div>
            )}

            {!outOfStock && (
              <CTAButton
                id="buy-now-detail"
                onClick={handleBuyNow}
                size="lg"
                variant="secondary"
                fullWidth
              >
                Buy Now
              </CTAButton>
            )}

            {/* Assurance row */}
            <div className="flex flex-wrap gap-5 py-4 border-t border-gray-100">
              {[
                { icon: RotateCcw, text: 'Free 30-day returns' },
                { icon: Shield,    text: 'Secure checkout' },
                { icon: Package,   text: '1-year warranty' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon size={15} className="text-primary-500 shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Tabs: Description / Specs */}
            <div className="border-t border-gray-100">
              <div className="flex gap-0 border-b border-gray-100">
                {['description', 'specs'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-primary-500 border-b-2 border-primary-500 -mb-px'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-5">
                {activeTab === 'description' && (
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                )}
                {activeTab === 'specs' && (
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(specs || {}).map(([key, val]) => (
                        <tr key={key} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 font-medium text-navy w-1/3">{key}</td>
                          <td className="py-2.5 text-gray-600">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky CTA */}
      {!outOfStock && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-30 flex gap-3" style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
          <CTAButton id="mobile-add-to-cart" onClick={handleAddToCart} fullWidth size="md">
            Add to Cart — ${price}
          </CTAButton>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetail;
