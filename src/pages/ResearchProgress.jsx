// // import { useEffect, useRef, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { Compass, ListChecks, Globe2, ShieldCheck, FileText, AlertCircle } from "lucide-react";
// // import { api, ApiError } from "../api/client";

// // import logo from "../assets/MK_Logo.png";

// // const STAGES = [
// //   {
// //     key: "planning",
// //     icon: ListChecks,
// //     label: "Planning the brief",
// //     detail: "Breaking the question into research tasks",
// //   },
// //   {
// //     key: "researching",
// //     icon: Globe2,
// //     label: "Gathering evidence",
// //     detail: "Searching sources and extracting claims",
// //   },
// //   {
// //     key: "validating",
// //     icon: ShieldCheck,
// //     label: "Validating evidence",
// //     detail: "Scoring credibility, recency, and conflicts",
// //   },
// //   {
// //     key: "reporting",
// //     icon: FileText,
// //     label: "Drafting the report",
// //     detail: "Synthesizing findings and recommendations",
// //   },
// // ];

// // // Stage advances on a timer to give a sense of progress while the
// // // backend call is in flight (the pipeline runs as a single blocking
// // // request, so this is illustrative rather than a literal live feed).
// // const STAGE_DURATION_MS = 5200;

// // export default function ResearchProgress() {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const query = location.state?.query;

// //   const [stageIndex, setStageIndex] = useState(0);
// //   const [error, setError] = useState("");
// //   const [failedJobId, setFailedJobId] = useState(null);
// //   const startedRef = useRef(false);

// //   useEffect(() => {
// //     if (!query) {
// //       navigate("/", { replace: true });
// //       return;
// //     }

// //     if (startedRef.current) return;
// //     startedRef.current = true;

// //     const timer = setInterval(() => {
// //       setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
// //     }, STAGE_DURATION_MS);

// //     api
// //       .createResearch(query)
// //       .then((result) => {
// //         clearInterval(timer);
// //         setStageIndex(STAGES.length - 1);
// //         setTimeout(() => {
// //           navigate(`/research/${result.job_id}`, { replace: true });
// //         }, 500);
// //       })
// //       .catch((err) => {
// //         clearInterval(timer);
// //         if (err instanceof ApiError) {
// //           setError(err.message);
// //           if (err.detail && typeof err.detail === "object" && err.detail.job_id) {
// //             setFailedJobId(err.detail.job_id);
// //           }
// //         } else {
// //           setError("Something went wrong starting the research pipeline.");
// //         }
// //       });

// //     return () => clearInterval(timer);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [query]);

// //   if (error) {
// //     return (
// //       <div className="flex min-h-screen items-center justify-center bg-navy px-6 text-white">
// //         <div className="w-full max-w-sm text-center">
// //           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bad/15 text-bad">
// //             <AlertCircle size={22} />
// //           </div>
// //           <h1 className="mt-5 font-display text-2xl">Research pipeline failed</h1>
// //           <p className="mt-2 text-sm leading-relaxed text-white/60">{error}</p>
// //           <div className="mt-7 flex justify-center gap-3">
// //             <button
// //               onClick={() => navigate("/")}
// //               className="rounded-md bg-white px-4 py-2.5 text-sm font-medium text-navy transition hover:bg-white/90 cursor-pointer"
// //             >
// //               Back to dashboard
// //             </button>
// //             {failedJobId && (
// //               <button
// //                 onClick={() => navigate(`/research/${failedJobId}`)}
// //                 className="rounded-md border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 cursor-pointer"
// //               >
// //                 View job
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#DCDCDC] px-6 text-white">
// //       <div className="grain pointer-events-none absolute inset-0" />
// //       <div
// //         className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-[0.14] blur-3xl animate-drift"
// //         style={{ background: "radial-gradient(circle, #d9b877 0%, transparent 70%)" }}
// //       />

// //       <div className="relative z-10 w-full max-w-md">
// //         <div className="mb-10 flex flex-col items-center text-center">
// //           <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-gold-soft ring-1 ring-white/15">
// //             <img src={logo} alt="meidian" />
// //           </span>
// //           <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-gold-soft">
// //             Meridian is working
// //           </p>
// //           <h1 className="mt-2 max-w-sm font-display text-2xl leading-snug tracking-tight">
// //             {query}
// //           </h1>
// //         </div>

// //         <div className="space-y-1.5">
// //           {STAGES.map((stage, i) => {
// //             const Icon = stage.icon;
// //             const state =
// //               i < stageIndex ? "done" : i === stageIndex ? "active" : "pending";

// //             return (
// //               <div
// //                 key={stage.key}
// //                 className={`flex items-center gap-4 rounded-lg border px-4 py-3.5 transition-all duration-500 ${state === "active"
// //                   ? "border-gold-soft/40 bg-white/[0.06]"
// //                   : "border-white/5 bg-transparent"
// //                   }`}
// //               >
// //                 <span
// //                   className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${state === "done"
// //                     ? "border-gold-soft/50 bg-gold-soft/15 text-gold-soft"
// //                     : state === "active"
// //                       ? "border-gold-soft bg-gold-soft/10 text-gold-soft"
// //                       : "border-white/10 text-white/25"
// //                     }`}
// //                 >
// //                   <Icon size={14} className={state === "active" ? "animate-pulse-soft" : ""} />
// //                 </span>
// //                 <div className="min-w-0">
// //                   <p
// //                     className={`text-sm font-medium transition-colors duration-500 ${state === "pending" ? "text-white/35" : "text-white"
// //                       }`}
// //                   >
// //                     {stage.label}
// //                   </p>
// //                   <p
// //                     className={`text-xs transition-colors duration-500 ${state === "pending" ? "text-white/20" : "text-white/50"
// //                       }`}
// //                   >
// //                     {stage.detail}
// //                   </p>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>

// //         <p className="mt-8 text-center text-xs text-white/35">
// //           This can take a minute or two for a thorough brief — feel free to
// //           leave this open.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }



// import { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   ListChecks,
//   Globe2,
//   ShieldCheck,
//   FileText,
//   AlertCircle,
//   Search,
//   Link2,
//   BarChart3,
//   Sparkles,
//   Check,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// import { api, ApiError } from "../api/client";
// import logo from "../assets/MK_Logo.png";

// const STAGES = [
//   {
//     key: "planning",
//     icon: ListChecks,
//     label: "Planning the brief",
//     detail: "Breaking the question into research tasks",
//   },
//   {
//     key: "researching",
//     icon: Globe2,
//     label: "Gathering evidence",
//     detail: "Searching sources and extracting claims",
//   },
//   {
//     key: "validating",
//     icon: ShieldCheck,
//     label: "Validating evidence",
//     detail: "Scoring credibility, recency, and conflicts",
//   },
//   {
//     key: "reporting",
//     icon: FileText,
//     label: "Drafting the report",
//     detail: "Synthesizing findings and recommendations",
//   },
// ];

// const STAGE_DURATION_MS = 5200;

// const ACTIVITIES = [
//   "Searching market reports...",
//   "Scanning industry sources...",
//   "Extracting relevant claims...",
//   "Checking source credibility...",
//   "Comparing market signals...",
//   "Preparing strategic synthesis...",
// ];

// export default function ResearchProgress() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const query = location.state?.query;

//   const [stageIndex, setStageIndex] = useState(0);
//   const [error, setError] = useState("");
//   const [failedJobId, setFailedJobId] = useState(null);
//   const [activityIndex, setActivityIndex] = useState(0);

//   const startedRef = useRef(false);

//   /*
//    * Stage progress
//    */
//   useEffect(() => {
//     if (!query) {
//       navigate("/", { replace: true });
//       return;
//     }

//     if (startedRef.current) return;

//     startedRef.current = true;

//     const timer = setInterval(() => {
//       setStageIndex((i) =>
//         Math.min(i + 1, STAGES.length - 1)
//       );
//     }, STAGE_DURATION_MS);

//     api
//       .createResearch(query)
//       .then((result) => {
//         clearInterval(timer);

//         setStageIndex(STAGES.length - 1);

//         setTimeout(() => {
//           navigate(`/research/${result.job_id}`, {
//             replace: true,
//           });
//         }, 700);
//       })
//       .catch((err) => {
//         clearInterval(timer);

//         if (err instanceof ApiError) {
//           setError(err.message);

//           if (
//             err.detail &&
//             typeof err.detail === "object" &&
//             err.detail.job_id
//           ) {
//             setFailedJobId(err.detail.job_id);
//           }
//         } else {
//           setError(
//             "Something went wrong starting the research pipeline."
//           );
//         }
//       });

//     return () => clearInterval(timer);

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [query]);

//   /*
//    * Activity text
//    */
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActivityIndex((i) =>
//         (i + 1) % ACTIVITIES.length
//       );
//     }, 2600);

//     return () => clearInterval(timer);
//   }, []);

//   /*
//    * Error screen
//    */
//   if (error) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-ink">
//         <div className="w-full max-w-sm text-center">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-bad/20 bg-bad/5 text-bad">
//             <AlertCircle size={22} />
//           </div>

//           <h1 className="mt-5 font-display text-2xl font-semibold">
//             Research pipeline failed
//           </h1>

//           <p className="mt-2 text-sm leading-relaxed text-ink-muted">
//             {error}
//           </p>

//           <div className="mt-7 flex justify-center gap-3">
//             <button
//               onClick={() => navigate("/")}
//               className="rounded-md bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy/90"
//             >
//               Back to dashboard
//             </button>

//             {failedJobId && (
//               <button
//                 onClick={() =>
//                   navigate(`/research/${failedJobId}`)
//                 }
//                 className="rounded-md border border-line px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
//               >
//                 View job
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const progress =
//     ((stageIndex + 1) / STAGES.length) * 100;

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-paper px-6 text-ink">

//       {/* ------------------------------------------------ */}
//       {/* Background */}
//       {/* ------------------------------------------------ */}

//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute left-1/2 top-[20%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" />

//         <div className="absolute inset-0 opacity-[0.025]">
//           <div
//             className="h-full w-full"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle, currentColor 1px, transparent 1px)",
//               backgroundSize: "28px 28px",
//             }}
//           />
//         </div>
//       </div>

//       {/* ------------------------------------------------ */}
//       {/* Main */}
//       {/* ------------------------------------------------ */}

//       <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-12">

//         {/* ------------------------------------------------ */}
//         {/* Animated research core */}
//         {/* ------------------------------------------------ */}

//         <div className="relative mb-8 flex h-24 w-24 items-center justify-center">

//           {/* Outer pulse */}
//           <motion.div
//             animate={{
//               scale: [1, 1.45, 1],
//               opacity: [0.35, 0, 0.35],
//             }}
//             transition={{
//               duration: 2.4,
//               repeat: Infinity,
//               ease: "easeOut",
//             }}
//             className="absolute h-20 w-20 rounded-full border border-gold/30"
//           />

//           {/* Rotating ring */}
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{
//               duration: 8,
//               repeat: Infinity,
//               ease: "linear",
//             }}
//             className="absolute h-20 w-20 rounded-full border border-dashed border-gold/30"
//           />

//           {/* Logo */}
//           <motion.div
//             initial={{ scale: 0.7, opacity: 0 }}
//             animate={{
//               scale: 1,
//               opacity: 1,
//             }}
//             transition={{
//               duration: 0.5,
//               ease: "easeOut",
//             }}
//             className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface shadow-sm"
//           >
//             <img
//               src={logo}
//               alt="Meridian"
//               className="h-8 w-8 object-contain"
//             />
//           </motion.div>

//           {/* Floating icons */}
//           <FloatingIcon
//             icon={Search}
//             className="-left-12 top-0"
//             delay={0}
//           />

//           <FloatingIcon
//             icon={Globe2}
//             className="-right-12 top-4"
//             delay={0.8}
//           />

//           <FloatingIcon
//             icon={Link2}
//             className="-bottom-5 -left-8"
//             delay={1.5}
//           />

//           <FloatingIcon
//             icon={BarChart3}
//             className="-bottom-6 -right-8"
//             delay={2.2}
//           />
//         </div>

//         {/* ------------------------------------------------ */}
//         {/* Heading */}
//         {/* ------------------------------------------------ */}

//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//           transition={{ duration: 0.45 }}
//           className="text-center"
//         >
//           <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
//             Meridian is working
//           </p>

//           <h1 className="mt-3 max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
//             {query}
//           </h1>

//           <div className="mt-5 flex items-center justify-center gap-2 text-xs text-ink-muted">
//             <Sparkles
//               size={13}
//               className="text-gold"
//             />

//             <AnimatePresence mode="wait">
//               <motion.span
//                 key={ACTIVITIES[activityIndex]}
//                 initial={{
//                   opacity: 0,
//                   y: 5,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 exit={{
//                   opacity: 0,
//                   y: -5,
//                 }}
//                 transition={{
//                   duration: 0.25,
//                 }}
//               >
//                 {ACTIVITIES[activityIndex]}
//               </motion.span>
//             </AnimatePresence>
//           </div>
//         </motion.div>

//         {/* ------------------------------------------------ */}
//         {/* Progress */}
//         {/* ------------------------------------------------ */}

//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//           transition={{
//             duration: 0.4,
//             delay: 0.15,
//           }}
//           className="mt-8 w-full max-w-xl"
//         >
//           <div className="mb-2 flex items-center justify-between text-[11px]">
//             <span className="font-mono uppercase tracking-wider text-ink-muted">
//               Research progress
//             </span>

//             <span className="font-mono text-ink-soft">
//               {Math.round(progress)}%
//             </span>
//           </div>

//           <div className="h-1 overflow-hidden rounded-full bg-line">
//             <motion.div
//               animate={{
//                 width: `${progress}%`,
//               }}
//               transition={{
//                 duration: 0.8,
//                 ease: "easeOut",
//               }}
//               className="h-full rounded-full bg-gold"
//             />
//           </div>
//         </motion.div>

//         {/* ------------------------------------------------ */}
//         {/* Stages */}
//         {/* ------------------------------------------------ */}

//         <div className="mt-8 w-full max-w-xl space-y-2">
//           {STAGES.map((stage, i) => {
//             const Icon = stage.icon;

//             const state =
//               i < stageIndex
//                 ? "done"
//                 : i === stageIndex
//                   ? "active"
//                   : "pending";

//             return (
//               <motion.div
//                 key={stage.key}
//                 layout
//                 initial={{
//                   opacity: 0,
//                   y: 12,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 transition={{
//                   duration: 0.35,
//                   delay: i * 0.08,
//                 }}
//                 className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-500 ${state === "active"
//                     ? "border-gold/35 bg-surface shadow-sm"
//                     : "border-line bg-surface/60"
//                   }`}
//               >

//                 {/* Active shimmer */}
//                 {state === "active" && (
//                   <motion.div
//                     initial={{ x: "-100%" }}
//                     animate={{ x: "100%" }}
//                     transition={{
//                       duration: 1.8,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}
//                     className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold/5 to-transparent"
//                   />
//                 )}

//                 <div className="relative flex items-center gap-4">

//                   {/* Icon */}
//                   <motion.div
//                     animate={
//                       state === "active"
//                         ? {
//                           scale: [1, 1.08, 1],
//                         }
//                         : {}
//                     }
//                     transition={{
//                       duration: 1.5,
//                       repeat: Infinity,
//                     }}
//                     className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${state === "done"
//                         ? "border-good/30 bg-good/5 text-good"
//                         : state === "active"
//                           ? "border-gold/40 bg-gold/5 text-gold"
//                           : "border-line text-ink-muted/40"
//                       }`}
//                   >
//                     {state === "done" ? (
//                       <Check size={15} />
//                     ) : (
//                       <Icon size={15} />
//                     )}
//                   </motion.div>

//                   {/* Text */}
//                   <div className="min-w-0">
//                     <p
//                       className={`text-sm font-medium ${state === "pending"
//                           ? "text-ink-muted"
//                           : "text-ink"
//                         }`}
//                     >
//                       {stage.label}
//                     </p>

//                     <p className="mt-0.5 text-xs text-ink-muted">
//                       {stage.detail}
//                     </p>
//                   </div>

//                   {/* Active indicator */}
//                   {state === "active" && (
//                     <div className="ml-auto flex items-center gap-1">
//                       <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
//                       <span className="font-mono text-[9px] uppercase tracking-wider text-gold">
//                         Active
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>

//         {/* ------------------------------------------------ */}
//         {/* Metrics */}
//         {/* ------------------------------------------------ */}

//         <motion.div
//           initial={{
//             opacity: 0,
//             y: 10,
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//           transition={{
//             duration: 0.4,
//             delay: 0.4,
//           }}
//           className="mt-7 grid w-full max-w-xl grid-cols-3 gap-2"
//         >
//           <Metric
//             value={stageIndex >= 1 ? "Scanning" : "Queued"}
//             label="Sources"
//           />

//           <Metric
//             value={stageIndex >= 2 ? "Checking" : "Waiting"}
//             label="Validation"
//           />

//           <Metric
//             value={stageIndex >= 3 ? "Writing" : "Pending"}
//             label="Synthesis"
//           />
//         </motion.div>

//         {/* Footer message */}

//         <p className="mt-8 max-w-md text-center text-xs leading-relaxed text-ink-muted">
//           Meridian is coordinating multiple research stages.
//           You can leave this page open while the analysis runs.
//         </p>
//       </div>
//     </div>
//   );
// }


// /* ------------------------------------------------ */
// /* Floating Icon */
// /* ------------------------------------------------ */

// function FloatingIcon({
//   icon: Icon,
//   className,
//   delay,
// }) {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         scale: 0.4,
//       }}
//       animate={{
//         opacity: [0, 0.8, 0.8, 0],
//         scale: [0.4, 1, 1, 0.8],
//         y: [12, 0, -8, -22],
//       }}
//       transition={{
//         duration: 3,
//         delay,
//         repeat: Infinity,
//         ease: "easeInOut",
//       }}
//       className={`absolute ${className}`}
//     >
//       <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-surface text-gold shadow-sm">
//         <Icon size={13} />
//       </div>
//     </motion.div>
//   );
// }


// /* ------------------------------------------------ */
// /* Metric */
// /* ------------------------------------------------ */

// function Metric({ value, label }) {
//   return (
//     <div className="rounded-lg border border-line bg-surface/70 px-3 py-3 text-center">
//       <p className="font-mono text-[10px] text-ink-muted">
//         {label}
//       </p>

//       <p className="mt-1 text-xs font-medium text-ink">
//         {value}
//       </p>
//     </div>
//   );
// }







import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ListChecks,
  Globe2,
  ShieldCheck,
  FileText,
  AlertCircle,
  Search,
  Link2,
  BarChart3,
  Sparkles,
  Check,
  Database,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { api, ApiError } from "../api/client";
import logo from "../assets/MK_Logo.png";

const STAGES = [
  {
    key: "planning",
    icon: ListChecks,
    label: "Planning the brief",
    detail: "Breaking the question into research tasks",
  },
  {
    key: "researching",
    icon: Globe2,
    label: "Gathering evidence",
    detail: "Searching sources and extracting claims",
  },
  {
    key: "validating",
    icon: ShieldCheck,
    label: "Validating evidence",
    detail: "Scoring credibility, recency, and conflicts",
  },
  {
    key: "reporting",
    icon: FileText,
    label: "Drafting the report",
    detail: "Synthesizing findings and recommendations",
  },
];

const STAGE_DURATION_MS = 5200;

const ACTIVITIES = [
  "Searching market reports...",
  "Scanning industry sources...",
  "Extracting relevant claims...",
  "Checking source credibility...",
  "Comparing market signals...",
  "Preparing strategic synthesis...",
];

const PARTICLE_ICONS = [
  Search,
  Globe2,
  Link2,
  BarChart3,
  Database,
];

export default function ResearchProgress() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = location.state?.query;

  const [stageIndex, setStageIndex] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);

  const [error, setError] = useState("");
  const [failedJobId, setFailedJobId] = useState(null);

  const startedRef = useRef(false);

  /*
  |--------------------------------------------------------------------------
  | Start research
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!query) {
      navigate("/", { replace: true });
      return;
    }

    if (startedRef.current) return;

    startedRef.current = true;

    const timer = setInterval(() => {
      setStageIndex((current) =>
        Math.min(current + 1, STAGES.length - 1)
      );
    }, STAGE_DURATION_MS);

    api
      .createResearch(query)
      .then((result) => {
        clearInterval(timer);

        setStageIndex(STAGES.length - 1);

        setTimeout(() => {
          navigate(`/research/${result.job_id}`, {
            replace: true,
          });
        }, 900);
      })
      .catch((err) => {
        clearInterval(timer);

        if (err instanceof ApiError) {
          setError(err.message);

          if (
            err.detail &&
            typeof err.detail === "object" &&
            err.detail.job_id
          ) {
            setFailedJobId(err.detail.job_id);
          }
        } else {
          setError(
            "Something went wrong starting the research pipeline."
          );
        }
      });

    return () => clearInterval(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  /*
  |--------------------------------------------------------------------------
  | Change activity text
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIndex(
        (current) => (current + 1) % ACTIVITIES.length
      );
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Error screen
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-ink">
        <div className="w-full max-w-md text-center">

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-bad/20 bg-bad/5 text-bad"
          >
            <AlertCircle size={24} />
          </motion.div>

          <h1 className="mt-6 font-display text-2xl font-semibold">
            Research pipeline failed
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {error}
          </p>

          <div className="mt-7 flex justify-center gap-3">

            <button
              onClick={() => navigate("/")}
              className="rounded-md bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 cursor-pointer"
            >
              Back to dashboard
            </button>

            {failedJobId && (
              <button
                onClick={() =>
                  navigate(`/research/${failedJobId}`)
                }
                className="rounded-md border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-paper-dim cursor-pointer"
              >
                View job
              </button>
            )}

          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Progress percentage
  |--------------------------------------------------------------------------
  */

  const progress =
    ((stageIndex + 1) / STAGES.length) * 100;

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="relative min-h-screen overflow-hidden bg-paper text-ink">

      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0">

        {/* Very subtle center glow */}
        <div
          className="
            absolute
            left-1/2
            top-[30%]
            h-[28rem]
            w-[28rem]
            -translate-x-1/2
            rounded-full
            bg-gold/5
            blur-3xl
          "
        />

        {/* Subtle dot grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
          "
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ============================================================
          CONTENT
      ============================================================ */}

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-12">

        {/* ========================================================
            LOGO / RESEARCH CORE
        ======================================================== */}

        <div className="relative mb-9 flex h-28 w-28 items-center justify-center">

          {/* Outer pulse */}
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.35, 0, 0.35],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="
              absolute
              h-24
              w-24
              rounded-full
              border
              border-gold/30
            "
          />

          {/* Orbit */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              h-24
              w-24
              rounded-full
              border
              border-dashed
              border-gold/25
            "
          >
            {/* Orbit dot */}
            <span
              className="
                absolute
                -right-1
                top-1/2
                h-2
                w-2
                -translate-y-1/2
                rounded-full
                bg-gold
              "
            />
          </motion.div>

          {/* Second orbit */}
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              h-20
              w-32
              rounded-full
              border
              border-line
              opacity-60
            "
          />

          {/* Logo */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            className="
              relative
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-xl
              border
              border-line
              bg-surface
              shadow-sm
            "
          >
            <motion.img
              src={logo}
              alt="Meridian"
              className="h-9 w-9 object-contain"
              animate={{
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Floating particles */}
          {PARTICLE_ICONS.map((Icon, index) => (
            <FloatingParticle
              key={index}
              Icon={Icon}
              index={index}
            />
          ))}
        </div>

        {/* ========================================================
            HEADING
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="text-center"
        >

          <p
            className="
              font-mono
              text-[11px]
              uppercase
              tracking-[0.22em]
              text-gold
            "
          >
            Meridian is working
          </p>

          <h1
            className="
              mt-3
              max-w-2xl
              font-display
              text-2xl
              font-semibold
              leading-tight
              tracking-tight
              sm:text-3xl
            "
          >
            {query}
          </h1>

          {/* Live activity */}
          <div className="mt-5 flex items-center justify-center gap-2">

            <motion.span
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
              }}
              className="h-1.5 w-1.5 rounded-full bg-gold"
            />

            <AnimatePresence mode="wait">
              <motion.span
                key={ACTIVITIES[activityIndex]}
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -5,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="text-xs text-ink-muted"
              >
                {ACTIVITIES[activityIndex]}
              </motion.span>
            </AnimatePresence>

          </div>
        </motion.div>

        {/* ========================================================
            PROGRESS BAR
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.15,
          }}
          className="mt-9 w-full max-w-xl"
        >

          <div className="mb-2 flex items-center justify-between">

            <span
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-wider
                text-ink-muted
              "
            >
              Research progress
            </span>

            <span className="font-mono text-[10px] text-ink-soft">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-1 overflow-hidden rounded-full bg-line">

            <motion.div
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="
                h-full
                rounded-full
                bg-gold
              "
            />

          </div>
        </motion.div>

        {/* ========================================================
            STAGES
        ======================================================== */}

        <div className="mt-8 w-full max-w-xl space-y-2">

          {STAGES.map((stage, index) => {

            const Icon = stage.icon;

            const state =
              index < stageIndex
                ? "done"
                : index === stageIndex
                  ? "active"
                  : "pending";

            return (
              <StageCard
                key={stage.key}
                stage={stage}
                Icon={Icon}
                state={state}
                index={index}
              />
            );
          })}

        </div>

        {/* ========================================================
            STATUS METRICS
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.5,
          }}
          className="
            mt-6
            grid
            w-full
            max-w-xl
            grid-cols-3
            gap-2
          "
        >

          <Metric
            icon={Globe2}
            label="Sources"
            value={
              stageIndex >= 1
                ? "Scanning"
                : "Queued"
            }
          />

          <Metric
            icon={ShieldCheck}
            label="Evidence"
            value={
              stageIndex >= 2
                ? "Checking"
                : "Waiting"
            }
          />

          <Metric
            icon={FileText}
            label="Report"
            value={
              stageIndex >= 3
                ? "Writing"
                : "Pending"
            }
          />

        </motion.div>

        {/* ========================================================
            FOOTER MESSAGE
        ======================================================== */}

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            delay: 0.7,
          }}
          className="
            mt-7
            max-w-md
            text-center
            text-xs
            leading-relaxed
            text-ink-muted
          "
        >
          Meridian is coordinating multiple research stages.
          You can leave this page open while the analysis runs.
        </motion.p>

      </div>
    </div>
  );
}


/* ==================================================================
   STAGE CARD
================================================================== */

function StageCard({
  stage,
  Icon,
  state,
  index,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
      }}
      className={`
        relative
        overflow-hidden
        rounded-xl
        border
        p-4
        transition-all
        duration-500

        ${state === "active"
          ? "border-gold/35 bg-surface shadow-sm"
          : state === "done"
            ? "border-line bg-surface/80"
            : "border-line/70 bg-surface/40"
        }
      `}
    >

      {/* Active shimmer */}

      {state === "active" && (
        <motion.div
          initial={{
            x: "-100%",
          }}
          animate={{
            x: "100%",
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            pointer-events-none
            absolute
            inset-y-0
            w-1/3
            bg-gradient-to-r
            from-transparent
            via-gold/5
            to-transparent
          "
        />
      )}

      <div className="relative flex items-center gap-4">

        {/* Icon */}

        <motion.div
          animate={
            state === "active"
              ? {
                scale: [1, 1.07, 1],
              }
              : {
                scale: 1,
              }
          }
          transition={{
            duration: 1.8,
            repeat:
              state === "active"
                ? Infinity
                : 0,
          }}
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            border

            ${state === "done"
              ? "border-good/30 bg-good/5 text-good"
              : state === "active"
                ? "border-gold/40 bg-gold/5 text-gold"
                : "border-line text-ink-muted/40"
            }
          `}
        >

          <AnimatePresence mode="wait">

            {state === "done" ? (
              <motion.div
                key="check"
                initial={{
                  scale: 0,
                  rotate: -45,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <Check size={15} />
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >
                <Icon
                  size={15}
                  className={
                    state === "active"
                      ? "animate-pulse"
                      : ""
                  }
                />
              </motion.div>
            )}

          </AnimatePresence>

        </motion.div>

        {/* Text */}

        <div className="min-w-0">

          <p
            className={`
              text-sm
              font-medium

              ${state === "pending"
                ? "text-ink-muted"
                : "text-ink"
              }
            `}
          >
            {stage.label}
          </p>

          <p className="mt-0.5 text-xs text-ink-muted">
            {stage.detail}
          </p>

        </div>

        {/* Active indicator */}

        {state === "active" && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="ml-auto flex items-center gap-1.5"
          >

            <motion.span
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
              }}
              className="h-1.5 w-1.5 rounded-full bg-gold"
            />

            <span
              className="
                hidden
                font-mono
                text-[9px]
                uppercase
                tracking-wider
                text-gold
                sm:block
              "
            >
              Active
            </span>

          </motion.div>
        )}

        {/* Done label */}

        {state === "done" && (
          <span
            className="
              ml-auto
              hidden
              font-mono
              text-[9px]
              uppercase
              tracking-wider
              text-good
              sm:block
            "
          >
            Complete
          </span>
        )}

      </div>
    </motion.div>
  );
}


/* ==================================================================
   FLOATING PARTICLE
================================================================== */

function FloatingParticle({
  Icon,
  index,
}) {

  const positions = [
    "-left-10 top-0",
    "-right-10 top-1",
    "-left-8 bottom-0",
    "-right-9 bottom-2",
    "left-1/2 -top-8",
  ];

  return (
    <motion.div
      className={`
        absolute
        ${positions[index]}
      `}
      initial={{
        opacity: 0,
        scale: 0.4,
      }}
      animate={{
        opacity: [0, 0.7, 0],
        scale: [0.5, 1, 0.7],
        y: [8, -4, -16],
      }}
      transition={{
        duration: 3.2,
        delay: index * 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >

      <div
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-lg
          border
          border-line
          bg-surface
          text-gold
          shadow-sm
        "
      >
        <Icon size={12} />
      </div>

    </motion.div>
  );
}


/* ==================================================================
   METRIC
================================================================== */

function Metric({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-lg
        border
        border-line
        bg-surface/60
        px-3
        py-3
        text-center
      "
    >

      <div className="flex items-center justify-center gap-1.5">

        <Icon
          size={11}
          className="text-ink-muted"
        />

        <span
          className="
            font-mono
            text-[9px]
            uppercase
            tracking-wider
            text-ink-muted
          "
        >
          {label}
        </span>

      </div>

      <p className="mt-1 text-xs font-medium text-ink">
        {value}
      </p>

    </div>
  );
}