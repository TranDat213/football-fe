export const ROUTES = {
    home:           "/",

    //user
    profile:        "/profile",
    //auth
    login:          "/login",
    register:       "/register",
    forgotPassword: "/forgot-password",
    ownerRegister:  "/owner",
    //pitch
    pitch:          "/pitch",
    leagues:        "/leagues",

    //booking
    book:           "/book",
    myBooking:      "/my-booking",
    bookingSuccess: "/booking/success",

    //owner
    ownerReview:    "/owner/review",
    ownerDashboard: "/owner/dashboard",
    ownerPitches:   "/owner/pitches",
    ownerAnalytics: "/owner/analytics",
    ownerPitchSuccess: "/owner/pitches/success",
    ownerPitchNew: "/owner/pitches/new",
    ownerEditPitch: "/owner/pitches/[id]/edit",

    //comunnity
    casualMatch:      "/casual-matches",
    myCasualMatches: "/casual-matches/my",
    casualOwner:    "/casual-matches/owner",
    createCasual:   "/casual-matches/create",
    
    //admin
    adminDashboard: "/admin",
    adminFields:    "/admin/field_management",
    adminOwners:    "/admin/owner_management",
    adminUsers:     "/admin/user_management",
    adminOwnerRegister: "/admin/owner_management/owner_register",
    adminUpdateField: "/admin/field_management/update_field",
    
    //payment
    checkout:       "/checkout",
    
}