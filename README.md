# APIs

## /api/adminAPIs

1. Started working it, it was basically for Admin panel.

## /api/buyersAPIs

1. buyerAccountDataFetchUpdateAPI:
   * GET: It will fetch the buyer's accoutn details, orders, reviews, & likes list.
   * POST: It will like or unlike the merchant's package.
2. buyerFetchOrdersListAPI:
   * GET: It will fetch the orders list or the buyer.
3. buyerProfilePicUpdateAPI:
   * GET: It will update the buyer profile picture.
4. buyerSignInAPI:
   * POST: It will verify buyer creds, & send OTP to their mail.
   * PUT: It will verify the OTP, & redirect them to buyersPage.
5. buyerSignUpAPI
   * POST: It will verify buyer creds, & send OTP to their mail.
   * PUT: It will verify the OTP, & add them in the DB.
6. buyPointsAPI:
   * GET: It will generate an access token from the commerce pay for the payment.
   * POST: It will generate an orderID for the points user wants to buy, & will redirect them to payment page.
   * PUT: If user tries to visit the page again, then, it will check that user has already verified the payment or not. If verified, then, will not add points, & redirect them homepage, else, it will add points to their wallet, & then show a payment done page.
7. publicMerchantAccountDataFetchAPI:
   * GET: It will fetch the merchant public data for the buyer view.
8. vvipDealsFetchAPI:
   * GET: It will fetch all of the VVIP deals list available.

## /api/commonAPIs

1. localSessionCheck:
   * GET: It will verify the user token is valid or not.
2. logoutSession:
   * GET: API to logout user, clean cookies, & remove their session from DB too.
3. merchantServicesFetch:
   * GET: It will fetch the merchants services for /services page.
4. pointsPrice:
   * GETL It will fetch the points price list for /purchase-points.
5. resendOTP:
   * PUT: It will allow users to resend the OTP.
6. resetPassword:
   * POST: It will generate an OTP & send to mail to reset the password.
   * PUT: User provides OTP, & new password, once OTP is verified, it will update the password in the DB.
7. reviewOrder:
   * GET: It will fetch the reviews from the merchant page.
8. serverSessionCheck:
   * GET: It will be used if user wants to do any critical changes so that we can verify that someone haven't stolen their cookie.

## /api/commonData

1. servicesCategoriesList
   * GET: It will fetch the categories list for the hamburger menu.

## /api/merchantsAPIs

1. merchantAccountDataFetchUpdateAPI:

   * GET: It will fetch the merchant data.
   * PUT: It will allow merchants to update their PersonalInformation, ServiceInformation, FundingInformation, VVIPDeals.
   * DELETE: It will allow merchants to delete their packages, vvip-deals.
2. merchantFetchOrdersListAPI:

   * GET: It will fetch merchant orders list for initiated contact ,work in progress, & done deals.
3. merchantPackageAddUpdateAPI:

   * POST: It will allow merchants to add packages in their account, & in this, (userName, businessName, serviceCategory, serviceName, & packageName) will be saved to SuggestionsModel for search bar.
   * PUT: It will allow merchants to add packages in their account.
4. merchantPointsShareAPI:

   * PUT: It will allow merchants to share points to buyer & referred person.
5. merchantProfilePicAndBannerUpdateAPI:

   * POST: It will allow merchant to update profile pic or banner.
   * DELETE: It will allow merchant to delete profile pic or banner.
6. merchantSignInAPI:

   * POST: It will verify merchant creds, & send OTP to their mail.
   * PUT: It will verify the OTP, & redirect them to merchantsPage.
7. merchantSignUpAPI:

   * POST: It will verify merchant creds, & send OTP to their mail.
   * PUT: It will verify the OTP, & redirect them to merchantsPage.
8. verifyMeAPI:

   * PUT: It will send the merchants account to admin for verification.

## /api/ordersAPIs

1. /addUpdateOrderStatus
   * GET: On buyer side, fetch merchant contact number, & redirect to whatsapp.
   * POST: It will allow user to initiate the package, only buyer's can initiate the package.
   * PUT: If merchant wants to change status to work in progress/initiate contact, then, it will just change the status, but if merchant tries to set it as done deals, then, it will send an OTP to user.
   * PATCH: When merchant enters correct OTP for done deals, then, it will update the deal status to done deals, & send an email to buyer, & the referred guy if exist.
   * DELETE: It allows buyer to cancel the order, & will send an email to merchant that the order has been canceled.

## /api/payment-verify

    1. It is used to generate returnURL in /buyPointsAPI.
