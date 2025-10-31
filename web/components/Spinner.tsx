import Lottie from "lottie-react";
import spinner from "@/assets/spinner.json";

export const Spinner = () => {
  return <Lottie animationData={spinner} loop={true} className="w-20 h-20" />;
};
