
import { motion } from "framer-motion";
import {
  Compass,
  GitBranch,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import logo from "../assets/MK_Logo.png";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">

      {/* Left side */}
      <div className="hidden border-r border-[#dedbd3] bg-[#f3f2ee] lg:flex">
        <div className="flex w-full flex-col justify-between px-10 py-10 xl:px-12">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#d9d6ce] ">
              <img src={logo} alt="logo" className="w-full h-full object-cover" />
            </div>

            <div>
              <p className="text-lg font-semibold tracking-tight text-[#171717]">
                Meridian
              </p>

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#b65a16]">
                Strategy Engine
              </p>
            </div>
          </motion.div>


          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="max-w-xl "
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#b65a16]">
              AI-Powered Research
            </p>

            <h1 className="mt-5 max-w-xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-[#171717] ">
              Strategy intelligence, <br /> built by autonomous agents.
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-7 text-[#666666]">
              Give Meridian a market question. It plans the research,
              gathers and validates evidence, and returns a structured
              strategy report — fully cited.
            </p>
          </motion.div>


          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="space-y-5"
          >

            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#d9d6ce] bg-white">
                <GitBranch size={15} className="text-[#b65a16]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#171717]">
                  Multi-agent pipeline
                </p>

                <p className="mt-1 text-xs leading-5 text-[#777777]">
                  Planner, researcher, validator, and report agents work a
                  brief end to end.
                </p>
              </div>
            </div>


            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#d9d6ce] bg-white">
                <ShieldCheck size={15} className="text-[#b65a16]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#171717]">
                  Evidence you can trace
                </p>

                <p className="mt-1 text-xs leading-5 text-[#777777]">
                  Every claim in the report links back to a scored,
                  citable source.
                </p>
              </div>
            </div>


            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#d9d6ce] bg-white">
                <TrendingUp size={15} className="text-[#b65a16]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#171717]">
                  Strategy-grade output
                </p>

                <p className="mt-1 text-xs leading-5 text-[#777777]">
                  Findings, signals, and recommendations — structured like
                  a real engagement.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>


      {/* Right side */}
      <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >

          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d9d6ce] bg-[#f3f2ee]">
              <Compass
                size={17}
                className="text-[#b65a16]"
              />
            </div>

            <div>
              <p className="font-semibold text-[#171717]">
                Meridian
              </p>

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#777777]">
                Strategy Engine
              </p>
            </div>
          </div>


          {/* Form heading */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#b65a16]">
              {eyebrow}
            </p>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#171717] sm:text-4xl">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#666666]">
              {subtitle}
            </p>
          </div>


          {/* Form */}
          <div className="mt-8">
            {children}
          </div>

        </motion.div>
      </div>

    </div>
  );
}