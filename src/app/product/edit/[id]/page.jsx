"use client";

import { useState, useEffect } from "react";
import Card from "../../../components/Card";
import Cookies from "js-cookie";
import { decrypt } from "../../../utils/encryption";
import useUserStore from "../../../store/useUserStore";
import { useParams, useRouter } from "next/navigation";
import AlertManager from "@/app/components/AlertManager";
import Link from "next/link";

export default function Edit() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type }); // ส่งข้อความแจ้งเตือนไปที่ AlertManager
  };

  const router = useRouter();

  const { id } = useParams();
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

  const [product, setProduct] = useState({});

  const encryptedEmail = Cookies.get("email");
  const email = encryptedEmail ? decrypt(encryptedEmail) : null;
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product/${id}`, { method: "GET" });
        if (!res.ok) {
          if (res.status === 404) {
            alert("Product not found!");
            showAlert("ไม่เจอสินค้า", "error");
          } else {
            throw new Error("Failed to fetch product");
          }
          router.push("/"); // Redirect กลับหน้าแรก
          return;
        }
        const data = await res.json();

        if (data.data.email !== email) {
          router.push("/");
        } else {
          setProduct(data.data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        showAlert("เกิดข้อผิดพลาดในขณะที่ดึงข้อมูลสินค้า", "error");
      }
    };

    fetchProduct();
  }, [id, router, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.image || !product.type) {
      alert("Please fill out all required fields.");
      return;
    }

    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`/api/user/product/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productID: id,
          email: decrypt(Cookies.get("email")),
          updates: {
            name: product.name,
            price: product.price,
            image: product.image,
            details: product.details,
            type: product.type,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await response.json();
        console.log(errorData);
      }
      showAlert("แก้ไขสินค้าสำเสร็จ", "success");
      setTimeout(() => {
        router.push("/profile/history/sold");
      }, 1000);
    } catch (err) {
      showAlert("เกิดข้อผิดพลาดขณะอัปเดต", "error");
    }
  };

  return (
    <>
      <AlertManager newAlert={alert} />
      <main>
        <div className="my-20 px-10 xl:px-32">
          <div className="bg-white px-5 py-10 rounded-md shadow-md">
            <h1 className="text-center text-3xl">แก้ไขสินค้า</h1>
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
                    name="name"
                    id="name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue={product.name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block mb-1">
                    ราคา
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                    max="100000"
                    defaultValue={product.price || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="image" className="block mb-1">
                    URL รูปภาพสินค้า (ขนาดสัดส่วน 1:1)
                  </label>
                  <input
                    type="url"
                    name="image"
                    id="image"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue={product.image || ""}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    คุณสามารถอัปโหลดรูปภาพของคุณที่บริการฝากรูปภาพฟรี ที่{" "}
                    <a
                      href="https://th.imgbb.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      ImgBB
                    </a>{" "}
                    และนำ URL ที่ได้มาวางที่นี่
                  </p>
                </div>
                <div>
                  <label htmlFor="type" className="block mb-1">
                    ประเภทสินค้า
                  </label>
                  <select
                    name="type"
                    id="type"
                    className="w-full"
                    value={product.type}
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
                  <label htmlFor="details" className="block mb-1">
                    รายละเอียดสินค้า
                  </label>
                  <textarea
                    name="details"
                    id="details"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-36"
                    defaultValue={product.details || ""}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="flex justify-end pt-5 space-x-2">
                  <Link
                    href="/profile/history/sold"
                    className="px-4 py-2 rounded-md bg-gray-600 text-white"
                  >
                    ยกเลิก
                  </Link>
                  <input
                    type="submit"
                    className="px-4 py-2 rounded-md bg-[#976829] text-white"
                    value="แก้ไข"
                  />
                </div>
              </form>
              <div className="flex items-center justify-center order-1 lg:order-2">
                <div className="sm:w-96 mb-5 md:mb-0">
                  <Card
                    pImg={
                      product.image ||
                      "https://cdn.discordapp.com/attachments/866924147048185856/1340995784514211911/Untitled-1.jpg?ex=67ba51e5&is=67b90065&hm=34d2c14e52146ab14c15bd40366063b2d5bbdc8cd0257446f36a2529bc20ff59&"
                    }
                    pName={product.name || "Product Name"}
                    pPrice={product.price || "0"}
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
