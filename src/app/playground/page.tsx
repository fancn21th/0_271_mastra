"use client";
import { MoreHorizontal } from "lucide-react";
export default function PlaygroundPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="border-b border-[#E1E0E7] h-[64px]">
        <div className="w-[800px] mx-auto flex items-center h-full gap-8">
          <div className="w-[56px] font-semibold text-[#1E1D26]">对话</div>
          <div className="flex-1 bg-[#EDF2FF] h-[38px] rounded-xl"></div>
          <div className="w-[40px]">
            <MoreHorizontal />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="h-full w-[800px] mx-auto">
          聊天内容区
        </div>
      </div>
    </div>
  );
}
