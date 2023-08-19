import { cartSchema } from "../schemas/cart";
import Cart from "../model/cart";
import User from "../model/user";

export const getAllCart = async (req, res) => {
  try {
    const carts = await Cart.find();
    if (carts.length === 0) {
      return res.status(404).json({
        message: "Không có phiếu đặt hàng nào",
      });
    }
    return res.status(200).json({
      message: "Danh sách phiếu đặt hàng",
      data: carts,
    });
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};
export const getOneCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy phiếu đặt hàng",
      });
    }
    return res.status(200).json({
      message: "Phiếu đặt hàng",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const createCart = async (req, res) => {
  try {
    const cart = await Cart.create(req.body);
    if (!cart) {
      return res.status(400).json({
        message: "Không thể tạo danh mục",
      });
    }
    return res.status(201).json({
      message: "Phiếu đặt hàng đã được tạo",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy phiếu đặt hàng cần sửa",
      });
    }
    return res.status(200).json({
      message: "Phiếu đặt hàng đã được cập nhật thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const getCartByUserId = async (req, res) => {
  const {
    _limit = 10,
    _page = 1,
    _sort = "create_At",
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
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    // const cart = await Cart.paginate({ user_id: req.params.id }, options);
    const cart = await Cart.find({ user_id: req.params.id });
    console.log(cart);

    if (!cart) {
      return res.status(400).json({
        message: "Người dùng chưa đặt hàng",
      });
    }
    return res.status(200).json({
      message: "Danh sách phiêu đặt hàng người dùng đã đặt",
      user: user,
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
