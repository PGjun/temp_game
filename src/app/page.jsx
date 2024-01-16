import Link from "next/link"

export default function Home() {
  return (
    <div className='flex flex-col gap-3'>
      <Link href={`/miro`}>
        <button className='px-[20px] h-[40px] bg-blue-500 rounded-full text-white'>
          미로게임
        </button>
      </Link>
      <Link href={`/foward`}>
        <button className='px-[20px] h-[40px] bg-blue-500 rounded-full text-white'>
          전진게임
        </button>
      </Link>
    </div>
  )
}
