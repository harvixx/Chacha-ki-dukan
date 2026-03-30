import mongoose from "mongoose";
async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database");
    } catch (error) {
        console.error("Unable to connected to Database : ", error);
        throw error
    }
}
export default connectToDb;