"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminSupabase as supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Users, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter, Plus, Edit, Trash2, ShoppingCart, TicketPercent, FileText, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { COUPON_SERVICE_KEYS, type ServiceKey } from '@/lib/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogAdminPanel from './BlogAdminPanel';
import { CVPdfDocument } from '@/components/CVExport/pdf/CVPdfDocument';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserProfile {
  paid: any;
  paydate: string | null;
  subscription_status: 'active' | 'canceled' | string | null;
  id: string;
  user_id: string;
  full_name: string | null;
  headline: string | null;
  summary: string | null;
  profile_picture_url: string | null;
  location: string | null;
  phone: string | null;
  linkedin_url: string | null;
  website: string | null;
  birthdate: string | null;
  civil_status: string | null;
  place_of_origin: string | null;
  created_at: string;
  email?: string; // Optional email field (requires database schema update)
}

interface Experience {
  id: string;
  user_id: string;
  company: string;
  job_title: string | null;
  employment_type: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  location: string | null;
}

interface Education {
  id: string;
  user_id: string;
  institution: string;
  degree: string | null;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

interface Skill {
  id: string;
  user_id: string;
  skill_name: string;
  proficiency: string | null;
}

interface Language {
  id: string;
  user_id: string;
  language_name: string;
  proficiency: string | null;
}

interface UserData {
  profile: UserProfile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
}

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percent' | 'free';
  discount_value: number | null;
  applicable_services: ServiceKey[];
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  redemption_count: number;
  max_redemptions: number | null;
  max_redemptions_per_user: number | null;
  min_order_amount: number | null;
  campaign_tag: string | null;
  created_at: string;
  updated_at: string;
}

interface CouponFormState {
  code: string;
  description: string;
  discountType: 'percent' | 'free';
  discountValue: string;
  maxRedemptions: string;
  maxRedemptionsPerUser: string;
  minOrderAmount: string;
  campaignTag: string;
  applicableServices: ServiceKey[];
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

interface Order {
  id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  service_type: string;
  service_label: string;
  original_price: number | null;
  final_price: number | null;
  payment_status: 'pending' | 'paid' | 'free_coupon' | 'failed' | string;
  status: 'pending' | 'paid' | 'processed' | 'failed' | string;
  coupon_code: string | null;
  coupon_discount_type: 'percent' | 'free' | null;
  coupon_discount_value: number | null;
  is_external: boolean | null;
  external_source: string | null;
  cv_file_name: string | null;
  salary_file_name: string | null;
  linkedin_url: string | null;
  remarks: string | null;
  created_at: string;
  paid_at: string | null;
  processed_at: string | null;
}

const serviceLabels: Record<ServiceKey, string> = {
  'service-career': 'Career Service',
  'service-check': 'Check Service',
  'service-cv': 'CV Service',
  'service-motivation': 'Motivation Service',
  'service-rav': 'RAV Service',
  'service-salary': 'Salary Service',
};

const adminEmails = ['jan@cvolution.ch', 'armend@cvolution.ch'];
const FIXED_PERCENT_DISCOUNT = 30;

const emptyCouponForm = (): CouponFormState => {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  return {
    code: '',
    description: '',
    discountType: 'percent',
    discountValue: String(FIXED_PERCENT_DISCOUNT),
    maxRedemptions: '',
    maxRedemptionsPerUser: '',
    minOrderAmount: '',
    campaignTag: '',
    applicableServices: [],
    startsAt: toDatetimeLocal(start.toISOString()),
    endsAt: toDatetimeLocal(end.toISOString()),
    isActive: true,
  };
};


function toDateInputValue(value: Date) {
  return value.toISOString().slice(0, 10);
}

function getDefaultOrdersDateFrom() {
  const today = new Date();
  today.setMonth(today.getMonth() - 1);
  return toDateInputValue(today);
}

function toDatetimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function getCouponStatus(coupon: Coupon) {
  const now = new Date();
  if (!coupon.is_active) return { label: 'Inaktiv', className: 'bg-gray-100 text-gray-700 border-gray-200' };
  if (now < new Date(coupon.starts_at)) return { label: 'Geplant', className: 'bg-blue-50 text-blue-700 border-blue-200' };
  if (now > new Date(coupon.ends_at)) return { label: 'Abgelaufen', className: 'bg-red-50 text-red-700 border-red-200' };
  return { label: 'Aktiv', className: 'bg-green-50 text-green-700 border-green-200' };
}

const AdminContent: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'canceled' | 'unknown'>('active');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<'all' | 'paid' | 'pending' | 'failed' | 'free_coupon'>('all');
  const [orderExternalFilter, setOrderExternalFilter] = useState<'all' | 'true' | 'false'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderDateFrom, setOrderDateFrom] = useState(getDefaultOrdersDateFrom);
  const [orderDateTo, setOrderDateTo] = useState(() => toDateInputValue(new Date()));
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPaidTotal, setOrderPaidTotal] = useState(0);
  const [orderPendingTotal, setOrderPendingTotal] = useState(0);
  const ORDER_PAGE_SIZE = 20;
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [couponForm, setCouponForm] = useState<CouponFormState>(() => emptyCouponForm());
  const [couponFormError, setCouponFormError] = useState('');
  const [exportingUserId, setExportingUserId] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers();
      fetchCoupons();
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    const { data } = await ensureAdminSession();
    const sessionEmail = data.session?.user.email?.toLowerCase();

    if (data.session && sessionEmail && adminEmails.includes(sessionEmail)) {
      setIsAdmin(true);
      setAdminEmail(sessionEmail);
      return;
    }

    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const ensureAdminSession = async () => {
    return supabase.auth.getSession();
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Hole alle Profile mit Email-Feld (muss in der Datenbank existieren)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Filtere Admin-Profile aus
      const nonAdminProfiles = profiles.filter(profile => {
        // Wenn email Feld existiert, prüfe ob es keine Admin-Email ist
        const profileWithEmail = profile as any;
        if (profileWithEmail.email) {
          return !adminEmails.includes(profileWithEmail.email.toLowerCase());
        }
        // Wenn kein email Feld, zeige das Profil an
        return true;
      });

      const usersData: UserData[] = await Promise.all(
        nonAdminProfiles.map(async (profile) => {
          const [experiences, education, skills, languages] = await Promise.all([
            supabase
              .from('experiences')
              .select('*')
              .eq('user_id', profile.user_id)
              .then(({ data }) => data || []),
            supabase
              .from('education')
              .select('*')
              .eq('user_id', profile.user_id)
              .then(({ data }) => data || []),
            supabase
              .from('skills')
              .select('*')
              .eq('user_id', profile.user_id)
              .then(({ data }) => data || []),
            supabase
              .from('languages')
              .select('*')
              .eq('user_id', profile.user_id)
              .then(({ data }) => data || []),
          ]);

          return {
            profile: profile as unknown as UserProfile,
            experiences: experiences as Experience[],
            education: education as Education[],
            skills: skills as Skill[],
            languages: languages as Language[],
          };
        })
      );

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Fehler',
        description: 'Fehler beim Laden der Benutzerdaten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getAdminHeaders = async () => {
    const { data } = await ensureAdminSession();
    const token = data.session?.access_token;
    const email = data.session?.user.email?.toLowerCase();
    if (!token || !email || !adminEmails.includes(email)) {
      router.push('/admin/login');
      throw new Error('Bitte melden Sie sich erneut als Admin an.');
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchCoupons = async () => {
    setCouponLoading(true);
    try {
      const headers = await getAdminHeaders();
      const res = await fetch('/api/admin/coupons', { headers });
      if (!res.ok) throw new Error('Coupons konnten nicht geladen werden.');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast({ title: 'Fehler', description: 'Coupons konnten nicht geladen werden.', variant: 'destructive' });
    } finally {
      setCouponLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const headers = await getAdminHeaders();
      const params = new URLSearchParams();
      if (orderPaymentFilter !== 'all') params.set('paymentStatus', orderPaymentFilter);
      if (orderExternalFilter !== 'all') params.set('isExternal', orderExternalFilter);
      if (orderSearch.trim()) params.set('search', orderSearch.trim());
      if (orderDateFrom) params.set('dateFrom', orderDateFrom);
      if (orderDateTo) params.set('dateTo', orderDateTo);
      params.set('page', String(orderPage));
      params.set('pageSize', String(ORDER_PAGE_SIZE));
      const query = params.toString();
      const res = await fetch(`/api/admin/orders${query ? `?${query}` : ''}`, { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bestellungen konnten nicht geladen werden.');
      setOrders(data.orders || []);
      setOrderTotal(typeof data.total === 'number' ? data.total : (data.orders || []).length);
      setOrderPaidTotal(typeof data.summary?.paid === 'number' ? data.summary.paid : 0);
      setOrderPendingTotal(typeof data.summary?.pending === 'number' ? data.summary.pending : 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({ title: 'Fehler', description: 'Bestellungen konnten nicht geladen werden.', variant: 'destructive' });
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
  }, [isAdmin, orderPaymentFilter, orderExternalFilter, orderSearch, orderDateFrom, orderDateTo, orderPage]);

  const startCreateCoupon = () => {
    setEditingCouponId(null);
    setCouponForm(emptyCouponForm());
    setCouponFormError('');
    setShowCouponForm(true);
  };

  const startEditCoupon = (coupon: Coupon) => {
    setEditingCouponId(coupon.id);
    setCouponForm({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discount_type,
      discountValue: String(coupon.discount_type === 'percent' ? FIXED_PERCENT_DISCOUNT : 100),
      maxRedemptions: coupon.max_redemptions ? String(coupon.max_redemptions) : '',
      maxRedemptionsPerUser: coupon.max_redemptions_per_user ? String(coupon.max_redemptions_per_user) : '',
      minOrderAmount: coupon.min_order_amount ? String(coupon.min_order_amount) : '',
      campaignTag: coupon.campaign_tag || '',
      applicableServices: coupon.applicable_services,
      startsAt: toDatetimeLocal(coupon.starts_at),
      endsAt: toDatetimeLocal(coupon.ends_at),
      isActive: coupon.is_active,
    });
    setCouponFormError('');
    setShowCouponForm(true);
  };

  const validateCouponForm = () => {
    if (!couponForm.code.trim()) return 'Coupon Code ist erforderlich.';
    if (couponForm.applicableServices.length === 0) return 'Bitte mindestens einen Service auswählen.';
    if (!couponForm.startsAt || !couponForm.endsAt || new Date(couponForm.endsAt) <= new Date(couponForm.startsAt)) {
      return 'Enddatum/-zeit muss nach dem Start liegen.';
    }
    return '';
  };

  const submitCoupon = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateCouponForm();
    if (validationError) {
      setCouponFormError(validationError);
      return;
    }

    try {
      const headers = await getAdminHeaders();
      const payload = {
        code: couponForm.code,
        description: couponForm.description,
        discountType: couponForm.discountType,
        discountValue: couponForm.discountType === 'free' ? 100 : Number(couponForm.discountValue || FIXED_PERCENT_DISCOUNT),
        maxRedemptions: couponForm.maxRedemptions ? Number(couponForm.maxRedemptions) : null,
        maxRedemptionsPerUser: couponForm.maxRedemptionsPerUser ? Number(couponForm.maxRedemptionsPerUser) : null,
        minOrderAmount: couponForm.minOrderAmount ? Number(couponForm.minOrderAmount) : null,
        campaignTag: couponForm.campaignTag,
        applicableServices: couponForm.applicableServices,
        startsAt: new Date(couponForm.startsAt).toISOString(),
        endsAt: new Date(couponForm.endsAt).toISOString(),
        isActive: couponForm.isActive,
      };
      const res = await fetch(editingCouponId ? `/api/admin/coupons/${editingCouponId}` : '/api/admin/coupons', {
        method: editingCouponId ? 'PATCH' : 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Coupon konnte nicht gespeichert werden.');
      toast({ title: 'Gespeichert', description: 'Coupon wurde gespeichert.' });
      setShowCouponForm(false);
      await fetchCoupons();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Coupon konnte nicht gespeichert werden.';
      setCouponFormError(message);
    }
  };

  const toggleCouponService = (serviceKey: ServiceKey) => {
    setCouponForm((current) => ({
      ...current,
      applicableServices: current.applicableServices.includes(serviceKey)
        ? current.applicableServices.filter((key) => key !== serviceKey)
        : [...current.applicableServices, serviceKey],
    }));
  };

  const toggleCouponActive = async (coupon: Coupon) => {
    try {
      const headers = await getAdminHeaders();
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ isActive: !coupon.is_active }),
      });
      if (!res.ok) throw new Error('Status konnte nicht geändert werden.');
      await fetchCoupons();
    } catch {
      toast({ title: 'Fehler', description: 'Coupon-Status konnte nicht geändert werden.', variant: 'destructive' });
    }
  };

  const deleteCoupon = async (coupon: Coupon) => {
    if (!window.confirm(`Coupon ${coupon.code} wirklich löschen?`)) return;
    try {
      const headers = await getAdminHeaders();
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Coupon konnte nicht gelöscht werden.');
      await fetchCoupons();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Coupon konnte nicht gelöscht werden.';
      toast({ title: 'Fehler', description: message, variant: 'destructive' });
    }
  };

  const handleSignOut = async () => {
    // Lösche Admin-Session aus localStorage
    await supabase.auth.signOut();

    toast({
      title: 'Abgemeldet',
      description: 'Sie wurden erfolgreich abgemeldet.',
    });

    router.push('/admin/login');
  };

  const toggleUserExpanded = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Heute';
    return new Date(date).toLocaleDateString('de-DE');
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('de-CH');
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return '-';
    return `CHF ${Number(price).toFixed(2)}`;
  };

  const getOrderCustomerName = (order: Order) => {
    const fullName = [order.first_name, order.last_name].filter(Boolean).join(' ').trim();
    return fullName || order.name || 'Kein Name';
  };

  const getOrderPaymentStatus = (status: Order['payment_status']) => {
    if (status === 'paid') return { label: 'Bezahlt', className: 'bg-green-50 text-green-700 border-green-200' };
    if (status === 'free_coupon') return { label: 'Gratis-Coupon', className: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (status === 'failed') return { label: 'Fehlgeschlagen', className: 'bg-red-50 text-red-700 border-red-200' };
    return { label: 'Ausstehend', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
  };

  const getCvFileName = (profile: UserProfile) => {
    const name = profile.full_name?.trim() || profile.email?.split('@')[0] || 'Benutzer';
    const safeName = name.replace(/[^a-zA-Z0-9äöüÄÖÜéèàÉÈÀß]+/g, '_').replace(/^_+|_+$/g, '');
    return `Lebenslauf_${safeName || 'Benutzer'}.pdf`;
  };

  const downloadClassicCv = async (userData: UserData) => {
    setExportingUserId(userData.profile.user_id);
    try {
      const pdf = (await import('@react-pdf/renderer')).pdf;
      const doc = (
        <CVPdfDocument
          user={{ email: userData.profile.email || '' }}
          profile={userData.profile}
          experiences={userData.experiences}
          education={userData.education}
          skills={userData.skills}
          languages={userData.languages}
          design="design3"
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getCvFileName(userData.profile);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Admin CV export failed:', error);
      toast({
        title: 'Fehler',
        description: 'Der klassische Lebenslauf konnte nicht exportiert werden.',
        variant: 'destructive',
      });
    } finally {
      setExportingUserId(null);
    }
  };

  if (!isAdmin) {
    return null;
  }

  const getSubscriptionState = (user: UserData): 'active' | 'canceled' | 'unknown' => {
    if (user.profile.subscription_status === 'active') return 'active';
    if (user.profile.subscription_status === 'canceled') return 'canceled';
    return 'unknown';
  };

  const getSubscriptionStatus = (status: UserProfile['subscription_status']) => {
    if (status === 'active') {
      return { label: 'Aktiv', className: 'bg-green-50 text-green-700 border-green-200' };
    }
    if (status === 'canceled') {
      return { label: 'Gekündigt', className: 'bg-red-50 text-red-700 border-red-200' };
    }
    return { label: 'Unknown', className: 'bg-gray-50 text-gray-700 border-gray-200' };
  };

  // Filter users based on subscription_status.
  const filteredUsers = users.filter(user => {
    if (activeFilter === 'all') return true;
    return getSubscriptionState(user) === activeFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleFilterChange = (value: string) => {
    setActiveFilter(value as 'all' | 'active' | 'canceled' | 'unknown');
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Count users by subscription_status.
  const activeCount = users.filter((user) => getSubscriptionState(user) === 'active').length;
  const canceledCount = users.filter((user) => getSubscriptionState(user) === 'canceled').length;
  const unknownCount = users.filter((user) => getSubscriptionState(user) === 'unknown').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-[#204878] mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              {/* <Badge variant="secondary" className="ml-3 text-gray-900">
                {users.length} Benutzer
              </Badge> */}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:inline">
                {adminEmail}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="bg-[#204878] text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="coupons" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 h-auto p-1">
            <TabsTrigger value="coupons" className="gap-2 data-[state=active]:bg-[#204878] text-black data-[state=active]:text-white">
              <TicketPercent className="h-4 w-4" />
              Coupons
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-[#204878] text-black data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              Benutzer
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-[#204878] text-black data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2 data-[state=active]:bg-[#204878] text-black data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coupons" className="mt-0">
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Coupon Codes</h2>
              <p className="text-sm text-gray-600">Rabatte erstellen, zeitlich steuern und pro Service freigeben.</p>
            </div>
            <Button onClick={startCreateCoupon} className="bg-[#204878] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Coupon erstellen
            </Button>
          </div>

          {showCouponForm && (
            <Card className="mb-6 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900">{editingCouponId ? 'Coupon bearbeiten' : 'Coupon erstellen'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitCoupon} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Coupon Code</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm text-gray-900"
                      value={couponForm.code}
                      onChange={(event) => setCouponForm({ ...couponForm, code: event.target.value.toUpperCase().trim() })}
                      placeholder="FRAUEN2026"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Beschreibung</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm text-gray-900"
                      value={couponForm.description}
                      onChange={(event) => setCouponForm({ ...couponForm, description: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Rabatt-Art</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white"
                      value={couponForm.discountType}
                      onChange={(event) => {
                        const discountType = event.target.value as 'percent' | 'free';
                        setCouponForm({
                          ...couponForm,
                          discountType,
                          discountValue: String(discountType === 'percent' ? FIXED_PERCENT_DISCOUNT : 100),
                        });
                      }}
                    >
                      <option value="percent">Prozentualer Rabatt</option>
                      <option value="free">Gratis / 100%</option>
                    </select>
                  </div>
                  {couponForm.discountType === 'percent' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Rabattwert</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="w-full border rounded-md px-3 py-2 text-sm text-gray-900"
                        value={couponForm.discountValue}
                        onChange={(event) => setCouponForm({ ...couponForm, discountValue: event.target.value })}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Max. Einlösungen (optional)</label>
                    <input type="number" min="1" className="w-full border rounded-md px-3 py-2 text-sm text-gray-900" value={couponForm.maxRedemptions} onChange={(event) => setCouponForm({ ...couponForm, maxRedemptions: event.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Max. pro Benutzer (optional)</label>
                    <input type="number" min="1" className="w-full border rounded-md px-3 py-2 text-sm text-gray-900" value={couponForm.maxRedemptionsPerUser} onChange={(event) => setCouponForm({ ...couponForm, maxRedemptionsPerUser: event.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Mindestbestellwert CHF (optional)</label>
                    <input type="number" step="0.01" min="0" className="w-full border rounded-md px-3 py-2 text-sm text-gray-900" value={couponForm.minOrderAmount} onChange={(event) => setCouponForm({ ...couponForm, minOrderAmount: event.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Campaign Tag (optional)</label>
                    <input className="w-full border rounded-md px-3 py-2 text-sm text-gray-900" value={couponForm.campaignTag} onChange={(event) => setCouponForm({ ...couponForm, campaignTag: event.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Startdatum und Startzeit</label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded-md px-3 py-2 text-sm text-gray-900"
                      value={couponForm.startsAt}
                      onChange={(event) => setCouponForm({ ...couponForm, startsAt: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Enddatum und Endzeit</label>
                    <input
                      type="datetime-local"
                      className="w-full border rounded-md px-3 py-2 text-sm text-gray-900"
                      value={couponForm.endsAt}
                      onChange={(event) => setCouponForm({ ...couponForm, endsAt: event.target.value })}
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-900 pt-6">
                    <input
                      type="checkbox"
                      checked={couponForm.isActive}
                      onChange={(event) => setCouponForm({ ...couponForm, isActive: event.target.checked })}
                    />
                    Aktiv
                  </label>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-900 mb-2">Services</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {COUPON_SERVICE_KEYS.map((serviceKey) => (
                        <label key={serviceKey} className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm text-gray-900">
                          <input
                            type="checkbox"
                            checked={couponForm.applicableServices.includes(serviceKey)}
                            onChange={() => toggleCouponService(serviceKey)}
                          />
                          {serviceLabels[serviceKey]}
                        </label>
                      ))}
                    </div>
                  </div>
                  {couponFormError && (
                    <p className="md:col-span-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                      {couponFormError}
                    </p>
                  )}
                  <div className="md:col-span-2 flex gap-2">
                    <Button type="submit" className="bg-[#204878] text-white">Speichern</Button>
                    <Button type="button" variant="outline" onClick={() => setShowCouponForm(false)}>Abbrechen</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white">
            <CardContent className="p-0 overflow-x-auto">
              {couponLoading ? (
                <p className="p-6 text-sm text-gray-500">Lade Coupons...</p>
              ) : coupons.length === 0 ? (
                <p className="p-6 text-sm text-gray-500">Noch keine Coupons erstellt.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-700">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Rabatt</th>
                      <th className="p-3">Services</th>
                      <th className="p-3">Zeitraum</th>
                      <th className="p-3">Einlösungen</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => {
                      const status = getCouponStatus(coupon);
                      return (
                        <tr key={coupon.id} className="border-t">
                          <td className="p-3 font-semibold text-gray-900">{coupon.code}</td>
                          <td className="p-3 text-gray-700">
                            {coupon.discount_type === 'free' ? 'Gratis' : `${coupon.discount_value}%`}
                          </td>
                          <td className="p-3 text-gray-700">
                            {coupon.applicable_services.map((key) => serviceLabels[key]).join(', ')}
                          </td>
                          <td className="p-3 text-gray-700">
                            {new Date(coupon.starts_at).toLocaleString('de-CH')} - {new Date(coupon.ends_at).toLocaleString('de-CH')}
                          </td>
                          <td className="p-3 text-gray-700">{coupon.redemption_count}</td>
                          <td className="p-3">
                            <Badge variant="outline" className={status.className}>{status.label}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => startEditCoupon(coupon)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => toggleCouponActive(coupon)}>
                                {coupon.is_active ? 'Deaktivieren' : 'Aktivieren'}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => deleteCoupon(coupon)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </section>
          </TabsContent>

          <TabsContent value="blog" className="mt-0">
            <BlogAdminPanel />
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
                  <p className="text-sm text-gray-600">Alle Bestellungen mit Service, Kontakt, Preis, Coupon und Zahlungsstatus.</p>
                </div>
                <Button onClick={fetchOrders} variant="outline" className="bg-white text-gray-900">
                  Aktualisieren
                </Button>
              </div>
              <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <input className="w-full border rounded-md px-3 py-2 text-sm text-gray-900" placeholder="Suche..." value={orderSearch} onChange={(event) => { setOrderPage(1); setOrderSearch(event.target.value); }} />
                <input type="date" className="w-full min-w-0 max-w-full appearance-none border rounded-md px-3 py-2 text-sm text-gray-900" value={orderDateFrom} onChange={(event) => { setOrderPage(1); setOrderDateFrom(event.target.value); }} />
                <input type="date" className="w-full min-w-0 max-w-full appearance-none border rounded-md px-3 py-2 text-sm text-gray-900" value={orderDateTo} onChange={(event) => { setOrderPage(1); setOrderDateTo(event.target.value); }} />
                <Select value={orderPaymentFilter} onValueChange={(v) => setOrderPaymentFilter(v as typeof orderPaymentFilter)}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="Payment-Status filtern" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Payment: Alle</SelectItem>
                    <SelectItem value="paid">Payment: Bezahlt</SelectItem>
                    <SelectItem value="pending">Payment: Ausstehend</SelectItem>
                    <SelectItem value="failed">Payment: Fehlgeschlagen</SelectItem>
                    <SelectItem value="free_coupon">Payment: Gratis-Coupon</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={orderExternalFilter} onValueChange={(v) => setOrderExternalFilter(v as typeof orderExternalFilter)}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="External filtern" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">Extern: Alle</SelectItem>
                    <SelectItem value="true">Extern: Ja</SelectItem>
                    <SelectItem value="false">Extern: Nein</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Orders gesamt</p>
                    <p className="text-2xl font-semibold text-gray-900">{orderTotal}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Bezahlt</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {orderPaidTotal}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Ausstehend</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {orderPendingTotal}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white">
                <CardContent className="p-0 overflow-x-auto">
                  {ordersLoading ? (
                    <p className="p-6 text-sm text-gray-500">Lade Orders...</p>
                  ) : orders.length === 0 ? (
                    <p className="p-6 text-sm text-gray-500">Noch keine Orders gefunden.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-left text-gray-700">
                        <tr>
                          <th className="p-3">Datum</th>
                          <th className="p-3">Order-ID</th>
                          <th className="p-3">Kunde</th>
                          <th className="p-3">Service</th>
                          <th className="p-3">Extern</th>
                          <th className="p-3">Preis</th>
                          <th className="p-3">Coupon</th>
                          <th className="p-3">Zahlung</th>
                          <th className="p-3">Dateien</th>
                          <th className="p-3">Notizen</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const paymentStatus = getOrderPaymentStatus(order.payment_status);
                          const files = [order.cv_file_name, order.salary_file_name].filter(Boolean).join(', ');
                          return (
                            <tr key={order.id} className="border-t align-top">
                              <td className="p-3 text-gray-700 whitespace-nowrap">{formatDateTime(order.created_at)}</td>
                              <td className="p-3 text-gray-700 font-mono text-xs">{order.id}</td>
                              <td className="p-3 text-gray-700">
                                <p className="font-semibold text-gray-900">{getOrderCustomerName(order)}</p>
                                <p>{order.email}</p>
                                {order.linkedin_url && (
                                  <a href={order.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    LinkedIn
                                  </a>
                                )}
                              </td>
                              <td className="p-3 text-gray-700">
                                <p className="font-semibold text-gray-900">{order.service_label}</p>
                                <p className="text-xs text-gray-500">{order.service_type}</p>
                              </td>
                              <td className="p-3 text-gray-700">
                                {order.is_external ? (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Ja{order.external_source ? ` (${order.external_source})` : ''}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Nein</Badge>
                                )}
                              </td>
                              <td className="p-3 text-gray-700 whitespace-nowrap">
                                <p>{formatPrice(order.final_price)}</p>
                                {order.original_price !== null && order.original_price !== order.final_price && (
                                  <p className="text-xs text-gray-500">Original: {formatPrice(order.original_price)}</p>
                                )}
                              </td>
                              <td className="p-3 text-gray-700">
                                {order.coupon_code ? (
                                  <>
                                    <p className="font-semibold text-gray-900">{order.coupon_code}</p>
                                    <p className="text-xs text-gray-500">
                                      {order.coupon_discount_type === 'free' ? 'Gratis' : `${order.coupon_discount_value}% Rabatt`}
                                    </p>
                                  </>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td className="p-3">
                                <Badge variant="outline" className={paymentStatus.className}>{paymentStatus.label}</Badge>
                              </td>
                              <td className="p-3 text-gray-700 max-w-[220px]">
                                {files || '-'}
                              </td>
                              <td className="p-3 text-gray-700 max-w-[260px]">
                                {order.remarks ? <p className="text-xs text-gray-500 line-clamp-3">{order.remarks}</p> : '-'}
                              </td>
                              <td className="p-3 text-gray-700">
                                <p>{order.status}</p>
                                {order.paid_at && <p className="text-xs text-gray-500">Bezahlt: {formatDateTime(order.paid_at)}</p>}
                                {order.processed_at && <p className="text-xs text-gray-500">Verarbeitet: {formatDateTime(order.processed_at)}</p>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  <div className="flex items-center justify-between border-t p-3 text-sm text-gray-600">
                    <span>Seite {orderPage} · Total {orderTotal}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={orderPage <= 1} onClick={() => setOrderPage((prev) => Math.max(1, prev - 1))}>Zurück</Button>
                      <Button variant="outline" size="sm" disabled={orderPage * ORDER_PAGE_SIZE >= orderTotal} onClick={() => setOrderPage((prev) => prev + 1)}>Weiter</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="users" className="mt-0">
        {/* Filter Section */}
        {!loading && users.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-black" />
              <span className="text-sm font-medium text-black">Filter nach Subscription:</span>
              <Select value={activeFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[220px] bg-white text-black">
                  <SelectValue placeholder="Alle anzeigen" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all" className="text-black">Alle ({users.length})</SelectItem>
                  <SelectItem value="active" className="text-black">Aktiv ({activeCount})</SelectItem>
                  <SelectItem value="canceled" className="text-black">Gekündigt ({canceledCount})</SelectItem>
                  <SelectItem value="unknown" className="text-black">Unknown ({unknownCount})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {activeCount} Aktiv
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {canceledCount} Gekündigt
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {unknownCount} Unknown
              </Badge>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Lade Benutzerdaten...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Keine Benutzer gefunden.</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Keine Benutzer für diesen Filter gefunden.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedUsers.map((userData) => {
                const isExpanded = expandedUsers.has(userData.profile.user_id);
                const subscriptionStatus = getSubscriptionStatus(userData.profile.subscription_status);

              return (
                <Card key={userData.profile.user_id} className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                  <CardHeader className="border-l-4 border-l-[#204878] bg-white transition-colors hover:bg-slate-50">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => toggleUserExpanded(userData.profile.user_id)}>
                        <div className="flex flex-wrap items-center gap-3">
                          <CardTitle className="text-xl font-semibold text-slate-950">
                            {userData.profile.full_name || 'Kein Name'}
                          </CardTitle>
                          <Badge variant="outline" className={subscriptionStatus.className}>
                            {subscriptionStatus.label}
                          </Badge>
                          <Button
                            type="button"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              downloadClassicCv(userData);
                            }}
                            disabled={exportingUserId === userData.profile.user_id}
                            className="bg-[#204878] px-3 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1a3a66]"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            {exportingUserId === userData.profile.user_id ? 'Exportiert...' : 'CV PDF'}
                          </Button>
                        </div>
                        {userData.profile.headline && (
                          <p className="mt-1 text-sm font-medium text-[#204878]">{userData.profile.headline}</p>
                        )}
                        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
                          {userData.profile.email && (
                            <p className="truncate rounded-md bg-slate-50 px-3 py-2">
                              <span className="font-semibold text-slate-900">Email:</span> {userData.profile.email}
                            </p>
                          )}
                          {userData.profile.phone && (
                            <p className="rounded-md bg-slate-50 px-3 py-2">
                              <span className="font-semibold text-slate-900">Telefon:</span> {userData.profile.phone}
                            </p>
                          )}
                          {userData.profile.location && (
                            <p className="rounded-md bg-slate-50 px-3 py-2">
                              <span className="font-semibold text-slate-900">Ort:</span> {userData.profile.location}
                            </p>
                          )}
                          <p className="rounded-md bg-slate-50 px-3 py-2">
                            <span className="font-semibold text-slate-900">Registriert:</span> {formatDate(userData.profile.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="grid grid-cols-2 gap-2 text-center text-sm text-slate-700 sm:grid-cols-4 lg:grid-cols-2">
                          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                            <p className="text-lg font-semibold text-slate-950">{userData.experiences.length}</p>
                            <p className="text-xs">Erfahrungen</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                            <p className="text-lg font-semibold text-slate-950">{userData.education.length}</p>
                            <p className="text-xs">Ausbildungen</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                            <p className="text-lg font-semibold text-slate-950">{userData.skills.length}</p>
                            <p className="text-xs">Skills</p>
                          </div>
                          <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                            <p className="text-lg font-semibold text-slate-950">{userData.languages.length}</p>
                            <p className="text-xs">Sprachen</p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp
                            className="h-5 w-5 shrink-0 cursor-pointer text-slate-500"
                            onClick={() => toggleUserExpanded(userData.profile.user_id)}
                          />
                        ) : (
                          <ChevronDown
                            className="h-5 w-5 shrink-0 cursor-pointer text-slate-500"
                            onClick={() => toggleUserExpanded(userData.profile.user_id)}
                          />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="border-t bg-slate-50/80 p-5">
                      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {/* Kontaktdaten */}
                        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
                          <h3 className="mb-3 text-sm font-semibold text-[#204878]">Kontaktdaten</h3>
                          <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
                            {userData.profile.location && <p><span className="font-medium text-slate-950">Standort:</span> {userData.profile.location}</p>}
                            {userData.profile.phone && <p><span className="font-medium text-slate-950">Telefon:</span> {userData.profile.phone}</p>}
                            {userData.profile.website && <p><span className="font-medium text-slate-950">Website:</span> {userData.profile.website}</p>}
                            {userData.profile.linkedin_url && (
                              <p><span className="font-medium text-slate-950">LinkedIn:</span> <a href={userData.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Profil</a></p>
                            )}
                            {userData.profile.birthdate && <p><span className="font-medium text-slate-950">Geburtsdatum:</span> {formatDate(userData.profile.birthdate)}</p>}
                            {userData.profile.civil_status && <p><span className="font-medium text-slate-950">Zivilstand:</span> {userData.profile.civil_status}</p>}
                            {userData.profile.place_of_origin && <p><span className="font-medium text-slate-950">Heimatort:</span> {userData.profile.place_of_origin}</p>}
                          </div>
                        </div>

                        {/* Erfahrungen */}
                        {userData.experiences.length > 0 && (
                          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h3 className="mb-3 text-sm font-semibold text-[#204878]">Berufserfahrung</h3>
                            <div className="space-y-2">
                              {userData.experiences.map((exp) => (
                                <div key={exp.id} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                                  <p className="font-semibold">{exp.job_title || 'Position'}</p>
                                  <p className="text-slate-600">{exp.company}</p>
                                  {exp.employment_type && <p className="text-xs text-slate-500">{exp.employment_type}</p>}
                                  <p className="text-xs text-slate-500">
                                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Ausbildung */}
                        {userData.education.length > 0 && (
                          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h3 className="mb-3 text-sm font-semibold text-[#204878]">Ausbildung</h3>
                            <div className="space-y-2">
                              {userData.education.map((edu) => (
                                <div key={edu.id} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                                  <p className="font-semibold text-slate-900">{edu.degree}</p>
                                  <p className="text-slate-600">{edu.institution}</p>
                                  <p className="text-xs text-slate-500">
                                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        {userData.skills.length > 0 && (
                          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h3 className="mb-3 text-sm font-semibold text-[#204878]">Fähigkeiten</h3>
                            <div className="flex flex-wrap gap-2 text-slate-900">
                              {userData.skills.map((skill) => (
                                <Badge key={skill.id} variant="outline" className="border-slate-300 bg-slate-50 text-sm text-slate-800">
                                  {skill.skill_name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sprachen */}
                        {userData.languages.length > 0 && (
                          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                            <h3 className="mb-3 text-sm font-semibold text-[#204878]">Sprachen</h3>
                            <div className="flex flex-wrap gap-2">
                              {userData.languages.map((lang) => (
                                <Badge key={lang.id} variant="outline" className="border-slate-300 bg-slate-50 text-sm text-slate-800">
                                  {lang.language_name} {lang.proficiency && `(${lang.proficiency})`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 bg-[#204878]" 
                >
                  <ChevronLeft className="h-4 w-4" />
                  Zurück
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Seite {currentPage} von {totalPages}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} von {filteredUsers.length}
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 bg-[#204878]"
                >
                  Weiter
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default function AdminPage() {
  return <AdminContent />;
}
