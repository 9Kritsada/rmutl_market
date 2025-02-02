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

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const [dropdown, setDropdown] = useState(false);

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
        <ul className="flex space-x-10 font-medium">
          <li>
            <a href="/">HOME</a>
          </li>
          <li>
            <a href="/about">ABOUT</a>
          </li>
          <li>
            <a href="/selling">SELLING</a>
          </li>
        </ul>
        {!user ? (
          <a
            href="/auth/login"
            className="flex items-center space-x-2 border-2 rounded-md px-4 py-2"
          >
            <p>LOGIN</p>
            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-auto" />
          </a>
        ) : (
          <>
            <div className="relative">
              <button
                className="flex space-x-2 border-2 rounded-md px-4 py-2"
                onClick={toggleDropdown}
              >
                {user.fname}
              </button>
              {dropdown && (
                <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="/profile/info">PROFILE</a>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </li>
                </ul>
              )}
            </div>
          </>
        )}
      </header>
    </>
  );
}
