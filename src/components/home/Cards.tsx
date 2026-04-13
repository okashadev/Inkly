import { motion } from "framer-motion";

interface CardProps {
  title: string;
  desc: string;
  img: string;
}

export default function Card({ title, desc, img }: CardProps) {
  return (
    <motion.div whileHover={{ y: -10 }} className="bg-[#171f33] rounded-xl overflow-hidden">
      <img src={img} className="h-60 w-full object-cover" />
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-slate-400 text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}