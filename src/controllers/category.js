import axios from "axios";
import Category from "../model/category";
import Product from "../model/product";
export const getAllCate = async (req, res) => {
  try {
    // gửi request từ server nodes -> json-server
    const categories = await Category.find();
    // Nếu mảng không có sản phẩm nào thì trả về 404
    if (categories.length === 0) {
      res.status(404).json({
        message: "Không có danh mục nào ",
      });
    }
    // Nếu có sản phẩm thì trả về 200 và mảng sản phẩm
    return res.status(200).json(categories);
  } catch (error) {
    // Nếu có lỗi thì trả về 500 và lỗi
    return res.status(500).json({
      message: error,
    });
  }
};
export const getCateById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "products"
    );
    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    const products = await Product.find({ categoryId: req.params.id });
    return res.status(200).json({
      ...category.toObject(),
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
export const createCate = async (req, res) => {
  try {
    console.log(1);
    const category = await Category.create(req.body);
    if (!category) {
      return res.status(400).json({
        message: "Không thể tạo danh mục",
      });
    }
    return res.status(201).json({
      message: "Danh mục đã được tạo",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const removeCate = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Danh mục đã được xóa thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const updateCate = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục",
      });
    }
    return res.status(200).json({
      message: "Danh mục đã được cập nhật thành công",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
