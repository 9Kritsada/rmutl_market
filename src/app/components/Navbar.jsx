"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/app/store/useUserStore";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { user, initializeUser, logout } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      await initializeUser();
      setIsLoading(false);
    };
    loadUser();
  }, [initializeUser]);

  useEffect(() => {
    const email = Cookies.get("email");
    if (!email) {
      logout();
    }
  }, []);

  const toggleDropdown = () => setDropdown((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    setDropdown(false);
    toggleMenu(false);
    Cookies.remove("email");
    logout();
    router.push("/");
  };

  return (
    <header className="text-[--foreground]">
      {/* โลโก้ */}
      <Link href="/" className="h-full">
        <img src="/rmutl_logo.png" alt="" className="h-full" />
      </Link>

      {/* เมนูหลัก */}
      <nav className="hidden lg:flex space-x-10 font-medium text-xl">
        <Link href="/" className="hover:underline">
          หน้าหลัก
        </Link>
        <Link href="/about" className="hover:underline">
          เกี่ยวกับ
        </Link>
        <Link href="/selling" className="hover:underline">
          ขายสินค้า
        </Link>
      </nav>

      {/* ปุ่ม Hamburger สำหรับจอเล็ก */}
      <button className="lg:hidden text-xl" onClick={toggleMenu}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>

      {/* เมนู Dropdown สำหรับจอเล็ก */}
      {menuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col space-y-4 py-4 z-50">
          <Link
            href="/"
            className="px-10 py-2 hover:bg-gray-100"
            onClick={toggleMenu}
          >
            หน้าหลัก
          </Link>
          <Link
            href="/about"
            className="px-10 py-2 hover:bg-gray-100"
            onClick={toggleMenu}
          >
            เกี่ยวกับ
          </Link>
          <Link
            href="/selling"
            className="px-10 py-2 hover:bg-gray-100"
            onClick={toggleMenu}
          >
            ขายสินค้า
          </Link>
          <div>
            {isLoading ? (
              <div className="flex items-center space-x-2 border-2 rounded-md px-4 py-2 animate-pulse">
                <p>Loading...</p>
              </div>
            ) : !user ? (
              <div className="px-6 py-2">
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 border-2 hover:border-black transition rounded-md px-4 py-2"
                  onClick={() => {
                    setDropdown(false);
                    toggleMenu(false);
                  }}
                >
                  <p>เข้าสู่ระบบ</p>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-auto" />
                </Link>
              </div>
            ) : (
              <div className="px-6 py-2">
                <div className="border-2 p-2 rounded-md bg-gray-100">
                  <div className="px-6 py-2  bg-white border-2 rounded-md w-full">
                    {user.fname}
                  </div>
                  <div className="mt-2 bg-white border-2 rounded-md w-full">
                    <Link
                      href="/profile/info"
                      className="flex items-center font-medium space-x-2 hover:bg-gray-100 px-6 py-2 cursor-pointer w-full"
                      onClick={toggleMenu}
                    >
                      โปรไฟล์
                    </Link>
                    <hr />
                    <button
                      className="hover:bg-gray-100 px-6 py-2 cursor-pointer w-full"
                      onClick={handleLogout}
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Actions */}
      {isLoading ? (
        <div className="lg:flex items-center space-x-2 border-2 rounded-md px-4 py-2 animate-pulse hidden">
          <p>Loading...</p>
        </div>
      ) : !user ? (
        <Link
          href="/auth/login"
          className="lg:flex items-center space-x-2 border-2 hover:border-black transition rounded-md px-4 py-2 hidden"
        >
          {/* <FontAwesomeIcon icon={faArrowRight} className="w-3 h-auto" /> */}
          <p>เข้าสู่ระบบ</p>
        </Link>
      ) : (
        <div className="relative hidden lg:block">
          <button
            className="flex items-center space-x-2 border-2 hover:border-black transition rounded-md px-4 py-2"
            onClick={toggleDropdown}
          >
            {user.fname}
          </button>
          {dropdown && (
            <div className="absolute right-0 mt-2 bg-white border-2 rounded-md shadow-lg w-fit">
              <Link
                href="/profile/info"
                className="flex items-center font-medium space-x-2 hover:bg-gray-100 px-6 py-2 cursor-pointer w-full"
                onClick={toggleDropdown}
              >
                โปรไฟล์
              </Link>
              <hr />
              <button
                className="hover:bg-gray-100 px-6 py-2 cursor-pointer w-full text-nowrap"
                onClick={handleLogout}
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
