-- AlterTable
ALTER TABLE "users" ADD COLUMN "razorpay_customer_id" TEXT UNIQUE,
ADD COLUMN "razorpay_contact_id" TEXT UNIQUE,
ADD COLUMN "razorpay_fund_account_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_razorpay_customer_id_key" ON "users"("razorpay_customer_id");
CREATE UNIQUE INDEX "users_razorpay_contact_id_key" ON "users"("razorpay_contact_id");
