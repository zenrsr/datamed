import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex w-3/4 space-x-2 items-center text-sm py-1 relative z-20"
    >
      <div className="h-10 flex items-center rounded-full flex-shrink-0 w-1/3">
        <Image
          src="/DataMed_avatar.png"
          alt="Logo"
          className="rounded-full"
          width={45}
          height={50}
        />
      </div>
      <div className="w-1/3">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-white bg-black whitespace-pre"
        >
          <p className="text-lg font-bold">DataMed</p>
        </motion.span>
      </div>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0">
        <Image
          src="/DataMed_avatar.png"
          alt="Logo"
          className="rounded-full"
          width={45}
          height={50}
        />
      </div>
    </Link>
  );
};
