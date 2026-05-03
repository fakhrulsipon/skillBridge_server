import { prisma } from "../../lib/prisma";


// ─────────────────────────────────────────
// Shared category include helper
// ─────────────────────────────────────────
const categoryInclude = {
   categories: {
      include: {
         category: true,
      },
   },
};


// ─────────────────────────────────────────
// Create Tutor Profile
// ─────────────────────────────────────────
const createTutorIntoDB = async (payload: any, userId: number) => {
   const user = await prisma.user.findUnique({
      where: { id: userId },
   });


   if (!user) {
      throw new Error('User not found');
   }


   const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId: userId }
   });


   if (existingProfile) {
      throw new Error('Tutor profile already exists for this user');
   }


   const result = await prisma.tutorProfile.create({
      data: {
         userId: userId,
         bio: payload.bio,
         hourlyRate: payload.hourlyRate,
         experience: payload.experience || 0,
         location: payload.location,
         imageUrl: payload.imageUrl,
         isApproved: payload.isApproved ?? true,
         avgRating: 0,
         totalReviews: 0,
         // Create TutorCategory join rows if categoryIds provided
         categories: payload.categoryIds?.length
            ? {
               create: payload.categoryIds.map((categoryId: number) => ({
                  categoryId,
               })),
            }
            : undefined,
      },
      include: {
         user: {
            select: {
               name: true,
               email: true,
               role: true
            }
         },
         ...categoryInclude,
         availability: true,
      }
   });


   return result;
};


export const TutorService = {
   createTutorIntoDB
};
