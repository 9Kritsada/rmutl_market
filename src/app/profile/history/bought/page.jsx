"use client"

import { useState, useEffect } from "react";
import useUserStore from "../../../store/useUserStore";
import { useRouter } from "next/navigation";
import ProfileMenu from "@/app/components/ProfileNav";

export default function Bought() {
  const router = useRouter();
  const { user, initializeUser } = useUserStore();

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const [userInfo, setUserInfo] = useState({
    fname: "",
    lname: "",
    faculty: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      await initializeUser();
      setLoading(false);
    };

    loadUser();
  }, [initializeUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
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

  return (
    <>
      <main className="my-20 px-32">
        <div className="grid grid-cols-3 gap-4">
          <ProfileMenu />
          <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 col-span-2 w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th>ชื่อสินค้า</th>
                  <th>ราคา</th>
                  <th>รูปภาพ</th>
                  <th>รายละเอียด</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}
