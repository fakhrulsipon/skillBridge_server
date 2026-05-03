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

// ─────────────────────────────────────────
// Get My Profile
// ─────────────────────────────────────────
const getMyProfileFromDB = async (userId: number) => {


   const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
         user: {
            select: {
               id: true,
               name: true,
               email: true,
               role: true,
            }
         },
         ...categoryInclude,
         availability: {
            orderBy: { dayOfWeek: "asc" }
         },
         reviews: {
            include: {
               student: {
                  select: { name: true }
               }
            },
            orderBy: { createdAt: "desc" }
         }
      }
   });


   if (!profile) {
      throw new Error('Tutor profile not found');
   }


   return profile;
};

// ─────────────────────────────────────────
// Update Tutor Profile
// ─────────────────────────────────────────
const updateTutorProfileIntoDB = async (userId: number, payload: any) => {


   // Check profile exists
   const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId }
   });


   if (!existingProfile) {
      throw new Error('Tutor profile not found. Please create your profile first');
   }


   // Rebuild category join rows if categoryIds provided
   if (payload.categoryIds !== undefined) {
      await prisma.tutorCategory.deleteMany({
         where: { tutorProfileId: existingProfile.id }
      });


      if (payload.categoryIds.length > 0) {
         await prisma.tutorCategory.createMany({
            data: payload.categoryIds.map((categoryId: number) => ({
               tutorProfileId: existingProfile.id,
               categoryId,
            })),
         });
      }
   }


   const result = await prisma.tutorProfile.update({
      where: { userId },
      data: {
         bio: payload.bio,
         hourlyRate: payload.hourlyRate,
         experience: payload.experience,
         location: payload.location,
         imageUrl: payload.imageUrl,
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

// ─────────────────────────────────────────
// Set Availability
// ─────────────────────────────────────────
const setAvailabilityIntoDB = async (userId: number, slots: any[]) => {


   if (!slots || slots.length === 0) {
      throw new Error("At least one slot is required");
   }


   for (const slot of slots) {
      if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
         throw new Error("dayOfWeek must be 0 (Sun) to 6 (Sat)");
      }
      if (!slot.startTime || !slot.endTime) {
         throw new Error("Each slot must have startTime and endTime");
      }
      if (slot.startTime >= slot.endTime) {
         throw new Error("startTime must be before endTime");
      }
   }


   const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
   });


   if (!profile) {
      throw new Error("Please create your tutor profile first");
   }


   await prisma.availability.deleteMany({
      where: { tutorProfileId: profile.id },
   });


   await prisma.availability.createMany({
      data: slots.map((slot) => ({
         tutorProfileId: profile.id,
         dayOfWeek: slot.dayOfWeek,
         startTime: slot.startTime,
         endTime: slot.endTime,
      })),
   });


   const availability = await prisma.availability.findMany({
      where: { tutorProfileId: profile.id },
      orderBy: { dayOfWeek: "asc" },
   });


   return availability;
};

// ─────────────────────────────────────────
// Get Tutor By ID (Public)
// ─────────────────────────────────────────
const getTutorByIdFromDB = async (id: number) => {


   const tutor = await prisma.tutorProfile.findUnique({
      where: { id },
      include: {
         user: {
            select: {
               id: true,
               name: true,
               email: true,
            }
         },
         ...categoryInclude,
         availability: {
            orderBy: { dayOfWeek: "asc" }
         }
      }
   });


   if (!tutor) {
      throw new Error('Tutor not found');
   }


   return tutor;
};

// ─────────────────────────────────────────
// Get All Tutors (Public)
// ─────────────────────────────────────────
const getAllTutorsFromDB = async () => {


   const tutors = await prisma.tutorProfile.findMany({
      where: {
         isApproved: true
      },
      include: {
         user: {
            select: {
               id: true,
               name: true,
               email: true,
            }
         },
         ...categoryInclude,
         availability: true,
      },
      orderBy: { avgRating: "desc" }
   });


   return tutors;
};


export const TutorService = {
   createTutorIntoDB,
   getMyProfileFromDB,
   updateTutorProfileIntoDB,
   setAvailabilityIntoDB,
   getTutorByIdFromDB,
   getAllTutorsFromDB
};
