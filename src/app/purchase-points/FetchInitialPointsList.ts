'use server'

async function FetchInitialPointsList() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/commonAPIs/pointsPrice`, { next: { tags: ['pointsPriceRevalidate'] } });
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(e);
        console.error("FetchInitialPointsList Failed.")
        return "FetchInitialPointsList Failed.";
    }
}

export default FetchInitialPointsList;