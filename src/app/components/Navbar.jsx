"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/app/store/useUserStore";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { user, initializeUser, logout } = useUserStore();

  const [isLoading, setIsLoading] = useState(true); // State สำหรับจัดการ loading
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      await initializeUser(); // โหลดข้อมูล user
      setIsLoading(false); // เมื่อโหลดเสร็จสิ้น ให้ set isLoading เป็น false
    };
    loadUser();
  }, [initializeUser]);

  useEffect(() => {
    const email = Cookies.get("email");
    if (!email) {
      logout();
    }
  }, []);

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("email");
    logout();
    router.push("/");
  };

  return (
    <>
      <header className="text-[--foreground]">
        <a href="/" className="h-full">
          <img src="/rmutl_logo.png" alt="" className="h-full" />
        </a>
        <ul className="flex space-x-10 font-medium text-xl">
          <li>
            <a href="/" className="hover:underline">HOME</a>
          </li>
          <li>
            <a href="/about" className="hover:underline">ABOUT</a>
          </li>
          <li>
            <a href="/selling" className="hover:underline">SELLING</a>
          </li>
        </ul>
        {isLoading ? (
          <div className="flex items-center space-x-2 border-2 rounded-md px-4 py-2 animate-pulse">
            <p>Loading...</p>
          </div>
        ) : !user ? (
          <a
            href="/auth/login"
            className="flex items-center space-x-2 border-2 hover:border-black transition rounded-md px-4 py-2"
          >
            <p>LOGIN</p>
            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-auto" />
          </a>
        ) : (
          <div className="relative">
            <button
              className="flex items-center space-x-2 border-2 hover:border-black transition rounded-md px-4 py-2"
              onClick={toggleDropdown}
            >
              {user.fname}
            </button>
            {dropdown && (
              <div className="absolute right-0 mt-2 bg-white border-2 rounded-md shadow-lg">
                <a
                  href="/profile/info"
                  className="flex items-center font-medium space-x-2 hover:bg-gray-100 px-6 py-2 cursor-pointer w-full"
                >
                  PROFILE
                </a>
                <hr />
                <button
                  className="hover:bg-gray-100 px-6 py-2 cursor-pointer w-full"
                  onClick={handleLogout}
                >
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
