"use client";

import { usePathname } from "next/navigation";

export default function ProfileMenu() {
  const pathname = usePathname();

  const isActive = (link) => pathname === link;

  return (
    <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md flex flex-col space-y-4">
      <a
        href="/profile/info"
        className={`w-full border-2 rounded-md px-4 py-2 ${isActive("/profile/info") ? "bg-[#976829] text-white" : ""
          }`}
      >
        ข้อมูลส่วนตัว
      </a>
      {/* <a
        href="/profile/history/bought"
        className={`w-full border-2 rounded-md px-4 py-2 ${isActive("/profile/history/bought") ? "bg-[#976829] text-white" : ""
          }`}
      >
        ประวัติการซื้อ
      </a> */}
      <a
        href="/profile/history/sold"
        className={`w-full border-2 rounded-md px-4 py-2 ${isActive("/profile/history/sold") ? "bg-[#976829] text-white" : ""
          }`}
      >
        ประวัติการขาย
      </a>
    </div>
  );
}
