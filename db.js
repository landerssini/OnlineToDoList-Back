import mongoose from "mongoose"

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)

    console.log("DB Online")
   
  } catch (error) {
    console.log(error)
    throw new Error("Could not initialize DB")
  }
}

