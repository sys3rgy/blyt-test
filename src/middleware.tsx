import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const accessToken = request.cookies.get("token");
	let decodedToken = undefined;
	if (accessToken) {
		decodedToken = jwtDecode<any>(`${accessToken?.value}`);
	}

	// Cek apakah rute adalah /admin/login, jika ya, skip middleware
	if (request.nextUrl.pathname === "/admin/login") {
		return NextResponse.next();
	}

	// Untuk semua rute di /admin, cek token dan peran isAdmin
	if (request.nextUrl.pathname.startsWith("/admin")) {
		if (decodedToken) {
			if (decodedToken.isAdmin) {
				return NextResponse.next(); // Lanjut jika user adalah admin
			} else {
				return NextResponse.redirect(new URL("/admin/login", request.url)); // Redirect jika bukan admin
			}
		} else {
			return NextResponse.redirect(new URL("/admin/login", request.url)); // Redirect jika tidak ada token
		}
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more

export const config = {
	matcher: [
		"/api/:path*", // Untuk menangani semua request di /api
		"/admin/:path*", // Untuk menangani semua request di /admin kecuali /admin/login
		"/admin", // Untuk menangani request di /admin (root)
	],
};
