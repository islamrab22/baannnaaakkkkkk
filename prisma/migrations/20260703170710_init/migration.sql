-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "Segment" AS ENUM ('PERSONAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "ProductGroup" AS ENUM ('ACCOUNT', 'LOAN', 'CARD', 'ELECTRONIC_SERVICE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('CONTACT', 'NEWSLETTER', 'LOAN_INQUIRY', 'CARD_INQUIRY', 'CAREER');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('NEW', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('PRODUCT', 'NEWS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replacedBy" TEXT,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL DEFAULT 'PRODUCT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "group" "ProductGroup" NOT NULL,
    "segment" "Segment" NOT NULL DEFAULT 'PERSONAL',
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "taglineAr" TEXT NOT NULL,
    "taglineEn" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "bulletsAr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bulletsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "icon" TEXT,
    "categoryId" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "badgeAr" TEXT NOT NULL,
    "badgeEn" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "segment" "Segment" NOT NULL DEFAULT 'PERSONAL',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descAr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "contentAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "image" TEXT,
    "categoryId" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "addressAr" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "hoursAr" TEXT NOT NULL,
    "hoursEn" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT,
    "data" JSONB,
    "status" "MessageStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_requests" (
    "id" TEXT NOT NULL,
    "loanType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "preferredBranch" TEXT,
    "amount" DOUBLE PRECISION,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_requests" (
    "id" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteNameAr" TEXT NOT NULL DEFAULT 'بنك فلسطين',
    "siteNameEn" TEXT NOT NULL DEFAULT 'Bank of Palestine',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactAddressAr" TEXT,
    "contactAddressEn" TEXT,
    "socialFacebook" TEXT,
    "socialTwitter" TEXT,
    "socialInstagram" TEXT,
    "socialLinkedin" TEXT,
    "socialYoutube" TEXT,
    "homepageHeroAr" TEXT,
    "homepageHeroEn" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "meta" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_group_segment_status_idx" ON "products"("group", "segment", "status");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- CreateIndex
CREATE INDEX "news_status_idx" ON "news"("status");

-- CreateIndex
CREATE INDEX "messages_type_status_idx" ON "messages"("type", "status");

-- CreateIndex
CREATE INDEX "loan_requests_status_idx" ON "loan_requests"("status");

-- CreateIndex
CREATE INDEX "card_requests_status_idx" ON "card_requests"("status");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
