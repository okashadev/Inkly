import { FaTwitter, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-10 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="font-bold">Inkly</h1>
          <p className="text-slate-500 text-sm">© 2024</p>
        </div>

        <div className="flex gap-4 text-slate-400">
          <FaTwitter />
          <FaGithub />
        </div>
      </div>
    </footer>
  );
}
