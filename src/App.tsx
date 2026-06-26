import { useState, useRef, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { ChatMessage } from './components/chat/ChatMessage';
import { mockFetchResponse } from './data/mock-responses';
import './index.css'

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: any;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (query: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const assistantResponse = mockFetchResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: assistantResponse,
        },
      ]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="border-b p-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">D</div>
        <span className="font-semibold text-lg">Dalil</span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-2 text-center">Your procedural guide for Cameroon</h1>
            <p className="text-muted-foreground mb-4 text-center">
              Ask anything about administrative steps – company registration, taxes, permits...
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex gap-3 mb-6">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <span className="text-sm font-bold">D</span>
                </div>
                <div className="bg-blue-50 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="border-t p-4 bg-white sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          <SearchBar onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
}
