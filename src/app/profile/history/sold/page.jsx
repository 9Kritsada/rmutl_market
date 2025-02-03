"use client";

import { useState, useEffect } from "react";
import useUserStore from "../../../store/useUserStore";
import { useRouter } from "next/navigation";
import ProfileMenu from "@/app/components/ProfileNav";
import AlertManager from "@/app/components/AlertManager";
import Cookies from "js-cookie";
import { decrypt } from "@/app/utils/encryption";

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
      setLoading(false);
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
        setLoading(true);
        const response = await fetch(`/api/user/product?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data);
        } else {
          const errorData = await response.json();
          showAlert(errorData.message || "Failed to fetch products.", "error")
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
        product._id === productId ? { ...product, status: updatedStatus } : product
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
        showAlert("อัปเดตสถานะสำเร็จ", "success")
      } else {
        showAlert(result.message || "Failed to update status.", "error")
      }
    } catch (err) {
      console.error("Error updating status:", err);
      showAlert("An error occurred while updating the product status.", "error")

    }
  };

  useEffect(() => {
    // Fetch buy messages for all products after fetching products
    products.forEach((product) => {
      fetchBuyMessages(product._id);
    });
  }, [products]);

  if (loading) {
    return (
      <main className="my-20 px-32">
        <div className="grid grid-cols-3 gap-4 h-72 animate-pulse">
          <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 w-full"></div>
          <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 col-span-2 w-full"></div>
        </div>
      </main>
    );
  }

  return (
    <>
      <AlertManager newAlert={alert} />
      <main className="my-20 px-32">
        <div className="grid grid-cols-3 gap-4">
          <ProfileMenu />
          <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 col-span-2 w-full">
            {products.map((product) => (
              <div key={product._id}>
                <div className="flex items-center space-x-2 border py-2 px-4 justify-between rounded-md">
                  <div className="relative">
                    <p className="text-sm text-gray-500">สถานะ</p>
                    <select
                      name="status"
                      id="status"
                      value={product.status}
                      onChange={(e) => handleStatusChange(e, product._id)}
                      required
                      className={`text-sm font-normal ${product.status === "กำลังขาย"
                        ? "bg-orange-600 text-white"
                        : product.status === "สิ้นสุดการขาย"
                          ? "bg-green-700 text-white"
                          : "bg-gray-700 text-white"
                        } p-2 rounded`}
                    >
                      <option value="กำลังขาย" className="bg-white text-[#000000]">กำลังขาย</option>
                      <option value="สิ้นสุดการขาย" className="bg-white text-[#000000]">ขายเสร็จสิ้น</option>
                      <option value="ยกเลิกขาย" className="bg-white text-[#000000]">ยกเลิกขาย</option>
                    </select>
                    {/* {message && <div className="absolute text-green-500 text-sm text-nowrap">{message}</div>} */}
                  </div>
                  <div className="w-56">
                    <p className="text-sm text-gray-500">ชื่อสินค้า</p>
                    {product.name}
                  </div>
                  <div className="w-24">
                    <p className="text-sm text-gray-500">ราคา</p>
                    ฿{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.price)}
                  </div>
                  <div>
                    <img src={product.image} alt={product.name} className="h-16" />
                  </div>
                  <div className="w-36">
                    <p className="text-sm text-gray-500">ประเภท</p>
                    {product.type}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">จัดการ</p>
                    <a href={`/product/edit/${product._id}`}>แก้ไข</a>
                  </div>
                </div>
                <div className="pl-10">
                  {buyMessages[product._id] && (
                    buyMessages[product._id].map((message) => (
                      <div
                        key={message._id}
                        className="border p-2 rounded-md mt-1"
                      >
                        <p className="text-sm text-gray-500">ผู้ซื้อ: {message.email}</p>
                        <p>ข้อความ: {message.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
