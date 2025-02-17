"use client";

import { useState, useEffect } from "react";

import Card from "./components/Card";
import CardLoading from "./components/CardLoading";
import useUserStore from "./store/useUserStore";
import AlertManager from "@/app/components/AlertManager";

export default function Home() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    "ALL",
    "หนังสือ",
    "อุปกรณ์เครื่องเขียน",
    "เครื่องมือ",
    "อื่นๆ",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16; // จำนวนสินค้าต่อหน้า

  useEffect(() => {
    fetch("/api/product", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          showAlert("ล้มเหลวในการดึงข้อมูลสินค้า", "error");
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.data);
        setFilteredProducts(data.data);
        setLoading(false);
      })
      .catch((err) => {
        showAlert(err.message, "error");
        setLoading(false);
      });
  }, []);

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
    setCurrentPage(1); // รีเซ็ตไปหน้าที่ 1 เมื่อมีการกรองใหม่
  }, [products, selectedCategory, searchTerm]);

  // คำนวณข้อมูลสำหรับหน้า Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage > 3) {
      range.push(1, "...");
    } else {
      range.push(1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (currentPage < totalPages - 2) {
      range.push("...", totalPages);
    } else if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <>
      <AlertManager newAlert={alert} />
      <main className="bg-[#ffffff] pb-20">
        <div className="sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl flex flex-col items-center justify-center p-10 lg:p-52 md:space-y-10 text-center">
          <h1>ซื้อ - ขาย แลกเปลี่ยน อุปกรณ์การเรียน</h1>
          <h1>มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา</h1>
        </div>
        <div className="px-10 lg:px-32 lg:flex justify-between mb-10 text-sm lg:text-base">
          {/* แสดง Select บนหน้าจอขนาดเล็ก */}
          <div className="mb-2 lg:mb-0 md:hidden">
            <select
              className="border rounded-md px-2 py-1 "
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "ALL" ? "ทั้งหมด" : category}
                </option>
              ))}
            </select>
          </div>

          {/* แสดง Button บนหน้าจอขนาด md ขึ้นไป */}
          <div className="hidden md:flex md:space-x-2 mb-2 lg:mb-0">
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
                {category === "ALL" ? "ทั้งหมด" : category}
              </button>
            ))}
          </div>

          {/* ช่องค้นหา */}
          <input
            type="text"
            className="border rounded-md px-2 w-80 xl:w-96"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-10 lg:px-32">
          {loading ? (
            <>
              <CardLoading />
              <CardLoading />
              <CardLoading />
              <CardLoading />
            </>
          ) : (
            <>
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
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

        {/* Pagination Controls */}
        <div className="flex justify-center mt-10">
          <button
            className="px-4 py-2 mx-1 border rounded-md disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ก่อนหน้า
          </button>

          <select
            className="text-sm px-4 py-2 mx-2 border rounded-md"
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                หน้า {page}
              </option>
            ))}
          </select>

          <button
            className="px-4 py-2 mx-1 border rounded-md disabled:opacity-50"
            disabled={currentPage === totalPages || currentItems.length === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            ถัดไป
          </button>
        </div>
      </main>
    </>
  );
}
