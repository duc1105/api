import Joi from "joi";
export const cartSchema = Joi.object({
  user_id: Joi.string(),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.string(),
      product_name: Joi.string(),
      price: Joi.number(),
      quanlity: Joi.number(),
      subtotal: Joi.number(),
    })
  ),
  total_price: Joi.number(),
});
