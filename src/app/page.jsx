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
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
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
        <div className="text-5xl flex flex-col items-center justify-center p-44 space-y-10">
          <h1>ซื้อ - ขาย แลกเปลี่ยน อุปกรณ์การเรียน</h1>
          <h1>มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา</h1>
        </div>
        <div className="px-32 flex justify-between mb-10">
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

          <input
            type="text"
            className="border rounded-md px-2 w-96"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 gap-5 px-32">
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
          {getPaginationRange().map((page, index) => (
            <button
              key={index}
              className={`px-4 py-2 mx-1 border rounded-md ${
                currentPage === page ? "bg-[#976829] text-white" : ""
              } ${page === "..." ? "cursor-default" : ""}`}
              onClick={() => page !== "..." && setCurrentPage(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
          <button
            className="px-4 py-2 mx-1 border rounded-md disabled:opacity-50"
            disabled={currentPage === totalPages || currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            ถัดไป
          </button>
        </div>
      </main>
    </>
  );
}
