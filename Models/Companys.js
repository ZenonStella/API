import mongoose from "mongoose";

const CompanysSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    siret: {
        type: String,
        required: false
    },
    way: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    emailActivated: {
        type: Boolean,
        required: true,
        default: false
    },
    emailCode: {
        type: String,
        required: true
    },
    customerStripeId: {
        type: String,
        required: false
    },
    cardStripeId: {
        type: String,
        required: false
    },
    licence: [{
        isActivated: {
            type: Boolean,
            required: false
        },
        key: {
            type: String,
            required: false
        },
        activationDate: {
            type: Date,
            required: false
        },
        expirationDate: {
            type: Date,
            required: false
        },
        duration: {
            type: Number,
            required: false
        },
        package: {
            type: String,
            required: false
        },
        monthCounter: {
            type: Number,
            required: false
        },
        monthlyPayment: {
            type: Number,
            required: false
        },
        invoice: {
            type: String,
            required: false
        },

    }]
    
});

// mongoose.model(<collection name>, <collection schema>);
const Companys = mongoose.model('companys', CompanysSchema);

export default Companys;