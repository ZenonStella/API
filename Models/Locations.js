import mongoose, { Mongoose } from "mongoose";

const LocationsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isArchive: {
        type: Boolean,
        required: true,
        default: false
    },
    companyId: {
        type: mongoose.Types.ObjectId,
        required: false,
    }
});

// mongoose.model(<collection name>, <collection schema>);
const Locations = mongoose.model('locations', LocationsSchema);

export default Locations;