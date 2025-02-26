"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileMenu() {
  const pathname = usePathname();

  const isActive = (link) => pathname === link;

  return (
    <div className="bg-[#ffffff] p-3 md:p-10 rounded-md drop-shadow-md flex flex-col space-y-4 h-fit w-full">
      <Link
        href="/profile/info"
        className={`w-full border hover:border-black transition rounded-md px-4 py-2 ${isActive("/profile/info") ? "bg-[#976829] text-white" : ""
          }`}
      >
        โปรไฟล์
      </Link>
      <Link
        href="/profile/history/bought"
        className={`w-full border hover:border-black transition rounded-md px-4 py-2 ${isActive("/profile/history/bought") ? "bg-[#976829] text-white" : ""
          }`}
      >
        ประวัติการซื้อ
      </Link>
      <Link
        href="/profile/history/sold"
        className={`w-full border hover:border-black transition rounded-md px-4 py-2 ${isActive("/profile/history/sold") ? "bg-[#976829] text-white" : ""
          }`}
      >
        ประวัติการขาย
      </Link>
    </div>
  );
}
