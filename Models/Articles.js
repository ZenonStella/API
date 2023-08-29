import mongoose from "mongoose";

const ArticlesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    reference: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: false,
    },
    stock: {
        type: Number,
        required: false,
        default: 0
    },
    threshold: {
        // seuil critique du stock
        type: Number,
        required: false,
        default: 0
    },
    locationId: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    companyId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    qrCode: {
        type: String,
        required: false
    },
    isArchive: {
        type: Boolean,
        required: true,
        default: false
    }
});

// mongoose.model(<collection name>, <collection schema>);
const Articles = mongoose.model('articles', ArticlesSchema);

export default Articles;