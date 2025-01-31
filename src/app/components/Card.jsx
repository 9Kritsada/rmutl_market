export default function Card({ pID, pImg, pName, pPrice, pLink }) {
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
        {pLink ? (
          <a href={`/product/${pID}`} className="flex items-center font-medium px-4 py-3 w-full bg-[#513300] text-[#ffffff] justify-between">
            <p className="line-clamp-1">{pName}</p>
            <p>฿{pPrice}</p>
          </a>
        ) : (
          <a className="flex items-center font-medium px-4 py-3 w-full bg-[#513300] text-[#ffffff] justify-between">
            <p className="max-w-[80%] line-clamp-1">{pName}</p>
            <p>฿{pPrice}</p>
          </a>
        )}
      </div>
    </>
  );
}
