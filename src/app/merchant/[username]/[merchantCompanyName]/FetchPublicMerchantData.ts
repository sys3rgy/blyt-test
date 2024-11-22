'use server'

async function FetchPublicMerchantData(pathname: string, merchantCompanyName: string, userNameCookie: any) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/buyersAPIs/publicMerchantAccountDataFetchAPI?userName=${pathname}&merchantCompanyName=${merchantCompanyName}&userNameCookie=${userNameCookie}`, { cache: 'no-store' });
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(e);
        console.error("FetchPublicMerchantData Failed.")
        return "FetchPublicMerchantData Failed.";
    }
}

export default FetchPublicMerchantData;