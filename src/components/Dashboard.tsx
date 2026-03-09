import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, BookOpen, Layers, Mic, Settings as SettingsIcon, LogOut, PlayCircle, FileText, Sparkles, Send, Video, MessageSquare, User } from 'lucide-react';
import Markdown from 'react-markdown';
import Settings from './Settings';

export default function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState<any>(null);

  // AI Tutor Chat State
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: "Hi! I'm your LumenNotes AI Tutor. I see you've been studying Quantum Computing. What would you like to review today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleGenerate = async () => {
    if (!url) return;
    setIsProcessing(true);
    setNotes(null); // Clear previous notes
    
    try {
      const response = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate notes');
      }

      setNotes(data);
    } catch (error: any) {
      console.error("Generate error:", error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsTyping(true);
    
    try {
      const context = notes 
        ? JSON.stringify(notes) 
        : "The user hasn't generated any notes yet. Tell them to go to the Dashboard tab and generate notes from a YouTube video first.";
      
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          context: context
        })
      });
      
      const data = await response.json();
      
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.reply || "Sorry, I couldn't process that. Please try again."
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Sorry, I'm having trouble connecting right now. Please try again later."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">LumenNotes</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: "Dashboard" },
            { id: 'notes', icon: BookOpen, label: "My Notes" },
            { id: 'flashcards', icon: Layers, label: "Flashcards" },
            { id: 'tutor', icon: Mic, label: "AI Tutor" },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>
          <button 
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors mt-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#050505]">
        {activeTab === 'dashboard' && (
          <div className="max-w-4xl mx-auto p-8">
            
            <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-2">Create New Notes</h1>
            <p className="text-gray-400">Paste a YouTube URL to generate structured notes and flashcards.</p>
          </header>

          {/* Input Area */}
          <div className="glass-card p-2 rounded-2xl flex items-center gap-2 mb-12">
            <div className="pl-4 text-gray-400">
              <PlayCircle className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 px-2 py-3"
            />
            <button 
              onClick={handleGenerate}
              disabled={!url || isProcessing}
              className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Generate <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Results Area */}
          {notes && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="glass-card p-8 rounded-3xl border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
                
                <h2 className="text-3xl font-bold mb-6 text-gradient">{notes.title}</h2>
                
                <div className="space-y-8 relative z-10">
                  <section>
                    <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Executive Summary
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">{notes.summary}</p>
                  </section>

                  <div className="h-px w-full bg-white/5" />

                  <section>
                    <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Key Lessons
                    </h3>
                    <ul className="space-y-3">
                      {notes.lessons?.map((lesson: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <span className="text-xl leading-none mt-0.5">💡</span>
                          <span className="leading-relaxed">{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="h-px w-full bg-white/5" />

                  <section>
                    <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Deep Dive
                    </h3>
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-gray-300 leading-relaxed">{notes.deepDive}</p>
                    </div>
                  </section>

                  <section>
                     <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">
                      Actionable Steps
                    </h3>
                    <div className="flex items-center gap-3 bg-indigo-500/10 text-indigo-200 p-4 rounded-xl border border-indigo-500/20">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      <p>{notes.actionable}</p>
                    </div>
                  </section>
                </div>
              </div>

              {/* Flashcards */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  Generated Flashcards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notes.flashcards?.map((card: any, i: number) => (
                    <div key={i} className="glass-card p-6 rounded-2xl group cursor-pointer hover:bg-white/5 transition-colors">
                      <p className="text-sm text-purple-400 font-medium mb-2">Q: {card.q}</p>
                      <p className="text-gray-300 group-hover:text-white transition-colors">A: {card.a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

        </div>
        )}

        {/* AI Tutor Mode */}
        {activeTab === 'tutor' && (
          <div className="flex flex-col h-full bg-[#0a0a0a]">
            {/* Header */}
            <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-[#050505] z-10">
              <div>
                <h1 className="text-2xl font-semibold flex items-center gap-3">
                  <Video className="w-6 h-6 text-purple-400" />
                  AI Tutor Session
                </h1>
                <p className="text-sm text-gray-400 mt-1">Simulated Video Call & Chat</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Connection
              </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Simulated Video Feed Area */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center relative border-r border-white/5 bg-black/50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
                
                <motion.div 
                  animate={{ 
                    scale: isTyping ? [1, 1.05, 1] : 1,
                    boxShadow: isTyping ? "0 0 40px rgba(139, 92, 246, 0.3)" : "0 0 0px rgba(139, 92, 246, 0)"
                  }}
                  transition={{ repeat: isTyping ? Infinity : 0, duration: 2 }}
                  className="w-48 h-48 rounded-full glass-card flex items-center justify-center relative z-10 border border-purple-500/20"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  {isTyping && (
                    <div className="absolute -bottom-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Speaking...
                    </div>
                  )}
                </motion.div>
                <p className="mt-8 text-gray-400 font-medium tracking-widest uppercase text-sm">LumenNotes AI</p>
              </div>

              {/* Chat Interface */}
              <div className="w-full md:w-[400px] lg:w-[500px] flex flex-col bg-[#050505]">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {chatMessages.map((msg, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i} 
                      className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-white/10' : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      }`}>
                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-white" />}
                      </div>
                      <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-white/10 text-white rounded-tr-none' 
                          : 'glass-card border-purple-500/20 text-gray-200 rounded-tl-none'
                      }`}>
                        {msg.role === 'user' ? (
                          msg.content
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
                            <Markdown>{msg.content}</Markdown>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="p-4 rounded-2xl glass-card border-purple-500/20 rounded-tl-none flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask your AI Tutor a question..."
                      className="w-full bg-[#111] border border-white/10 rounded-full pl-6 pr-14 py-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-purple-500/50 transition-colors"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim() || isTyping}
                      className="absolute right-2 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <Settings />
        )}

        {/* Placeholder for other tabs */}
        {(activeTab === 'notes' || activeTab === 'flashcards') && (
          <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-4">
            <BookOpen className="w-12 h-12 opacity-20" />
            <p>Select a video from your dashboard to view {activeTab}.</p>
          </div>
        )}
      </main>
    </div>
  );
}
