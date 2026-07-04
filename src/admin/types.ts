export type Role = "ADMIN" | "EDITOR" | "VIEWER";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type Segment = "PERSONAL" | "BUSINESS";
export type ProductGroup = "ACCOUNT" | "LOAN" | "CARD" | "ELECTRONIC_SERVICE" | "TRANSFER";
export type MessageType = "CONTACT" | "NEWSLETTER" | "LOAN_INQUIRY" | "CARD_INQUIRY" | "CAREER";
export type MessageStatus = "NEW" | "READ" | "ARCHIVED";
export type RequestStatus = "PENDING" | "CONTACTED" | "APPROVED" | "REJECTED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface Product {
  id: string;
  slug: string;
  group: ProductGroup;
  segment: Segment;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  descAr: string;
  descEn: string;
  bulletsAr: string[];
  bulletsEn: string[];
  images: string[];
  icon?: string | null;
  categoryId?: string | null;
  status: ContentStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  type: "PRODUCT" | "NEWS";
}

export interface Campaign {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badgeAr: string;
  badgeEn: string;
  image: string;
  link: string;
  segment: Segment;
  status: ContentStatus;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  contentAr: string;
  contentEn: string;
  image?: string | null;
  categoryId?: string | null;
  status: ContentStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: string | null;
  createdAt: string;
}

export interface Branch {
  id: string;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  lat: number;
  lng: number;
  hoursAr: string;
  hoursEn: string;
  phone: string;
  email?: string | null;
}

export interface Message {
  id: string;
  type: MessageType;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  data?: Record<string, unknown> | null;
  status: MessageStatus;
  createdAt: string;
}

export interface LoanRequest {
  id: string;
  loanType: string;
  name: string;
  phone: string;
  email?: string | null;
  preferredBranch?: string | null;
  amount?: number | null;
  status: RequestStatus;
  notes?: string | null;
  createdAt: string;
}

export interface CardRequest {
  id: string;
  cardType: string;
  name: string;
  phone: string;
  email?: string | null;
  status: RequestStatus;
  notes?: string | null;
  createdAt: string;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface Settings {
  id: string;
  siteNameAr: string;
  siteNameEn: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactAddressAr?: string | null;
  contactAddressEn?: string | null;
  socialFacebook?: string | null;
  socialTwitter?: string | null;
  socialInstagram?: string | null;
  socialLinkedin?: string | null;
  socialYoutube?: string | null;
  homepageHeroAr?: string | null;
  homepageHeroEn?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
}

export interface DashboardStats {
  products: { total: number; published: number };
  news: { total: number; published: number };
  campaigns: { total: number };
  branches: { total: number };
  users: { total: number };
  messages: { unread: number; byType: { type: string; count: number }[] };
  loanRequests: { pending: number; byStatus: { status: string; count: number }[] };
  cardRequests: { pending: number };
}


export interface PublicSubmission {
  id: string;
  type: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  data?: Record<string, unknown>;
  status: string;
  createdAt: string;
  updatedAt: string;
}
