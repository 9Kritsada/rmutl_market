"use client";

import { useState, useEffect } from "react";

import Card from "./components/Card";
import CardLoading from "./components/CardLoading";
import useUserStore from "./store/useUserStore";

export default function Home() {
  const { user, initializeUser, logout } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setProducts(data.data); // Update the state with fetched data
        setLoading(false); // Set loading to false after fetching
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); // Stop loading in case of an error
      });
  }, []);

  return (
    <>
      <main className="bg-[#ffffff] pb-20">
        <div className="text-5xl flex flex-col items-center justify-center p-44 space-y-10">
          <h1>ซื้อ - ขาย แลกเปลี่ยน อุปกรณ์การเรียน</h1>
          <h1>มหาวิทายาลัยเทคโนโลยีราชมงคลล้านนา</h1>
        </div>
        <div className="px-32 flex justify-between mb-10">
          <div className="flex space-x-2">
            <button className="px-2 py-1 rounded-md bg-[#976829] text-white">
              ALL
            </button>
            <button className="px-2 py-1 border rounded-md">หนังสือ</button>
            <button className="px-2 py-1 border rounded-md">
              อุปกรณ์ครื่องเขียน
            </button>
            <button className="px-2 py-1 border rounded-md">เครื่องมือ</button>
          </div>
          <input
            type="text"
            className="border rounded-md px-2 w-96"
            placeholder="Search"
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
              {products.map((product) => (
                <Card
                  key={product._id}
                  pID={product._id}
                  pImg={product.image}
                  pName={product.name}
                  pPrice={product.price}
                  pLink={true}
                />
              ))}
            </>
          )}
        </div>
      </main>
    </>
  );
}
