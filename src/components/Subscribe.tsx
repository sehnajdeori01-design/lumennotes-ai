import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ArrowLeft, Zap, Shield, Video, CreditCard, Sparkles, BrainCircuit, BookOpen, MessageSquare } from 'lucide-react';

const planDetails: Record<string, any> = {
  starter: {
    name: 'Starter',
    price: '₹0',
    interval: '/month',
    description: 'Perfect for casual learners wanting to test the waters.',
    perks: [
      { icon: Zap, title: '3 Video Processings/mo', desc: 'Convert up to 3 short YouTube lectures per month.' },
      { icon: BookOpen, title: 'Basic Summaries', desc: 'Get standard text summaries of your videos.' },
      { icon: MessageSquare, title: 'Standard AI Chat', desc: 'Ask basic questions about your generated notes.' }
    ],
    buttonText: 'Continue to Dashboard'
  },
  pro: {
    name: 'Pro Scholar',
    price: '₹999',
    interval: '/month',
    description: 'Advanced AI tools for serious students who want to master subjects faster.',
    perks: [
      { icon: Zap, title: 'Unlimited Video Processing', desc: 'No limits on how many lectures you can convert.' },
      { icon: Sparkles, title: 'Advanced Apple-Style Notes', desc: 'Beautifully formatted, structured notes with deep dives.' },
      { icon: BrainCircuit, title: 'Unlimited Flashcards', desc: 'Automatically generate Q&A flashcards for active recall.' },
      { icon: Video, title: 'AI Tutor Video Call Mode', desc: 'Simulated real-time video calls with your AI tutor for deep learning.' }
    ],
    buttonText: 'Confirm & Pay ₹999'
  },
  ultimate: {
    name: 'Ultimate',
    price: '₹1999',
    interval: '/month',
    description: 'Everything unlocked with priority processing and 24/7 support.',
    perks: [
      { icon: Zap, title: 'Everything in Pro', desc: 'All the features of the Pro Scholar plan.' },
      { icon: Shield, title: 'Priority AI Processing', desc: 'Skip the queue. Your videos process 3x faster.' },
      { icon: Sparkles, title: 'Early Access Features', desc: 'Get new AI models and features before anyone else.' },
      { icon: CreditCard, title: '24/7 Priority Support', desc: 'Direct line to our support team for any issues.' }
    ],
    buttonText: 'Confirm & Pay ₹1999'
  }
};

const comparisonFeatures = [
  { name: 'Video Processings', starter: '3/month', pro: 'Unlimited', ultimate: 'Unlimited (Priority)' },
  { name: 'Note Quality', starter: 'Basic', pro: 'Advanced Apple-Style', ultimate: 'Advanced Apple-Style' },
  { name: 'Flashcards', starter: false, pro: true, ultimate: true },
  { name: 'AI Tutor Chat', starter: 'Standard', pro: 'Advanced Context', ultimate: 'Advanced Context' },
  { name: 'Video Call Mode', starter: false, pro: true, ultimate: true },
  { name: 'Support', starter: 'Community', pro: 'Email', ultimate: '24/7 Priority' },
];

export default function Subscribe({ planId, onBack, onConfirm }: { planId: string, onBack: () => void, onConfirm: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'standard' | 'upi'>('standard');
  const [upiId, setUpiId] = useState('');
  const plan = planDetails[planId] || planDetails['starter'];

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (planId !== 'starter') {
      const fetchOrder = async () => {
        try {
          const response = await fetch('/api/razorpay/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ planId }),
          });
          if (response.ok) {
            const data = await response.json();
            setOrderData(data);
          } else {
            console.error("Failed to create order");
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      };
      
      fetchOrder();
    }
  }, [planId]);

  const handleRazorpayPayment = async () => {
    if (planId === 'starter') {
      onConfirm();
      return;
    }
    
    if (paymentMethod === 'upi' && (!upiId || !upiId.includes('@'))) {
      alert('Please enter a valid UPI ID');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order dynamically based on payment method
      const endpoint = paymentMethod === 'upi' ? '/api/razorpay/upi-transaction' : '/api/razorpay/create-order';
      const body = paymentMethod === 'upi' ? { planId, upiId } : { planId };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const newOrderData = await response.json();

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: newOrderData.amount,
        currency: newOrderData.currency,
        name: "LumenNotes AI",
        description: `${planId.toUpperCase()} Subscription`,
        order_id: newOrderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            if (verifyRes.ok) {
              alert("Payment Successful! Welcome to " + planId);
              onConfirm();
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification error.");
          } finally {
            setIsProcessing(false);
          }
        },
        theme: { color: "#6366f1" },
      };

      if (paymentMethod === 'upi') {
        options.prefill = { vpa: upiId };
        options.config = {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [
                  {
                    method: "upi"
                  }
                ]
              }
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: false
            }
          }
        };
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment failed:", response.error);
        alert("Payment failed: " + response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment failed to initialize:", err);
      alert("Payment failed to initialize. Check console.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-y-auto pb-24">
      {/* Navbar */}
      <nav className="px-8 py-6 max-w-5xl mx-auto flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight">LumenNotes AI</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Left Column: Plan Details */}
          <div>
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {plan.name} <span className="text-gradient">Plan</span>
              </h1>
              <p className="text-gray-400 text-lg">{plan.description}</p>
            </div>

            <div className="space-y-6 mb-10">
              <h3 className="text-xl font-semibold border-b border-white/10 pb-4">Feature Breakdown</h3>
              {plan.perks.map((perk: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                    <perk.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">{perk.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Checkout Card */}
          <div className="lg:pl-12">
            <div className="glass-card p-8 rounded-3xl border border-purple-500/30 relative sticky top-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              <h3 className="text-lg font-medium text-gray-400 mb-2">Order Summary</h3>
              <div className="flex items-baseline gap-1 mb-8 border-b border-white/10 pb-8">
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400">{plan.interval}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{plan.name} Subscription</span>
                  <span className="text-white">{plan.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Taxes</span>
                  <span className="text-white">Included</span>
                </div>
                <div className="flex justify-between font-medium pt-4 border-t border-white/10">
                  <span className="text-white">Total Due Today</span>
                  <span className="text-white">{plan.price}</span>
                </div>
              </div>

              {planId !== 'starter' && (
                <div className="mb-8 space-y-4">
                  <h4 className="text-sm font-medium text-gray-400">Payment Method</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('standard')}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        paymentMethod === 'standard' 
                          ? 'bg-purple-500/20 border-purple-500 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" /> Cards / Netbanking
                    </button>
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        paymentMethod === 'upi' 
                          ? 'bg-purple-500/20 border-purple-500 text-white' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <Zap className="w-4 h-4" /> UPI
                    </button>
                  </div>

                  {paymentMethod === 'upi' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2"
                    >
                      <label className="block text-xs text-gray-400 mb-1">Enter UPI ID</label>
                      <input 
                        type="text"
                        placeholder="username@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 text-white"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              <button 
                onClick={handleRazorpayPayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {planId === 'starter' ? 'Go to Dashboard' : <><CreditCard className="w-5 h-5" /> {plan.buttonText}</>}
                  </>
                )}
              </button>
              
              {planId !== 'starter' && (
                <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" /> Secured by Razorpay
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-32"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
            <p className="text-gray-400">See exactly what you're getting with each tier.</p>
          </div>

          <div className="glass-card rounded-3xl overflow-hidden border border-white/10 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-6 font-medium text-gray-400 w-1/4">Feature</th>
                  <th className="p-6 font-medium text-white w-1/4">Starter</th>
                  <th className="p-6 font-medium text-purple-400 w-1/4">Pro Scholar</th>
                  <th className="p-6 font-medium text-white w-1/4">Ultimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonFeatures.map((feat, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-sm text-gray-300">{feat.name}</td>
                    
                    <td className="p-6 text-sm">
                      {typeof feat.starter === 'boolean' ? (
                        feat.starter ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-gray-600" />
                      ) : (
                        <span className="text-gray-400">{feat.starter}</span>
                      )}
                    </td>
                    
                    <td className="p-6 text-sm bg-purple-500/[0.02]">
                      {typeof feat.pro === 'boolean' ? (
                        feat.pro ? <CheckCircle2 className="w-5 h-5 text-purple-400" /> : <XCircle className="w-5 h-5 text-gray-600" />
                      ) : (
                        <span className="text-purple-300 font-medium">{feat.pro}</span>
                      )}
                    </td>
                    
                    <td className="p-6 text-sm">
                      {typeof feat.ultimate === 'boolean' ? (
                        feat.ultimate ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-gray-600" />
                      ) : (
                        <span className="text-white">{feat.ultimate}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
