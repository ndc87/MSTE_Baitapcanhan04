const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const response = require('../utils/response');

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildProductPayload = (product) => {
  const category = product.category && typeof product.category === 'object'
    ? product.category
    : null;

  const sortedMedia = Array.isArray(product.media)
    ? [...product.media].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    : [];
  const images = sortedMedia
    .filter((item) => item.media_type === 'image')
    .map((item) => item.media_url);

  const variantStock = Array.isArray(product.variants)
    ? product.variants.reduce((sum, variant) => sum + (variant.stock_quantity || 0), 0)
    : 0;
  const stock = variantStock > 0 ? variantStock : (product.stock_quantity || 0);

  return {
    id: product._id?.toString(),
    slug: product.slug,
    title: product.name,
    price: product.base_price,
    oldPrice: product.old_price || null,
    discount: product.discount || 0,
    stock,
    rating: product.average_rating || 0,
    reviewCount: product.review_count || 0,
    images: images.length > 0 ? images : ['https://placehold.co/600x600'],
    category: category?.slug || null,
    categoryName: category?.name || null,
    tags: product.tags || [],
    brand: product.brand || 'UTEShop',
    description: product.description || '',
    specs: product.specs || {},
    viewCount: product.view_count || 0
  };
};

const buildFilters = async (query) => {
  const conditions = [{ is_active: true }];

  if (query.category) {
    const category = await Category.findOne({ slug: query.category });
    if (!category) {
      return { match: { _id: null } };
    }
    conditions.push({ category: category._id });
  }

  if (query.search && query.search.trim()) {
    const regex = new RegExp(query.search.trim(), 'i');
    conditions.push({ $or: [{ name: regex }, { description: regex }] });
  }

  if (query.tag) {
    conditions.push({ tags: query.tag });
  }

  const priceMin = toNumber(query.priceMin, null);
  const priceMax = toNumber(query.priceMax, null);
  if (priceMin !== null || priceMax !== null) {
    const priceFilter = {};
    if (priceMin !== null) priceFilter.$gte = priceMin;
    if (priceMax !== null) priceFilter.$lte = priceMax;
    conditions.push({ base_price: priceFilter });
  }

  const rating = toNumber(query.rating, null);
  if (rating !== null && rating > 0) {
    conditions.push({ average_rating: { $gte: rating } });
  }

  if (query.inStock === 'true') {
    conditions.push({
      $or: [
        { stock_quantity: { $gt: 0 } },
        { 'variants.stock_quantity': { $gt: 0 } }
      ]
    });
  }

  return { match: conditions.length > 1 ? { $and: conditions } : conditions[0] };
};

exports.listProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const sort = req.query.sort;

    const { match } = await buildFilters(req.query);

    let sortConfig = { createdAt: -1 };
    if (sort === 'price-asc') sortConfig = { base_price: 1 };
    if (sort === 'price-desc') sortConfig = { base_price: -1 };
    if (sort === 'rating') sortConfig = { average_rating: -1 };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(match)
        .populate('category', 'name slug')
        .sort(sortConfig)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(match)
    ]);

    return response.success(res, {
      message: 'Products fetched successfully',
      data: {
        items: products.map(buildProductPayload),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const increaseView = req.query.increaseView !== 'false';

    const product = await Product.findOne({ slug }).populate('category', 'name slug');
    if (!product) {
      return response.error(res, {
        statusCode: 404,
        message: 'Product not found'
      });
    }

    if (increaseView) {
      product.view_count = (product.view_count || 0) + 1;
      await product.save();
    }

    return response.success(res, {
      message: 'Product fetched successfully',
      data: buildProductPayload(product)
    });
  } catch (error) {
    next(error);
  }
};

exports.getTopSellingProducts = async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const pipeline = [
      { $match: { status: { $in: ['completed', 'shipping'] } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', sold: { $sum: '$items.quantity' } } },
      { $sort: { sold: -1 } },
      { $limit: limit },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $match: { 'product.is_active': true } },
      { $lookup: { from: 'categories', localField: 'product.category', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }
    ];

    const results = await Order.aggregate(pipeline);
    const items = results.map((entry) => buildProductPayload({
      ...entry.product,
      category: entry.category
    }));

    return response.success(res, {
      message: 'Top selling products fetched successfully',
      data: { items }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMostViewedProducts = async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const products = await Product.find({ is_active: true })
      .populate('category', 'name slug')
      .sort({ view_count: -1, createdAt: -1 })
      .limit(limit);

    return response.success(res, {
      message: 'Most viewed products fetched successfully',
      data: { items: products.map(buildProductPayload) }
    });
  } catch (error) {
    next(error);
  }
};
