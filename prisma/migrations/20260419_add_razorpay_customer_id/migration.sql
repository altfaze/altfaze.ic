-- AlterTable
ALTER TABLE "users" ADD COLUMN "razorpay_customer_id" TEXT UNIQUE,
ADD COLUMN "razorpay_contact_id" TEXT UNIQUE,
ADD COLUMN "razorpay_fund_account_id" TEXT;
