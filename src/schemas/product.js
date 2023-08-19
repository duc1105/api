import joi, { string } from "joi";
export const productSchema = joi.object({
  productName: joi.string().required(),
  price: joi.number().required(),
  originalPrice: joi.number().required(),
  description: joi.string(),
  color: joi.string().required(),
  size: joi.string().required(),
  image: joi
    .array()
    .items(
      joi.object({
        url: string(),
        publicId: string(),
      })
    )
    .required(),
  categoryId: joi.string().required(),
});
