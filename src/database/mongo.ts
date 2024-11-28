import mongoose from "mongoose"

export const mongoConnect = async () => {
    try { await mongoose.connect(process.env.MONGO_URL as string) }
    catch (error) { console.log(error) }
}