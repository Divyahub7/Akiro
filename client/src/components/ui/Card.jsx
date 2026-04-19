import React from "react";

const Card = ({ children, className = "", glass = false, hover = false }) => {
  return (
    <div
      className={`
        rounded-2xl border p-6 transition-all duration-300
        ${glass
          ? "bg-white/5 border-white/10 backdrop-blur-sm"
          : "bg-slate-800/60 border-slate-700/50"
        }
        ${hover ? "hover:border-indigo-500/40 hover:bg-slate-800/80 hover:-translate-y-0.5 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
