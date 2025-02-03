"use client";

import { useState, useEffect } from "react";
import Card from "../components/Card";
import Cookies from "js-cookie";
import { decrypt } from "../utils/encryption";
import useUserStore from "../store/useUserStore";
import { useRouter } from "next/navigation";

export default function Selling() {
  const router = useRouter();

  const { user, initializeUser, logout } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    const email = Cookies.get("email");
    if (!email) {
      logout();
    }
  }, []);

  const [product, setProduct] = useState({
    pName: "",
    pDetails: "",
    pPrice: "",
    pImg: "",
    pOwner: Cookies.get("email"),
    pType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.pName || !product.pPrice) {
      alert("Please fill out all fields.");
      return;
    }

    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.pName,
          price: parseFloat(product.pPrice), // แปลงให้เป็น Number
          image: product.pImg,
          details: product.pDetails,
          email: decrypt(product.pOwner),
          type: product.pType,
          status: "กำลังขาย",
        }),
      });

      if (response.ok) {
        alert("Product submitted successfully!");
        setProduct({
          pName: "",
          pDetails: "",
          pPrice: "",
          pImg: "https://cdn.pixabay.com/photo/2014/06/03/19/38/board-361516_1280.jpg",
        });
      } else {
        const errorData = await response.json(); // ดู Error Message
        console.log("Error response:", errorData);
        alert(
          `Failed to submit product: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.log("Error submitting product:", error);
      alert("An error occurred while submitting the product.");
    }
  };

  return (
    <>
      <main>
        <div className="my-20 px-32">
          <h1 className="text-center text-3xl">SELLING</h1>
          <div className="grid grid-cols-2 py-10">
            <form className="px-20 space-y-3" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="pName" className="block mb-1">
                  ชื่อสินค้า
                </label>
                <input
                  type="text"
                  name="pName"
                  id="pName"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={product.pName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="pPrice" className="block mb-1">
                  ราคา
                </label>
                <input
                  type="number"
                  name="pPrice"
                  id="pPrice"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={product.pPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="pImg" className="block mb-1">
                  รูปสินค้า
                </label>
                <input
                  type="text"
                  name="pImg"
                  id="pImg"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={product.pImg}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="pType" className="block mb-1">
                  ประเภทสินค้า
                </label>
                <select
                  name="pType"
                  id="pType"
                  className="w-full"
                  value={product.pType}
                  onChange={handleChange}
                  required
                >
                  <option disabled></option>
                  <option value="หนังสือ">หนังสือ</option>
                  <option value="อุปกรณ์เครื่องเขียน">
                    อุปกรณ์เครื่องเขียน
                  </option>
                  <option value="เครื่องมือ">เครื่องมือ</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>
              <div>
                <label htmlFor="pDetails" className="block mb-1">
                  รายละเอียดสินค้า
                </label>
                <textarea
                  name="pDetails"
                  id="pDetails"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-36"
                  value={product.pDetails}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="flex justify-end pt-5">
                <input
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#976829] text-white"
                  value="SUBMIT"
                />
              </div>
            </form>
            <div className="flex items-center justify-center">
              <div className="w-96">
                <Card
                  pImg={product.pImg || "https://cdn.pixabay.com/photo/2014/06/03/19/38/board-361516_1280.jpg"}
                  pName={product.pName || "Product Name"}
                  pPrice={product.pPrice || "0"}
                  pLink={false}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
