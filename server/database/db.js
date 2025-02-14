import mongoose from "mongoose";

const connnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(
      `Mongodb connected !! DB Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB Connection error occured", error);
    process.exit(1);
  }
};
export default connnectDB;
