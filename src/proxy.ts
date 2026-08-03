import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token?.id;
    },
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
    "/approvals/:path*",
    "/my-department/:path*",
  ],
};