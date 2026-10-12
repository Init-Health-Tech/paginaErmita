-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('alquiler', 'retiros', 'visitas');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('confirmado', 'pendiente');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "type" "SubmissionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "VisitStatus",
    "visitDate" TEXT,
    "visitTime" TEXT,
    "payload" JSONB NOT NULL,
    "qrDataUrl" TEXT,
    "verifyUrl" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_type_idx" ON "Submission"("type");

-- CreateIndex
CREATE INDEX "Submission_createdAt_idx" ON "Submission"("createdAt");

-- CreateIndex
CREATE INDEX "Submission_type_visitDate_idx" ON "Submission"("type", "visitDate");
