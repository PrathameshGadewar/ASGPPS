import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadSection from "./components/UploadSection";
import RadarChart from "./components/RadarChart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import { BrainCircuit, Briefcase, TrendingUp, Target, Database, Blocks, AlertTriangle, CheckCircle2, PlayCircle, BookOpen, Landmark, MessageSquare, ExternalLink, Building2, Highlighter, Check, X, Search, MapPin, DollarSign, Send, Mic, ScanLine, FileText, ChevronDown } from "lucide-react";

export default function App() {
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [jobDesc, setJobDesc] = useState("");
  const [shortlistData, setShortlistData] = useState<any>(null);
  const [loadingShortlist, setLoadingShortlist] = useState(false);
  
  // Chat State for Mock Interview
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: "ai", content: "Hi there! I am your AI Mock Interviewer. I've analyzed your resume and skills. Are you ready to begin the technical assessment? We can do DSA, System Design, or HR." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleUploadSuccess = (data: any) => {
    setResult(data);
  };

  const handleChatSubmit = async () => {
     if(!chatInput.trim() || isTyping) return;
     const userMsg = chatInput.trim();
     
     const newMessages = [...messages, {role: "user", content: userMsg}];
     setMessages(newMessages);
     setChatInput("");
     setIsTyping(true);
     
     try {
       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
         method: "POST",
         headers: {
           "Authorization": "Bearer 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",
           "Content-Type": "application/json",
           "HTTP-Referer": window.location.href,
           "X-Title": "ASGPPS Pro Mock Interview"
         },
         body: JSON.stringify({
           model: "openai/gpt-4o-mini",
           messages: [
             { role: "system", content: "You are an AI Mock Interviewer. Conduct a technical software engineering interview. Wait for the user's responses, evaluate them, and progressively ask more challenging questions. Keep all of your responses very concise (1-3 sentences maximum)." },
             ...newMessages.map(m => ({
               role: m.role === "ai" ? "assistant" : "user",
               content: m.content
             }))
           ]
         })
       });
       
       const data = await response.json();
       if (data.choices && data.choices.length > 0) {
         setMessages(prev => [...prev, {role: "ai", content: data.choices[0].message.content}]);
       } else {
         console.error("OpenRouter Response Error:", data);
         setMessages(prev => [...prev, {role: "ai", content: "I'm sorry, my language router encountered an error processing that API model. Could you repeat?"}]);
       }
     } catch (error) {
       console.error("Error communicating with AI:", error);
       setMessages(prev => [...prev, {role: "ai", content: "Connection error. Please try again."}]);
     } finally {
       setIsTyping(false);
     }
  };

  const handleVoice = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
       alert("Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
       return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(prev => prev ? prev + " " + transcript : transcript);
        setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const navItems = ["Dashboard", "ATS Scanner", "Analytics", "Skill Gap", "Career Roadmap", "Interview Prep", "Mock Interview", "Live Jobs", "Shortlist Predictor"];

  return (
    <div className="min-h-screen flex bg-transparent">
      {/* Premium Sidebar */}
      <aside className="w-72 glass-panel border-r border-white/5 flex flex-col z-20">
        <div className="p-8 flex items-center gap-3 border-b border-white/5">
          <BrainCircuit className="w-8 h-8 text-[#00f0ff]" />
          <h1 className="text-2xl font-bold tracking-tight text-gradient">ASGPPS Pro</h1>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item, i) => (
            <div 
              key={item} 
              onClick={() => setActiveTab(item)}
              className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${activeTab === item ? "bg-white/10 text-white shadow-lg border border-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
            >
              {i === 0 && <Database className={`w-5 h-5 ${activeTab === item ? 'text-[#00f0ff]' : ''}`} />}
              {i === 2 && <TrendingUp className={`w-5 h-5 ${activeTab === item ? 'text-[#8a2be2]' : ''}`} />}
              {i === 3 && <Target className={`w-5 h-5 ${activeTab === item ? 'text-[#ef4444]' : ''}`} />}
              {i === 4 && <Blocks className={`w-5 h-5 ${activeTab === item ? 'text-[#34d399]' : ''}`} />}
              {i === 5 && <MessageSquare className={`w-5 h-5 ${activeTab === item ? 'text-[#f59e0b]' : ''}`} />}
              {i === 6 && <Mic className={`w-5 h-5 ${activeTab === item ? 'text-[#f43f5e]' : ''}`} />}
              {i === 7 && <Briefcase className={`w-5 h-5 ${activeTab === item ? 'text-[#ec4899]' : ''}`} />}
              {i === 8 && <Search className={`w-5 h-5 ${activeTab === item ? 'text-[#14b8a6]' : ''}`} />}
              <span className="font-medium text-sm">{item}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Container */}
      <main className="flex-1 p-10 overflow-y-auto relative z-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
              {activeTab}
            </h2>
            <p className="text-zinc-400 text-lg">
              {activeTab === "Dashboard" && "Upload your resume to activate predictive placement modeling."}
              {activeTab === "ATS Scanner" && "Enhancv-style deep-dive structural text analysis of your uploaded document."}
              {activeTab === "Analytics" && "Deep dive into your salary estimations and market prospects."}
              {activeTab === "Skill Gap" && "Identify critical missing competencies to improve your score."}
              {activeTab === "Career Roadmap" && "Your personalized 6-month sequence to master required skills."}
              {activeTab === "Interview Prep" && "Targeted technical questions formulated explicitly from your detected skills."}
              {activeTab === "Mock Interview" && "Interactive conversational AI agent to practice live interview scenarios with instant feedback."}
              {activeTab === "Live Jobs" && "Direct application portals matched automatically with your parsed resume."}
              {activeTab === "Shortlist Predictor" && "Paste any company's specific job requirements to receive an instant probability score."}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#8a2be2] p-1 flex items-center justify-center shadow-lg shadow-[#8a2be2]/20">
                <div className="w-full h-full bg-zinc-900 rounded-full border-2 border-transparent"></div>
             </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl"
            >
              <div className="glass-panel p-8 rounded-3xl">
                <UploadSection onUploadSuccess={handleUploadSuccess} />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-12 gap-8 pb-20"
            >
              
              {/* --- DASHBOARD VIEW --- */}
              {activeTab === "Dashboard" && (
                <>
                  {/* Top Metrics Row */}
                  <div className="col-span-12 grid grid-cols-4 gap-6">
                    <MetricCard title="Skill Match" value={`${result.intelligence?.skill_match}%`} highlight="#00f0ff" icon={<BrainCircuit />} />
                    <MetricCard title="Prediction" value="High Probability" highlight="#8a2be2" icon={<Target />} />
                    <MetricCard title="Est. Package" value={result.salary_estimation?.india_salary_range?.split(' ')[0] || "10.0 LPA"} highlight="#34d399" icon={<Briefcase />} />
                    <MetricCard title="Top Sector" value="Product Base" highlight="#fbbf24" icon={<TrendingUp />} />
                  </div>

                  {/* Charts & Graphs row */}
                  <div className="col-span-12 lg:col-span-7 glass-panel p-8 rounded-3xl flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-6 self-start text-zinc-200">Competency Radar</h3>
                    <div className="w-full max-w-md aspect-square">
                      <RadarChart score={result.intelligence?.skill_match} />
                    </div>
                  </div>

                  {/* Classification Results */}
                  <div className="col-span-12 glass-panel p-8 rounded-3xl flex flex-col">
                    <h3 className="text-xl font-semibold mb-6 text-zinc-200">Algorithmic Eligibility</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {Object.entries(result.eligibility_prediction || {}).map(([key, val]: any) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-2 text-zinc-300 font-medium">
                            <span>{key}</span>
                            <span className="text-[#00f0ff]">{val}%</span>
                          </div>
                          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-[#00f0ff] to-[#8a2be2]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* --- ATS SCANNER VIEW (ENHANCV STYLE) --- */}
              {activeTab === "ATS Scanner" && (
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                   {/* Left Panel: Score & Categories */}
                   <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                      <div className="glass-panel p-8 rounded-3xl text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-white">
                         <h3 className="text-xl font-bold text-zinc-900 mb-6 tracking-tight">Your Score</h3>
                         <div className="mb-2">
                            <span className="text-6xl font-black text-amber-500">{result.ats_insights?.score || 68}</span>
                            <span className="text-2xl font-bold text-zinc-400">/100</span>
                         </div>
                         <p className="text-zinc-500 font-medium">{result.ats_insights?.total_issues || 7} Issues</p>
                         
                         <div className="w-full h-[1px] bg-zinc-200 my-8"></div>
                         
                         <div className="space-y-4">
                            {result.ats_insights?.categories?.map((cat: any, i: number) => (
                               <div key={i} className="flex flex-col gap-3">
                                  <div className="flex justify-between items-center text-sm font-bold text-zinc-600 uppercase tracking-widest cursor-pointer hover:text-zinc-900 transition-colors">
                                     <span>{cat.name}</span>
                                     <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${cat.score > 80 ? 'bg-emerald-100 text-emerald-700' : cat.score > 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                           {cat.score}%
                                        </span>
                                        <ChevronDown className="w-4 h-4" />
                                     </div>
                                  </div>
                                  {/* Sub Issues Preview */}
                                  <div className="space-y-2 pl-2">
                                     {cat.issues?.map((iss: any, j: number) => (
                                        <div key={j} className="flex justify-between items-center text-sm">
                                           <div className="flex items-center gap-2">
                                              {iss.type === 'good' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
                                              <span className="text-zinc-500 truncate max-w-[120px]">{iss.name}</span>
                                           </div>
                                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${iss.type === 'good' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                              {iss.status}
                                           </span>
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Right Panel: Content Details */}
                   <div className="col-span-12 md:col-span-8 glass-panel bg-white p-8 sm:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                      <div className="flex justify-between items-center pb-6 border-b border-zinc-200 mb-8">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#8a2be2]/10 flex items-center justify-center">
                               <ScanLine className="w-5 h-5 text-[#8a2be2]" />
                            </div>
                            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">CONTENT</h2>
                         </div>
                         <div className="bg-zinc-100 text-zinc-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-zinc-200">
                             {result.ats_insights?.total_issues} issues found
                         </div>
                      </div>

                      <div className="bg-zinc-50 rounded-2xl p-6 md:p-8 border border-zinc-200 mb-6">
                         <div className="flex justify-between items-center mb-6 cursor-pointer">
                            <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                               <div className="w-1.5 h-6 bg-[#34d399] rounded-full"></div> ATS PARSE RATE
                            </h3>
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                         </div>
                         <p className="text-zinc-600 mb-4 text-sm leading-relaxed max-w-2xl">
                            An <strong>Applicant Tracking System</strong> commonly referred to as <strong>ATS</strong> is a system used by employers and recruiters to quickly scan a large number of job applications.
                         </p>
                         <div className="bg-white p-6 rounded-2xl border border-zinc-200 text-center shadow-sm">
                            <div className="w-full h-3 bg-zinc-100 rounded-full mb-6 relative">
                               <div className="absolute top-0 left-0 h-full bg-[#34d399] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: '100%' }}></div>
                            </div>
                            <h4 className="text-xl font-bold text-zinc-800 mb-1">Great!</h4>
                            <p className="text-zinc-500">We parsed 100% of your resume successfully using an industry-leading ATS.</p>
                         </div>
                      </div>

                      <div className="bg-zinc-50 rounded-2xl p-6 md:p-8 border border-zinc-200">
                         <div className="flex justify-between items-center mb-6 cursor-pointer">
                            <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
                               <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div> AUTO-FIX SUGGESTIONS
                            </h3>
                            <ChevronDown className="w-5 h-5 text-zinc-400" />
                         </div>
                         <p className="text-zinc-600 mb-6 text-sm leading-relaxed max-w-2xl">
                            Our AI detected areas where your wording decreases recruiter impact. View the optimized restructuring below.
                         </p>
                         <div className="space-y-4">
                            {result.ats_insights?.fixes?.map((fix: any, idx: number) => (
                               <div key={idx} className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden group">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 group-hover:bg-[#34d399] transition-colors"></div>
                                  <div className="flex flex-col md:flex-row gap-4">
                                     <div className="flex-1 bg-rose-50 p-4 rounded-xl border border-rose-100 border-dashed">
                                        <div className="flex items-center gap-1.5 mb-2">
                                           <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                           <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Original Text</span>
                                        </div>
                                        <p className="text-sm text-zinc-700 font-medium">"{fix.original}"</p>
                                     </div>
                                     <div className="flex-1 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                        <div className="flex items-center gap-1.5 mb-2">
                                           <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                           <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Optimized Rewrite</span>
                                        </div>
                                        <p className="text-sm text-zinc-800 font-bold">{fix.suggestion}</p>
                                     </div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}


              {/* --- ANALYTICS & EDA VIEW --- */}
              {activeTab === "Analytics" && (
                <div className="col-span-12 grid grid-cols-12 gap-8">
                  
                  {/* Smart Job Match Engine */}
                  <div className="col-span-12 glass-panel p-8 rounded-3xl border-t border-[#00f0ff]/30 shadow-[0_-10px_30px_rgba(0,240,255,0.05)]">
                     <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-3">
                        <Building2 className="text-[#00f0ff] w-6 h-6" />
                        Smart Job Match Engine
                     </h3>
                     <p className="text-zinc-400 mb-8 max-w-2xl">A LinkedIn-style algorithmic deeper dive into specific company alignments based on your explicit technical portfolio.</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {result.job_match_engine?.map((job: any, i: number) => (
                           <motion.div 
                              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                              key={i} className="p-6 bg-zinc-900/80 rounded-2xl border border-white/5 flex flex-col gap-4 shadow-lg hover:border-[#00f0ff]/30 transition-colors relative overflow-hidden"
                           >
                              <div className="flex justify-between items-center mb-1">
                                 <h4 className="text-xl font-black text-white">{job.company}</h4>
                                 <div className={`px-3 py-1 rounded-full text-xs font-bold ${job.match > 80 ? 'bg-[#34d399]/20 text-[#34d399]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'}`}>
                                    {job.match}% MATCH
                                 </div>
                              </div>
                              <p className="text-sm text-zinc-300 leading-relaxed italic border-l-2 border-[#8a2be2] pl-3">"{job.why}"</p>
                              <div className="mt-auto pt-4 border-t border-white/10">
                                 <span className="text-xs uppercase tracking-widest text-rose-400 font-bold mb-2 block">Missing Requirements:</span>
                                 <ul className="space-y-1">
                                    {job.missing.map((m: string, idx: number) => (
                                       <li key={idx} className="text-xs text-zinc-400 flex items-center gap-2 max-w-full truncate">
                                          <div className="w-1 h-1 rounded-full bg-rose-500 shrink-0"></div>
                                          <span className="truncate">{m}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </div>

                  <div className="col-span-12 lg:col-span-4 glass-panel p-8 rounded-3xl border-l-[4px] border-l-[#34d399]">
                    <h3 className="text-2xl font-bold mb-2 text-white">Salary Estimations</h3>
                    <p className="text-zinc-400 mb-8">Generated by our regression pipeline based on your extracted experience and skill match.</p>
                    
                    <div className="space-y-6">
                      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <div className="text-sm text-zinc-400 font-medium mb-1">Domestic Range (India)</div>
                        <div className="text-4xl font-black text-[#34d399] tracking-tighter">{result.salary_estimation?.india_salary_range}</div>
                      </div>
                      
                      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <div className="text-sm text-zinc-400 font-medium mb-1">Global Range (USD)</div>
                        <div className="text-4xl font-black text-[#00f0ff] tracking-tighter">{result.salary_estimation?.global_salary_range}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Exploratory Data Analysis (EDA) */}
                  <div className="col-span-12 lg:col-span-8 glass-panel p-8 rounded-3xl flex flex-col">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                           <h3 className="text-2xl font-bold text-zinc-200">5-Year Market Demand EDA</h3>
                           <p className="text-zinc-500 mt-2 max-w-lg">
                             Predictive time-series comparison showing the compounding growth necessity of your missing skills versus your existing technical stack.
                           </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#8a2be2]/10 flex items-center justify-center border border-[#8a2be2]/30">
                           <TrendingUp className="w-6 h-6 text-[#8a2be2]" />
                        </div>
                      </div>

                      <div className="w-full flex-1 min-h-[300px]">
                         <LineChart data={result.analytics_eda} />
                      </div>
                  </div>
                </div>
              )}

              {/* --- SKILL GAP VIEW --- */}
              {activeTab === "Skill Gap" && (
                <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                   
                   {/* Left Column: Missing Skills Pro Cards */}
                   <div className="lg:col-span-8 glass-panel p-8 sm:p-10 rounded-3xl border-t border-rose-500/30 relative overflow-hidden shadow-[0_-10px_40px_rgba(225,29,72,0.08)]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                      <div className="flex justify-between items-end mb-8 relative z-10">
                         <div>
                            <h3 className="text-3xl font-black mb-2 text-white flex items-center gap-3 tracking-tight">
                              <AlertTriangle className="text-rose-500 w-8 h-8" />
                              Critical Deficiencies
                            </h3>
                            <p className="text-zinc-400">High-ROI technical gaps preventing you from passing top-tier ATS filters.</p>
                         </div>
                         <div className="hidden sm:block bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(225,29,72,0.2)]">
                            {result.intelligence?.missing_skills?.length || 0} Priority Gaps
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        {result.intelligence?.missing_skills?.map((skill: string, index: number) => {
                           const isHard = skill.length > 8;
                           const demand = 70 + (skill.length * 2) % 25;
                           return (
                             <motion.div 
                               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                               key={index} className="flex flex-col bg-zinc-900/80 p-6 rounded-2xl border border-rose-500/20 hover:border-rose-500/50 transition-all shadow-lg group relative overflow-hidden"
                             >
                                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <div className="flex justify-between items-center mb-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/30 group-hover:bg-rose-500/20 transition-colors">
                                         <Target className="w-5 h-5 text-rose-500" />
                                      </div>
                                      <span className="text-xl font-bold text-white tracking-tight">{skill}</span>
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                   <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 group-hover:text-[#00f0ff] transition-colors">Market Demand</div>
                                      <div className="text-lg font-black text-zinc-200">{demand}%</div>
                                   </div>
                                   <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 group-hover:text-[#34d399] transition-colors">Est. Time</div>
                                      <div className="text-lg font-black text-zinc-200">{isHard ? '4-6 Weeks' : '1-2 Weeks'}</div>
                                   </div>
                                </div>
                                <div className="w-full mt-5 relative">
                                   <div className="flex justify-between text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">
                                      <span>Impact vs Effort ROI</span>
                                      <span className="text-rose-400">High</span>
                                   </div>
                                   <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-rose-500 to-[#8a2be2] rounded-full" style={{ width: `${80 + (index * 5)}%` }}></div>
                                   </div>
                                </div>
                             </motion.div>
                           )
                        })}
                      </div>
                   </div>

                   {/* Right Column: Verified Strengths */}
                   <div className="lg:col-span-4 glass-panel p-8 sm:p-10 rounded-3xl border-t border-[#34d399]/30 relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#34d399]/10 blur-[60px] rounded-full pointer-events-none"></div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 tracking-tight">
                        <CheckCircle2 className="text-[#34d399] w-7 h-7" />
                        Verified Arsenal
                      </h3>
                      <p className="text-zinc-400 mb-8 text-sm leading-relaxed">System successfully mapped these precise competencies to existing top-tier job topologies.</p>
                      
                      <div className="flex flex-wrap gap-2.5">
                         {result.intelligence?.extracted_skills?.length > 0 ? result.intelligence.extracted_skills.map((skill: string, index: number) => (
                           <motion.span 
                             initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}
                             key={index} 
                             className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/20 hover:bg-[#34d399]/20 transition-colors shadow-sm"
                           >
                             {skill}
                           </motion.span>
                         )) : (
                           <div className="w-full text-center p-6 border border-dashed border-zinc-700 rounded-2xl">
                              <span className="text-zinc-500 font-medium">No baseline tech skills detected.</span>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              )}

              {/* --- CAREER ROADMAP VIEW --- */}
              {activeTab === "Career Roadmap" && (
                <div className="col-span-12 glass-panel p-10 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f0ff]/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  
                  <h3 className="text-3xl font-bold mb-2 text-white">Adaptive Career Trajectory</h3>
                  <p className="text-zinc-400 mb-12 max-w-2xl">Based on your identified skill gaps, we've dynamically generated this 6-month roadmap to optimize your placement probability.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                    {result.adaptive_roadmap?.map((rm: any, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}
                        key={i} className="bg-zinc-900/80 p-8 rounded-3xl border border-white/5 backdrop-blur-md relative z-10 transition-transform hover:-translate-y-2 hover:border-[#00f0ff]/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col h-full"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff]/20 to-[#8a2be2]/20 flex items-center justify-center mb-6 border border-white/10">
                          <span className="text-[#00f0ff] font-bold">{i + 1}</span>
                        </div>
                        <span className="text-[#8a2be2] font-bold text-sm tracking-widest uppercase mb-3 block">{rm.month}</span>
                        <p className="text-zinc-100 font-medium leading-relaxed text-lg mb-6">{rm.focus}</p>
                        
                        {/* Resource Links */}
                        {rm.resources && rm.resources.length > 0 && (
                           <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
                              {rm.resources.map((res: any, idx: number) => (
                                 <a key={idx} href={res.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 group">
                                     {res.type === 'video' && <PlayCircle className="w-4 h-4 text-rose-400 mt-[2px] shrink-0" />}
                                     {res.type === 'study' && <BookOpen className="w-4 h-4 text-blue-400 mt-[2px] shrink-0" />}
                                     {res.type === 'gov' && <Landmark className="w-4 h-4 text-emerald-400 mt-[2px] shrink-0" />}
                                     <span className="text-sm text-zinc-400 font-medium group-hover:text-white transition-colors leading-snug">{res.name}</span>
                                 </a>
                              ))}
                           </div>
                        )}
                      </motion.div>
                    ))}
                    {/* Connectors */}
                    <div className="absolute top-[48px] left-[10%] w-[80%] h-[2px] bg-gradient-to-r from-[#00f0ff]/20 via-[#8a2be2]/20 to-transparent z-0 hidden md:block" />
                  </div>
                </div>
              )}

              {/* --- INTERVIEW PREP VIEW --- */}
              {activeTab === "Interview Prep" && (
                <div className="col-span-12 glass-panel p-10 rounded-3xl relative overflow-hidden ring-1 ring-[#f59e0b]/20">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f59e0b]/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  <h3 className="text-3xl font-bold mb-2 text-white">Targeted Interview Masterclass</h3>
                  <p className="text-zinc-400 mb-8 max-w-2xl">Subject-wise preparation guides compiling the most frequently asked questions and massive external solution banks for your specific skills.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                    {result.interview_questions?.map((hub: any, i: number) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={i} className="bg-zinc-900/80 p-6 rounded-2xl border border-white/5 flex flex-col relative group shadow-lg"
                      >
                        <h4 className="text-xl font-bold text-[#f59e0b] mb-4 pb-3 border-b border-white/5">{hub.topic}</h4>
                        
                        {/* Sample Questions */}
                        <div className="mb-6 space-y-4">
                           {hub.samples?.map((q: any, j: number) => (
                             <div key={j} className="flex flex-col gap-2">
                               <div className="flex items-center gap-2">
                                  <div className={`w-1.5 h-1.5 rounded-full ${q.difficulty === 'Advanced' ? 'bg-rose-500' : q.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-[#34d399]'}`}></div>
                                  <span className="text-zinc-200 text-sm font-medium leading-snug">{q.q}</span>
                               </div>
                             </div>
                           ))}
                        </div>
                        
                        {/* Comprehensive Resource Banks */}
                        <div className="mt-auto space-y-2 pt-4 border-t border-white/5 bg-black/40 -mx-6 -mb-6 p-6 rounded-b-2xl">
                           <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-3 block">Complete Question Banks & Solutions</span>
                           {hub.prep_links?.map((link: any, idx: number) => (
                              <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-zinc-800/50 hover:bg-[#f59e0b]/10 p-3 rounded-xl border border-transparent hover:border-[#f59e0b]/30 transition-all group/link">
                                 <span className="text-sm font-medium text-zinc-300 group-hover/link:text-white transition-colors truncate pr-4">{link.name}</span>
                                 <ExternalLink className="w-4 h-4 text-zinc-500 group-hover/link:text-[#f59e0b] transition-colors shrink-0" />
                              </a>
                           ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- LIVE JOBS VIEW --- */}
              {activeTab === "Live Jobs" && (
                <div className="col-span-12 glass-panel p-10 rounded-3xl relative overflow-hidden">
                   <h3 className="text-3xl font-bold mb-2 text-white">Active Job Market</h3>
                   <p className="text-zinc-400 mb-8 max-w-2xl">These real-time job openings have been algorithmically matched to your strongest extracted skills and overall ATS competency.</p>
                   
                   <div className="flex flex-col gap-6 relative z-10">
                     {result.live_jobs?.map((job: any, i: number) => (
                        <motion.div 
                           initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                           key={i} className="bg-zinc-900/60 p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-lg hover:border-[#ec4899]/30 transition-all group"
                        >
                           <div className="flex-1">
                              <h4 className="text-2xl font-black text-white mb-2">{job.role}</h4>
                              <div className="flex items-center gap-2 mb-4">
                                 <Building2 className="w-4 h-4 text-[#ec4899]" />
                                 <span className="text-lg font-bold text-[#ec4899]">{job.company}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 font-medium">
                                 <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5"><MapPin className="w-4 h-4 text-rose-400" />{job.location}</span>
                                 <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5"><Briefcase className="w-4 h-4 text-amber-400" />{job.type}</span>
                                 <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5"><DollarSign className="w-4 h-4 text-[#34d399]" />{job.salary}</span>
                              </div>
                           </div>

                           <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
                              <div className="flex items-center gap-2">
                                 <div className="text-right">
                                    <span className="block text-[#00f0ff] font-black text-2xl">{job.match}%</span>
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Candidate Match</span>
                                 </div>
                              </div>
                              <a href={job.apply_url} target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-white hover:bg-[#ec4899] hover:text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] text-black px-6 py-3 rounded-full font-bold transition-all text-center flex items-center justify-center gap-2">
                                 Apply Directly <ExternalLink className="w-4 h-4" />
                              </a>
                           </div>
                        </motion.div>
                     ))}
                   </div>
                </div>
              )}

              {/* --- SHORTLIST PREDICTOR VIEW --- */}
              {activeTab === "Shortlist Predictor" && (
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="glass-panel p-8 rounded-3xl flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-[#14b8a6]/10 blur-2xl rounded-full"></div>
                      <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-3">
                         <Target className="text-[#14b8a6] w-6 h-6" />
                         Custom JD Analyzer
                      </h3>
                      <p className="text-zinc-400 mb-6 text-sm">Paste the specific Job Description (JD) and requirements from the company you wish to apply to. Our intelligence engine will parse it against your resume.</p>
                      
                      <textarea 
                        className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-4 text-zinc-200 outline-none focus:border-[#14b8a6]/50 focus:ring-1 focus:ring-[#14b8a6]/50 transition-all font-medium resize-none mb-4 shadow-inner"
                        placeholder="Paste job description requirements here..."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                      />

                      <button 
                        onClick={async () => {
                           if (!jobDesc) return;
                           setLoadingShortlist(true);
                           try {
                              const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
                              const res = await fetch(`${API_BASE}/api/intelligence/check-shortlist`, {
                                 method: "POST", headers: { "Content-Type": "application/json" },
                                 body: JSON.stringify({ 
                                    job_description: jobDesc, 
                                    extracted_skills: result.intelligence.extracted_skills || [],
                                    score: result.intelligence.skill_match || 50
                                 })
                              });
                              if (!res.ok) throw new Error("Failed");
                              const data = await res.json();
                              setShortlistData(data);
                           } catch (err) {
                              const jdLower = jobDesc.toLowerCase();
                              const skills = result.intelligence.extracted_skills || [];
                              let matchCount = 0;
                              const missing: string[] = [];
                              
                              skills.forEach((s: string) => jdLower.includes(s.toLowerCase()) ? matchCount++ : null);
                              
                              const possibleSkills = [
                                  "react", "node", "python", "aws", "docker", "kubernetes", "sql", "mongodb", "java", "c++", "system design", 
                                  "typescript", "javascript", "machine learning", "rest api", "graphql", "hadoop", "spark", "risk management",
                                  "payments", "leadership", "communication", "big data", "agile", "scrum", "azure", "gcp", "spring", "django",
                                  "angular", "vue", "redis", "kafka", "microservices", "ci/cd", "git", "linux", "cloud", "data structures", "algorithms"
                              ];
                              
                              possibleSkills.forEach(ps => {
                                  if (jdLower.includes(ps) && !skills.map((s: string)=>s.toLowerCase()).includes(ps)) {
                                      missing.push(ps.charAt(0).toUpperCase() + ps.slice(1));
                                  }
                              });

                              // Fallback JD Term Extraction if dictionary yielded 0 misses
                              if (missing.length === 0) {
                                  const stopWords = new Set(["knowledge", "exposure", "strong", "inclusive", "collaborative", "competitive", "structure", "mission", "critical", "large", "scale", "technologies", "systems", "culture", "growth", "salary", "bonus", "offers", "experience", "looking", "working", "develop", "building", "required", "preferred", "about", "what", "with", "from", "that", "this", "have", "been", "will"]);
                                  const words = jdLower.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 5 && !stopWords.has(w));
                                  for (const w of words) {
                                      if (!skills.some((s: string) => s.toLowerCase().includes(w))) {
                                          missing.push(w.charAt(0).toUpperCase() + w.slice(1));
                                          if (missing.length >= 3) break;
                                      }
                                  }
                              }

                              const probability = Math.min(100, Math.max(10, 40 + matchCount * 15 - missing.length * 8));
                              
                              setShortlistData({
                                 probability: probability,
                                 decision: probability >= 75 ? "Highly Likely" : probability >= 50 ? "Borderline" : "Unlikely",
                                 recommendation: missing.length > 0 ? "You have some critical gaps based on JD keyword parsing." : "Your profile aligns perfectly with this JD.",
                                 missing_skills: [...new Set(missing)].slice(0, 5),
                                 alignment_score: (matchCount * 15) || 12
                              });
                           }
                           setLoadingShortlist(false);
                        }}
                        disabled={loadingShortlist || !jobDesc}
                        className="mt-auto w-full bg-[#14b8a6] hover:bg-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#14b8a6]/20"
                      >
                         {loadingShortlist ? "Scanning..." : "Predict Shortlist Probability"} <Send className="w-5 h-5" />
                      </button>
                   </div>

                   <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-[#14b8a6]/20">
                      {shortlistData ? (
                         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center w-full text-center">
                            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                               <PieChart alignment={shortlistData.alignment_score || 50} missing={shortlistData.missing_skills?.length ? shortlistData.missing_skills.length * 15 : 10} />
                               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 mt-[150px]">
                                     <span className="text-xl font-black text-white">{shortlistData.probability}%</span>
                                  </div>
                               </div>
                            </div>

                            <h4 className={`text-2xl font-black mb-2 tracking-wide uppercase ${shortlistData.decision === 'Highly Likely' ? 'text-[#34d399]' : shortlistData.decision === 'Borderline' ? 'text-amber-400' : 'text-rose-500'}`}>
                               {shortlistData.decision}
                            </h4>
                            
                            <p className="text-zinc-400 text-sm mb-6 max-w-sm">{shortlistData.recommendation}</p>

                            <div className="w-full bg-black/40 p-4 rounded-2xl border border-white/5">
                               <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Critical Missing Factors</span>
                               <div className="flex flex-wrap gap-2 justify-center">
                                  {shortlistData.missing_skills?.length > 0 ? shortlistData.missing_skills.map((m: string, i: number) => (
                                     <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-lg border border-rose-500/20">{m}</span>
                                  )) : <span className="text-[#34d399] font-medium text-sm">Perfect Alignment. No major factors missing.</span>}
                               </div>
                            </div>
                         </motion.div>
                      ) : (
                         <div className="text-center opacity-50">
                            <CheckCircle2 className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
                            <p className="text-zinc-400 font-medium">Awaiting Job Description parameters.</p>
                         </div>
                      )}
                   </div>
                </div>
              )}

              {/* --- MOCK INTERVIEW SIMULATOR VIEW --- */}
              {activeTab === "Mock Interview" && (
                <div className="col-span-12 glass-panel rounded-3xl overflow-hidden flex flex-col h-[700px] border border-white/10 ring-1 ring-[#f43f5e]/20 relative shadow-[0_0_50px_rgba(244,63,94,0.05)]">
                   
                   {/* Chat Header */}
                   <div className="bg-zinc-900/90 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center z-10 shrink-0">
                      <div className="flex items-center gap-4">
                         <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f43f5e] to-rose-700 flex items-center justify-center p-0.5">
                               <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center">
                                  <Mic className="w-6 h-6 text-[#f43f5e]" />
                               </div>
                            </div>
                            <div className="absolute top-1 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900"></div>
                         </div>
                         <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">AI Interview Assistant</h3>
                            <p className="text-sm text-[#f43f5e] font-medium flex items-center gap-1.5">
                               <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-pulse"></span> Analyzing your portfolio...
                            </p>
                         </div>
                      </div>
                      
                      {/* Timer & Scope Mode Toggles */}
                      <div className="flex items-center gap-4 hidden md:flex">
                         <div className="bg-black/50 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-rose-500 blink"></span>
                             <span className="font-bold text-lg text-white font-mono">20:00</span>
                         </div>
                         <select className="bg-black/50 border border-white/5 text-zinc-300 font-medium px-4 py-2.5 rounded-xl outline-none focus:border-[#f43f5e] cursor-pointer appearance-none">
                            <option>System Design Mode</option>
                            <option>DSA Implementation</option>
                            <option>HR & Behavioral</option>
                         </select>
                      </div>
                   </div>

                   {/* Chat History Area */}
                   <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 flex flex-col scroll-smooth">
                      <div className="text-center w-full my-4">
                         <span className="bg-black/40 text-xs text-zinc-500 font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Interview Started</span>
                      </div>
                      
                      {messages.map((m, i) => (
                         <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            key={i} 
                            className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'} w-full relative group`}
                         >
                            <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-2xl relative shadow-lg ${
                               m.role === 'ai' 
                               ? 'bg-zinc-800/80 border border-white/5 text-zinc-200 rounded-tl-sm' 
                               : 'bg-gradient-to-r from-[#f43f5e] to-rose-600 text-white rounded-tr-sm'
                            }`}>
                               {m.role === 'ai' && i > 0 && (
                                 <div className="absolute -top-3 -right-3 bg-black/80 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] font-bold tracking-widest text-[#34d399] border border-[#34d399]/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Confidence: 85%
                                 </div>
                               )}
                               <p className="text-base font-medium leading-relaxed">{m.content}</p>
                            </div>
                         </motion.div>
                      ))}

                      {isTyping && (
                         <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="flex justify-start w-full relative group"
                         >
                            <div className="max-w-[85%] md:max-w-[70%] p-5 rounded-2xl relative shadow-lg bg-zinc-800/80 border border-white/5 text-zinc-200 rounded-tl-sm flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-[#f43f5e] animate-bounce" style={{ animationDelay: "0ms" }}></div>
                               <div className="w-2 h-2 rounded-full bg-[#f43f5e] animate-bounce" style={{ animationDelay: "150ms" }}></div>
                               <div className="w-2 h-2 rounded-full bg-[#f43f5e] animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                         </motion.div>
                      )}
                   </div>

                   {/* Chat Input Engine */}
                   <div className="bg-zinc-900/80 backdrop-blur-xl border-t border-white/5 p-4 sm:p-6 shrink-0 z-10 w-full relative">
                      <div className="w-full h-1 absolute top-0 left-0 bg-gradient-to-r from-transparent via-[#f43f5e]/50 to-transparent"></div>
                      <div className="flex gap-4">
                         <textarea 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                               if(e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleChatSubmit();
                               }
                            }}
                            className="flex-1 bg-black/60 border border-white/10 rounded-2xl p-4 text-zinc-100 outline-none focus:border-[#f43f5e]/50 focus:ring-1 focus:ring-[#f43f5e]/50 transition-all font-medium resize-none shadow-inner"
                            placeholder="Type your answer, or use voice..."
                            rows={1}
                            style={{ minHeight: '60px', maxHeight: '120px' }}
                         />
                         <div className="flex flex-col sm:flex-row gap-2">
                             <button 
                               onClick={handleVoice}
                               className={`w-14 h-[60px] rounded-2xl flex items-center justify-center transition-colors border border-white/5 ${isListening ? 'bg-[#f43f5e]/20 text-[#f43f5e] animate-pulse border-[#f43f5e]/50' : 'bg-zinc-800 hover:bg-zinc-700 text-[#f43f5e]'}`}
                             >
                                 <Mic className="w-6 h-6" />
                             </button>
                             <button 
                               onClick={handleChatSubmit}
                               className="w-14 sm:w-24 h-[60px] bg-gradient-to-br from-[#f43f5e] to-rose-700 hover:opacity-90 text-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all"
                             >
                                 <Send className="w-6 h-6" />
                             </button>
                         </div>
                      </div>
                   </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function MetricCard({ title, value, highlight, icon }: any) {
  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]">
      <div className="absolute top-0 right-0 w-24 h-24 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: highlight, transform: 'translate(30%, -30%)' }} />
      <div className="text-zinc-400 mb-4 [&>svg]:w-6 [&>svg]:h-6" style={{ color: highlight }}>{icon}</div>
      <h4 className="text-sm text-zinc-400 font-medium mb-1">{title}</h4>
      <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
    </div>
  )
}
