import { prisma } from "../../lib/prisma";


// ─────────────────────────────────────────
// Create Review (Student করবে)
// ─────────────────────────────────────────
const createReviewIntoDB = async (userId: number, payload: any) => {
  const { bookingId, rating, comment } = payload;


  // Check all fields
  if (!bookingId || !rating) {
    throw new Error("bookingId and rating are required");
  }


  // Rating must be 1-5
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }


  // Check booking exists
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });


  if (!booking) {
    throw new Error("Booking not found");
  }


  // Check this booking belongs to this student
  if (booking.studentId !== userId) {
    throw new Error("You are not authorized to review this booking");
  }


  // Check booking is COMPLETED
  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review completed sessions");
  }


  // Check already reviewed
  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });


  if (existingReview) {
    throw new Error("You have already reviewed this session");
  }


  // Create review
  const review = await prisma.review.create({
    data: {
      studentId: userId,
      tutorProfileId: booking.tutorProfileId,
      bookingId,
      rating,
      comment: comment || null,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tutorProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });


  // ─────────────────────────────────────────
  // Tutor এর avgRating আপডেট করো
  // ─────────────────────────────────────────
  const allReviews = await prisma.review.findMany({
    where: { tutorProfileId: booking.tutorProfileId },
  });


  const avgRating =
    allReviews.reduce(
      (sum: number, r: { rating: number }) => sum + r.rating,
      0,
    ) / allReviews.length;


  await prisma.tutorProfile.update({
    where: { id: booking.tutorProfileId },
    data: {
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalReviews: allReviews.length,
    },
  });


  return review;
};




export const ReviewService = {
  createReviewIntoDB,
};
