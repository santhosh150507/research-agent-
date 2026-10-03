"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Bot, User, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useResearchStore } from "@/store/research";
import { ClaimView } from "@/components/claims/ClaimView";
import { AgentTrace } from "./AgentTrace";
import { cn } from "@/lib/utils";
import { AgentTraceStep, ConversationMessage } from "@/lib/types";

export function ResearchChat() {
  const queryClient = useQueryClient();
  const searchId = useResearchStore((s) => s.search_id);
  const conversationId = useResearchStore((s) => s.conversation_id);
  const setConversationId = useResearchStore((s) => s.setConversationId);
  const applyLiteratureState = useResearchStore((s) => s.applyLiteratureState);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [activeTrace, setActiveTrace] = useState<AgentTraceStep[] | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTrace]);

  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      let cid = conversationId;
      if (!cid) {
        const res = await api.createConversation();
        cid = res.id;
        setConversationId(cid);
      }
      return api.sendMessage(cid, { content: text });
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data.message]);
      setActiveTrace(data.agent_trace || null);
      if (data.literature_state) {
        applyLiteratureState(data.literature_state);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMutation.isPending) return;

    const userMsg: ConversationMessage = {
      role: "user",
      content: input.trim(),
      claims: [],
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setActiveTrace(null);
    sendMutation.mutate(input.trim());
    setInput("");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 border-b bg-card px-4 py-3 shadow-sm z-10 shrink-0">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-sm">Research Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
            <Bot className="h-12 w-12 opacity-20" />
            <p className="text-sm max-w-[200px]">
              Ask questions about the current literature or direct me to perform specific research actions.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-col gap-2 max-w-[90%]",
                msg.role === "user" ? "self-end items-end" : "self-start items-start"
              )}
            >
              <div className={cn(
                "flex items-center gap-2 text-xs text-muted-foreground mb-1",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}>
                {msg.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                {msg.role === "user" ? "You" : "Assistant"}
              </div>
              
              <div className={cn(
                "rounded-lg px-4 py-3 text-sm",
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-foreground border"
              )}>
                {msg.content}
              </div>

              {msg.role === "assistant" && msg.claims && msg.claims.length > 0 && (
                <div className="flex flex-col gap-2 mt-2 w-full min-w-[280px]">
                  {msg.claims.map((claim, cidx) => (
                    <ClaimView key={cidx} claim={claim} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {sendMutation.isPending && (
          <div className="flex items-start gap-2 self-start">
            <Bot className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="rounded-lg border bg-muted px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        {activeTrace && (
          <div className="mt-2 w-full max-w-[90%]">
            <AgentTrace trace={activeTrace} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-card p-3 shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <Textarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask about these papers..."
            className="min-h-[44px] max-h-32 resize-none py-3 pr-10 rounded-full"
            disabled={sendMutation.isPending}
          />
          <Button 
            type="submit" 
            size="icon"
            className="absolute right-1.5 top-1.5 h-8 w-8 rounded-full" 
            disabled={!input.trim() || sendMutation.isPending}
          >
            {sendMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
