import { cookies } from 'next/headers';

export async function removeCookies() {
    const cookieStore = cookies()
    cookieStore.delete('userName');
    cookieStore.delete('token');
    cookieStore.delete('isLogin');
    cookieStore.delete('sessionId');
}