import Category from "../model/category";
import Product from "../model/product";
import { productSchema } from "../schemas/product";
import cloudinary from "../config/cloudinary";
export const getAllProduct = async (req, res) => {
  const {
    _limit = 10,
    _page = 1,
    _sort = "created_At",
    _order = "asc",
    _keyword,
  } = req.query;
  const options = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order == "desc" ? -1 : 1,
    },
  };
  try {
    const searchData = (products) => {
      return products?.docs?.filter((item) =>
        item.productName.includes(_keyword)
      );
    };

    const products = await Product.paginate({}, options);
    // Nếu mảng không có sản phẩm nào thì trả về 404
    if (products.length === 0) {
      res.status(404).json({
        message: "Không có sản phẩm nào",
      });
    }
    if (_keyword) {
      const searchDataProduct = await searchData(products);
      const productsResponse = await { ...products, docs: searchDataProduct };
      return res.status(200).json(productsResponse);
    }

    return res.status(200).json(products);

    // Nếu có sản phẩm thì trả về 200 và mảng sản phẩm
  } catch (error) {
    // Nếu có lỗi thì trả về 500 và lỗi
    return res.status(500).json({
      message: error,
    });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId"
    );
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      message: "Product found",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
export const createProduct = async (req, res) => {
  //Lấy dữ liệu ảnh upload được gửi lên từ form
  const files = req.files;
  if (!Array.isArray(files)) {
    return res.status(400).json({ error: "No files were uploaded" });
  }
  try {
    //tạo 1 mảng lưu trữ link ảnh và id ảnh ở cloudinary tiện cho việc xuất ảnh và update,xóa ảnh
    const uploadedFiles = files.map((result) => ({
      url: result.path,
      publicId: result.filename,
    }));
    // console.log(uploadedFiles);
    const { error } = productSchema.validate({
      ...req.body,
      image: uploadedFiles,
    });
    if (error) {
      //nếu có lỗi ở validate không cho ảnh được upload lên cloudinary
      if (uploadedFiles) {
        uploadedFiles.map((file) => {
          cloudinary.uploader.destroy(file.publicId);
        });
      }
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const product = await Product.create({ ...req.body, image: uploadedFiles });
    if (!product) {
      return res.status(400).json({
        message: "Không thể tạo sản phẩm",
      });
    }
    await Category.findByIdAndUpdate(product.categoryId, {
      $addToSet: {
        products: product._id,
      },
    });
    return res.status(201).json({
      message: "Product created",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const removeProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    //xóa sản phẩm thì xóa luôn cả ảnh trên cloudinary
    product.image.map((file) => {
      cloudinary.uploader.destroy(file.publicId);
    });
    return res.status(200).json({
      data: product,
      message: "Sản phẩm đã được xóa thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    //Lấy dữ liệu file ảnh được upload từ form
    const files = req.files;
    let uploadedFiles = [];
    const product = await Product.findById(req.params.id);

    //Nếu trong mảng chứa dữ liệu tức là muốn thay đổi ảnh mới
    if (files.length > 0) {
      //Xóa ảnh cũ
      product.image?.map((file) => {
        cloudinary.uploader.destroy(file.publicId);
      });
      //Tạo 1 mảng chứa dữ liệu ảnh mới
      uploadedFiles = files.map((result) => ({
        url: result.path,
        publicId: result.filename,
      }));
    } else {
      //Nếu không upload ảnh thì lưu lại ảnh cũ
      uploadedFiles = product.image;
    }
    //update lại sản phẩm
    const productUpdate = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: uploadedFiles },
      {
        new: true,
      }
    );

    if (!productUpdate) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      message: "Sản phẩm đã được cập nhật thành công",
      data: productUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
