const Sub = require('../models/sub');
const slugify = require('slugify');
const Product = require('../models/product');
const Category = require('../models/category'); // Necessary import for populate to work

exports.create = async (req, res) => {
  console.log(req.body, '==================>');

  try {
    const { sub } = req.body; // Assuming the request body contains { sub: { sub: 'aaaa', parent: '66d122a328cd51561a642482' } }

    // Extract the actual sub name and parent from the sub object
    const { sub: subName, parent } = sub;

    // Create a new subcategory using 'subName' as the name
    const newSub = await new Sub({
      name: subName,
      parent: parent,
      slug: slugify(subName),
    }).save();

    // Send the response with the newly created subcategory
    res.json(newSub);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message); // Corrected to 'err.message'
  }
};

exports.list = async (req, res) => {
  try {
    // Fetch all subcategories and populate the parent field with the category name
    const subs = await Sub.find({}).populate('parent', 'name').exec();

    res.json(subs);
  } catch (err) {
    console.log(err);
    res.status(400).send('Failed to fetch subcategories');
  }
};

exports.read = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ subs: sub })
    .populate('category')
    .exec();
  res.json({
    sub,
    products,
  });
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const update = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(update);
  } catch {
    console.log(err);
    res.status(400).send('Sub update failed');
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    console.log(err);
    res.status(400).send('Sub delete failed');
  }
};
