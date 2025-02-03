"use client";

import { useState, useEffect } from "react";

import Card from "./components/Card";
import CardLoading from "./components/CardLoading";
import useUserStore from "./store/useUserStore";

export default function Home() {
  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // สำหรับเก็บสินค้าหลังการกรอง
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]); // สำหรับเก็บหมวดหมู่สินค้า
  const [selectedCategory, setSelectedCategory] = useState("ALL"); // หมวดหมู่ที่เลือก
  const [searchTerm, setSearchTerm] = useState(""); // คำค้นหา

  useEffect(() => {
    fetch("/api/product", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.data); // ตั้งค่า products จาก API
        setFilteredProducts(data.data); // ตั้งค่าเริ่มต้นของสินค้าที่กรอง
        const uniqueCategories = [
          "ALL",
          ...new Set(data.data.map((product) => product.type)),
        ];
        setCategories(uniqueCategories); // สร้างรายการหมวดหมู่สินค้า
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันสำหรับกรองสินค้า
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "ALL" || product.type === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  return (
    <>
      <main className="bg-[#ffffff] pb-20">
        <div className="text-5xl flex flex-col items-center justify-center p-44 space-y-10">
          <h1>ซื้อ - ขาย แลกเปลี่ยน อุปกรณ์การเรียน</h1>
          <h1>มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา</h1>
        </div>
        <div className="px-32 flex justify-between mb-10">
          {/* ปุ่มสำหรับเลือกหมวดหมู่ */}
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-2 py-1 rounded-md ${
                  selectedCategory === category
                    ? "bg-[#976829] text-white"
                    : "border"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Input สำหรับค้นหา */}
          <input
            type="text"
            className="border rounded-md px-2 w-96"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* แสดงสินค้า */}
        <div className="grid grid-cols-4 gap-5 px-32">
          {loading ? (
            <>
              <CardLoading />
              <CardLoading />
              <CardLoading />
              <CardLoading />
            </>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    pID={product._id}
                    pImg={product.image}
                    pName={product.name}
                    pPrice={product.price}
                    pLink={true}
                  />
                ))
              ) : (
                <p className="text-gray-500">ไม่พบสินค้า</p>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
