export default function Card({ pID, pImg, pName, pPrice, pLink }) {
  return (
    <>
      <a href={`/product/${pID}`}>
        <div className="bg-[#FDFAE7] p-10 aspect-square">
          <img
            src={pImg}
            alt={pName}
            className="h-full aspect-square object-cover object-center bg-[#ffffff]"
          />
        </div>

        <div className="flex items-center font-medium px-4 py-3 w-full bg-[#513300] text-[#ffffff] justify-between">
          <p className="max-w-[80%] line-clamp-1">{pName}</p>
          <p>
            ฿
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(pPrice)}
          </p>
        </div>
      </a>
    </>
  );
}
