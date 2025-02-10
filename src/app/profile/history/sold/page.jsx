"use client";

import { useState, useEffect } from "react";
import useUserStore from "../../../store/useUserStore";
import { useRouter } from "next/navigation";
import ProfileMenu from "@/app/components/ProfileNav";
import AlertManager from "@/app/components/AlertManager";
import Cookies from "js-cookie";
import { decrypt } from "@/app/utils/encryption";
import InfoProfileLoading from "@/app/components/InfoProfileLoading";
import Link from "next/link";

export default function Sold() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type }); // ส่งข้อความแจ้งเตือนไปที่ AlertManager
  };
  const router = useRouter();
  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [buyMessages, setBuyMessages] = useState({}); // State to store buy messages for each product

  useEffect(() => {
    const loadUser = async () => {
      await initializeUser();
    };

    loadUser();
  }, [initializeUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }
  }, [loading, user, router]);

  const encryptedEmail = Cookies.get("email");
  const email = encryptedEmail ? decrypt(encryptedEmail) : null;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/user/product?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data);
        } else {
          const errorData = await response.json();
          showAlert(errorData.message || "Failed to fetch products.", "error");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchProducts();
    }
  }, [email]);

  const fetchBuyMessages = async (productID) => {
    try {
      const response = await fetch(`/api/sell/?productID=${productID}`);
      if (response.ok) {
        const data = await response.json();
        setBuyMessages((prev) => ({
          ...prev,
          [productID]: data.data, // Store messages for the corresponding product
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (e, productId) => {
    const updatedStatus = e.target.value;
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? { ...product, status: updatedStatus }
          : product
      )
    );

    try {
      const response = await fetch(`/api/user/product`, {
        method: "PUT",
        body: JSON.stringify({
          productID: productId,
          email: email,
          updates: { status: updatedStatus },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        showAlert("อัปเดตสถานะสำเร็จ", "success");
      } else {
        showAlert(result.message || "Failed to update status.", "error");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      showAlert(
        "An error occurred while updating the product status.",
        "error"
      );
    }
  };

  useEffect(() => {
    // Fetch buy messages for all products after fetching products
    products.forEach((product) => {
      fetchBuyMessages(product._id);
    });
  }, [products]);

  if (loading) {
    return <InfoProfileLoading />;
  }

  return (
    <>
      <AlertManager newAlert={alert} />
      <main className="my-20 px-72">
        <div className="grid grid-cols-3 gap-4">
          <ProfileMenu />
          <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 col-span-2 w-full">
            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg p-6 shadow-sm hover:border-black transition"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-2xl text-gray-800">
                      {product.name}
                    </h2>
                    <select
                      name="status"
                      id="status"
                      value={product.status}
                      onChange={(e) => handleStatusChange(e, product._id)}
                      className={`text-sm px-3 py-1 rounded-lg font-medium shadow ${
                        product.status === "กำลังขาย"
                          ? "bg-orange-500 text-white"
                          : product.status === "สิ้นสุดการขาย"
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      <option
                        value="กำลังขาย"
                        className="bg-white text-gray-800"
                      >
                        กำลังขาย
                      </option>
                      <option
                        value="สิ้นสุดการขาย"
                        className="bg-white text-gray-800"
                      >
                        ขายเสร็จสิ้น
                      </option>
                      <option
                        value="ยกเลิกขาย"
                        className="bg-white text-gray-800"
                      >
                        ยกเลิกขาย
                      </option>
                    </select>
                  </div>

                  {/* Product Details */}
                  <div className="flex items-center gap-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-28 w-28 rounded-xl object-cover border border-gray-300 shadow-sm"
                    />
                    <div className="flex-1">
                      <p className="text-gray-600">
                        ราคา: ฿
                        {new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(product.price)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        ประเภท: {product.type}
                      </p>
                    </div>
                    <Link
                      href={`/product/edit/${product._id}`}
                      className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-400"
                    >
                      แก้ไขสินค้า
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-t border-gray-200"></div>

                  {/* Buyer Messages */}
                  <div className="bg-gray-100 border rounded-lg p-4  max-h-56 overflow-y-scroll">
                    <h3 className="font-semibold text-gray-700 text-lg mb-3">
                      ข้อความจากผู้ซื้อ
                    </h3>
                    {buyMessages[product._id] &&
                    buyMessages[product._id].length > 0 ? (
                      buyMessages[product._id].map((message) => (
                        <div
                          key={message._id}
                          className="border rounded-lg p-4 mt-2 bg-white shadow-sm"
                        >
                          <div className="text-sm text-gray-500 mb-1">
                            <span className="font-medium text-gray-700">
                              {message.email}
                            </span>
                            &nbsp; &#183;{" "}
                            {new Date(message.updatedAt).toLocaleString(
                              "th-TH",
                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                          <p className="text-gray-800">{message.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        ยังไม่มีข้อความจากผู้ซื้อ
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
