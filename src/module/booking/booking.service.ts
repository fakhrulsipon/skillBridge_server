import { prisma } from "../../lib/prisma";


// ─────────────────────────────────────────
// Create Booking (Student করবে)
// ─────────────────────────────────────────
const createBookingIntoDB = async (userId: number, payload: any) => {


    // Check tutor profile exists
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { id: payload.tutorProfileId }
    });


    if (!tutorProfile) {
        throw new Error('Tutor not found');
    }


    // Check student is not booking themselves
    if (tutorProfile.userId === userId) {
        throw new Error('You cannot book yourself');
    }


    // Calculate total price
    // hourlyRate per minute * duration
    const totalPrice = (tutorProfile.hourlyRate / 60) * payload.duration;


    // Create booking
    const booking = await prisma.booking.create({
        data: {
            studentId: userId,
            tutorProfileId: payload.tutorProfileId,
            scheduledAt: new Date(payload.scheduledAt),
            duration: payload.duration,
            totalPrice: totalPrice,
            note: payload.note || null,
            status: 'CONFIRMED',
        },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            tutorProfile: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                }
            }
        }
    });


    return booking;
};


// ─────────────────────────────────────────
// Get My Bookings
// Student → নিজের bookings দেখবে
// Tutor → নিজের কাছে আসা bookings দেখবে
// ─────────────────────────────────────────
const getMyBookingsFromDB = async (userId: number, role: string) => {


    let bookings;


    if (role === 'STUDENT') {
        // Student এর সব bookings
        bookings = await prisma.booking.findMany({
            where: { studentId: userId },
            include: {
                tutorProfile: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            },
            orderBy: { scheduledAt: 'desc' }
        });


    } else if (role === 'TUTOR') {
        // Tutor এর profile খোঁজো
        const tutorProfile = await prisma.tutorProfile.findUnique({
            where: { userId }
        });


        if (!tutorProfile) {
            throw new Error('Tutor profile not found');
        }


        // Tutor এর কাছে আসা সব bookings
        bookings = await prisma.booking.findMany({
            where: { tutorProfileId: tutorProfile.id },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { scheduledAt: 'desc' }
        });
    }


    return bookings;
};


// ─────────────────────────────────────────
// Get Single Booking By ID
// ─────────────────────────────────────────
const getBookingByIdFromDB = async (bookingId: number, userId: number, role: string) => {


    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            tutorProfile: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                }
            }
        }
    });


    if (!booking) {
        throw new Error('Booking not found');
    }


    // Check user owns this booking
    if (role === 'STUDENT' && booking.studentId !== userId) {
        throw new Error('You are not authorized to view this booking');
    }


    if (role === 'TUTOR') {
        const tutorProfile = await prisma.tutorProfile.findUnique({
            where: { userId }
        });
        if (!tutorProfile || booking.tutorProfileId !== tutorProfile.id) {
            throw new Error('You are not authorized to view this booking');
        }
    }


    return booking;
};


// ─────────────────────────────────────────
// Update Booking Status
// Tutor → COMPLETED
// Student → CANCELLED
// ─────────────────────────────────────────
const updateBookingStatusIntoDB = async (bookingId: number, userId: number, role: string, status: string) => {


    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });


    if (!booking) {
        throw new Error('Booking not found');
    }


    // Tutor only can mark COMPLETED
    if (status === 'COMPLETED' && role !== 'TUTOR') {
        throw new Error('Only tutor can mark booking as completed');
    }


    // Student only can CANCEL
    if (status === 'CANCELLED' && role !== 'STUDENT') {
        throw new Error('Only student can cancel booking');
    }


    // Cannot update already completed or cancelled booking
    if (booking.status !== 'CONFIRMED') {
        throw new Error(`Booking is already ${booking.status}`);
    }


    const updated = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: status as any },
    });


    return updated;
};








export const BookingService = {
    createBookingIntoDB,
    getMyBookingsFromDB,
    getBookingByIdFromDB,
    updateBookingStatusIntoDB,
};
