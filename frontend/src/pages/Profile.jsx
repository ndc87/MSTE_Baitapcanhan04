import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile, uploadAvatar, logout, reset } from '../redux/authSlice';
import { fetchOrders } from '../redux/orderSlice';
import Layout from '../components/layout/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';

/* ── Tab Keys ─────────────────────────────────────── */
const TABS = [
  { key: 'profile',  icon: 'fa-regular fa-user',                label: 'Profile info' },
  { key: 'orders',   icon: 'fa-solid fa-box-open',              label: 'Orders history' },
  { key: 'reviews',  icon: 'fa-regular fa-star',                label: 'Reviews' },
  { key: 'wishlist', icon: 'fa-regular fa-heart',               label: 'Wishlist' },
  { key: 'address',  icon: 'fa-solid fa-location-dot',          label: 'Addresses' },
];

/* ── Status Badge helper ──────────────────────────── */
const statusMap = {
  pending:          { text: 'Mới đặt',         bg: '#dbeafe', color: '#2563eb' },
  confirmed:        { text: 'Đã xác nhận',     bg: '#e0e7ff', color: '#4f46e5' },
  preparing:        { text: 'Đang chuẩn bị',   bg: '#ffedd5', color: '#ea580c' },
  shipping:         { text: 'Đang giao',       bg: '#f3e8ff', color: '#7c3aed' },
  completed:        { text: 'Hoàn thành',      bg: '#dcfce7', color: '#16a34a' },
  cancelled:        { text: 'Đã hủy',          bg: '#fee2e2', color: '#dc2626' },
  cancel_requested: { text: 'Yêu cầu hủy',    bg: '#fecaca', color: '#b91c1c' },
};

const StatusBadge = ({ status }) => {
  const s = statusMap[status] || { text: status, bg: '#f3f4f6', color: '#6b7280' };
  return (
    <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
      {s.text}
    </span>
  );
};

/* ── Profile Page ─────────────────────────────────── */
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((s) => s.auth);
  const { orders } = useSelector((s) => s.orders);
  const [activeTab, setActiveTab] = useState('profile');

  // ── Profile form state ──
  const formatDate = (d) => { if (!d) return ''; try { return new Date(d).toISOString().split('T')[0]; } catch { return ''; } };
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '', email: user?.email || '',
    phone: user?.phone || '', dob: formatDate(user?.dob), gender: user?.gender || '',
  });
  const fileInputRef = React.useRef(null);

  useEffect(() => { if (user) setFormData({ fullName: user.full_name || '', email: user.email || '', phone: user.phone || '', dob: formatDate(user.dob), gender: user.gender || '' }); }, [user]);
  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  useEffect(() => {
    if (isError) { toast.error(message, { id: 'profile-error' }); dispatch(reset()); }
    if (isSuccess && (message === 'Profile updated successfully' || message === 'Avatar uploaded successfully')) { toast.success(message, { id: 'profile-success' }); dispatch(reset()); }
  }, [isError, isSuccess, message, dispatch]);

  // Fetch orders when Orders tab is active
  useEffect(() => { if (activeTab === 'orders') dispatch(fetchOrders()); }, [activeTab, dispatch]);

  // ── Wishlist state ──
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  useEffect(() => {
    if (activeTab === 'wishlist') {
      setWishlistLoading(true);
      api.get('/users/wishlist').then(res => setWishlistItems(res.data?.data || [])).catch(() => {}).finally(() => setWishlistLoading(false));
    }
  }, [activeTab]);
  const removeFromWishlist = async (productId) => {
    try { await api.post(`/users/wishlist/${productId}`); setWishlistItems(prev => prev.filter(p => p._id !== productId)); toast.success('Đã xóa khỏi yêu thích'); } catch { toast.error('Lỗi'); }
  };

  // ── Address state ──
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ label: '', recipient_name: '', recipient_phone: '', street_address: '' });
  const [addrList, setAddrList] = useState(user?.addresses || []);
  useEffect(() => { setAddrList(user?.addresses || []); }, [user]);
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addrForm.recipient_name || !addrForm.recipient_phone || !addrForm.street_address) return toast.error('Vui lòng điền đầy đủ thông tin');
    try {
      const res = await api.post('/users/addresses', addrForm);
      setAddrList(res.data?.data || []);
      setAddrForm({ label: '', recipient_name: '', recipient_phone: '', street_address: '' });
      setShowAddressForm(false);
      toast.success('Thêm địa chỉ thành công');
    } catch { toast.error('Lỗi khi thêm địa chỉ'); }
  };
  const handleDeleteAddress = async (addrId) => {
    try {
      const res = await api.delete(`/users/addresses/${addrId}`);
      setAddrList(res.data?.data || []);
      toast.success('Đã xóa địa chỉ');
    } catch { toast.error('Lỗi khi xóa địa chỉ'); }
  };

  const onChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onAvatarClick = () => fileInputRef.current.click();
  const onAvatarChange = (e) => { const f = e.target.files[0]; if (f) { const fd = new FormData(); fd.append('avatar', f); dispatch(uploadAvatar(fd)); } };
  const onSubmit = (e) => { e.preventDefault(); const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/; if (formData.phone && !phoneRegex.test(formData.phone)) return toast.error('Số điện thoại không hợp lệ', { id: 'profile-error' }); dispatch(updateProfile(formData)); };
  const onLogout = () => { dispatch(logout()); navigate('/login'); };

  /* ── Render tab content ─────────────────────────── */
  const renderContent = () => {
    switch (activeTab) {
      /* ── PROFILE INFO ── */
      case 'profile':
        return (
          <>
            <div className="mb-5">
              <h2 className="fw-bold h3 mb-2" style={{ color: '#1e3a8a' }}>Personal information</h2>
              <p className="text-muted small">Quản lý thông tin cá nhân và liên hệ của bạn.</p>
            </div>
            <form onSubmit={onSubmit}>
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Họ và tên</label>
                  <div className="input-group"><span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-regular fa-user"></i></span>
                    <input type="text" name="fullName" className="form-control bg-light border-start-0 ps-0 py-2" value={formData.fullName} onChange={onChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Email</label>
                  <div className="input-group"><span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-regular fa-envelope"></i></span>
                    <input type="email" name="email" className="form-control bg-light border-start-0 ps-0 py-2" value={formData.email} disabled />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Số điện thoại</label>
                  <div className="input-group"><span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-solid fa-phone"></i></span>
                    <input type="text" name="phone" className="form-control bg-light border-start-0 ps-0 py-2" value={formData.phone} onChange={onChange} placeholder="0901234567" />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Ngày sinh</label>
                  <div className="input-group"><span className="input-group-text bg-light border-end-0 text-muted"><i className="fa-regular fa-calendar"></i></span>
                    <input type="date" name="dob" className="form-control bg-light border-start-0 ps-0 py-2" value={formData.dob} onChange={onChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Giới tính</label>
                  <select name="gender" className="form-select bg-light py-2" value={formData.gender} onChange={onChange}>
                    <option value="">Chọn giới tính</option><option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Xu tích lũy</label>
                  <div className="input-group"><span className="input-group-text bg-light border-end-0 text-warning"><i className="fa-solid fa-coins"></i></span>
                    <input type="text" className="form-control bg-light border-start-0 ps-0 py-2 fw-bold text-warning" value={`${user?.coin_balance || 0} xu`} disabled />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-end pt-4 border-top">
                <button type="submit" disabled={isLoading} className="btn btn-primary px-5 py-2 fw-bold rounded-3 shadow-sm">
                  {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </>
        );

      /* ── ORDERS HISTORY ── */
      case 'orders':
        return (
          <>
            <div className="mb-5">
              <h2 className="fw-bold h3 mb-2" style={{ color: '#1e3a8a' }}>Lịch sử đơn hàng</h2>
              <p className="text-muted small">Theo dõi tất cả đơn hàng đã đặt.</p>
            </div>
            {(!orders || orders.length === 0) ? (
              <div className="text-center py-5 text-muted">
                <i className="fa-solid fa-box-open fs-1 mb-3 d-block opacity-25"></i>
                <p>Bạn chưa có đơn hàng nào.</p>
                <Link to="/shop" className="btn btn-primary btn-sm mt-2">Mua sắm ngay</Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-3 p-3 p-md-4" style={{ background: '#fafbfc' }}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                      <div>
                        <span className="fw-bold" style={{ color: '#1e3a8a' }}>#{order.order_code}</span>
                        <span className="text-muted small ms-3">{new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {order.items?.map((item) => (
                        <div key={item._id} className="d-flex align-items-center gap-3">
                          <div className="rounded-2 overflow-hidden flex-shrink-0" style={{ width: 48, height: 48, background: '#e5e7eb' }}>
                            <img src={item.product?.media?.[0]?.media_url || 'https://placehold.co/48'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-0 small fw-medium">{item.product?.name || 'Sản phẩm'}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: 12 }}>x{item.quantity} · {(item.price_at_buy || 0).toLocaleString('vi-VN')}đ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex flex-wrap justify-content-between align-items-center border-top pt-3 gap-2">
                      <span className="fw-bold">Tổng: <span style={{ color: '#dc2626' }}>{(order.total_final || 0).toLocaleString('vi-VN')}đ</span></span>
                      <Link to={`/orders/${order._id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">Xem chi tiết</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );

      /* ── REVIEWS ── */
      case 'reviews':
        return (
          <>
            <div className="mb-5">
              <h2 className="fw-bold h3 mb-2" style={{ color: '#1e3a8a' }}>Đánh giá của tôi</h2>
              <p className="text-muted small">Xem lại những đánh giá bạn đã viết cho sản phẩm.</p>
            </div>
            <div className="text-center py-5 text-muted">
              <i className="fa-regular fa-star fs-1 mb-3 d-block opacity-25"></i>
              <p>Bạn chưa có đánh giá nào.</p>
              <p className="small">Hãy mua sắm và đánh giá sản phẩm để giúp cộng đồng!</p>
            </div>
          </>
        );

      /* ── WISHLIST ── */
      case 'wishlist':
        return (
          <>
            <div className="mb-5">
              <h2 className="fw-bold h3 mb-2" style={{ color: '#1e3a8a' }}>Sản phẩm yêu thích</h2>
              <p className="text-muted small">Danh sách sản phẩm bạn đã lưu để mua sau.</p>
            </div>
            {wishlistLoading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fa-regular fa-heart fs-1 mb-3 d-block opacity-25"></i>
                <p>Chưa có sản phẩm yêu thích nào.</p>
                <Link to="/shop" className="btn btn-primary btn-sm mt-2">Khám phá sản phẩm</Link>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {wishlistItems.map((product) => (
                  <div key={product._id} className="border rounded-3 p-3 d-flex align-items-center gap-3" style={{ background: '#fafbfc' }}>
                    <div className="rounded-2 overflow-hidden flex-shrink-0" style={{ width: 60, height: 60, background: '#e5e7eb' }}>
                      <img src={product.media?.[0]?.media_url || 'https://placehold.co/60'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="flex-grow-1">
                      <Link to={`/products/${product.slug}`} className="fw-bold text-decoration-none" style={{ color: '#1e3a8a' }}>{product.name}</Link>
                      <p className="mb-0 small" style={{ color: '#dc2626' }}>{(product.base_price || 0).toLocaleString('vi-VN')}đ</p>
                    </div>
                    <button onClick={() => removeFromWishlist(product._id)} className="btn btn-outline-danger btn-sm rounded-pill" title="Xóa khỏi yêu thích">
                      <i className="fa-solid fa-trash-can me-1"></i> Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        );

      /* ── ADDRESSES ── */
      case 'address':
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h2 className="fw-bold h3 mb-2" style={{ color: '#1e3a8a' }}>Sổ địa chỉ</h2>
                <p className="text-muted small mb-0">Quản lý các địa chỉ nhận hàng của bạn.</p>
              </div>
              <button onClick={() => setShowAddressForm(!showAddressForm)} className="btn btn-primary btn-sm rounded-pill px-3">
                <i className={`fa-solid ${showAddressForm ? 'fa-times' : 'fa-plus'} me-1`}></i> {showAddressForm ? 'Hủy' : 'Thêm địa chỉ'}
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="border rounded-3 p-4 mb-4" style={{ background: '#f0f9ff' }}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Nhãn (VD: Nhà, Công ty)</label>
                    <input type="text" className="form-control" value={addrForm.label} onChange={e => setAddrForm(p => ({...p, label: e.target.value}))} placeholder="VD: KTX Khu A" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Tên người nhận <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" value={addrForm.recipient_name} onChange={e => setAddrForm(p => ({...p, recipient_name: e.target.value}))} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Số điện thoại <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" value={addrForm.recipient_phone} onChange={e => setAddrForm(p => ({...p, recipient_phone: e.target.value}))} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Địa chỉ chi tiết <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" value={addrForm.street_address} onChange={e => setAddrForm(p => ({...p, street_address: e.target.value}))} required />
                  </div>
                </div>
                <div className="mt-3 text-end">
                  <button type="submit" className="btn btn-primary rounded-pill px-4"><i className="fa-solid fa-check me-1"></i> Lưu địa chỉ</button>
                </div>
              </form>
            )}

            {addrList.length === 0 && !showAddressForm ? (
              <div className="text-center py-5 text-muted">
                <i className="fa-solid fa-location-dot fs-1 mb-3 d-block opacity-25"></i>
                <p>Bạn chưa có địa chỉ nào.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {addrList.map((addr) => (
                  <div key={addr._id} className="border rounded-3 p-3 p-md-4 d-flex align-items-start gap-3" style={{ background: '#fafbfc' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40, background: '#dbeafe' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#2563eb' }}></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="fw-bold mb-1">{addr.label || 'Địa chỉ'}</p>
                      <p className="mb-1 small">{addr.recipient_name} · {addr.recipient_phone}</p>
                      <p className="mb-0 text-muted small">{addr.street_address}</p>
                    </div>
                    <button onClick={() => handleDeleteAddress(addr._id)} className="btn btn-outline-danger btn-sm rounded-circle" style={{ width: 32, height: 32, padding: 0 }} title="Xóa">
                      <i className="fa-solid fa-trash-can" style={{ fontSize: 12 }}></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        );

      default: return null;
    }
  };

  return (
    <Layout>
      <div className="container-xl py-5" style={{ maxWidth: '1100px' }}>
        <div className="row g-4 align-items-stretch">
          {/* ── Sidebar ── */}
          <aside className="col-lg-4 col-xl-3">
            <div className="bg-white rounded-4 shadow-sm border p-4 text-center h-100">
              <div className="position-relative d-inline-block mb-3">
                <img src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.full_name}&background=random`} alt="Profile" className="rounded-circle border border-4 border-white shadow-sm" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                <input type="file" ref={fileInputRef} onChange={onAvatarChange} style={{ display: 'none' }} accept="image/*" />
                <button onClick={onAvatarClick} className="position-absolute bottom-0 end-0 bg-primary text-white border-0 rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '28px', height: '28px' }}>
                  <i className="fa-solid fa-camera" style={{ fontSize: '10px' }}></i>
                </button>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: '#1e3a8a' }}>{user?.full_name}</h5>
              <p className="text-muted small fw-medium mb-4">Verified Customer</p>

              <div className="list-group list-group-flush text-start border-top pt-3">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`list-group-item list-group-item-action border-0 py-3 rounded-3 d-flex align-items-center gap-3 ${activeTab === tab.key ? 'active' : 'text-muted'}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className={`${tab.icon} fs-5`}></i>
                    <span className="small fw-bold">{tab.label}</span>
                  </button>
                ))}
                <button onClick={onLogout} className="list-group-item list-group-item-action border-0 py-3 rounded-3 d-flex align-items-center gap-3 text-danger border-top mt-2">
                  <i className="fa-solid fa-arrow-right-from-bracket fs-5"></i>
                  <span className="small fw-bold">Đăng xuất</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="col-lg-8 col-xl-9">
            <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 h-100">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
