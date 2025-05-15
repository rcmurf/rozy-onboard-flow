
import { ChatMessage } from '@/types/onboarding';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ChatBubbleProps {
  message: ChatMessage;
  onSubmit?: (fieldId: string, value: any) => Promise<void>;
  disabled?: boolean;
}

const ChatBubble = ({ message, onSubmit, disabled = false }: ChatBubbleProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('');
  const [showInput, setShowInput] = useState(false);
  const { role, content, formField } = message;
  const isAssistant = role === 'assistant';

  useEffect(() => {
    // Short delay for animation
    const timer = setTimeout(() => {
      setShowInput(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formField) return;

    let value = '';
    switch (formField.type) {
      case 'text':
      case 'textarea':
        value = inputValue;
        break;
      case 'select':
        value = selectValue;
        break;
      case 'submit':
        value = 'confirmed';
        break;
      default:
        value = inputValue;
    }

    if (onSubmit && value) {
      await onSubmit(formField.id, value);
      setInputValue('');
      setSelectValue('');
    }
  };

  return (
    <div className={cn(
      "mb-4 max-w-[80%] animate-fade-in",
      isAssistant ? "mr-auto" : "ml-auto"
    )}>
      <div className={cn(
        "flex items-start",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0",
          isAssistant ? "bg-rozy text-white mr-2" : "bg-gray-200 ml-2"
        )}>
          {isAssistant ? "R" : "U"}
        </div>
        
        <div className={cn(
          "rounded-2xl p-4",
          isAssistant ? "bg-white border border-gray-200" : "bg-rozy text-white"
        )}>
          <div className={cn(
            "text-sm",
            !isAssistant && "text-white"
          )}>
            {content.split('\n').map((text, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>{text}</p>
            ))}
          </div>
          
          {formField && isAssistant && showInput && (
            <form 
              onSubmit={handleSubmit} 
              className="mt-4 animate-bounce-in"
            >
              <div className="mb-3">
                <label 
                  htmlFor={formField.id} 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {formField.label}
                </label>
                
                {formField.type === 'text' && (
                  <input
                    id={formField.id}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={formField.placeholder}
                    required={formField.required}
                    disabled={disabled}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rozy focus:border-transparent"
                  />
                )}
                
                {formField.type === 'textarea' && (
                  <textarea
                    id={formField.id}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={formField.placeholder}
                    required={formField.required}
                    disabled={disabled}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rozy focus:border-transparent"
                  />
                )}
                
                {formField.type === 'select' && formField.options && (
                  <select
                    id={formField.id}
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    required={formField.required}
                    disabled={disabled}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rozy focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    {formField.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <button
                type="submit"
                disabled={disabled || (formField.type !== 'submit' && !inputValue && !selectValue)}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-white rounded-md",
                  "bg-rozy hover:bg-rozy-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rozy",
                  (disabled || (formField.type !== 'submit' && !inputValue && !selectValue)) && "opacity-50 cursor-not-allowed"
                )}
              >
                {formField.type === 'submit' ? 'Submit' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <div className={cn(
        "text-xs text-gray-400 mt-1",
        isAssistant ? "text-left" : "text-right"
      )}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default ChatBubble;
