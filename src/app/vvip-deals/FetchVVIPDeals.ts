'use client'

import { revalidateTag } from "next/cache";

export async function FetchVVIPDeals(toValidate: boolean, sessionExist: boolean) {
    try {
        if (toValidate) {
            revalidateTag('VVIPDealsRevalidate');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN_NAME}/api/buyersAPIs/vvipDealsFetchAPI?sessionExist=${sessionExist}`, { next: { tags: ['VVIPDealsRevalidate'] } });
        const data = await response.json();
        return data;
    } catch (e) {
        console.error(e);
        console.error("FetchVVIPDeals Failed.")
        return "FetchVVIPDeals Failed.";
    }
}