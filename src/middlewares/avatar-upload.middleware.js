const multer = require("multer");
const path = require("path");
const ApiError = require("../api-error");

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/"); // Lưu file vào thư mục public/uploads
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + path.extname(file.originalname));
    // Tạo tên file mới
  },
});

// Hàm xử lý upload avatar
function avatarUpload(req, res, next) {
  const upload = multer({ storage: storage }).single("avatarFile"); // Chỉ cho phép upload 1 file có tên avatarFile

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Xử lý các lỗi liên quan đến multer
      return next(
        new ApiError(400, "An error occurred while uploading the avatar")
      );
    } else if (err) {
      // Xử lý các lỗi khác
      return next(
        new ApiError(
          500,
          "An unknown error occurred while uploading the avatar"
        )
      );
    }

    // Nếu không có lỗi, chuyển đến middleware tiếp theo
    next();
  });
}

module.exports = avatarUpload;
