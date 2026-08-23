-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TENANT', 'LANDLORD', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'RENTED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'SSLCOMMERZ');

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "rentalRequestId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "transactionId" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "rent" DECIMAL(10,2) NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "amenities" TEXT[],
    "images" TEXT[],
    "status" "PropertyStatus" NOT NULL DEFAULT 'AVAILABLE',
    "landlordId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalRequests" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "moveInDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "message" TEXT,
    "status" "RentalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "propertyId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'TENANT',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_rentalRequestId_key" ON "Payments"("rentalRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_transactionId_key" ON "Payments"("transactionId");

-- CreateIndex
CREATE INDEX "Properties_city_idx" ON "Properties"("city");

-- CreateIndex
CREATE INDEX "Properties_status_idx" ON "Properties"("status");

-- CreateIndex
CREATE INDEX "Properties_categoryId_idx" ON "Properties"("categoryId");

-- CreateIndex
CREATE INDEX "Properties_landlordId_idx" ON "Properties"("landlordId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "RentalRequests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Properties" ADD CONSTRAINT "Properties_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Properties" ADD CONSTRAINT "Properties_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalRequests" ADD CONSTRAINT "RentalRequests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalRequests" ADD CONSTRAINT "RentalRequests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
