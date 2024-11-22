import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcrypt";

//! Fethcing  & verifying environment variables
import jwt from "jsonwebtoken";
import serverSideSessionCheck from "@/utils/serverSideSessionCheck";
let jwtTokenValue: string;
if (!process.env.NEXT_PRIVATE_JWT_TOKEN_VALUE) {
	throw new Error(`NEXT_PRIVATE_JWT_TOKEN_VALUE is undefined.`);
} else {
	jwtTokenValue = process.env.NEXT_PRIVATE_JWT_TOKEN_VALUE;
}

//! interface for JWTTokenData
interface JWTTokenData {
	userName: string;
	userAgent: string;
	isMerchant: string;
	isAdmin: boolean;
}

export async function GET(request: NextRequest) {
	const isSessionExist = await serverSideSessionCheck();

	if (!isSessionExist) {
		return NextResponse.json(
			{
				message: "No session found",
				statusCode: 404,
			},
			{ status: 200 }
		);
	}

	try {
		//! Check if token exist
		const verifyingJWTToken = jwt.verify(isSessionExist.tokenCookie as string, jwtTokenValue);

		//! If not throw error
		if (!verifyingJWTToken) {
			return NextResponse.json(
				{
					message: "No session found",
					statusCode: 404,
				},
				{ status: 200 }
			);

			//! Else verify details
		} else {
			//! Compare userName & userAgent
			const userAgent = request.headers.get("user-agent");
			const decodedToken = verifyingJWTToken as JWTTokenData;

			if (
				isSessionExist.userNameCookie === decodedToken.userName &&
				(await bcrypt.compare(userAgent as string, decodedToken.userAgent as string))
			) {
				return NextResponse.json(
					{
						message: "Session found",
						statusCode: 302,
						userNameCookie: isSessionExist.userNameCookie,
						isLoginCookie: isSessionExist.isLoginCookie,
						isMerchant: decodedToken.isMerchant,
						isAdmin: decodedToken.isAdmin,
					},
					{ status: 200 }
				);
			}

			return NextResponse.json(
				{
					message: "No session found",
					statusCode: 404,
				},
				{ status: 200 }
			);
		}
	} catch {
		return NextResponse.json(
			{
				message: "No session found",
				statusCode: 404,
			},
			{ status: 200 }
		);
	}
}

export async function POST(request: NextRequest) {
	return NextResponse.json(
		{ message: "Just A POST call in localSessionCheck.tsx", statusCode: 404 },
		{ status: 200 }
	);
}
