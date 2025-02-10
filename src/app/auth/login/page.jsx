"use client";

import { encrypt } from "@/app/utils/encryption";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useUserStore from "@/app/store/useUserStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AlertManager from "@/app/components/AlertManager";
import Link from "next/link";

export default function Login() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailEncrypted = encrypt(login.email);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('email', emailEncrypted, { expires: 1, secure: true })
        setUser(data.data);
        router.push("/");
      } else {
        const errorData = await response.json();
        showAlert("อีเมลหรือรหัสผ่านที่ไม่ถูกต้อง", "error")
      }
    } catch (e) {
      showAlert("อีเมลหรือรหัสผ่านที่ไม่ถูกต้อง", "error")
    }
  };


  return (
    <>
      <AlertManager newAlert={alert} />
      <div className="fixed inset-0 flex items-center justify-center bg-[--background] p-10">
        <form
          method="post"
          className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 w-96"
          onSubmit={handleSubmit}
        >
          <Link href="/" className="flex text-[#A0A0A0] text-sm space-x-1">
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-auto" />
            <p>หน้าหลัก</p>
          </Link>
          <h1 className="text-center text-3xl">เข้าสู่ระบบ</h1>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full"
              value={login.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full"
              value={login.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end"></div>
          <input
            type="submit"
            className="w-full px-4 py-2 rounded-md bg-[#976829] text-white"
            value="เข้าสู่ระบบ"
          />
          <div className="text-sm opacity-80">
            <p className="text-center">
              ไม่มีบัญชี! <Link href="/auth/register" className="text-[#976829] underline">สมัคร</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
