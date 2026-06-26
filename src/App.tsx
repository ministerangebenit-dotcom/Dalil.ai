import { useState, useRef, useEffect } from 'react';
import './index.css'

export default function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (query: string) => {
    setMessages(prev => [...prev, `You: ${query}`]);
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [...prev, `Dalil: Here's the procedure for "${query}"...`]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="border-b p-3 flex items-center gap-2">
        <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">D</div>
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
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={msg.startsWith('You:') ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-4 py-3 rounded-2xl ${
                  msg.startsWith('You:') 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-blue-50 text-gray-700'
                }`}>
                  {msg}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-left">
                <div className="inline-block bg-blue-50 px-4 py-3 rounded-2xl">
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
}{/* force rebuild */}


