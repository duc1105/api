import mongoose from "mongoose";

import { mongoosePaginate } from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        product_id: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    total_price: { type: Number },
  },
  { timestamps: true, versionKey: false }
);
// cartSchema.plugin(mongoosePaginate);
export default mongoose.model("Cart", cartSchema);
