import {
  Heart,
  Home,
  ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import Image from "next/image";

const page = () => {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0F0F0F] border-r border-[#FFFFFFCC]/30 p-4 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <Image src={"/Layer_1.svg"} alt="logo" width={100} height={100} />
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <button className="w-full flex justify-start bg-[#FF3599] hover:bg-[#FF3599]/80 text-white rounded-full">
            <Home className="mr-3 h-4 w-4" />
            Home
          </button>

          <button className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50 bg-transparent border">
            <MessageCircle className="mr-3 h-4 w-4" />
            WHSPRs
          </button>

          <button className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50 bg-transparent border">
            <ImageIcon className="mr-3 h-4 w-4" />
            Meme
          </button>

          <button className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50 bg-transparent border">
            <Heart className="mr-3 h-4 w-4" />
            Favourites
          </button>
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4">
          <button className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50 bg-transparent border">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 p-2">
            {/* <Avatar className="h-8 w-8">
              <AvatarImage src="/abstract-geometric-shapes.png" />
              <AvatarFallback>X</AvatarFallback>
            </Avatar> */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Xavoo</p>
              <p className="text-xs text-gray-400 truncate">Owl Reveals</p>
            </div>
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
