import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, CreditCard, Shield, Mic, Upload, Play, MonitorSmartphone, AlertTriangle, CheckCircle2, Zap, Smartphone, Laptop, Globe } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [theme, setTheme] = useState('charcoal'); // 'charcoal' | 'oled'
  const [enableBlur, setEnableBlur] = useState(true);
  const [verbosity, setVerbosity] = useState(50);
  const [voice, setVoice] = useState('rachel');
  const [isPlaying, setIsPlaying] = useState(false);

  // Apply theme changes to document body
  useEffect(() => {
    if (theme === 'oled') {
      document.body.style.backgroundColor = '#000000';
    } else {
      document.body.style.backgroundColor = '#050505';
    }
    
    if (!enableBlur) {
      document.documentElement.style.setProperty('--glass-blur', '0px');
    } else {
      document.documentElement.style.setProperty('--glass-blur', '16px');
    }
  }, [theme, enableBlur]);

  const handleTestVoice = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto relative bg-transparent p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account, subscription, and AI preferences.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          {[
            { id: 'general', icon: User, label: 'General & Appearance' },
            { id: 'subscription', icon: CreditCard, label: 'Subscription & Quota' },
            { id: 'security', icon: Shield, label: 'Security & Devices' },
            { id: 'ai', icon: Mic, label: 'AI Customization' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                activeTab === tab.id 
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-8">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-medium mb-6">Profile Information</h3>
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-bold border-4 border-[#111]">
                      JD
                    </div>
                    <button className="flex items-center gap-2 text-xs font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors">
                      <Upload className="w-3 h-3" /> Upload Avatar
                    </button>
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                      <input type="text" defaultValue="John Doe" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500/50 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <input type="email" defaultValue="john@example.com" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-purple-500/50 outline-none transition-colors" />
                    </div>
                    <button className="bg-white text-black px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-medium mb-6">Appearance</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Dark Mode Style</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setTheme('charcoal')}
                        className={`flex-1 py-3 rounded-xl border transition-colors flex items-center justify-center gap-2 ${theme === 'charcoal' ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 'bg-[#050505] border-white/10 text-gray-400 hover:text-white'}`}
                      >
                        Deep Charcoal
                      </button>
                      <button 
                        onClick={() => setTheme('oled')}
                        className={`flex-1 py-3 rounded-xl border transition-colors flex items-center justify-center gap-2 ${theme === 'oled' ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 'bg-[#000000] border-white/10 text-gray-400 hover:text-white'}`}
                      >
                        OLED Black
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                    <div>
                      <p className="font-medium text-sm">Glassmorphism Blur</p>
                      <p className="text-xs text-gray-500 mt-0.5">Disable for better performance on older devices.</p>
                    </div>
                    <button 
                      onClick={() => setEnableBlur(!enableBlur)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${enableBlur ? 'bg-purple-500' : 'bg-gray-700'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${enableBlur ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="glass-card p-6 rounded-2xl border-purple-500/30 bg-purple-900/5">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-semibold">Pro Scholar</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500 text-white">Active</span>
                    </div>
                    <p className="text-sm text-gray-400">₹999/month • Next billing date: Oct 24, 2026</p>
                  </div>
                  <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Cancel Plan
                  </button>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white text-black px-5 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm">
                    Manage in Razorpay
                  </button>
                  <button className="glass-card px-5 py-2 rounded-xl font-medium hover:bg-white/10 transition-colors text-sm">
                    Upgrade to Ultimate
                  </button>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" /> Usage Quota
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">YouTube Minutes Processed</span>
                      <span className="font-medium">450 / 1000 mins</span>
                    </div>
                    <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">AI Tutor Words Generated</span>
                      <span className="font-medium">24,500 / 50,000 words</span>
                    </div>
                    <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '49%' }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="glass-card p-6 rounded-2xl border-red-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Unusual Activity Detection</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      We use advanced Browser Fingerprinting to secure your account. If a login occurs from a new device in a different city within 1 hour, we will force an OTP to your email.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full inline-flex">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Protection Active
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">Active Sessions</h3>
                  <button className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10">
                    Sign Out of All Devices
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          MacBook Pro (Current)
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Mumbai, India • Safari • IP: 192.168.1.1</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">iPhone 14 Pro</p>
                        <p className="text-xs text-gray-400 mt-0.5">Delhi, India • Chrome Mobile • 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-xs font-medium text-gray-400 hover:text-white transition-colors">Revoke</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Customization Tab */}
          {activeTab === 'ai' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-medium mb-6">Tutor Personality</h3>
                
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-300 font-medium">AI Verbosity</span>
                    <span className="text-purple-400 font-medium">{verbosity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={verbosity}
                    onChange={(e) => setVerbosity(parseInt(e.target.value))}
                    className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Concise & Direct</span>
                    <span>Detailed & Explanatory</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-medium mb-6">Voice Identity (ElevenLabs)</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Select Voice Model</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'rachel', name: 'Rachel', desc: 'Calm, Professional (American)' },
                        { id: 'drew', name: 'Drew', desc: 'Energetic, News (British)' },
                        { id: 'mim', name: 'Mimi', desc: 'Childish, Animated' },
                        { id: 'fin', name: 'Fin', desc: 'Deep, Authoritative' },
                      ].map(v => (
                        <div 
                          key={v.id}
                          onClick={() => setVoice(v.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-colors ${voice === v.id ? 'bg-purple-500/10 border-purple-500/50' : 'bg-black/30 border-white/5 hover:border-white/20'}`}
                        >
                          <p className={`font-medium text-sm ${voice === v.id ? 'text-purple-400' : 'text-white'}`}>{v.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{v.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Test Current Voice</p>
                        <p className="text-xs text-gray-400 mt-0.5">Listen to a sample before saving.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleTestVoice}
                      disabled={isPlaying}
                      className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {isPlaying ? (
                        <><span className="w-3 h-3 rounded-full bg-black animate-pulse" /> Playing...</>
                      ) : (
                        <><Play className="w-4 h-4" /> Test Voice</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
