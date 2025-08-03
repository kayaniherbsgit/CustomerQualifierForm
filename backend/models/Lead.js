import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  problem: { type: String, required: true },
  readyToPay: { type: Boolean, default: null },
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
