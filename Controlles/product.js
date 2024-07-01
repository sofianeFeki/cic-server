const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");
const path = require("path");

exports.create = async (req, res) => {
  console.log(req.body); // Ensure you're receiving the correct data in the request body

  try {
    const { files, body } = req;

    // Parse ficheTech if it exists in the body
    if (body.ficheTech) {
      body.ficheTech = JSON.parse(body.ficheTech);
    }

    let imagePath = "";
    let pdfPath = "";
    let videoPath = "";

    if (files.imageFile) {
      imagePath = path.join("/uploads/images", files.imageFile[0].filename);
    }

    if (files.pdf) {
      pdfPath = path.join("/uploads/pdfs", files.pdf[0].filename);
    }

    if (files.video) {
      videoPath = path.join("/uploads/videos", files.video[0].filename);
    }

    const newProduct = new Product({
      ...body,
      slug: slugify(body.Title),
      Image: imagePath, // Assuming Image is still necessary for the product
      pdf: pdfPath,
      video: videoPath,
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

// exports.listAll = async (req, res) => {
//   let products = await Product.find({})
//     .limit(parseInt(req.params.count))
//     .populate('category')
//     .populate('subs')
//     .sort([['createdAt', 'desc']])
//     .exec();
//   res.json(products);
// };

// exports.remove = async (req, res) => {
//   try {
//     const deleted = await Product.findOneAndRemove({
//       slug: req.params.slug,
//     }).exec();
//     res.json(deleted);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// };

exports.read = async (req, res) => {
  const read = await Product.findOne({ slug: req.params.slug }).exec();
  console.log(req.params.slug);
  res.json(read);
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(path.join(__dirname, "..", filePath));
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
};

exports.update = async (req, res) => {
  console.log(req.body); // Ensure you're receiving the correct data in the request body

  try {
    // Extract fields from request body
    const { Title, imageFile, Image, ficheTech, ...rest } = req.body;
    let updateData = { ...rest }; // Copy other fields from the request body

    // Parse ficheTech if it is a string
    if (typeof ficheTech === "string") {
      try {
        updateData.ficheTech = JSON.parse(ficheTech);
      } catch (error) {
        console.error("Error parsing ficheTech:", error);
        return res.status(400).send("Invalid ficheTech format");
      }
    }

    // Check for uploaded files
    if (req.files) {
      if (req.files.imageFile) {
        const newImagePath = `/uploads/images/${req.files.imageFile[0].filename}`;

        // Delete old image if it exists and is different from the new one
        if (Image && Image !== newImagePath) {
          await deleteFile(Image);
        }

        // Save new image path
        updateData.Image = newImagePath;
      }

      if (req.files.pdf) {
        const newPdfPath = `/uploads/pdfs/${req.files.pdf[0].filename}`;

        // Delete old pdf if it exists
        if (updateData.pdf && updateData.pdf !== newPdfPath) {
          await deleteFile(updateData.pdf);
        }

        // Save new pdf path
        updateData.pdf = newPdfPath;
      }

      if (req.files.video) {
        const newVideoPath = `/uploads/videos/${req.files.video[0].filename}`;

        // Delete old video if it exists
        if (updateData.video && updateData.video !== newVideoPath) {
          await deleteFile(updateData.video);
        }

        // Save new video path
        updateData.video = newVideoPath;
      }
    }

    // If the user resets the image (sets it to empty), delete the old image
    if (imageFile === null) {
      if (Image) {
        await deleteFile(Image);
      }
      updateData.Image = ""; // Ensure Image field is set to empty
    }

    // If "Title" is provided, update the slug
    if (Title) {
      updateData.slug = slugify(Title);
    }

    // Perform the update operation
    const update = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      updateData,
      { new: true }
    ).exec();

    res.json(update);
  } catch (err) {
    console.error("Product update error:", err);
    return res.status(400).send("Product update failed");
  }
};

// without pagination
exports.list = async (req, res) => {
  try {
    //const { sort, order, limit } = req.body;
    const products = await Product.find({});
    // .populate('category')
    // .populate('subs')
    // .sort([[sort, order]])
    // .limit(limit)
    // .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

//with pagination
// exports.list = async (req, res) => {
//   try {
//     const { sort, order, page } = req.body;
//     const currentPage = page || 1;
//     const perPage = 3;
//     const products = await Product.find({})
//       .skip((currentPage - 1) * perPage)
//       .populate('category')
//       .populate('subs')
//       .sort([[sort, order]])
//       .limit(perPage)
//       .exec();
//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// exports.productsCount = async (req, res) => {
//   const total = await Product.find({}).estimatedDocumentCount().exec();
//   res.json(total);
// };

// exports.productStar = async (req, res) => {
//   const product = await Product.findById(req.params.productId).exec();
//   const user = await User.findOne({ email: req.user.email }).exec();
//   const { star } = req.body;

//   let existingRatingObject = product.ratings.find(
//     (ele) => ele.postedBy.toString() === user._id.toString()
//   );

//   if (existingRatingObject === undefined) {
//     let ratingAdded = await Product.findByIdAndUpdate(
//       product._id,
//       {
//         $push: { ratings: { star, postedBy: user._id } },
//       },
//       { new: true }
//     ).exec();
//     console.log('rating added', ratingAdded);
//     res.json(ratingAdded);
//   } else {
//     const ratingUpdated = await Product.updateOne(
//       { ratings: { $elemMatch: existingRatingObject } },
//       { $set: { 'ratings.$.star': star } },
//       { new: true }
//     ).exec();
//     console.log('rating updated', ratingUpdated);
//     res.json(ratingUpdated);
//   }
// };

// exports.listRelated = async (req, res) => {
//   const product = await Product.findById(req.params.productId).exec();
//   const related = await Product.find({
//     _id: { $ne: product._id },
//     category: product.category,
//   })
//     .limit(6)
//     .populate('category')
//     .populate('subs')
//     //.populate('postedBy')
//     .exec();
//   res.json(related);
// };

// // filter / search
// const handleQuery = async (req, res, query) => {
//   const products = await Product.find({ $text: { $search: query } })
//     .populate('category', '_id name')
//     .populate('subs', '_id name')
//     //.populate('postedBy', '_id name')
//     .exec();
//   res.json(products);
// };

// const handlePrice = async (req, res, price) => {
//   try {
//     let products = await Product.find({
//       price: {
//         $gte: price[0],
//         $lte: price[1],
//       },
//     })
//       .populate('category', '_id name')
//       .populate('subs', '_id name')
//       //.populate('postedBy', '_id name')
//       .exec();
//     res.json(products);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const handleCategory = async (req, res, category) => {
//   const products = await Product.find({ category })
//     .populate('category', '_id name')
//     .populate('subs', '_id name')
//     //.populate('postedBy', '_id name')
//     .exec();
//   res.json(products);
// };

// const handleStar = (req, res, stars) => {
//   Product.aggregate([
//     {
//       $project: {
//         document: '$$ROOT',
//         floorAverage: {
//           $floor: { $avg: '$ratings.star' },
//         },
//       },
//     },
//     { $match: { floorAverage: stars } },
//   ])
//     .limit(12)
//     .exec((err, aggregates) => {
//       if (err) console.log('aggregate error', err);
//       Product.find({ _id: aggregates })
//         .populate('category', '_id name')
//         .populate('subs', '_id name')
//         //.populate('postedBy', '_id name')
//         .exec((err, products) => {
//           if (err) console.log('product aggregate error', err);
//           res.json(products);
//         });
//     });
// };

// const handleSub = async (req, res, sub) => {
//   const products = await Product.find({ subs: sub })
//     .populate('category', '_id name')
//     .populate('subs', '_id name')
//     .exec();
//   res.json(products);
// };

// const handleShipping = async (req, res, shipping) => {
//   const products = await Product.find({ shipping })
//     .populate('category', '_id name')
//     .populate('subs', '_id name')
//     .exec();
//   res.json(products);
// };

// const handleColor = async (req, res, color) => {
//   const products = await Product.find({ color })
//     .populate('category', '_id name')
//     .populate('subs', '_id name')
//     .exec();
//   res.json(products);
// };

// const handleBrand = async (req, res, brand) => {
//   const products = await Product.find({ brand })
//     .populate('category', '_id name')
//     .populate('subs', '_id name')
//     .exec();
//   res.json(products);
// };

// exports.searchFilters = async (req, res) => {
//   const { query, price, category, stars, sub, shipping, color, brand } =
//     req.body;
//   if (query) {
//     console.log('query ------>', query);
//     await handleQuery(req, res, query);
//   }
//   if (price !== undefined) {
//     console.log('price ------>', price);
//     await handlePrice(req, res, price);
//   }
//   if (category) {
//     console.log('category ------>', category);
//     await handleCategory(req, res, category);
//   }
//   if (stars) {
//     console.log('stars ------>', stars);
//     await handleStar(req, res, stars);
//   }
//   if (sub) {
//     console.log('sub ------>', sub);
//     await handleSub(req, res, sub);
//   }
//   if (shipping) {
//     console.log('shipping ------>', shipping);
//     await handleShipping(req, res, shipping);
//   }
//   if (color) {
//     console.log('color ------>', color);
//     await handleColor(req, res, color);
//   }
//   if (brand) {
//     console.log('brand ------>', brand);
//     await handleBrand(req, res, brand);
//   }
// };
