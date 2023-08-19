import { string } from "joi";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new mongoose.Schema(
  {
    productName: String,
    price: Number,
    originalPrice: Number,
    description: String,
    color: String,
    size: String,
    image: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true, versionKey: false }
);
productSchema.plugin(mongoosePaginate);
export default mongoose.model("Product", productSchema);
