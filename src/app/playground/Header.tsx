"use client";
import { MoreHorizontal } from "lucide-react";

export function Header() {
  return (
    <div className="w-[800px] mx-auto flex items-center h-full gap-8">
      <div className="w-[56px] font-semibold text-[#1E1D26]">对话</div>
      <div className="flex-1 bg-[#EDF2FF] h-[38px] rounded-xl"></div>
      <div className="w-[40px]">
        <MoreHorizontal />
      </div>
    </div>
  );
}
