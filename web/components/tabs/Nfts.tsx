import Image from 'next/image';
import CatNft from "@/images/photos/cat-nft.jpg";

export default function NFTs() {
  return (
    <ul className="grid grid-cols-2 gap-1 sm:grid-cols-2 lg:grid-cols-2">
      <li>
        <div
          className="bg-gray-100 w-full">
          <Image
            alt=""
            src={CatNft}
            className="pointer-events-none w-full"
          />
        </div>
      </li>
      <li>
        <div
          className="bg-gray-100 w-full rounded-tr-4xl">
          <Image
            alt=""
            src={CatNft}
            className="pointer-events-none w-full h-auto rounded-tr-2xl"
          />
        </div>
      </li>
    </ul>
  )
}
