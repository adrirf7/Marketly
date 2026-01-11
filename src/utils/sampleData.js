// Datos de ejemplo para desarrollo sin MongoDB
// Estos son los mismos productos del proyecto ecommerce-react original
export const sampleProducts = [
  {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description:
      "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    category: "beauty",
    price: 9.99,
    discountPercentage: 10.48,
    rating: 2.56,
    stock: 99,
    tags: ["beauty", "mascara"],
    brand: "Essence",
    sku: "BEA-ESS-ESS-001",
    weight: 4,
    dimensions: { width: 15.14, height: 13.08, depth: 22.99 },
    warrantyInformation: "1 week warranty",
    shippingInformation: "Ships in 3-5 business days",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 3,
        comment: "Would not recommend!",
        date: "2025-04-30T09:41:02.053Z",
        reviewerName: "Eleanor Collins",
        reviewerEmail: "eleanor.collins@x.dummyjson.com",
      },
    ],
    returnPolicy: "No return policy",
    minimumOrderQuantity: 1,
    images: ["https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
  },
  {
    id: 2,
    title: "Eyeshadow Palette with Mirror",
    description: "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks.",
    category: "beauty",
    price: 19.99,
    discountPercentage: 5.5,
    rating: 4.5,
    stock: 44,
    tags: ["beauty", "eyeshadow"],
    brand: "Glamour Beauty",
    sku: "BEA-GLA-EYE-001",
    weight: 3,
    dimensions: { width: 12.42, height: 8.63, depth: 29.13 },
    warrantyInformation: "1 year warranty",
    shippingInformation: "Ships in 2 weeks",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 4,
        comment: "Very satisfied!",
        date: "2024-05-23T08:56:21.618Z",
        reviewerName: "Liam Garcia",
        reviewerEmail: "liam.garcia@x.dummyjson.com",
      },
    ],
    returnPolicy: "30 days return policy",
    minimumOrderQuantity: 32,
    images: ["https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.png"],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
  },
  {
    id: 3,
    title: "Powder Canister",
    description: "The Powder Canister is a finely milled setting powder designed to set makeup and control shine.",
    category: "beauty",
    price: 14.99,
    discountPercentage: 18.14,
    rating: 3.82,
    stock: 59,
    tags: ["beauty", "face powder"],
    brand: "Velvet Touch",
    sku: "BEA-VEL-POW-001",
    weight: 8,
    dimensions: { width: 24.16, height: 10.7, depth: 11.07 },
    warrantyInformation: "2 year warranty",
    shippingInformation: "Ships in 1-2 business days",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Very happy with my purchase!",
        date: "2024-05-23T08:56:21.618Z",
        reviewerName: "Ethan Thompson",
        reviewerEmail: "ethan.thompson@x.dummyjson.com",
      },
    ],
    returnPolicy: "60 days return policy",
    minimumOrderQuantity: 25,
    images: ["https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png"],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
  },
  {
    id: 4,
    title: "Red Lipstick",
    description: "The Red Lipstick is a classic and bold choice for adding a pop of color to your lips.",
    category: "beauty",
    price: 12.99,
    discountPercentage: 19.03,
    rating: 2.46,
    stock: 68,
    tags: ["beauty", "lipstick"],
    brand: "Chic Cosmetics",
    sku: "BEA-CHI-RED-001",
    weight: 5,
    dimensions: { width: 14.37, height: 13.94, depth: 14.6 },
    warrantyInformation: "Lifetime warranty",
    shippingInformation: "Ships in 2 weeks",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Great product!",
        date: "2024-05-23T08:56:21.619Z",
        reviewerName: "Leo Rivera",
        reviewerEmail: "leo.rivera@x.dummyjson.com",
      },
    ],
    returnPolicy: "90 days return policy",
    minimumOrderQuantity: 6,
    images: ["https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png"],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png",
  },
  {
    id: 5,
    title: "Red Nail Polish",
    description: "The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails.",
    category: "beauty",
    price: 8.99,
    discountPercentage: 2.46,
    rating: 4.91,
    stock: 71,
    tags: ["beauty", "nail polish"],
    brand: "Nail Couture",
    sku: "BEA-NAI-RED-001",
    weight: 9,
    dimensions: { width: 8.11, height: 10.89, depth: 29.06 },
    warrantyInformation: "1 year warranty",
    shippingInformation: "Ships in 1 week",
    availabilityStatus: "In Stock",
    reviews: [
      {
        rating: 5,
        comment: "Very pleased!",
        date: "2024-05-23T08:56:21.619Z",
        reviewerName: "Leo Rivera",
        reviewerEmail: "leo.rivera@x.dummyjson.com",
      },
    ],
    returnPolicy: "No return policy",
    minimumOrderQuantity: 46,
    images: ["https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/1.png"],
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png",
  },
];

// Función auxiliar para filtrar productos
export function filterProducts(products, { category, brand, maxPrice, search }) {
  return products.filter((product) => {
    if (category && category !== "all" && product.category !== category) return false;
    if (brand && brand !== "all" && product.brand !== brand) return false;
    if (maxPrice && product.price > parseFloat(maxPrice)) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      const matchesTitle = product.title.toLowerCase().includes(searchLower);
      const matchesDesc = product.description.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDesc) return false;
    }
    return true;
  });
}
