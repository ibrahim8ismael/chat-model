'use client';

import { useState } from 'react';
import Textarea from "@/components/chat/Textarea";
import UserMessage from '@/components/chat/UserMessage';
import AgentMessage from '@/components/chat/AgentMessage';

// Define a type for a single message
interface Message {
  text: string;
  sender: 'user' | 'agent';
  isLoading?: boolean; // To show a typing indicator
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (text: string) => {
    // Add user message to the state
    const userMessage: Message = { text, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Add a loading indicator for the agent's response
    const loadingMessage: Message = { text: '...', sender: 'agent', isLoading: true };
    setMessages(prevMessages => [...prevMessages, loadingMessage]);

    let errorOccurred = false;
    let errorMessage = 'Sorry, something went wrong.';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        errorOccurred = true;
        errorMessage = data.error?.message || 'API request failed with no specific error message.';
      } else {
        // Replace the loading message with the actual response
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          const lastMessageIndex = newMessages.length - 1;
          newMessages[lastMessageIndex] = { text: data.text, sender: 'agent' };
          return newMessages;
        });
      }

    } catch (error: unknown) {
      console.error("Failed to get agent's response:", error);
      errorOccurred = true;
      errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while fetching.';
    }

    if (errorOccurred) {
      // Replace the loading message with an error message
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const lastMessageIndex = newMessages.length - 1;
        newMessages[lastMessageIndex] = { text: `Error: ${errorMessage}`, sender: 'agent' };
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
                    <AgentMessage text={msg.text} isLoading={msg.isLoading} />
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
