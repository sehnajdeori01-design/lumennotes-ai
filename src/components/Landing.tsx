import { useRef } from 'react';

import { motion, Variants } from 'motion/react';

import { Sparkles, BookOpen, BrainCircuit, Mic, ShieldAlert, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Landing({ onEnter, onSubscribe, onLogin }: { onEnter: () => void, onSubscribe: (planId: string) => void, onLogin: () => void }) {

  const pricingRef = useRef<HTMLDivElement>(null);

  const scrollToPricing = () => {

    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });

  };

  const titleText = "Transform Lectures Into Mastery.";

  const words = titleText.split(" ");

  const container: Variants = {

    hidden: { opacity: 0 },

    visible: (i = 1) => ({

      opacity: 1,

      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },

    }),

  };

  const child: Variants = {

    visible: {

      opacity: 1,

      y: 0,

      transition: {

        type: "spring",

        damping: 12,

        stiffness: 100,

      },

    },

    hidden: {

      opacity: 0,

      y: 20,

      transition: {

        type: "spring",

        damping: 12,

        stiffness: 100,

      },

    },

  };



  return (

    <div className="relative overflow-hidden">

      {/* Background Glows */}

      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />



      {/* Navbar */}

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">

        <div className="flex items-center gap-2">

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">

            <Sparkles className="w-4 h-4 text-white" />

          </div>

          <span className="font-semibold text-lg tracking-tight">LumenNotes AI</span>

        </div>

        <div className="flex items-center gap-6">

          <button onClick={scrollToPricing} className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</button>

          <button onClick={onLogin} className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</button>

          <button

            onClick={onEnter}

            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"

          >

            Get Started

          </button>

        </div>

      </nav>



      {/* Hero Section */}

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-5xl mx-auto">

        <motion.div

          initial={{ opacity: 0, scale: 0.95 }}

          animate={{ opacity: 1, scale: 1 }}

          transition={{ duration: 0.8, ease: "easeOut" }}

          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card mb-8"

        >

          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />

          <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">LumenNotes AI 1.0 is live</span>

        </motion.div>



        <motion.div

          style={{ display: "flex", overflow: "hidden", flexWrap: "wrap", justifyContent: "center" }}

          variants={container}

          initial="hidden"

          animate="visible"

          className="mb-6"

        >

          {words.map((word, index) => (

            <motion.span

              variants={child}

              style={{ marginRight: index === words.length - 1 ? "0" : "1.5vw" }}

              key={index}

              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-gradient pb-2"

            >

              {word}

            </motion.span>

          ))}

        </motion.div>



        <motion.p

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.8, delay: 0.6 }}

          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 font-light"

        >

          The ultimate AI study assistant. Convert YouTube lectures into structured notes, generate flashcards, and learn with an interactive AI tutor.

        </motion.p>



        <motion.div

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.8, delay: 0.8 }}

          className="flex flex-col sm:flex-row items-center gap-4"

        >

          <button

            onClick={onEnter}

            className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:scale-105 transition-all duration-300"

          >

            Start Learning Free

            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

          </button>

          <button

            onClick={scrollToPricing}

            className="flex items-center gap-2 glass-card text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-all duration-300"

          >

            View Pricing

          </button>

        </motion.div>



        {/* Features Grid */}

        <motion.div

          initial={{ opacity: 0, y: 40 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 1, delay: 1.2 }}

          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left"

        >

          {[

            { icon: BookOpen, title: "Smart Notes", desc: "Instantly convert any YouTube lecture into beautifully structured Apple-style notes." },

            { icon: BrainCircuit, title: "AI Tutor", desc: "Chat with your notes or enter simulated video-call teaching mode for deep learning." },

            { icon: ShieldAlert, title: "Secure & Smart", desc: "Advanced unusual activity detection and seamless Razorpay subscriptions." }

          ].map((feature, i) => (

            <div key={i} className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">

              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">

                <feature.icon className="w-6 h-6 text-purple-400" />

              </div>

              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>

              <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>

            </div>

          ))}

        </motion.div>

      </main>



      {/* How it Works Section */}

      <section className="relative z-10 py-32 px-4 max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-3xl md:text-5xl font-bold mb-4">How LumenNotes Works</h2>

          <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to master any subject.</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-indigo-500/0 -translate-y-1/2 z-0" />

          {[

            { step: "01", title: "Paste URL", desc: "Drop any YouTube lecture or tutorial link into the dashboard." },

            { step: "02", title: "AI Processing", desc: "Our models extract transcripts, summarize key points, and build flashcards." },

            { step: "03", title: "Master It", desc: "Review your structured notes or jump into a video call with your AI Tutor." }

          ].map((item, i) => (

            <div key={i} className="relative z-10 glass-card p-8 rounded-3xl text-center">

              <div className="w-16 h-16 mx-auto bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center text-2xl font-bold text-purple-400 mb-6">

                {item.step}

              </div>

              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>

              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>

            </div>

          ))}

        </div>

      </section>



      {/* Pricing Section */}

      <section ref={pricingRef} className="relative z-10 py-32 px-4 max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>

          <p className="text-gray-400 max-w-2xl mx-auto">Invest in your education with our premium AI tools.</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col">
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-bold">₹0</span><span className="text-gray-400">/month</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {["3 Video Processings/mo", "Basic Summaries", "Standard AI Chat"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-4 h-4 text-purple-400" /> {f}</li>
              ))}
            </ul>
            <button onClick={() => onSubscribe('starter')} className="w-full py-3 rounded-xl glass-card hover:bg-white/10 transition-colors font-medium">Get Started</button>
          </div>

          {/* Pro */}
          <div className="glass-card p-8 rounded-3xl border border-purple-500/30 relative flex flex-col transform md:-translate-y-4 bg-purple-900/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
            <h3 className="text-xl font-semibold mb-2">Pro Scholar</h3>
            <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-bold">₹999</span><span className="text-gray-400">/month</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Unlimited Video Processing", "Advanced Apple-Style Notes", "AI Tutor Video Call Mode"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-4 h-4 text-purple-400" /> {f}</li>
              ))}
            </ul>
            <button onClick={() => onSubscribe('pro')} className="w-full py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors font-medium">
              Upgrade to Pro
            </button>
          </div>

          {/* Ultimate */}
          <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col">
            <h3 className="text-xl font-semibold mb-2">Ultimate</h3>
            <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-bold">₹1999</span><span className="text-gray-400">/month</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Everything in Pro", "Priority AI Processing", "24/7 Priority Support"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm"><CheckCircle2 className="w-4 h-4 text-purple-400" /> {f}</li>
              ))}
            </ul>
            <button onClick={() => onSubscribe('ultimate')} className="w-full py-3 rounded-xl glass-card hover:bg-white/10 transition-colors font-medium">
              Get Ultimate
            </button>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm relative z-10">
        <p>© 2026 LumenNotes AI. All rights reserved.</p>
      </footer>
    </div>
  );
}