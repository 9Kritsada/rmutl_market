"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AlertManager from "@/app/components/AlertManager";
import Link from "next/link";

export default function Register() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
  };

  const router = useRouter();
  const [register, setRegister] = useState({
    fname: "",
    lname: "",
    faculty: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (register.password === register.confirmPassword) {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(register),
        });

        if (response.ok) {
          showAlert("สมัครสมาชิกสำเร็จ", "success");
          setTimeout(() => {
            router.push("/auth/login");
          }, 1000);
        } else {
          const errorData = await response.json();
          showAlert(errorData.message[0].message, "error");
        }
      } catch (e) {
        showAlert("An error occurred: ${e.message}", "error");
      }
    } else {
      showAlert("รหัสผ่านไม่ตรงกัน", "error");
    }
  };

  return (
    <>
      <AlertManager newAlert={alert} />
      <div className="fixed inset-0 flex items-center justify-center bg-[--background] p-10">
        <form
          method="post"
          className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 w-[500px]"
          onSubmit={handleSubmit}
        >
          <Link href="/" className="flex text-[#A0A0A0] text-sm space-x-1">
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-auto" />
            <p>หน้าหลัก</p>
          </Link>
          <h1 className="text-center text-3xl">สมัครสมาชิก</h1>
          <div>
            <label htmlFor="fname">ชื่อ</label>
            <input
              type="text"
              name="fname"
              id="fname"
              className="w-full"
              value={register.fname}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lname">นามสกุล</label>
            <input
              type="text"
              name="lname"
              id="lname"
              className="w-full"
              value={register.lname}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="faculty">คณะ</label>
            <select
              name="faculty"
              id="faculty"
              className="w-full"
              value={register.faculty}
              onChange={handleChange}
              required
            >
              <option disabled></option>
              <option value="บริหารธุรกิจและศิลปศาสตร์">
                บริหารธุรกิจและศิลปศาสตร์
              </option>
              <option value="วิทยาศาสตร์และเทคโนโลยีการเกษตร">
                วิทยาศาสตร์และเทคโนโลยีการเกษตร
              </option>
              <option value="วิศวกรรมศาสตร์">วิศวกรรมศาสตร์</option>
              <option value="ศิลปกรรมกรรมและสถาปัตยกรรมศาสตร์">
                ศิลปกรรมกรรมและสถาปัตยกรรมศาสตร์
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full"
              value={register.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full"
              value={register.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="w-full"
              value={register.confirmPassword}
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
              มีบัญชีแล้ว!{" "}
              <Link href="/auth/login" className="text-[#976829] underline">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
