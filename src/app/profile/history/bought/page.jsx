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
        const response = await fetch(`/api/buy/?email=${email}`);
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
                <div className="border py-1 px-4 ">
                  <div className="flex items-center space-x-2 justify-between rounded-md border-b py-2">
                    <div className="w-56">
                      <p className="text-sm text-gray-500">ชื่อสินค้า</p>
                      {product.product.name}
                    </div>
                    <div className="w-24">
                      <p className="text-sm text-gray-500">ราคา</p>
                      ฿{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.product.price)}
                    </div>
                    <div>
                      <img src={product.product.image} alt={product.product.name} className="h-16 aspect-square object-cover object-center border overflow-hidden" />
                    </div>
                    <div className="w-36">
                      <p className="text-sm text-gray-500">ประเภท</p>
                      {product.product.type}
                    </div>
                  </div>
                  <p className="py-2">ข้อความ : {product.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
