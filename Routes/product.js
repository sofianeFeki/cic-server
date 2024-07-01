const express = require("express");
const router = express.Router();
const multer = require("multer");
//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");
//controller
const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
} = require("../Controlles/product");

//Update Routes to Handle File Uploads

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir = "uploads/others";
    if (file.fieldname === "imageFile") {
      uploadDir = "uploads/images";
    } else if (file.fieldname === "pdf") {
      uploadDir = "uploads/pdfs";
    } else if (file.fieldname === "video") {
      uploadDir = "uploads/videos";
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/product/create",
  upload.fields([
    { name: "imageFile", maxCount: 3 },
    { name: "pdf", maxCount: 2 },
    { name: "video", maxCount: 2 },
  ]),
  create
);
// router.get("/products/total", productsCount);
// router.get("/products/:count", listAll);
// router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put(
  "/admin/product-update/:slug",
  upload.fields([
    { name: "imageFile", maxCount: 2 },
    { name: "pdf", maxCount: 2 },
    { name: "video", maxCount: 2 },
  ]),
  update
);

router.get("/products", list);

// // rating
// router.put("/product/star/:productId", authCheck, productStar);

// //related
// router.get("/product/related/:productId", listRelated);

// //serach product

// router.post("/search/filters", searchFilters);

module.exports = router;
