import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

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