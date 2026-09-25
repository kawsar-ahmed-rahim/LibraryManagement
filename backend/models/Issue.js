import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({

},{
    timestamps: true
})

export default mongoose.model("Issue", issueSchema);