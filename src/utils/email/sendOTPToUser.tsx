// import { Resend } from "resend";
// const resend = new Resend(process.env.NEXT_PRIVATE_RESEND_API_KEY);

import nodemailer from "nodemailer";

//! Loading HTML Templete
import SignInUpEmailTemplate from "!!raw-loader!./SignInUpEmailTemplate.html";
import DealCompleteOTPEmailTemplate from "!!raw-loader!./DealCompleteOTPEmailTemplate.html";
import NewUserEmailTemplate from "!!raw-loader!./NewUserEmailTemplate.html";

//! Order Status Email Templates
import InitiatedContactEmailTemplate from "!!raw-loader!./DealStatusTempaltes/InitiatedContactEmailTemplate.html";
import WorkInProgressEmailTemplate from "!!raw-loader!./DealStatusTempaltes/WorkInProgressEmailTemplate.html";
import DealCompletedEmailTemplate from "!!raw-loader!./DealStatusTempaltes/DealCompletedEmailTemplate.html";
import OrderCancelEmailTemplate from "!!raw-loader!./DealStatusTempaltes/OrderCancelEmailTemplate.html";

//! Referrer Email Templates
import ReferredDealInitiated from "!!raw-loader!./ReferredEmailTemplates/ReferredDealInitiated.html";
import ReferredDealCompleted from "!!raw-loader!./ReferredEmailTemplates/ReferredDealCompleted.html";

//! Check if NEXT_PRIVATE_RESEND_API_KEY is defined
// if (!process.env.NEXT_PRIVATE_RESEND_API_KEY || !process.env.NEXT_PRIVATE_RESEND_EMAIL_ID) {
// 	throw new Error(
// 		"NEXT_PRIVATE_RESEND_API_KEY or NEXT_PRIVATE_RESEND_EMAIL_ID is not defined in your environment variables."
// 	);
// }

//! Define type for email titles
type EmailTitles = {
	signUp: string;
	signIn: string;
	forgotPassword: string;
	doneDeals: string;
	newUser: string;
	initiatedContact: string;
	workInProgress: string;
	dealCompleted: string;
	orderCancel: string;
	referredBy: string;
	referredCompleted: string;
};

async function sendOTPToUser(
	userName: string,
	email: string,
	OTP: any,
	action: keyof EmailTitles,
	userAgent?: string,
	userIP?: string,
	buyerName?: string,
	merchantName?: string,
	orderNumber?: string
) {
	//! Determine the email titles based on the action performed
	const emailTitles: EmailTitles = {
		signUp: "Sign Up",
		signIn: "Sign In",
		forgotPassword: "Forgot Password",
		doneDeals: "Finalize Deal",
		newUser: "Thanks for joining",
		initiatedContact: "Initiated Contact",
		workInProgress: "Work In Progress",
		dealCompleted: "Successful Completion of Deal",
		orderCancel: "Order Cancellation",
		referredBy: "Success Referral",
		referredCompleted: "Job Completed",
	};

	let replacedHtml = "";

	switch (action) {
		case "doneDeals":
			replacedHtml = DealCompleteOTPEmailTemplate.replaceAll("{{username}}", userName).replaceAll(
				"{{OTPOrPassword}}",
				OTP
			);
			break;

		case "newUser":
			replacedHtml = NewUserEmailTemplate.replaceAll("{{username}}", userName);
			break;

		case "initiatedContact":
			replacedHtml = InitiatedContactEmailTemplate.replaceAll(
				"{{buyerName}}",
				buyerName || "buyerName not found fro InitiatedContactEmailTemplate"
			).replaceAll(
				"{{merchantName}}",
				merchantName || "merchantName not found fro InitiatedContactEmailTemplate"
			);
			break;

		case "workInProgress":
			replacedHtml = WorkInProgressEmailTemplate.replaceAll(
				"{{buyerName}}",
				buyerName || "buyerName not found for WorkInProgressEmailTemplate"
			).replaceAll("{{merchantName}}", merchantName || "merchantName not found for WorkInProgressEmailTemplate");
			break;

		case "dealCompleted":
			replacedHtml = DealCompletedEmailTemplate.replaceAll(
				"{{buyerName}}",
				buyerName || "buyerName not found for DealCompletedEmailTemplate"
			).replaceAll("{{merchantName}}", merchantName || "merchantName not found for DealCompletedEmailTemplate");
			break;

		case "orderCancel":
			replacedHtml = OrderCancelEmailTemplate.replaceAll(
				"{{merchantName}}",
				merchantName || "merchantName not found for OrderCancelEmailTemplate"
			).replaceAll("{{orderNumber}}", orderNumber || "orderNumber not found for OrderCancelEmailTemplate");
			break;

		case "referredBy":
			replacedHtml = ReferredDealInitiated.replaceAll(
				"{{referredUsername}}",
				buyerName || "referredUsername not found for referredBy"
			).replaceAll("{{buyerName}}", merchantName || "buyerName not found for referredBy");
			break;

		case "referredCompleted":
			replacedHtml = ReferredDealCompleted.replaceAll(
				"{{referredUsername}}",
				buyerName || "referredUsername not found for referredCompleted"
			);
			break;

		default:
			replacedHtml = SignInUpEmailTemplate.replaceAll("{{username}}", userName)
				.replaceAll("{{OTPOrPassword}}", OTP)
				.replaceAll("{{userIP}}", userIP || "")
				.replaceAll("{{userAgent}}", userAgent || "");
			break;
	}

	const transporter = nodemailer.createTransport({
		host: process.env.NEXT_MAIL_HOST as string,
		port: process.env.NEXT_MAIL_PORT as unknown as number,
		auth: {
			user: process.env.NEXT_MAIL_USER as string,
			pass: process.env.NEXT_MAIL_PASS as string,
		},
	});

	// const response = await resend.emails.send({
	// 	from: process.env.NEXT_PRIVATE_RESEND_EMAIL_ID as string,
	// 	to: email,
	// 	subject: emailTitles[action],
	// 	html: replacedHtml,
	// });

	try {
		await transporter.sendMail({
			from: '"BLYT" <info@blyt.com>', // Ganti dengan alamat pengirim
			to: email, // Penerima
			subject: emailTitles[action], // Subjek email
			html: replacedHtml, // Isi pesan dalam format HTML
		});

		return {
			data: {
				id: "oke",
			},
		};
	} catch (error) {
		return {
			data: {
				id: null,
			},
		};
	}
}

export default sendOTPToUser;
