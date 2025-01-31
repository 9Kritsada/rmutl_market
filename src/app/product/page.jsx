"use client"

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faX } from "@fortawesome/free-solid-svg-icons";

export default function Product() {
  const [popup, setPopup] = useState(false);

  return (
    <>
      <main className="">
        <div className="flex">
          <div className="w-2/3 flex justify-center h-screen p-20">
            <img
              src="https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="h-[500px] aspect-square object-cover object-center"
            />
          </div>
          <div className="w-1/3 bg-[#ffffff] p-10 space-y-10 pr-32 h-screen">
            <hr />
            <button className="text-[#A0A0A0]">
              <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-auto" />
              <p>BACK</p>
            </button>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold">หนังสือ</h1>
              <div>ผู้ขาย : นายชาย กล้า</div>
              <div>เรียนอยู่ : วิศวกรรมศาสตร์</div>
              <div>รายละเอียด : is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
            </div>
            <button onClick={() => setPopup(true)} className="bg-[#212121] w-full text-[#ffffff] flex items-center justify-center p-5 text-2xl rounded-md">฿100</button>
            <hr />
          </div>
        </div>
      </main>

      {popup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#ffffff] p-10">
            <div className="flex justify-end">
              <button onClick={() => setPopup(false)}>
                <FontAwesomeIcon icon={faX} className="w-3 h-auto" />
              </button>
            </div>
            <div className="space-y-10 w-96">
              <h1 className="text-2xl font-bold">ต้องการซื้อ</h1>
              <div className="space-y-1">
                <h1>ส่งข้อมูลติดต่อผู้ขาย</h1>
                <input type="text" className="border p-2 w-full" placeholder="Line: lineid, Tel:08888888888" />
              </div>
              <button onClick={() => setPopup(false)} className="px-4 py-2 rounded-md bg-[#976829] text-white w-full flex items-center justify-center">ส่งข้อมูล</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
