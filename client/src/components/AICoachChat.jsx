import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Dumbbell, 
  Flame, 
  HelpCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

export default function AICoachChat({ activePlan }) {
  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: `Hey there! I'm Coach Alex, your AI Fitness & Nutrition Strategist powered by Google Gemini. I can help modify exercises for injuries, suggest optimal pre/post-workout fuel, or fine-tune your lifting technique. What's on your mind today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'My lower back is tired, give me alternatives for Romanian Deadlifts.',
    'What should I eat 45 minutes before training for maximum energy?',
    'How do I implement progressive overload with limited dumbbell weights?',
    'I have only 30 minutes today. How should I condense my routine?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isSending) return;

    const userMsg = {
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages.slice(-6),
          message: query.trim(),
          userContext: {
            fitnessGoal: activePlan?.fitnessGoal || 'general fitness',
            fitnessLevel: activePlan?.fitnessLevel || 'intermediate',
            bmi: activePlan?.bmi || 23.5,
            bmiCategory: activePlan?.bmiCategory || 'Normal'
          }
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'coach',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.message || 'Error receiving coach response');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: `I'm having a slight connection blip with the server, but remember: prioritize pristine joint mechanics, lock in your protein target, and hydrate! Try asking again in a moment.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[750px] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Coach Alex AI</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  Gemini Flash 1.5
                </span>
              </div>
              <p className="text-xs text-slate-400">Biomechanics, Injury Prevention & Sports Nutrition Specialist</p>
            </div>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            title="Reset Chat"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex gap-2 scrollbar-none">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300 border border-slate-700/60 transition-all flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/20">
          {messages.map((msg, index) => {
            const isCoach = msg.sender === 'coach';
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${isCoach ? 'justify-start' : 'justify-end'}`}
              >
                {isCoach && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isCoach
                      ? 'bg-slate-800/90 text-slate-200 border border-slate-700/60 shadow-md whitespace-pre-line'
                      : 'bg-emerald-500 text-slate-950 font-medium shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[10px] block mt-1.5 ${isCoach ? 'text-slate-500' : 'text-slate-800'}`}>
                    {msg.time}
                  </span>
                </div>
                {!isCoach && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Coach Alex is formulating your response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Coach Alex about form, substitutions, meal timing..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
