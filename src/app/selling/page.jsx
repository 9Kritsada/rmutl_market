"use client";

import { useState, useEffect } from "react";
import Card from "../components/Card";
import Cookies from "js-cookie";
import { decrypt } from "../utils/encryption";
import useUserStore from "../store/useUserStore";
import { useRouter } from "next/navigation";
import AlertManager from "@/app/components/AlertManager";

export default function Selling() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    if (!product.pName || !product.pPrice) {
      showAlert("โปรดใส่ข้อมูลให้ครบ", "error");
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
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        showAlert("เพิ่มสินค้าสำเร็จ", "success");
        setProduct({
          pName: "",
          pDetails: "",
          pPrice: "",
          pImg: "",
          pType: "",
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        const errorData = await response.json();
        showAlert(
          `Failed to submit product: ${errorData.message || "Unknown error"}`,
          "error"
        );
      }
    } catch (error) {
      showAlert("เกิดข้อผิดพลาดในขณะที่ส่งข้อมูล", "error");
    }
  };

  return (
    <>
      <AlertManager newAlert={alert} />
      <main>
        <div className="my-20 px-10 xl:px-32">
          <div className="bg-white px-5 py-10 rounded-md shadow-md">
            <h1 className="text-center text-3xl">ขายสินค้า</h1>
            <div className="grid lg:grid-cols-2 py-10">
              <form
                className="lg:px-20 space-y-3 order-2 lg:order-1"
                onSubmit={handleSubmit}
              >
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
                    min="0"
                    max="100000"
                    value={product.pPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pImg" className="block mb-1">
                    URL รูปภาพสินค้า (ขนาดสัดส่วน 1:1)
                  </label>
                  <input
                    type="url"
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
                    className={`
                    px-4 py-2 rounded-md text-white
                    ${isLoading ? "bg-[#976829] opacity-80" : "bg-[#976829]"}
                    `}
                    value="ขายสินค้า"
                    disabled={isLoading}
                  />
                </div>
              </form>
              <div className="flex items-center justify-center order-1 lg:order-2">
                <div className="sm:w-96 mb-5 md:mb-0">
                  <Card
                    pImg={
                      product.pImg ||
                      "https://cdn.discordapp.com/attachments/866924147048185856/1340995784514211911/Untitled-1.jpg?ex=67b46325&is=67b311a5&hm=1008ea998c3a0986a0cda0abb018121504ebfa6bb1138192a85c3424f00f2807&"
                    }
                    pName={product.pName || "ชื่อสินค้า"}
                    pPrice={product.pPrice || "0"}
                    pLink={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
