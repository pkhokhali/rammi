'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Send, Bot, User, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Health, Diet, and Fitness Assistant. I can help you with questions about nutrition, exercise, weight management, and healthy lifestyle habits. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>(`session-${Date.now()}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId.current,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${data.error || 'Failed to get response'}` },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar />
      
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-12 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-6 shadow-premium"
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            AI Health Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant, personalized health, diet, and fitness advice. Ask questions about nutrition, exercise, weight management, and healthy lifestyle habits.
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex-1 bg-white rounded-3xl shadow-premium-lg border border-gray-100 flex flex-col overflow-hidden glass-strong"
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
            <AnimatePresence>
              {messages.map((message, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-start gap-4 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                        : 'bg-gradient-to-br from-accent-500 to-accent-600 text-white'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-6 w-6" />
                    ) : (
                      <Bot className="h-6 w-6" />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex-1 rounded-2xl p-5 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white ml-auto max-w-[75%]'
                        : 'bg-white text-gray-800 border border-gray-100 max-w-[80%]'
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-accent-600" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-5 md:p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about health, diet, or fitness..."
                className="flex-1 px-5 py-4 input-premium text-base"
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold btn-premium min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send</span>
                  </>
                )}
              </motion.button>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-3 w-3" />
              <span>This AI provides general health information only. Consult a healthcare professional for medical advice.</span>
            </motion.p>
          </form>
        </motion.div>

        {/* Quick Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            'Weight loss tips',
            'Healthy breakfast',
            'Cardio exercises',
            'Protein sources',
          ].map((suggestion, idx) => (
            <motion.button
              key={suggestion}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInput(suggestion)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-all font-medium"
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
