import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reviewerName: {
      type: String,
      required: true,
    },
    reviewerEmail: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const DimensionsSchema = new mongoose.Schema(
  {
    width: Number,
    height: Number,
    depth: Number,
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título del producto es requerido"],
      trim: true,
      maxlength: [200, "El título no puede tener más de 200 caracteres"],
    },
    description: {
      type: String,
      required: [true, "La descripción del producto es requerida"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "La categoría es requerida"],
      lowercase: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0, "El precio no puede ser negativo"],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      required: [true, "El stock es requerido"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    brand: {
      type: String,
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    weight: Number,
    dimensions: DimensionsSchema,
    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    reviews: [ReviewSchema],
    returnPolicy: String,
    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    thumbnail: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual para calcular el precio con descuento
ProductSchema.virtual("finalPrice").get(function () {
  return this.price - (this.price * this.discountPercentage) / 100;
});

// Virtual para el número de reseñas
ProductSchema.virtual("reviewCount").get(function () {
  return this.reviews ? this.reviews.length : 0;
});

// Índices compuestos para mejorar las búsquedas
ProductSchema.index({ title: "text", description: "text" });
ProductSchema.index({ category: 1, brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });

// Método para actualizar el stock
ProductSchema.methods.updateStock = function (quantity) {
  this.stock += quantity;

  if (this.stock <= 0) {
    this.availabilityStatus = "Out of Stock";
  } else if (this.stock < 10) {
    this.availabilityStatus = "Low Stock";
  } else {
    this.availabilityStatus = "In Stock";
  }

  return this.save();
};

// Método estático para buscar productos
ProductSchema.statics.searchProducts = function (query) {
  return this.find({
    $text: { $search: query },
  });
};

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
