"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

const messages = [
  "The secret of getting ahead is getting started.",
  "Your future is created by what you do today, not tomorrow.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "A journey of a thousand miles begins with a single step."
];

export function MotivationalMessage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  if (!message) {
    return null;
  }

  return (
    <Alert className="border-accent/50 bg-accent/10">
      <Lightbulb className="h-4 w-4 text-accent" />
      <AlertTitle className="text-accent">Quote of the Day</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
