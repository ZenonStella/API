import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    companyId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date()
    },
});

// mongoose.model(<collection name>, <collection schema>);
const Orders = mongoose.model('orders', OrdersSchema);

export default Orders;