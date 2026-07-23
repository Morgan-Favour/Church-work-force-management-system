export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workers/:path*",
    "/departments/:path*",
    "/leaders/:path*",
    "/attendance/:path*",
    "/activity/:path*",
    "/my-department/:path*",
  ],
};