import React from "react";

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
  xl: "w-24 h-24 text-3xl",
};

const Avatar = ({ src, name = "", size = "md", className = "" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ring-2 ring-indigo-500/30 ${sizeMap[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-bold
        bg-gradient-to-br from-indigo-500 to-purple-600 text-white
        ring-2 ring-indigo-500/30
        ${sizeMap[size]} ${className}
      `}
    >
      {initials || "?"}
    </div>
  );
};

export default Avatar;
