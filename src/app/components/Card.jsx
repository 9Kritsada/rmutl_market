import Link from "next/link";

export default function Card({ pID, pImg, pName, pPrice, pLink }) {
  return (
    <>
      {pLink ? (
        <>
          <Link
            href={`/product/${pID}`}
            className="hover:border border-black hover:scale-105 transition"
          >
            <div className="bg-[#FDFAE7] aspect-square">
              <img
                src={pImg}
                alt={pName}
                className="h-full aspect-square object-cover object-center bg-[#ffffff]"
              />
            </div>

            <div className="font-medium px-2 py-1 md:px-4 md:py-3 text-sm lg:text-base w-full justify-between">
              <p>
                ฿
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(pPrice)}
              </p>
              <p className="max-w-[80%] line-clamp-2 md:line-clamp-1">{pName}</p>
            </div>
          </Link>
        </>
      ) : (
        <>
          <div className="hover:border border-black hover:scale-105 transition bg-[#ffffff]">
            <div className="bg-[#FDFAE7]  aspect-square">
              <img
                src={pImg}
                alt={pName}
                className="h-full aspect-square object-cover object-center bg-[#ffffff]"
              />
            </div>

            <div className="font-medium px-4 py-3 w-full justify-between">
              <p>
                ฿
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(pPrice)}
              </p>
              <p className="max-w-[80%] line-clamp-2 md:line-clamp-1">{pName}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
