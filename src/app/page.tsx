'use client';

import { useState } from 'react';
import Textarea from "@/components/chat/Textarea";
import Logo from '@/components/ui/Logo';

// Define a type for a single message
interface Message {
  text: string;
  sender: 'user' | 'agent';
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (text: string) => {
    // Add user message to the state
    setMessages(prevMessages => [...prevMessages, { text, sender: 'user' }]);
    
    // Here you would typically call an API to get the agent's response
    // For now, we can simulate a response
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: `Echo: ${text}`, sender: 'agent' }]);
    }, 1000);
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
            <div className="flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-lg ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-zinc-700'}`}>
                    {msg.text}
                  </div>
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
