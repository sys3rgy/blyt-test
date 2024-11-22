import sendOTPToUser from "./email/sendOTPToUser";

interface SendOTPToUserInterface {
    (
        userName: string,
        userEmail: string,
        OTP: string,
        method: string,
        userAgent: string,
        userIP: string
    ): Promise<void>;
}

export const sendOTPUtil: SendOTPToUserInterface = async (
    userName,
    userEmail,
    OTP,
    method,
    userAgent,
    userIP
) => {
    await sendOTPToUser(userName, userEmail, OTP, 'signIn', userAgent, userIP);
};