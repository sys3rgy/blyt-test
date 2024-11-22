export interface MerchantData {
    //! Merchant id
    _id: string;
    //! Client Data
    userFullName: string;
    userEmail: string;
    userName: string;
    userPassword: string;
    userProfilePic: string;
    invitedBy: string;
    inviteCode: string;
    totalReferrals: string[];
    bio: string;
    phoneNumberCountryCode: string;
    phoneNumber: string;
    blytPoints: number;
    isMerchant: boolean;
    //! Merchant Data
    businessName: string;
    businessCategory: string;
    businessDescription: string;
    businessPhoneNumberCountryCode: string;
    businessPhoneNumber: string;
    businessLocation: string;
    businessAddress: string;
    businessState: string;
    businessCity: string;
    businessPincode: string;
    businessPage: string;
    websiteLink: string;
    dealsCount: number;
    profileViews: number;
    totalOrders: number;
    totalEarnings: number;
    allOrdersList: OrdersListData[];
    totalReviews: string[];
    totalReviewsCount: number;
    averageRatings: number;
    service: {
        serviceCategory: string;
        serviceCurrency: string;
        serviceName: string;
        serviceDescription: string;
        serviceImages: string[];
        serviceVideo: string;
        serviceDeck: string;
        serviceMinPrice: number;
        serviceMaxPrice: number;
        serviceBanner: string;
    };
    socialMediaLinks: {
        instagram: string;
        twitter: string;
        linkedin: string;
        facebook: string;
    };
    funding: {
        fundingStage: string;
        fundingCurrency: string;
        fundingAmount: string;
        fundingDescription: string;
        fundingDeck: string;
    }
    packagesList: PackageListData[];
    dealsList: DealsListData[];
    verified: boolean;
    toVerify: boolean;
    activationStatus: boolean;
    banned: boolean;
    createdAt: string;
}

export interface PackageListData {
    _id: string;
    merchantId: string;
    packageName: string;
    packagePrice: number;
    packageDescription: string;
    packageImages: string[];
    packageCategory: string;
    packageReviews: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface DealsListData {
    _id: string;
    uniqueSlug: string;
    merchantId: string;
    merchantUserName: string;
    discountValue: string;
    couponCode: string;
    couponDescription: string;
    stepsToRedeem: string;
    dealPicture: string;
    __v: number;
}

export interface SearchedData {
    _id: string;
    userName: string;
    businessName: string;
    serviceCategory: string;
    serviceName: string;
}

export interface OrdersListData {
    _id: string;
    merchantId: string;
    buyerId: string;
    buyerFullName: string;
    buyerUserName: string;
    packageId: string;
    serviceName: string;
    packageName: string;
    packageDescription: string;
    packageImage: string;
    packageAmount: string;
    orderStatus: string;
    __v: number;
}

export interface CountriesList {
    country: string;
    code?: string;
    flag: string;
}

export interface CountryPhoneCodes {
    country: string;
    code: string;
    iso: string;
}

export interface ServiceCategoriesList {
    _id: string;
    category: string;
    link: string;
}

export interface CurrencyList {
    cc: string;
    symbol: string;
    name: string;
}

export interface LatestOrderData {
    _id: string;
    merchantId: MerchantData;
    buyerId: MerchantData;
    packageId: PackageListData;
    orderStatus: string;
}

export interface PointsPriceList {
    _id: string;
    points: number;
    price: number;
    salePrice: number;
}

export interface InitiatedContactsList {
    map(arg0: (item: any) => import("react").JSX.Element): import("react").ReactNode;
    _id: string;
    buyerId: string,
    buyerFullName: string,
    buyerUserName: string,
    buyerProfilePic: string,
    merchantId: string,
    merchantUserName: string,
    merchantBusinessName: string,
    packageId: string,
    serviceName: string,
    packageName: string,
    packageDescription: string,
    packageImage: string,
    packageAmount: number,
    serviceCurrency: string;
    orderStatus: string,
    orderReviewed: boolean,
    rating: number,
    isPointsShared: boolean;
    pointsShared: number;
    length: number;
    referredBy: string
    isPointsSharedToReferred: boolean;
    pointsSharedToReferred: number;
}

export interface ReviewsList {
    map(arg0: (item: any) => import("react").JSX.Element): import("react").ReactNode;
    _id: string;
    buyerId: string,
    buyerName: string,
    buyerProfilePic: string,
    merchantId: string,
    merchantUserName: string,
    merchantBusinessName: string,
    merchantPackageId: string,
    merchantPackageName: string,
    rating: number,
    comment: string,
}