'use server'

async function FetchServicesCategoriesList() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/commonData/servicesCategoriesList`, { next: { tags: ['servicesCategoriesListRevalidate'] } });
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(e);
        console.error("FetchServicesCategoriesList Failed.")
        return "FetchServicesCategoriesList Failed.";
    }
}

export default FetchServicesCategoriesList;