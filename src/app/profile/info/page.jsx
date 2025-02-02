"use client";

import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import { useRouter } from "next/navigation";
import ProfileMenu from "@/app/components/ProfileNav";

export default function Profile() {
  const router = useRouter();
  const { user, initializeUser, setUser } = useUserStore();
  const [userInfo, setUserInfo] = useState({
    fname: "",
    lname: "",
    faculty: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  useEffect(() => {
    // เรียก initializeUser และใช้ setLoading ในกรณีที่ไม่รองรับ finally()
    const loadUser = async () => {
      await initializeUser();
      setLoading(false); // ตั้งค่า loading เป็น false เมื่อเสร็จสิ้นการโหลด
    };

    loadUser();
  }, [initializeUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <main className="my-20 px-32">
        <div className="grid grid-cols-3 gap-4 h-72 animate-pulse">
          <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 w-full"></div>
          <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 col-span-2 w-full"></div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/user?id=${user.userId}`, {
        // ส่ง id ผ่าน query parameter
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname: userInfo.fname || user.fname,
          lname: userInfo.lname || user.lname,
          email: userInfo.email || user.email,
          faculty: userInfo.faculty || user.faculty,
        }), // ส่งข้อมูลที่อัปเดตไป
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setMessage("updated successfully");
        setTimeout(() => {
          setMessage(""); // ลบข้อความหลังจาก 2 วินาที
        }, 2000);
        setErrorMessage("");
        router.push("/profile/info");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (e) {
      setErrorMessage(`An error occurred: ${e.message}`);
    }
  };

  return (
    <>
      <main className="my-20 px-32">
        <div className="grid grid-cols-3 gap-4">
          <ProfileMenu />
          <form
            method="post"
            className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 col-span-2 w-full"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fname">ชื่อ</label>
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  className="w-full"
                  required
                  defaultValue={user?.fname || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lname">นามกุล</label>
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  className="w-full"
                  required
                  defaultValue={user?.lname || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full"
                  required
                  defaultValue={user?.email || ""}
                  disabled
                />
              </div>
              <div>
                <label htmlFor="faculty">คณะ</label>
                <select
                  name="faculty"
                  id="faculty"
                  className="w-full"
                  defaultValue={user?.faculty || ""}
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
            </div>
            {errorMessage && (
              <div className="fixed text-red-600 text-sm">{errorMessage}</div>
            )}
            {message && (
              <div className="fixed text-green-600 text-sm">{message}</div>
            )}
            <div className="flex justify-end">
              <input
                type="submit"
                className="px-4 py-2 rounded-md bg-[#976829] text-white"
                value="บันทึก"
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
