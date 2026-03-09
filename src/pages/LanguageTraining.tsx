import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Play, Square, Mic, Activity, CheckCircle2, AlertCircle, Eye, Smile, Volume2, AlignLeft } from 'lucide-react';
import { TRAINING_SCRIPTS } from '../data/trainingScripts';

export function LanguageTraining() {
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [spokenText, setSpokenText] = useState('');
  
  const startTimeRef = useRef<number | null>(null);
  const charIndexRef = useRef(0);
  const [readingSpeed, setReadingSpeed] = useState<number | null>(null);
  const [speedFeedback, setSpeedFeedback] = useState<{type: 'success'|'warning', title: string, text: string} | null>(null);
  const [dynamicFeedbacks, setDynamicFeedbacks] = useState<{type: 'success'|'warning', title: string, text: string}[]>([]);

  const currentScriptObj = TRAINING_SCRIPTS[currentScriptIndex];
  const scriptText = currentScriptObj.text;

  // Pre-calculate error indices for fast lookup during render
  const errorIndices = new Set<number>();
  currentScriptObj.errors.forEach(word => {
    let startIndex = scriptText.indexOf(word);
    while (startIndex !== -1) {
      for (let i = 0; i < word.length; i++) {
        errorIndices.add(startIndex + i);
      }
      startIndex = scriptText.indexOf(word, startIndex + 1);
    }
  });

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStopRecording = useCallback(() => {
    setIsRecording(false);
    const start = startTimeRef.current || Date.now();
    const elapsedMinutes = (Date.now() - start) / 60000;
    
    const spokenChars = scriptText.substring(0, charIndexRef.current);
    const actualCharCount = (spokenChars.match(/[\u4e00-\u9fa5a-zA-Z0-9]/g) || []).length;
    const speed = elapsedMinutes > 0 ? Math.round(actualCharCount / elapsedMinutes) : 0;
    
    setReadingSpeed(speed);
    
    let feedbackType: 'success' | 'warning' = 'success';
    let feedbackTitle = '【语速检测】节奏适中';
    let feedbackText = `当前语速为 ${speed} 字/分钟，符合新闻播音 240-350 字/分钟的行业标准，信息传递高效，节奏紧凑。`;
    
    if (speed < 240) {
      feedbackType = 'warning';
      feedbackTitle = '【语速检测】节奏偏慢';
      feedbackText = `当前语速为 ${speed} 字/分钟，低于 240 字/分钟的行业标准。建议适当加快播报节奏，提升信息传递的效率。`;
    } else if (speed > 350) {
      feedbackType = 'warning';
      feedbackTitle = '【语速检测】节奏偏快';
      feedbackText = `当前语速为 ${speed} 字/分钟，高于 350 字/分钟的行业标准。建议适当放慢语速，留出气口，确保观众能清晰接收信息。`;
    }
    
    setSpeedFeedback({ type: feedbackType as 'success' | 'warning', title: feedbackTitle, text: feedbackText });

    // Generate dynamic feedbacks based on errors
    const generatedFeedbacks = [];
    if (currentScriptObj.errors.length > 0) {
      const randomError = currentScriptObj.errors[Math.floor(Math.random() * currentScriptObj.errors.length)];
      generatedFeedbacks.push({
        type: 'warning' as const,
        title: '【发音纠正】易混淆字词',
        text: `系统检测到您在读到“${randomError}”时出现了轻微的吞音或发音不准。请注意口型饱满，咬字清晰。`
      });
      generatedFeedbacks.push({
        type: 'success' as const,
        title: '【语音语调】整体表现',
        text: `在进行${currentScriptObj.type}训练时，您的整体声韵调把握较好，能够较好地控制气息。`
      });
    }
    setDynamicFeedbacks(generatedFeedbacks);

    setTimeout(() => {
      setScore(Math.floor(Math.random() * 10) + 82);
    }, 1000);
  }, [currentScriptObj, scriptText]);

  // Simulate speech recognition
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isRecording) {
      const readNextChar = () => {
        if (charIndexRef.current < scriptText.length) {
          const char = scriptText[charIndexRef.current];
          setSpokenText(prev => prev + char);
          charIndexRef.current++;
          
          let delay = 190; 
          if (['，', '、', '：', '；'].includes(char)) delay = 380;
          else if (['。', '！', '？', '\n'].includes(char)) delay = 550;
          else delay = 170 + Math.random() * 40; 
          
          // Tongue twisters are usually read faster
          if (currentScriptObj.type === '绕口令') {
            delay = delay * 0.85;
          }

          timeoutId = setTimeout(readNextChar, delay);
        } else {
          handleStopRecording();
        }
      };
      
      timeoutId = setTimeout(readNextChar, 180);
    }
    
    return () => clearTimeout(timeoutId);
  }, [isRecording, scriptText, handleStopRecording, currentScriptObj.type]);

  const handleRecordToggle = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      // If we already have a score, cycle to the next script for the new session
      if (score !== null) {
        setCurrentScriptIndex((prev) => (prev + 1) % TRAINING_SCRIPTS.length);
      }
      setIsRecording(true);
      setScore(null);
      setSpeedFeedback(null);
      setDynamicFeedbacks([]);
      setReadingSpeed(null);
      setSpokenText('');
      charIndexRef.current = 0;
      startTimeRef.current = Date.now();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 h-full flex flex-col"
    >
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">技巧语言训练</h2>
        <p className="text-neutral-400">绕口令与易混音专项突破</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Video Feeds & Script */}
        <div className="lg:col-span-7 flex flex-col gap-6 min-h-0">
          <div className="grid grid-cols-2 gap-4">
            {/* Master Video */}
            <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 aspect-video shadow-2xl">
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">标准示范</span>
              </div>
              <img 
                src={`https://picsum.photos/seed/training${currentScriptIndex}/1280/720`} 
                alt="Master Anchor" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="text-sm font-medium text-white mb-1">{currentScriptObj.type} - {currentScriptObj.title}</div>
              </div>
            </div>

            {/* User Camera */}
            <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 aspect-video shadow-2xl">
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 z-10">
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-neutral-500'}`} />
                <span className={`text-xs font-medium ${isRecording ? 'text-red-400' : 'text-neutral-400'}`}>
                  {isRecording ? '实时测评中...' : '准备就绪'}
                </span>
              </div>
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              
              {/* AI Overlay Simulation */}
              {isRecording && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Face tracking box */}
                  <div className="absolute top-1/4 left-1/3 w-1/3 h-1/2 border-2 border-indigo-500/50 rounded-xl flex items-center justify-center">
                    <div className="absolute -top-6 bg-indigo-500/80 text-[10px] px-2 py-0.5 rounded text-white">面部捕捉</div>
                    <div className="w-2 h-2 bg-indigo-500 absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
                    <div className="w-2 h-2 bg-indigo-500 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" />
                    <div className="w-2 h-2 bg-indigo-500 absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
                    <div className="w-2 h-2 bg-indigo-500 absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Script Comparison Area */}
          <div className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm flex flex-col min-h-0">
            <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              训练文本：{currentScriptObj.title}
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <p className="text-xl leading-relaxed font-medium text-neutral-300 whitespace-pre-line">
                {scriptText.split('').map((char, i) => {
                  const isSpoken = i < spokenText.length;
                  const isError = score !== null && errorIndices.has(i);
                  
                  return (
                    <span 
                      key={i} 
                      className={`transition-colors duration-200 ${
                        isError
                          ? 'text-red-400 font-bold underline decoration-red-500/50 decoration-2 underline-offset-4'
                          : isSpoken 
                          ? 'text-white' 
                          : 'text-neutral-600'
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center mt-2">
            <button
              onClick={handleRecordToggle}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all shadow-lg ${
                isRecording 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/25'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5 fill-current" />
                  结束测评
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  {score !== null ? '进行下一段练习' : '开始跟读测评'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Analysis Dashboard */}
        <div className="lg:col-span-5 bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 flex flex-col gap-6 backdrop-blur-sm overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              多维度评分体系
            </h3>
            {score !== null && (
              <div className="text-3xl font-bold text-emerald-400 font-mono">
                {score}<span className="text-sm text-neutral-500 ml-1">分</span>
              </div>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard 
              icon={Volume2} 
              label="语音语调" 
              value={score ? score - 2 : '--'} 
              desc="声韵调、停连、重音"
              color="text-blue-400"
              bg="bg-blue-400/10"
            />
            <MetricCard 
              icon={Eye} 
              label="眼神交流" 
              value={score ? score + 4 : '--'} 
              desc="镜头感、专注度"
              color="text-indigo-400"
              bg="bg-indigo-400/10"
            />
            <MetricCard 
              icon={Smile} 
              label="表情管理" 
              value={score ? score - 5 : '--'} 
              desc="微笑弧度、肌肉紧张度"
              color="text-violet-400"
              bg="bg-violet-400/10"
            />
            <MetricCard 
              icon={Activity} 
              label="语速检测" 
              value={readingSpeed ? readingSpeed : '--'} 
              desc="字/分钟 (标准:240-350)"
              color="text-emerald-400"
              bg="bg-emerald-400/10"
            />
          </div>

          {/* Feedback Section */}
          <div className="flex-1 bg-neutral-950 rounded-2xl p-5 border border-neutral-800/50 mt-2">
            <h4 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">AI 深度纠正建议</h4>
            
            {!score && !isRecording && (
              <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-3 py-8">
                <Mic className="w-8 h-8 opacity-20" />
                <p className="text-sm">点击左侧按钮开始测评</p>
              </div>
            )}

            {isRecording && (
              <div className="space-y-4 py-4">
                <div className="flex items-start gap-3 animate-pulse">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-800 rounded w-3/4" />
                    <div className="h-4 bg-neutral-800 rounded w-1/2" />
                  </div>
                </div>
                {/* Simulated waveform */}
                <div className="flex items-center gap-1 h-8 mt-6 justify-center opacity-50">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: i * 0.05 }}
                      className="w-1.5 bg-indigo-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}

            {score && (
              <div className="space-y-4">
                {speedFeedback && (
                  <FeedbackItem 
                    type={speedFeedback.type} 
                    title={speedFeedback.title}
                    text={speedFeedback.text} 
                  />
                )}
                {dynamicFeedbacks.map((fb, idx) => (
                  <FeedbackItem 
                    key={idx}
                    type={fb.type} 
                    title={fb.title}
                    text={fb.text} 
                  />
                ))}
                
                <div className="mt-6 pt-4 border-t border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-2">波形对比分析</div>
                  <div className="h-12 bg-neutral-900 rounded-lg relative overflow-hidden flex items-center px-2">
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIGQ9Ik0wLDUwIFExMCw0MCAyMCw1MCBUMDAsNTAgVDYwLDUwIFQ4MCw1MCBUMTAwLDUwIiBzdHJva2U9IiNmZmYiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')] bg-cover" />
                    <div className="w-full h-0.5 bg-neutral-700 relative">
                      <div className="absolute left-[20%] w-4 h-4 bg-red-500/20 border border-red-500 rounded-full -top-1.5 flex items-center justify-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                      </div>
                      <div className="absolute left-[65%] w-4 h-4 bg-red-500/20 border border-red-500 rounded-full -top-1.5 flex items-center justify-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ icon: Icon, label, value, desc, color, bg }: any) {
  return (
    <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800/50 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${bg} ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-neutral-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white font-mono mt-1">{value}</div>
      <div className="text-[10px] text-neutral-500">{desc}</div>
    </div>
  );
}

function FeedbackItem({ type, title, text }: { type: 'success' | 'warning', title: string, text: string }) {
  return (
    <div className="flex items-start gap-3 bg-neutral-900/50 p-3.5 rounded-xl border border-neutral-800">
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
      )}
      <div className="flex-1">
        <span className={`text-sm font-bold ${type === 'success' ? 'text-emerald-400' : 'text-amber-400'}`}>
          {title}
        </span>
        <span className="text-sm text-neutral-300 leading-relaxed ml-1">{text}</span>
      </div>
    </div>
  );
}
