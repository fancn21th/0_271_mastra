"use client";
import { useState } from "react";
import { ComposedSender } from "@/components/wuhan/composed/sender";

export function Sender() {
  const [value, setValue] = useState("");
  return (
    <ComposedSender
      value={value}
      onChange={setValue}
      onSend={() => console.log("send", value)}
      placeholder="输入你的需求..."
    />
  );
}
