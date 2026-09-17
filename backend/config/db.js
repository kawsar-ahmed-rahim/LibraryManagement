import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect("mongodb+srv://kahmedrahim1512_db_user:n6DDX3SYnlYcHMrk@cluster0.a9h8rui.mongodb.net/LibraryManagement")
    .then(()=> {
        console.log("DB CONNECTED");
        
    })
}