'use server'

async function FetchInitialServicesList() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/commonAPIs/merchantServicesFetch`, { cache: 'no-store' });
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(e);
        console.error("FetchInitialServicesList Failed.")
        return "FetchInitialServicesList Failed.";
    }
}

export default FetchInitialServicesList;