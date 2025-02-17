"use client";

import { useState, useEffect } from "react";
import useUserStore from "../../../store/useUserStore";
import { useRouter } from "next/navigation";
import ProfileMenu from "@/app/components/ProfileNav";
import AlertManager from "@/app/components/AlertManager";
import Cookies from "js-cookie";
import { decrypt } from "@/app/utils/encryption";
import InfoProfileLoading from "@/app/components/InfoProfileLoading";

export default function Sold() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
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
        const response = await fetch(`/api/buy/?email=${email}`);
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

  if (loading) {
    return <InfoProfileLoading />;
  }

  return (
    <>
      <AlertManager newAlert={alert} />
      <main className="my-20 px-10 md:px-32 2xl:px-72">
        <div className="grid lg:grid-cols-3 gap-4">
          <ProfileMenu />
          <div className="bg-white p-3 md:p-10  rounded-2xl shadow-lg lg:col-span-2">
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="border rounded-lg p-6 shadow-sm hover:border-black transition"
                  >
                    <div className="lg:flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-500">
                        {new Date(product.updatedAt).toLocaleString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}{" "}
                        น.
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        หมวดหมู่: {product.product.type}
                      </p>
                    </div>
                    <div className="md:flex items-center space-y-2 md:space-y-0 md:space-x-6">
                      <img
                        src={product.product.image}
                        alt={product.product.name}
                        className="h-20 w-20 rounded-lg object-cover border aspect-square"
                      />
                      <div className="">
                        <h2 className="md:text-lg font-bold text-gray-800 line-clamp-5 text-sm">
                          {product.product.name}
                        </h2>
                        <p className="text-gray-600">
                          ฿
                          {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(product.product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="lg:flex mt-4 bg-gray-100 border rounded-lg px-4 py-2 lg:space-x-2">
                      <p>ข้อความ:</p>
                      <p>{product.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">ไม่พบประวัติการซื้อ</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
