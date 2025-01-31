export default function Card({pImg, pName, pPrice}) {
  return (
    <>
      <div className="">
        <div className="bg-[#FDFAE7] p-10 aspect-square">
          <img
            src={pImg}
            alt=""
            className="h-full aspect-square object-cover object-center"
          />
        </div>
        <a href="/product" className="flex items-center font-medium px-4 py-2 w-full bg-[#513300] text-[#ffffff] justify-between">
          <p>{pName}</p>
          <p>฿{pPrice}</p>
        </a>
      </div>
    </>
  );
}
