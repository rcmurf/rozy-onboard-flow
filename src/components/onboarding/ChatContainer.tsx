
import { useRef, useEffect } from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import ChatBubble from './ChatBubble';

const ChatContainer = () => {
  const { messages, submitFormField, isTyping } = useOnboarding();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">Chat with Rozy</h1>
        <p className="text-sm text-gray-500">Your AI onboarding assistant</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              onSubmit={submitFormField}
              disabled={isTyping}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-rozy text-white w-8 h-8 flex items-center justify-center flex-shrink-0 mr-2">
                R
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 inline-block">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
