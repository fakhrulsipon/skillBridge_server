import { Router } from "express";
import { TutorRoutes } from "../module/Tutor/tutor.route";
import { BookingRoutes } from "../module/booking/booking.route";
import { AdminRoutes } from "../module/Admin/admin.route";
import { ReviewRoutes } from "../module/Review/review.route";
import { AuthRoutes } from "../module/auth/auth.route";



const router =Router();
 
const routerManager =[
    {
        path: '/auth',
        route: AuthRoutes
    },
    {  
        path: '/tutors',
        route: TutorRoutes
    },
    {
        path:'/booking',
        route:BookingRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/review',
        route: ReviewRoutes
    }
]

routerManager.forEach((route)=>{
    router.use(route.path,route.route);
})

export default router;