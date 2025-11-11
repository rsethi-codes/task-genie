// "use client";

// import { motion } from "framer-motion";
// import { Plus } from "lucide-react";
// import { useState } from "react";
// import TaskCard from "@/components/dashboard/task-card";
// import TaskStats from "@/components/dashboard/task-stats";
// import Header from "@/components/common/header";
// import Sidebar from "@/components/common/sidebar";

// export default function DashboardPage() {
//   const [tasks, setTasks] = useState([
//     {
//       id: "1",
//       title: "Launch Personal Website",
//       progress: 45,
//       subtasks: 8,
//       completedSubtasks: 4,
//       priority: "high",
//       dueDate: "Dec 15, 2025",
//       status: "in-progress",
//     },
//     {
//       id: "2",
//       title: "Learn Next.js Advanced Patterns",
//       progress: 20,
//       subtasks: 12,
//       completedSubtasks: 2,
//       priority: "medium",
//       dueDate: "Jan 5, 2026",
//       status: "in-progress",
//     },
//     {
//       id: "3",
//       title: "Write Blog Post Series",
//       progress: 0,
//       subtasks: 5,
//       completedSubtasks: 0,
//       priority: "low",
//       dueDate: "Dec 30, 2025",
//       status: "not-started",
//     },
//   ]);

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#000] text-white">
//       {/* Animated Background Orbs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div
//           animate={{
//             x: [0, 100, 0],
//             y: [0, 50, 0],
//           }}
//           transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
//           className="absolute -top-40 -left-40 w-80 h-80 bg-[#E8A476] opacity-10 blur-3xl rounded-full"
//         />
//         <motion.div
//           animate={{
//             x: [0, -100, 0],
//             y: [0, -50, 0],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Number.POSITIVE_INFINITY,
//             delay: 1,
//           }}
//           className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#E8A476] opacity-10 blur-3xl rounded-full"
//         />
//       </div>

//       <div className="flex relative z-10">
//         <Sidebar />

//         <div className="flex-1">
//           <Header />

//           <main className="p-8 md:p-12">
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="space-y-8"
//             >
//               {/* Welcome Section */}
//               <motion.div variants={itemVariants} className="space-y-2">
//                 <h1 className="text-4xl font-black">Welcome Back!</h1>
//                 <p className="text-[#B8B8B8]">
//                   Here's what you're working on today
//                 </p>
//               </motion.div>

//               {/* Stats */}
//               <motion.div variants={itemVariants}>
//                 <TaskStats
//                   totalTasks={tasks.length}
//                   completedTasks={
//                     tasks.filter((t) => t.status === "completed").length
//                   }
//                   inProgressTasks={
//                     tasks.filter((t) => t.status === "in-progress").length
//                   }
//                 />
//               </motion.div>

//               {/* Create New Task */}
//               <motion.button
//                 variants={itemVariants}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="w-full bg-gradient-to-r from-[#E8A476] to-[#f1b589] hover:shadow-lg hover:shadow-[#E8A476]/20 text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
//               >
//                 <Plus size={24} />
//                 Create New Task
//               </motion.button>

//               {/* Tasks Section */}
//               <motion.div variants={itemVariants} className="space-y-4">
//                 <h2 className="text-2xl font-bold">Your Tasks</h2>
//                 <div className="grid gap-4">
//                   {tasks.map((task, idx) => (
//                     <motion.div
//                       key={task.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: idx * 0.1 }}
//                     >
//                       <TaskCard task={task} />
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             </motion.div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
