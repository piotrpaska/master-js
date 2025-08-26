-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('OK', 'DNF', 'DNS', 'DSQ');

-- CreateTable
CREATE TABLE "Record" (
    "id" TEXT NOT NULL,
    "startTime" BIGINT NOT NULL DEFAULT 0,
    "endTime" BIGINT,
    "duration" BIGINT,
    "track" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'OK',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "StartList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "athleteId" TEXT NOT NULL,
    "startListId" TEXT NOT NULL,
    "bib" TEXT NOT NULL,
    "alreadyStarted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startListId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Athlete" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_startListId_fkey" FOREIGN KEY ("startListId") REFERENCES "StartList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_startListId_fkey" FOREIGN KEY ("startListId") REFERENCES "StartList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
