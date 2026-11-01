import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  Coffee,
  FileText,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  LogOut,
  User,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  fetchAdminStats,
  fetchAllReservations,
  updateReservationStatus,
  deleteReservation,
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItem,
  fetchContactMessages,
  updateContactStatus,
  deleteContactMessage,
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublishBlog
} from '../services/api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';

const MENU_CATEGORIES = [
  'Coffee & Brews',
  'Artisanal Pizzas',
  'Gourmet Burgers',
  'Fresh Pastas',
  'Tacos & Starters',
  'Decadent Desserts',
  'Coolers & Mocktails'
];

const BLOG_CATEGORIES = [
  'Dating & Romance',
  'Coffee Culture',
  'Culinary Secrets',
  'Celebration Guides',
  'Lifestyle & Dates'
];

const AdminDashboardPage = () => {
  const { admin, logout } = useAuth();
  const { addToast } = useToast();

  // Navigation tab state: 'overview' | 'reservations' | 'menu' | 'blogs' | 'messages'
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Core Data
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [messages, setMessages] = useState([]);

  // Filter & Search states
  const [resSearch, setResSearch] = useState('');
  const [resFilter, setResFilter] = useState('All');

  const [menuSearch, setMenuSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState('All');

  const [blogSearch, setBlogSearch] = useState('');
  const [blogFilter, setBlogFilter] = useState('All');

  const [msgFilter, setMsgFilter] = useState('All');

  // Modals state
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    category: 'Coffee & Brews',
    price: 250,
    isVeg: true,
    isChefSpecial: false,
    isPopular: false,
    description: '',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
    tags: 'Specialty, Barista'
  });

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    category: 'Dating & Romance',
    author: 'Head Barista & Culinary Team',
    readTime: '4 min read',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
    tags: 'Dating, Ambience',
    isPublished: true
  });

  const [selectedReservation, setSelectedReservation] = useState(null);

  // Load all admin data
  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const [statsRes, resRes, menuRes, blogRes, msgRes] = await Promise.all([
        fetchAdminStats(),
        fetchAllReservations(),
        fetchMenuItems(),
        fetchBlogs(),
        fetchContactMessages()
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (resRes.data?.success) setReservations(resRes.data.data);
      if (menuRes.data?.success) setMenuItems(menuRes.data.data);
      if (blogRes.data?.success) setBlogPosts(blogRes.data.data);
      if (msgRes.data?.success) setMessages(msgRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      addToast('Error refreshing data from server.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ==========================================
  // RESERVATION ACTIONS
  // ==========================================
  const handleUpdateResStatus = async (id, status) => {
    try {
      const res = await updateReservationStatus(id, status);
      if (res.data?.success) {
        addToast(`Reservation ${id} updated to ${status}.`, 'success');
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to update reservation status.', 'error');
    }
  };

  const handleDeleteRes = async (id) => {
    if (!window.confirm(`Are you sure you want to delete reservation ${id}?`)) return;
    try {
      const res = await deleteReservation(id);
      if (res.data?.success) {
        addToast(`Reservation ${id} removed.`, 'info');
        setReservations((prev) => prev.filter((r) => r.id !== id));
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to delete reservation.', 'error');
    }
  };

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesFilter =
      resFilter === 'All' ||
      (r.status || '').toLowerCase() === resFilter.toLowerCase();

    const q = resSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (r.name || r.fullName || '').toLowerCase().includes(q) ||
      (r.phone || '').includes(q) ||
      (r.email || '').toLowerCase().includes(q) ||
      (r.id || '').toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // ==========================================
  // MENU ACTIONS
  // ==========================================
  const handleOpenAddMenu = () => {
    setEditingMenuItem(null);
    setMenuFormData({
      name: '',
      category: 'Coffee & Brews',
      price: 250,
      isVeg: true,
      isChefSpecial: false,
      isPopular: false,
      description: '',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
      tags: 'Specialty, Barista'
    });
    setShowMenuModal(true);
  };

  const handleOpenEditMenu = (item) => {
    setEditingMenuItem(item);
    setMenuFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      isVeg: item.isVeg !== false,
      isChefSpecial: !!item.isChefSpecial,
      isPopular: !!item.isPopular,
      description: item.description,
      image: item.image,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || ''
    });
    setShowMenuModal(true);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    const payload = {
      ...menuFormData,
      price: Number(menuFormData.price),
      tags: menuFormData.tags
        ? menuFormData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingMenuItem) {
        const res = await updateMenuItem(editingMenuItem.id, payload);
        if (res.data?.success) {
          addToast(`"${payload.name}" updated successfully.`, 'success');
          setMenuItems((prev) =>
            prev.map((m) => (m.id === editingMenuItem.id ? res.data.data : m))
          );
        }
      } else {
        const res = await createMenuItem(payload);
        if (res.data?.success) {
          addToast(`"${payload.name}" added to menu.`, 'success');
          setMenuItems((prev) => [res.data.data, ...prev]);
        }
      }
      setShowMenuModal(false);
      loadDashboardData(true);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save menu item.', 'error');
    }
  };

  const handleDeleteMenu = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from the menu?`)) return;
    try {
      const res = await deleteMenuItem(id);
      if (res.data?.success) {
        addToast(`Deleted "${name}".`, 'info');
        setMenuItems((prev) => prev.filter((m) => m.id !== id));
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to delete menu item.', 'error');
    }
  };

  const handleToggleMenuAvailability = async (id, currentStatus) => {
    try {
      const res = await toggleMenuItem(id);
      if (res.data?.success) {
        const updated = res.data.data;
        const statusLabel = updated.isAvailable !== false ? 'Enabled' : 'Disabled';
        addToast(`Item is now ${statusLabel}.`, 'success');
        setMenuItems((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isAvailable: updated.isAvailable } : m))
        );
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to toggle item availability.', 'error');
    }
  };

  // Filtered menu items
  const filteredMenuItems = menuItems.filter((m) => {
    const matchesCategory =
      menuFilter === 'All' ||
      m.category.toLowerCase() === menuFilter.toLowerCase();

    const q = menuSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  // ==========================================
  // BLOG ACTIONS
  // ==========================================
  const handleOpenAddBlog = () => {
    setEditingBlog(null);
    setBlogFormData({
      title: '',
      category: 'Dating & Romance',
      author: 'Cafe Love Byte Team',
      readTime: '4 min read',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      tags: 'Dates, Romance, Coffee',
      isPublished: true
    });
    setShowBlogModal(true);
  };

  const handleOpenEditBlog = (post) => {
    setEditingBlog(post);
    setBlogFormData({
      title: post.title,
      category: post.category,
      author: post.author || 'Cafe Love Byte Team',
      readTime: post.readTime || '4 min read',
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImage: post.coverImage || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      isPublished: post.isPublished !== false
    });
    setShowBlogModal(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const payload = {
      ...blogFormData,
      tags: blogFormData.tags
        ? blogFormData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingBlog) {
        const res = await updateBlog(editingBlog.id, payload);
        if (res.data?.success) {
          addToast(`"${payload.title}" updated.`, 'success');
          setBlogPosts((prev) =>
            prev.map((b) => (b.id === editingBlog.id ? res.data.data : b))
          );
        }
      } else {
        const res = await createBlog(payload);
        if (res.data?.success) {
          addToast(`"${payload.title}" published successfully.`, 'success');
          setBlogPosts((prev) => [res.data.data, ...prev]);
        }
      }
      setShowBlogModal(false);
      loadDashboardData(true);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save blog post.', 'error');
    }
  };

  const handleDeleteBlog = async (id, title) => {
    if (!window.confirm(`Delete blog post "${title}"?`)) return;
    try {
      const res = await deleteBlog(id);
      if (res.data?.success) {
        addToast(`Deleted "${title}".`, 'info');
        setBlogPosts((prev) => prev.filter((b) => b.id !== id));
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to delete blog post.', 'error');
    }
  };

  const handleTogglePublishBlog = async (id) => {
    try {
      const res = await togglePublishBlog(id);
      if (res.data?.success) {
        const updated = res.data.data;
        addToast(`Post is now ${updated.isPublished ? 'Published' : 'Draft'}.`, 'success');
        setBlogPosts((prev) =>
          prev.map((b) => (b.id === id ? { ...b, isPublished: updated.isPublished } : b))
        );
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to toggle publish status.', 'error');
    }
  };

  // Filtered blogs
  const filteredBlogs = blogPosts.filter((b) => {
    const matchesCategory =
      blogFilter === 'All' ||
      b.category.toLowerCase() === blogFilter.toLowerCase();

    const q = blogSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      (b.excerpt || '').toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  // ==========================================
  // CONTACT MESSAGES ACTIONS
  // ==========================================
  const handleUpdateMsgStatus = async (id, status) => {
    try {
      const res = await updateContactStatus(id, status);
      if (res.data?.success) {
        addToast(`Message marked as ${status}.`, 'success');
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to update message status.', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      const res = await deleteContactMessage(id);
      if (res.data?.success) {
        addToast('Message deleted.', 'info');
        setMessages((prev) => prev.filter((m) => m.id !== id));
        loadDashboardData(true);
      }
    } catch (err) {
      addToast('Failed to delete message.', 'error');
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (msgFilter === 'All') return true;
    return (m.status || '').toLowerCase() === msgFilter.toLowerCase();
  });

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top Admin Sub-Header */}
      <section
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          padding: '1.25rem 0'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent-soft)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                  Admin Command Center
                </h1>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                  Live Protected
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                Logged in as <strong>{admin?.name || 'Administrator'}</strong> ({admin?.email})
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <ThemeToggle />

            <button
              onClick={() => loadDashboardData()}
              disabled={refreshing}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.82rem' }}
              title="Refresh All Records"
            >
              <RefreshCw size={14} className={refreshing ? 'subtle-pulse' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={logout}
              className="btn"
              style={{
                padding: '0.55rem 1rem',
                fontSize: '0.82rem',
                background: 'rgba(225, 29, 72, 0.1)',
                color: '#E11D48',
                border: '1px solid rgba(225, 29, 72, 0.25)'
              }}
              title="End Admin Session"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Workspace */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container">
          {/* Main Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'reservations', label: `Reservations (${reservations.length})`, icon: CalendarCheck },
              { id: 'menu', label: `Menu Items (${menuItems.length})`, icon: Coffee },
              { id: 'blogs', label: `Blog Posts (${blogPosts.length})`, icon: FileText },
              { id: 'messages', label: `Inquiries (${messages.length})`, icon: MessageSquare }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    background: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? 'var(--color-primary-text)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--color-primary)' : '1px solid transparent',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    transition: 'all var(--transition-fast)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <IconComponent size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Loading indicator if loading initial data */}
          {loading && !refreshing ? (
            <LoadingSpinner message="Decrypting and loading administrative data..." />
          ) : (
            <div>
              {/* ==============================================================
                  TAB 1: DASHBOARD OVERVIEW
                  ============================================================== */}
              {activeTab === 'overview' && (
                <div>
                  {/* KPI Stat Cards Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '1.25rem',
                      marginBottom: '2.5rem'
                    }}
                  >
                    {/* Total Reservations */}
                    <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          Total Bookings
                        </span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-accent-soft)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CalendarCheck size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {stats?.totalReservations ?? reservations.length}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Lifetime guest bookings
                      </div>
                    </div>

                    {/* Pending Reservations */}
                    <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          Pending Review
                        </span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.12)', color: '#EAB308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Clock size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#EAB308', lineHeight: 1 }}>
                        {stats?.pendingReservations ?? reservations.filter((r) => r.status?.toLowerCase() === 'pending').length}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Requires immediate staff confirmation
                      </div>
                    </div>

                    {/* Confirmed Reservations */}
                    <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          Confirmed Tables
                        </span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle2 size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10B981', lineHeight: 1 }}>
                        {stats?.confirmedReservations ?? reservations.filter((r) => r.status?.toLowerCase() === 'confirmed').length}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Guest tables locked & ready
                      </div>
                    </div>

                    {/* Contact Messages */}
                    <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          Inquiries & Notes
                        </span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MessageSquare size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {messages.length}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {stats?.unreadMessages ?? messages.filter((m) => (m.status || '').toLowerCase() === 'unread').length} unread messages
                      </div>
                    </div>

                    {/* Blog Posts */}
                    <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                          Editorial Stories
                        </span>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-accent-soft)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={18} />
                        </div>
                      </div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {blogPosts.length}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        {blogPosts.filter((b) => b.isPublished !== false).length} published live
                      </div>
                    </div>
                  </div>

                  {/* Two Column Overview: Recent Reservations & Unread Messages */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
                    {/* Latest Reservations */}
                    <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                          Recent Table Bookings
                        </h3>
                        <button
                          onClick={() => setActiveTab('reservations')}
                          style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <span>Manage all</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      {reservations.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reservations yet.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          {reservations.slice(0, 5).map((res) => (
                            <div
                              key={res.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.85rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)'
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                  {res.name || res.fullName}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                  {res.date} • {res.time || res.timeSlot} • {res.guests || res.guestsCount} guests ({res.occasion})
                                </div>
                              </div>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: 'var(--radius-full)',
                                  background:
                                    (res.status || '').toLowerCase() === 'confirmed'
                                      ? 'rgba(16, 185, 129, 0.12)'
                                      : (res.status || '').toLowerCase() === 'cancelled'
                                      ? 'rgba(225, 29, 72, 0.12)'
                                      : (res.status || '').toLowerCase() === 'completed'
                                      ? 'rgba(59, 130, 246, 0.12)'
                                      : 'rgba(234, 179, 8, 0.12)',
                                  color:
                                    (res.status || '').toLowerCase() === 'confirmed'
                                      ? '#10B981'
                                      : (res.status || '').toLowerCase() === 'cancelled'
                                      ? '#E11D48'
                                      : (res.status || '').toLowerCase() === 'completed'
                                      ? '#3B82F6'
                                      : '#EAB308'
                                }}
                              >
                                {res.status || 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Latest Inquiries */}
                    <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                          Recent Messages
                        </h3>
                        <button
                          onClick={() => setActiveTab('messages')}
                          style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <span>Manage all</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      {messages.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No messages received.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          {messages.slice(0, 5).map((msg) => (
                            <div
                              key={msg.id}
                              style={{
                                padding: '0.85rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-subtle)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                  {msg.fullName || msg.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: 'var(--radius-full)',
                                    background:
                                      (msg.status || '').toLowerCase() === 'resolved'
                                        ? 'rgba(16, 185, 129, 0.12)'
                                        : (msg.status || '').toLowerCase() === 'read'
                                        ? 'rgba(59, 130, 246, 0.12)'
                                        : 'rgba(234, 179, 8, 0.12)',
                                    color:
                                      (msg.status || '').toLowerCase() === 'resolved'
                                        ? '#10B981'
                                        : (msg.status || '').toLowerCase() === 'read'
                                        ? '#3B82F6'
                                        : '#EAB308'
                                  }}
                                >
                                  {msg.status || 'Unread'}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {msg.subject ? `[${msg.subject}] ` : ''}{msg.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB 2: RESERVATION MANAGEMENT
                  ============================================================== */}
              {activeTab === 'reservations' && (
                <div>
                  {/* Filter & Search Bar */}
                  <div
                    className="glass-card"
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    {/* Status Pills */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setResFilter(st)}
                          style={{
                            padding: '0.45rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            background: resFilter === st ? 'var(--color-primary)' : 'var(--bg-surface)',
                            color: resFilter === st ? 'var(--color-primary-text)' : 'var(--text-secondary)',
                            border: resFilter === st ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Search Field */}
                    <div style={{ position: 'relative', minWidth: '240px' }}>
                      <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Search guest, phone, email, ID..."
                        value={resSearch}
                        onChange={(e) => setResSearch(e.target.value)}
                        style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {/* Reservations Table / Cards */}
                  {filteredReservations.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                      <CalendarCheck size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>No reservations found</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Try adjusting your search criteria or status filter.
                      </p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          textAlign: 'left',
                          fontSize: '0.88rem'
                        }}
                      >
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
                            <th style={{ padding: '0.85rem 1rem' }}>Code</th>
                            <th style={{ padding: '0.85rem 1rem' }}>Guest Details</th>
                            <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
                            <th style={{ padding: '0.85rem 1rem' }}>Guests & Zone</th>
                            <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                            <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredReservations.map((r) => {
                            const statusLower = (r.status || 'pending').toLowerCase();
                            return (
                              <tr
                                key={r.id}
                                style={{
                                  borderBottom: '1px solid var(--border-subtle)',
                                  background: 'var(--bg-card)',
                                  transition: 'background var(--transition-fast)'
                                }}
                              >
                                <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                                  {r.id}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {r.name || r.fullName}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    {r.phone} • {r.email}
                                  </div>
                                  {r.specialRequest && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                                      Note: "{r.specialRequest}"
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                  <div style={{ fontWeight: 600 }}>{r.date}</div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.time || r.timeSlot}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                  <div><strong>{r.guests || r.guestsCount}</strong> Guests</div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    {r.seatingPreference || r.zone} • {r.occasion}
                                  </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                  <span
                                    style={{
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      padding: '0.25rem 0.75rem',
                                      borderRadius: 'var(--radius-full)',
                                      background:
                                        statusLower === 'confirmed'
                                          ? 'rgba(16, 185, 129, 0.14)'
                                          : statusLower === 'cancelled'
                                          ? 'rgba(225, 29, 72, 0.14)'
                                          : statusLower === 'completed'
                                          ? 'rgba(59, 130, 246, 0.14)'
                                          : 'rgba(234, 179, 8, 0.14)',
                                      color:
                                        statusLower === 'confirmed'
                                          ? '#10B981'
                                          : statusLower === 'cancelled'
                                          ? '#E11D48'
                                          : statusLower === 'completed'
                                          ? '#3B82F6'
                                          : '#EAB308'
                                    }}
                                  >
                                    {r.status || 'Pending'}
                                  </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                    {statusLower !== 'confirmed' && (
                                      <button
                                        onClick={() => handleUpdateResStatus(r.id, 'Confirmed')}
                                        title="Confirm Reservation"
                                        style={{
                                          padding: '0.35rem 0.75rem',
                                          fontSize: '0.78rem',
                                          fontWeight: 600,
                                          borderRadius: 'var(--radius-sm)',
                                          background: 'rgba(16, 185, 129, 0.12)',
                                          color: '#10B981',
                                          border: '1px solid rgba(16, 185, 129, 0.3)'
                                        }}
                                      >
                                        Confirm
                                      </button>
                                    )}

                                    {statusLower !== 'completed' && (
                                      <button
                                        onClick={() => handleUpdateResStatus(r.id, 'Completed')}
                                        title="Mark as Completed"
                                        style={{
                                          padding: '0.35rem 0.75rem',
                                          fontSize: '0.78rem',
                                          fontWeight: 600,
                                          borderRadius: 'var(--radius-sm)',
                                          background: 'rgba(59, 130, 246, 0.12)',
                                          color: '#3B82F6',
                                          border: '1px solid rgba(59, 130, 246, 0.3)'
                                        }}
                                      >
                                        Complete
                                      </button>
                                    )}

                                    {statusLower !== 'cancelled' && (
                                      <button
                                        onClick={() => handleUpdateResStatus(r.id, 'Cancelled')}
                                        title="Cancel Reservation"
                                        style={{
                                          padding: '0.35rem 0.75rem',
                                          fontSize: '0.78rem',
                                          fontWeight: 600,
                                          borderRadius: 'var(--radius-sm)',
                                          background: 'rgba(225, 29, 72, 0.12)',
                                          color: '#E11D48',
                                          border: '1px solid rgba(225, 29, 72, 0.3)'
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteRes(r.id)}
                                      title="Delete"
                                      style={{
                                        padding: '0.35rem 0.55rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-secondary)',
                                        color: 'var(--text-muted)',
                                        border: '1px solid var(--border-subtle)'
                                      }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ==============================================================
                  TAB 3: MENU MANAGEMENT
                  ============================================================== */}
              {activeTab === 'menu' && (
                <div>
                  {/* Menu Toolbar */}
                  <div
                    className="glass-card"
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['All', ...MENU_CATEGORIES].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setMenuFilter(cat)}
                          style={{
                            padding: '0.45rem 0.9rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            background: menuFilter === cat ? 'var(--color-primary)' : 'var(--bg-surface)',
                            color: menuFilter === cat ? 'var(--color-primary-text)' : 'var(--text-secondary)',
                            border: menuFilter === cat ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ position: 'relative', minWidth: '220px' }}>
                        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="Search menu..."
                          value={menuSearch}
                          onChange={(e) => setMenuSearch(e.target.value)}
                          style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.85rem' }}
                        />
                      </div>

                      <Button onClick={handleOpenAddMenu} variant="primary" icon={Plus}>
                        Add Item
                      </Button>
                    </div>
                  </div>

                  {/* Menu Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filteredMenuItems.map((item) => {
                      const isAvailable = item.isAvailable !== false;
                      return (
                        <div
                          key={item.id}
                          className="glass-card"
                          style={{
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            opacity: isAvailable ? 1 : 0.65,
                            border: isAvailable ? '1px solid var(--border-subtle)' : '1px dashed #E11D48'
                          }}
                        >
                          {/* Item Thumbnail */}
                          <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.35rem' }}>
                              <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-non-veg'}`}>
                                {item.isVeg ? 'Veg' : 'Non-Veg'}
                              </span>
                              {item.isChefSpecial && <span className="badge badge-gold">Chef Special</span>}
                            </div>

                            {!isAvailable && (
                              <div
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'rgba(0, 0, 0, 0.6)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#FFFFFF',
                                  fontWeight: 700,
                                  fontSize: '0.9rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em'
                                }}
                              >
                                Currently Disabled
                              </div>
                            )}
                          </div>

                          {/* Item Content */}
                          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                                  {item.category}
                                </span>
                                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                                  ₹{item.price}
                                </span>
                              </div>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
                                {item.name}
                              </h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.85rem' }}>
                                {item.description}
                              </p>
                            </div>

                            {/* Item Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                              {/* Enable/Disable Toggle */}
                              <button
                                onClick={() => handleToggleMenuAvailability(item.id, isAvailable)}
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: 'var(--radius-full)',
                                  background: isAvailable ? 'rgba(16, 185, 129, 0.12)' : 'rgba(225, 29, 72, 0.12)',
                                  color: isAvailable ? '#10B981' : '#E11D48',
                                  border: isAvailable ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(225, 29, 72, 0.3)'
                                }}
                              >
                                {isAvailable ? 'Enabled' : 'Disabled'}
                              </button>

                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button
                                  onClick={() => handleOpenEditMenu(item)}
                                  title="Edit item"
                                  style={{
                                    padding: '0.4rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-subtle)'
                                  }}
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMenu(item.id, item.name)}
                                  title="Delete item"
                                  style={{
                                    padding: '0.4rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(225, 29, 72, 0.1)',
                                    color: '#E11D48',
                                    border: '1px solid rgba(225, 29, 72, 0.25)'
                                  }}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB 4: BLOG MANAGEMENT
                  ============================================================== */}
              {activeTab === 'blogs' && (
                <div>
                  {/* Blog Toolbar */}
                  <div
                    className="glass-card"
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['All', ...BLOG_CATEGORIES].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setBlogFilter(cat)}
                          style={{
                            padding: '0.45rem 0.9rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            background: blogFilter === cat ? 'var(--color-primary)' : 'var(--bg-surface)',
                            color: blogFilter === cat ? 'var(--color-primary-text)' : 'var(--text-secondary)',
                            border: blogFilter === cat ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ position: 'relative', minWidth: '220px' }}>
                        <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="Search articles..."
                          value={blogSearch}
                          onChange={(e) => setBlogSearch(e.target.value)}
                          style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.85rem' }}
                        />
                      </div>

                      <Button onClick={handleOpenAddBlog} variant="primary" icon={Plus}>
                        New Post
                      </Button>
                    </div>
                  </div>

                  {/* Blog Cards List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {filteredBlogs.map((post) => {
                      const isPublished = post.isPublished !== false;
                      return (
                        <div
                          key={post.id}
                          className="glass-card"
                          style={{
                            padding: '1.25rem',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1.25rem'
                          }}
                        >
                          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              style={{ width: '100px', height: '70px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                                  {post.category}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    padding: '0.15rem 0.55rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)',
                                    color: isPublished ? '#10B981' : '#EAB308'
                                  }}
                                >
                                  {isPublished ? 'Published' : 'Draft'}
                                </span>
                              </div>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>
                                {post.title}
                              </h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                                By {post.author} • {post.readTime}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            {/* Toggle Publish / Unpublish */}
                            <button
                              onClick={() => handleTogglePublishBlog(post.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.45rem 0.85rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                background: isPublished ? 'rgba(234, 179, 8, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                                color: isPublished ? '#EAB308' : '#10B981',
                                border: isPublished ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                              }}
                            >
                              {isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                              <span>{isPublished ? 'Unpublish' : 'Publish'}</span>
                            </button>

                            <button
                              onClick={() => handleOpenEditBlog(post)}
                              title="Edit post"
                              style={{
                                padding: '0.45rem 0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.8rem',
                                fontWeight: 600
                              }}
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteBlog(post.id, post.title)}
                              title="Delete post"
                              style={{
                                padding: '0.45rem',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(225, 29, 72, 0.1)',
                                color: '#E11D48',
                                border: '1px solid rgba(225, 29, 72, 0.25)'
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB 5: CONTACT INQUIRIES
                  ============================================================== */}
              {activeTab === 'messages' && (
                <div>
                  {/* Status Filters */}
                  <div
                    className="glass-card"
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      gap: '0.45rem'
                    }}
                  >
                    {['All', 'Unread', 'Read', 'Resolved'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setMsgFilter(st)}
                        style={{
                          padding: '0.45rem 1rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          background: msgFilter === st ? 'var(--color-primary)' : 'var(--bg-surface)',
                          color: msgFilter === st ? 'var(--color-primary-text)' : 'var(--text-secondary)',
                          border: msgFilter === st ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)'
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Messages Feed */}
                  {filteredMessages.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                      <MessageSquare size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>No messages found</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>All inquiries are caught up.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {filteredMessages.map((msg) => {
                        const statusLower = (msg.status || 'unread').toLowerCase();
                        return (
                          <div
                            key={msg.id}
                            className="glass-card"
                            style={{
                              padding: '1.5rem',
                              borderRadius: 'var(--radius-lg)',
                              borderLeft: statusLower === 'unread' ? '4px solid #EAB308' : statusLower === 'resolved' ? '4px solid #10B981' : '1px solid var(--border-subtle)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                                    {msg.fullName || msg.name}
                                  </h4>
                                  <span
                                    style={{
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      textTransform: 'uppercase',
                                      padding: '0.15rem 0.6rem',
                                      borderRadius: 'var(--radius-full)',
                                      background:
                                        statusLower === 'resolved'
                                          ? 'rgba(16, 185, 129, 0.12)'
                                          : statusLower === 'read'
                                          ? 'rgba(59, 130, 246, 0.12)'
                                          : 'rgba(234, 179, 8, 0.12)',
                                      color:
                                        statusLower === 'resolved'
                                          ? '#10B981'
                                          : statusLower === 'read'
                                          ? '#3B82F6'
                                          : '#EAB308'
                                    }}
                                  >
                                    {msg.status || 'Unread'}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                  {msg.email} {msg.phone ? `• ${msg.phone}` : ''} • Received {new Date(msg.createdAt || Date.now()).toLocaleDateString()}
                                </div>
                              </div>

                              {/* Message Actions */}
                              <div style={{ display: 'flex', gap: '0.45rem' }}>
                                {statusLower !== 'read' && (
                                  <button
                                    onClick={() => handleUpdateMsgStatus(msg.id, 'Read')}
                                    style={{
                                      padding: '0.35rem 0.75rem',
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      borderRadius: 'var(--radius-sm)',
                                      background: 'rgba(59, 130, 246, 0.12)',
                                      color: '#3B82F6',
                                      border: '1px solid rgba(59, 130, 246, 0.3)'
                                    }}
                                  >
                                    Mark Read
                                  </button>
                                )}

                                {statusLower !== 'resolved' && (
                                  <button
                                    onClick={() => handleUpdateMsgStatus(msg.id, 'Resolved')}
                                    style={{
                                      padding: '0.35rem 0.75rem',
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      borderRadius: 'var(--radius-sm)',
                                      background: 'rgba(16, 185, 129, 0.12)',
                                      color: '#10B981',
                                      border: '1px solid rgba(16, 185, 129, 0.3)'
                                    }}
                                  >
                                    Mark Resolved
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  title="Delete message"
                                  style={{
                                    padding: '0.35rem 0.55rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-muted)',
                                    border: '1px solid var(--border-subtle)'
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            {msg.subject && (
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                                Subject: {msg.subject}
                              </div>
                            )}

                            <div
                              style={{
                                background: 'var(--bg-secondary)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)',
                                lineHeight: 1.55
                              }}
                            >
                              {msg.message}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==============================================================
          MODAL: ADD / EDIT MENU ITEM
          ============================================================== */}
      <Modal
        isOpen={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        title={editingMenuItem ? `Edit "${editingMenuItem.name}"` : 'Add New Menu Item'}
        maxWidth="640px"
      >
        <form onSubmit={handleSaveMenu} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hazelnut Pour-Over Cold Brew"
              value={menuFormData.name}
              onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Category *
              </label>
              <select
                value={menuFormData.category}
                onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
              >
                {MENU_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={menuFormData.price}
                onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={menuFormData.isVeg}
                onChange={(e) => setMenuFormData({ ...menuFormData, isVeg: e.target.checked })}
                style={{ width: 'auto' }}
              />
              <span>Vegetarian Dish</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={menuFormData.isChefSpecial}
                onChange={(e) => setMenuFormData({ ...menuFormData, isChefSpecial: e.target.checked })}
                style={{ width: 'auto' }}
              />
              <span>Chef's Special Recommendation</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={menuFormData.isPopular}
                onChange={(e) => setMenuFormData({ ...menuFormData, isPopular: e.target.checked })}
                style={{ width: 'auto' }}
              />
              <span>Popular Item</span>
            </label>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Image URL *
            </label>
            <input
              type="url"
              required
              value={menuFormData.image}
              onChange={(e) => setMenuFormData({ ...menuFormData, image: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Description *
            </label>
            <textarea
              rows="3"
              required
              placeholder="Flavor notes, ingredients, crust details..."
              value={menuFormData.description}
              onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Sourdough, Artisan, Truffle"
              value={menuFormData.tags}
              onChange={(e) => setMenuFormData({ ...menuFormData, tags: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowMenuModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary">
              {editingMenuItem ? 'Save Changes' : 'Create Menu Item'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ==============================================================
          MODAL: ADD / EDIT BLOG POST
          ============================================================== */}
      <Modal
        isOpen={showBlogModal}
        onClose={() => setShowBlogModal(false)}
        title={editingBlog ? `Edit "${editingBlog.title}"` : 'Write New Blog Article'}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Article Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 5 Secret Date Night Spots Inside Cafe Love Byte"
              value={blogFormData.title}
              onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Category *
              </label>
              <select
                value={blogFormData.category}
                onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Read Time
              </label>
              <input
                type="text"
                placeholder="4 min read"
                value={blogFormData.readTime}
                onChange={(e) => setBlogFormData({ ...blogFormData, readTime: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Author
              </label>
              <input
                type="text"
                value={blogFormData.author}
                onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="Dates, Vibe, Coffee"
                value={blogFormData.tags}
                onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Cover Image URL *
            </label>
            <input
              type="url"
              required
              value={blogFormData.coverImage}
              onChange={(e) => setBlogFormData({ ...blogFormData, coverImage: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Short Excerpt *
            </label>
            <textarea
              rows="2"
              required
              placeholder="Teaser summary displayed on blog cards..."
              value={blogFormData.excerpt}
              onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Article Body Content
            </label>
            <textarea
              rows="6"
              placeholder="Write the full editorial content..."
              value={blogFormData.content}
              onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={blogFormData.isPublished}
              onChange={(e) => setBlogFormData({ ...blogFormData, isPublished: e.target.checked })}
              style={{ width: 'auto' }}
            />
            <span>Publish live immediately (uncheck to save as Draft)</span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowBlogModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary">
              {editingBlog ? 'Update Post' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
