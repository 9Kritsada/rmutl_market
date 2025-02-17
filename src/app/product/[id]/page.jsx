"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faX } from "@fortawesome/free-solid-svg-icons";
import useUserStore from "@/app/store/useUserStore";
import AlertManager from "@/app/components/AlertManager";
import Link from "next/link";

export default function Product() {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const { user } = useUserStore();

  const router = useRouter();

  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [productOwner, setProductOwner] = useState({});
  const [popup, setPopup] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [isLoading, setIsLoading] = useState(true); // State สำหรับจัดการ loading

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product by ID
        const res = await fetch(`/api/product/${id}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();
        setProduct(data.data);

        // Fetch additional check based on product email
        if (data.data?.email) {
          const checkRes = await fetch(
            `/api/check?email=${encodeURIComponent(data.data.email)}`,
            {
              method: "GET",
            }
          );

          if (!checkRes.ok) {
            throw new Error("Failed to fetch email check");
          } else {
            setIsLoading(false);
          }

          const checkData = await checkRes.json();
          setProductOwner(checkData.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]); // Include `id` in the dependency array

  const handlePopup = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setPopup(true);
  };

  const sendContactInfo = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await fetch("/api/buy/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productID: product._id, // ใช้ productID จาก product ที่โหลดมา
          email: user.email, // ใช้ email ของผู้ใช้ที่ล็อกอินอยู่
          message: contactInfo, // ข้อความจาก input
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        showAlert("ส่งคำขอซื้อเรียบร้อยแล้ว", "success");
        setPopup(false); // ปิด popup หลังการส่ง
      } else {
        const errorData = await response.json();
        console.log("TTT ", errorData);
        showAlert(`ส่งคำขอซื้อไม่สำเร็จ`, "error");
      }
    } catch (err) {
      console.error("Error occurred while sending purchase request:", err);
      showAlert("เกิดข้อผิดพลาดขณะส่งคำขอซื้อ", "error");
    }
  };

  return (
    <>
      <AlertManager newAlert={alert} />
      {isLoading ? (
        <>
          <main className="">
            <div className="flex">
              <div className="w-2/3 flex justify-center h-screen p-20">
                <div className="h-[500px] aspect-square object-cover object-center bg-[#c5c5c5] animate-pulse"></div>
              </div>
              <div className="w-1/3 bg-[#ffffff] p-10 space-y-10 pr-32 h-screen">
                <hr />
                <Link
                  href="/"
                  className="flex items-center font-medium space-x-2 text-[#A0A0A0]"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-auto" />
                  <p>BACK</p>
                </Link>
                <div className="space-y-3 animate-pulse">
                  <div>
                    <div className="h-4 bg-[#e5e5e5] mb-1"></div>
                    <div className="bg-[#e5e5e5] h-8 w-32"></div>
                  </div>
                  <div className="bg-[#e5e5e5] h-6 w-44"></div>
                  <div className="bg-[#e5e5e5] h-6 w-28"></div>
                  <div className="bg-[#e5e5e5] h-20 w-full"></div>
                </div>
                <button
                  onClick={handlePopup}
                  className="bg-[#212121] w-full text-[#ffffff] flex items-center justify-center p-5 text-2xl rounded-md h-20 animate-pulse"
                ></button>
                <hr />
              </div>
            </div>
          </main>
        </>
      ) : (
        <>
          <main className="">
            <div className="flex">
              <div className="w-2/3 flex justify-center h-screen p-20">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[500px] aspect-square object-cover object-center bg-[#ffffff]"
                />
              </div>
              <div className="w-1/3 bg-[#ffffff] p-10 space-y-10 pr-32 h-screen">
                <hr />
                <Link
                  href="/"
                  className="flex items-center font-medium space-x-2 text-[#A0A0A0]"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-auto" />
                  <p>BACK</p>
                </Link>
                <div className="space-y-3">
                  <div>
                    <p className="text-[#A0A0A0] text-sm">
                      {new Date(product.updatedAt).toLocaleString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                      <span> น.</span>
                    </p>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                  </div>
                  <div>
                    ผู้ขาย : {productOwner.fname} {productOwner.lname}
                  </div>
                  <div>เรียนอยู่ : {productOwner.faculty}</div>
                  <div>รายละเอียด : {product.details}</div>
                </div>
                <button
                  onClick={handlePopup}
                  className="bg-[#212121] w-full text-[#ffffff] flex items-center justify-center p-5 text-2xl rounded-md"
                >
                  ฿
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(product.price)}
                </button>
                <hr />
              </div>
            </div>
          </main>
        </>
      )}

      {popup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#ffffff] p-10">
            <div className="flex justify-end">
              <button onClick={() => setPopup(false)}>
                <FontAwesomeIcon icon={faX} className="w-3 h-auto" />
              </button>
            </div>
            <form
              className="space-y-10 w-96"
              onSubmit={sendContactInfo}
            >
              <h1 className="text-2xl font-bold">ต้องการซื้อ</h1>
              <div className="space-y-1">
                <h1>ส่งข้อมูลติดต่อผู้ขาย</h1>
                <input
                  type="text"
                  className="border p-2 w-full"
                  placeholder="Line: lineid, Tel:08888888888"
                  onChange={(e) => setContactInfo(e.target.value)} // บันทึกข้อมูล input
                  required
                />
              </div>
              <input
                type="submit"
                className={`
                  px-4 py-2 rounded-md text-white w-full flex items-center justify-center
                  ${isLoading ? "bg-[#976829] opacity-80" : "bg-[#976829]"}
                  `}
                value="ส่งข้อมูล"
                disabled={isLoading}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
