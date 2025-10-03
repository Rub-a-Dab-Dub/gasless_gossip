import Image from "next/image";

type CardProps = {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
};

export default function Card({
  iconSrc,
  iconAlt,
  title,
  description,
}: CardProps) {
  return (
    <div className="group perspective">
      <div className="flex flex-col items-start gap-3 bg-[#F1F7F6] rounded-xl p-5 shadow-md hover:shadow-[0px_4px_16px_0px_#0E91861F] transition duration-300 ease-in-out transform group-hover:tilt-down">
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={24}
          height={24}
          className="object-contain"
        />
        <h3 className="text-[#121418] text-lg font-semibold">{title}</h3>
        <p className="text-sm text-[#6B7A77]">{description}</p>
      </div>
    </div>
  );
}
