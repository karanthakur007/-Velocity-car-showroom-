import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Send, Compass, Sparkles, MapPin, Wine, Milestone } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessage {
  sender: 'user' | 'arthur';
  text: string;
  timestamp: string;
  id: string;
}

export const ConciergeTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        sender: 'arthur',
        text: "Exquisite day, driver. I am Arthur, your personal Velocity master coordinator. I supervise runway transport clearances, track licenses, private heli-transfers, and customized vehicle provisions. How may I customize your driving journey today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: 'welcome'
      }
    ]);
  }, []);

  // Scroll to bottom helper
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const triggerArthurResponse = (userText: string) => {
    setIsTyping(true);

    // Determine the optimal response based on keyword matching
    let arthurReply = "An impeccable request. I am instantly forwarding this to our localized ground crew in your active region. Consider it done, driver.";
    
    const textLower = userText.toLowerCase();
    if (textLower.includes('dom') || textLower.includes('champagne') || textLower.includes('wine')) {
      arthurReply = "Ah, a vintage preference. I have documented your choice. A bottle of vintage Dom Pérignon will be correctly chilled to 6°C and positioned in the built-in holster of your selected supercar upon delivery.";
    } else if (textLower.includes('runway') || textLower.includes('tarmac') || textLower.includes('airport')) {
      arthurReply = "Understood perfectly. I am obtaining tarmac permission and coordinating clearance with private air transport control. Your designated supercar is authorized to pull up directly onto the runway alongside your jet's boarding steps.";
    } else if (textLower.includes('track') || textLower.includes('nürburgring') || textLower.includes('paddock')) {
      arthurReply = "An outstanding athletic choice. Our track liaison is reserving a slot on the Nordschleife circuit, pre-installing high-temp carbon track pads, and establishing telemetry alignment with your personal vehicle. Track hospitality access cards are approved.";
    } else if (textLower.includes('speed') || textLower.includes('convoy') || textLower.includes('police')) {
      arthurReply = "Safety and prestige aligned. I have contacted our VIP tactical transport logistics. Two black support pace vehicles will serve as your forward pace and tail security convoy during your coastal highway touring route.";
    }

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'arthur',
          text: arthurReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          id: Math.random().toString(36).substring(4)
        }
      ]);
    }, 1800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: Math.random().toString(36).substring(4)
    };

    setMessages(prev => [...prev, userMsg]);
    const savedVal = inputVal;
    setInputVal('');
    
    triggerArthurResponse(savedVal);
  };

  const selectQuickRequest = (label: string) => {
    const userMsg: ChatMessage = {
      sender: 'user',
      text: label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: Math.random().toString(36).substring(4)
    };
    setMessages(prev => [...prev, userMsg]);
    triggerArthurResponse(label);
  };

  const quickRequests = [
    { label: "Request chilled vintage champagne in carbon holder", icon: Wine, text: "I request chilled vintage Dom Pérignon champagne in my vehicle." },
    { label: "Arrange direct private runway jet tarmac delivery", icon: MapPin, text: "Please arrange direct private runway tarmac delivery at the airport." },
    { label: "Book a high-speed track racing session at Nürburgring", icon: Compass, text: "I would like to book a private track session on Nürburgring." },
    { label: "Hire custom dual black speed-pace support convoy", icon: Milestone, text: "I require an elite tactical support pace-car convoy." }
  ];

  return (
    <div className="bg-black min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-white flex flex-col" id="concierge-tab-root">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gold-550/10 border border-gold-550/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gold-550 shadow-md">
            <Headphones className="w-6 h-6" />
          </div>
          <span className="font-mono text-gold-550 text-xs tracking-[0.4em] mb-2 block uppercase">
            24/7 DESK OF CO-ORDINATES
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight">
            Master Concierge
          </h1>
          <p className="text-gray-400 text-xs mt-2 max-w-xl mx-auto leading-relaxed">
            Your personal, dedicated coordinator is online. Arthur handles special clearance, beverage requests, personalized tracks, and real-time flight synchronization.
          </p>
        </div>

        {/* Chat window body */}
        <div className="flex-1 min-h-[400px] bg-neutral-950/80 border border-white/5 rounded-2xl flex flex-col shadow-2xl overflow-hidden mb-6">
          {/* Active status head */}
          <div className="p-4 border-b border-white/5 bg-neutral-900/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" 
                  alt="Arthur" 
                  className="w-10 h-10 rounded-xl object-cover border border-gold-550/20"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-950"></span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Arthur Sterling</p>
                <p className="text-[10px] text-gold-550 font-mono tracking-wider uppercase">Senior Paddock Director</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-450 bg-neutral-950 px-3 py-1 rounded-md border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-550 animate-pulse"></span>
              <span>Encrypted Secure Line</span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[420px] min-h-[300px]">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex max-w-lg ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'} flex-col text-left`}
              >
                <span className={`text-[9px] text-gray-500 font-mono mb-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.sender === 'user' ? 'You' : 'Arthur Sterling'} • {msg.timestamp}
                </span>

                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gold-550 text-black font-semibold rounded-tr-none'
                    : 'bg-neutral-900 text-gray-250 border border-white/5 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex mr-auto flex-col text-left max-w-sm">
                <span className="text-[9px] text-gray-500 font-mono mb-1">Arthur Sterling is updating log coordinates...</span>
                <div className="p-3 bg-neutral-900 border border-white/5 rounded-2xl rounded-tl-none flex items-center justify-center space-x-1.5 w-16">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-550 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-550 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-550 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={scrollRef}></div>
          </div>

          {/* Quick actions box */}
          <div className="p-4 border-t border-white/5 bg-neutral-900/30 flex flex-wrap gap-2 text-left">
            {quickRequests.map((req, idx) => {
              const ActionIcon = req.icon;
              return (
                <button
                  key={idx}
                  onClick={() => selectQuickRequest(req.text)}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-neutral-950 border border-white/5 rounded-xl text-[10px] text-gray-300 hover:text-gold-550 hover:border-gold-550/30 transition-all cursor-pointer"
                >
                  <ActionIcon className="w-3.5 h-3.5 text-gold-550" />
                  <span>{req.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-neutral-950 flex gap-2">
            <input
              type="text"
              placeholder="Message your senior coordinator..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold-550"
            />
            <button
              type="submit"
              className="px-5 bg-gold-550 hover:bg-gold-600 text-black rounded-xl transition-all font-bold flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
