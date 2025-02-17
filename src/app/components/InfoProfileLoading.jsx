export default function InfoProfileLoading() {
  return (
    <main className="my-20 px-10 md:px-32 2xl:px-72">
      <div className="grid lg:grid-cols-3 gap-4 h-72 animate-pulse">
        <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 w-full">
          <button className="w-full border-2 rounded-md px-4 py-2 h-10 bg-[#e5e5e5]"></button>
          <button className="w-full border-2 rounded-md px-4 py-2 h-10 bg-[#e5e5e5]"></button>
          <button className="w-full border-2 rounded-md px-4 py-2 h-10 bg-[#e5e5e5]"></button>
        </div>
        <div className="bg-[#ffffff] p-10 rounded-md drop-shadow-md space-y-4 md:col-span-2 w-full">
          <div className="grid grid-cols-2 gap-4">
            <button className="w-full border-2 rounded-md px-4 py-2 h-10 bg-[#e5e5e5]"></button>
            <button className="w-full border-2 rounded-md px-4 py-2 h-10 bg-[#e5e5e5]"></button>
          </div>
          <button className="w-full border-2 rounded-md px-4 py-2 h-10 bg-[#e5e5e5]"></button>
          <div className="grid grid-cols-2 gap-4">
            <button className="w-full border-2 rounded-md px-4 py-2 h-10 bg-[#e5e5e5]"></button>
            <button className="w-full border-2 rounded-md px-4 py-2 h-10 bg-[#e5e5e5]"></button>
          </div>
          <button className="w-full border-2 rounded-md px-4 py-2 h-10 bg-[#e5e5e5]"></button>
        </div>
      </div>
    </main>
  )
}
