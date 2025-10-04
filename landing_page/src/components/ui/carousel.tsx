import Image from "next/image";

type CardItem = {
  id: number;
  imageSrc: string;
  alt: string;
};

const cards: CardItem[] = [
  { id: 1, imageSrc: "/images/sponsor_icon.svg", alt: "icon" },
  { id: 2, imageSrc: "/images/sponsor_icon.svg", alt: "icon" },
  { id: 3, imageSrc: "/images/sponsor_icon.svg", alt: "icon" },
  { id: 4, imageSrc: "/images/sponsor_icon.svg", alt: "icon" },
  { id: 5, imageSrc: "/images/sponsor_icon.svg", alt: "icon" },
];

export default function CardsCarousel() {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-4 py-6 w-max ">
        {cards.map((card) => (
          <div
            key={card.id}
            className=" bg-white rounded-xl shadow-md flex items-center justify-center p-4  hover:shadow-[0px_4px_16px_0px_#0E91861F] transition duration-300 ease-in-out transform group-hover:tilt-down"
          >
            <Image src={card.imageSrc} alt={card.alt} width={60} height={60} />
          </div>
        ))}
      </div>
    </div>
  );
}
