const { mongoose } = require("mongoose");
require('./MerchantPackagesListModel');
require('./OrdersListModel');

const accountsModelSchema = new mongoose.Schema({
    //! Client Data
    userFullName: {
        type: String
    },
    userEmail: {
        type: String,
        default: ""
    },
    userName: {
        type: String,
        default: ""
    },
    userPassword: {
        type: String
    },
    userProfilePic: {
        type: String
    },
    invitedBy: {
        type: String
    },
    inviteCode: {
        type: String
    },
    totalReferrals: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        default: ""
    },
    socialMediaLinks: {
        instagram: {
            type: String
        },
        twitter: {
            type: String
        },
        linkedin: {
            type: String
        },
        facebook: {
            type: String
        },
    },
    phoneNumberCountryCode: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    blytPoints: {
        type: Number,
        default: 0
    },
    isMerchant: {
        type: Boolean,
        default: false
    },
    //! Merchant Data
    businessName: {
        type: String
    },
    businessCategory: {
        type: String
    },
    businessDescription: {
        type: String
    },
    businessPhoneNumberCountryCode: {
        type: String
    },
    businessPhoneNumber: {
        type: String
    },
    businessLocation: {
        type: String
    },
    businessAddress: {
        type: String
    },
    businessCity: {
        type: String
    },
    businessPincode: {
        type: String
    },
    businessState: {
        type: String
    },
    businessPage: {
        type: String
    },
    websiteLink: {
        type: String
    },
    dealsCount: {
        type: Number,
        default: 0
    },
    profileViews: {
        type: Number,
        default: 0
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    allOrdersList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orderslist'
    }],
    totalReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orderslist'
    }],
    totalReviewsCount: {
        type: Number,
        default: 0
    },
    averageRatings: {
        type: Number,
        default: 0
    },
    service: {
        serviceCategory: {
            type: String,
        },
        serviceName: {
            type: String,
        },
        serviceDescription: {
            type: String,
        },
        serviceImages: {
            type: [String],
        },
        serviceVideo: {
            type: String,
        },
        serviceDeck: {
            type: String,
        },
        serviceCurrency: {
            type: String,
        },
        serviceMinPrice: {
            type: Number,
        },
        serviceMaxPrice: {
            type: Number,
        },
        serviceBanner: {
            type: String,
        }
    },
    funding: {
        fundingStage: {
            type: String,
        },
        fundingCurrency: {
            type: String,
        },
        fundingAmount: {
            type: String,
        },
        fundingDescription: {
            type: String,
        },
        fundingDeck: {
            type: String,
        }
    },
    packagesList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'merchantPackagesList'
    }],
    dealsList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'merchantDealsList'
    }],
    verified: {
        type: Boolean,
        default: false
    },
    toVerify: {
        type: Boolean,
        default: false
    },
    activationStatus: {
        type: Boolean,
        default: false
    },
    banned: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    likesList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'merchantPackagesList'
    }],
}, { timestamps: true })

accountsModelSchema.index({ userName: 1 }, { unique: true });
accountsModelSchema.index({ 'service.serviceCategory': 1 });

export default mongoose.models.accounts || mongoose.model('accounts', accountsModelSchema);