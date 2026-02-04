"use client";
import { Sender } from "./Sender";
import { Header } from "./Header";
import { MessageList } from "./MessageList";

export default function PlaygroundPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="border-b border-[#E1E0E7] h-[64px]">
        <Header />
      </div>
      <div className="flex-1">
        <div className="h-full w-[800px] mx-auto flex flex-col">
          <div className="flex-1">
            <MessageList />
          </div>
          <div className="pb-6">
            <Sender />
          </div>
        </div>
      </div>
    </div>
  );
}
