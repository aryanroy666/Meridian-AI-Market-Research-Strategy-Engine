import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useTheme } from "../context/ThemeContext";

// ICONS
import { FaGithub } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { RiFlowChart } from "react-icons/ri";


export default function Footer() {

  const { theme, toggleTheme } = useTheme();


  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="border-t border-line bg-paper mt-8"
    >
      <div className="mx-auto flex  max-w-6xl flex-col items-center gap-6 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">

        <p className="text-sm text-ink-soft text-center">
          © 2026 Meridian Strategy Engine. AI-Powered Market Research.
        </p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            to="/methodology"
            className={`text-[13px] flex items-center gap-1 font-normal ${theme == "dark" ? "text-ink-soft/70" : "text-gray-700"} transition hover:text-ink`}
          >
            <RiFlowChart />
            Methodology
          </Link>

          <Link
            to="/about"
            className={`text-[13px] flex items-center gap-1 font-normal ${theme == "dark" ? "text-ink-soft/70" : "text-gray-700"} transition hover:text-ink`}
          >
            {/* <FaGithub /> */}
            <IoMdInformationCircleOutline />
            About
          </Link>

          <a
            href="https://github.com/furqansup/mckinsey-research-engine"
            target="_blank"
            rel="noreferrer"
            className={`text-[13px] flex items-center gap-1 font-normal ${theme == "dark" ? "text-ink-soft/70" : "text-gray-700"} transition hover:text-ink`}
          >

            <FaGithub />
            GitHub
          </a>
        </div>
      </div>
    </motion.footer>
  );
}