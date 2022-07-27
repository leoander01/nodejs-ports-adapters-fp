-- CreateTable
CREATE TABLE "Following" (
    "userId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("userId","followingId")
);

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
