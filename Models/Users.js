import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UsersSchema = new mongoose.Schema({
    lastname: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: false,
        default: true
    },
    licenceId: {
        type: mongoose.Types.ObjectId,
        required: false,
    },
    companyId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    created_at: {
        type: Date,
        required: false,
        default: Date()
    },
    delete_at: {
        type: Date,
        required: false,
    },
    sessions: {
        web: {
            type: String,
            required: false
        },
        desktop: {
            type: String,
            required: false
        },
        mobile: {
            type: String,
            required: false
        }
    },
    refreshTokenAuthorized: {
        type: Boolean,
        default: false,
        required: true
    },
});

UsersSchema.pre('save', async function (next) {
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;

    next();
});

UsersSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const isSame = await bcrypt.compare(password, user.password);
    return isSame; // Return true ou false
}
// mongoose.model(<collection name>, <collection schema>);
const Users = mongoose.model('users', UsersSchema);

export default Users;