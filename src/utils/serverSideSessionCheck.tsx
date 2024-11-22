import { cookies } from 'next/headers'

async function serverSideSessionCheck() {
    const cookieStore = cookies()
    const userNameCookie = cookieStore.get('userName')
    const tokenCookie = cookieStore.get('token')
    const isLoginCookie = cookieStore.get('isLogin')
    const sessionIdCookie = cookieStore.get('sessionId')

    if (!userNameCookie || !tokenCookie || !isLoginCookie || !sessionIdCookie) {
        return false;
    }

    const data = {
        userNameCookie: userNameCookie.value,
        tokenCookie: tokenCookie.value,
        isLoginCookie: isLoginCookie.value,
        sessionIdCookie: sessionIdCookie.value
    };

    return data;
}

export default serverSideSessionCheck;