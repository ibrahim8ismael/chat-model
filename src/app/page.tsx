'use client';

import { useState, useRef } from 'react';
import Textarea from "@/components/chat/Textarea";
import UserMessage from '@/components/chat/UserMessage';
import AgentMessage from '@/components/chat/AgentMessage';

// Define a type for a single message
interface Message {
  text: string;
  sender: 'user' | 'agent';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const typeMessage = (fullText: string, messageIndex: number) => {
    let i = 0;
    // Clear any existing interval to prevent overlapping typing effects
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        if (newMessages[messageIndex]) {
          newMessages[messageIndex].text = fullText.substring(0, i);
        }
        return newMessages;
      });

      if (i < fullText.length) {
        i++;
      } else {
        clearInterval(typingIntervalRef.current!); // Clear when done
        typingIntervalRef.current = null;
      }
    }, 20); // Typing speed (milliseconds per character)
  };

  const handleSendMessage = async (text: string) => {
    // 1. Add user message and an empty agent message to the state
    const userMessage: Message = { text, sender: 'user' };
    const agentMessage: Message = { text: '', sender: 'agent' };
    setMessages(prevMessages => [...prevMessages, userMessage, agentMessage]);

    // Get the index of the agent's message (which is the last one added)
    const agentMessageIndex = messages.length + 1; 

    let accumulatedText = ''; // To build the full response for the typewriter effect

    try {
      // 2. Make the API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      // 3. Handle errors from the API
      if (!response.ok || !response.body) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'An unknown error occurred.');
      }

      // 4. Process the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        typeMessage(accumulatedText, agentMessageIndex);
      }

    } catch (error: unknown) {
      console.error("Failed to get agent's response:", error);
      // Clear any ongoing typing effect
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      // Update the agent's message with the error
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        if (newMessages[agentMessageIndex]) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          newMessages[agentMessageIndex].text = `Error: ${errorMessage}`;
        }
        return newMessages;
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-800 text-white">
      {messages.length === 0 ? (
        // Centered layout for empty chat
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-8">
            <span className='text-3xl'>How can i help you today?</span>
          </div>
          <div className="w-full max-w-2xl px-4">
            <Textarea onSendMessage={handleSendMessage} />
          </div>
        </div>
      ) : (
        // Chat view layout
        <>
          <main className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-8 py-4">
              {messages.map((msg, index) => (
                <div key={index}>
                  {msg.sender === 'user' ? (
                    <UserMessage text={msg.text} />
                  ) : (
                    <AgentMessage text={msg.text} />
                  )}
                </div>
              ))}
            </div>
          </main>
          <footer className="p-4">
            <div className="w-full max-w-4xl mx-auto">
              <Textarea onSendMessage={handleSendMessage} />
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
