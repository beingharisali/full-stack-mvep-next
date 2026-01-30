"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ProtectedRoute from "../../../shared/ProtectedRoute";
import { Product, getProductById } from "../../../../full-stack-mvep-next/services/product.api"; 
import { useCart } from "../../../context/CartContext";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id as string);
      setProduct(res.product);
      setSelectedImageIndex(0);
    } catch (err) {
      console.error(err);
      router.push("/products");
    } finally {
      setLoading(false);
    }
  };

  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product._id, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`);
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["customer", "vendor", "admin"]}>
        <div className="p-10 text-center">Loading...</div>
      </ProtectedRoute>
    );
  }

  if (!product) {
    return (
      <ProtectedRoute allowedRoles={["customer", "vendor", "admin"]}>
        <div className="p-10 text-center">
          <h1 className="text-xl font-bold">Product not found</h1>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["customer", "vendor", "admin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-6">
            <button
              onClick={() => router.back()}
              className="mb-4 text-blue-600"
            >
              ← Back
            </button>

            <div className="bg-white p-6 rounded-lg shadow grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div>
                <img
                  src={product.images?.[selectedImageIndex] || "/placeholder.png"}
                  alt={product.name}
                  className="h-96 w-full object-contain bg-gray-100 rounded"
                />

                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    {product.images.map((img, i) => (
                      <Image
                        key={i}
                        src={img}
                        alt={`Product image ${i + 1}`}
                        className={`h-16 w-16 object-cover border cursor-pointer ${
                          selectedImageIndex === i
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedImageIndex(i)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>

                <p className="text-2xl text-blue-600 mt-2">
                  Rs {product.price}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Stock: {product.stock}
                </p>

                <p className="mt-4">
                  {product.description || "No description"}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 border"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-3 py-1 border"
                  >
                    +
                  </button>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="px-6 py-3 bg-blue-600 text-white rounded disabled:bg-gray-400"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
