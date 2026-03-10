import { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { Upload, FileVideo, CheckCircle2, AlertCircle, Play, Users, BarChart3, Clock, Star } from 'lucide-react';

interface ScoreDetails {
  content: {
    total: number;
    socialValue: number;
    personalStyle: number;
    logic: number;
  };
  speech: {
    total: number;
    pronunciation: number;
    voice: number;
    fluency: number;
  };
  presentation: {
    total: number;
    clothing: number;
    bodyLanguage: number;
  };
  totalScore: number;
  feedback: string[];
}

export function SelfPresentation() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [score, setScore] = useState<ScoreDetails | null>(null);
  const [submittedCount, setSubmittedCount] = useState(142); // Mock submitted count
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload process
    setIsUploading(true);
    setScore(null);
    
    // Create a local object URL for the uploaded video to preview it
    const url = URL.createObjectURL(file);
    
    setTimeout(() => {
      setIsUploading(false);
      setVideoUrl(url);
      setSubmittedCount(prev => prev + 1);
      startAnalysis();
    }, 1500);
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Generate mock scores based on criteria
      const socialValue = Math.floor(Math.random() * 3) + 12; // 12-14 out of 15
      const personalStyle = Math.floor(Math.random() * 3) + 12; // 12-14 out of 15
      const logic = Math.floor(Math.random() * 3) + 12; // 12-14 out of 15
      
      const pronunciation = Math.floor(Math.random() * 2) + 8; // 8-9 out of 10
      const voice = Math.floor(Math.random() * 2) + 8; // 8-9 out of 10
      const fluency = Math.floor(Math.random() * 2) + 8; // 8-9 out of 10
      
      const clothing = Math.floor(Math.random() * 2) + 8; // 8-9 out of 10
      const bodyLanguage = Math.floor(Math.random() * 3) + 12; // 12-14 out of 15

      const contentTotal = socialValue + personalStyle + logic;
      const speechTotal = pronunciation + voice + fluency;
      const presentationTotal = clothing + bodyLanguage;

      setScore({
        content: {
          total: contentTotal,
          socialValue,
          personalStyle,
          logic
        },
        speech: {
          total: speechTotal,
          pronunciation,
          voice,
          fluency
        },
        presentation: {
          total: presentationTotal,
          clothing,
          bodyLanguage
        },
        totalScore: contentTotal + speechTotal + presentationTotal,
        feedback: [
          "立意较高，能够结合当下社会热点，展现了良好的大局观。",
          "语言表达流畅自然，基本做到了脱稿，但部分段落语速略快。",
          "着装得体，符合主持人形象要求，手势运用较为自然，但可适当增加眼神交流。"
        ]
      });
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 h-full flex flex-col"
    >
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">3min自我展示</h2>
          <p className="text-neutral-400">央视主持人大赛同款考核标准</p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-full">
          <Users className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-neutral-300">已提交作业：<strong className="text-white">{submittedCount}</strong> 份</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Upload & Video Preview */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
          
          {/* Upload Area */}
          {!videoUrl && !isUploading && (
            <div 
              className="flex-1 border-2 border-dashed border-neutral-700 rounded-3xl bg-neutral-900/30 flex flex-col items-center justify-center p-8 hover:bg-neutral-900/50 hover:border-indigo-500/50 transition-all cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 rounded-full bg-neutral-800 group-hover:bg-indigo-500/20 flex items-center justify-center mb-6 transition-colors">
                <Upload className="w-10 h-10 text-neutral-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">上传展示视频</h3>
              <p className="text-neutral-500 text-center max-w-xs mb-8">
                请上传您的3min自我展示视频，支持 MP4, MOV 格式，不超过 500MB。
              </p>
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-indigo-500/25">
                选择文件
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="video/*" 
                className="hidden" 
              />
            </div>
          )}

          {/* Uploading State */}
          {isUploading && (
            <div className="flex-1 border border-neutral-800 rounded-3xl bg-neutral-900/50 flex flex-col items-center justify-center p-8">
              <div className="w-16 h-16 relative mb-6">
                <div className="absolute inset-0 border-4 border-neutral-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">正在上传视频...</h3>
              <p className="text-sm text-neutral-500">请勿关闭页面</p>
            </div>
          )}

          {/* Video Preview */}
          {videoUrl && !isUploading && (
            <div className="flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-neutral-800 shadow-2xl">
                <video 
                  src={videoUrl} 
                  controls 
                  className="w-full h-full object-contain"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-75" />
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-150" />
                    </div>
                    <div className="text-white font-medium tracking-widest">AI 深度解析中</div>
                    <div className="text-xs text-indigo-300 mt-2">正在评估内容逻辑与表现力...</div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-3">
                  <FileVideo className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm font-medium text-white">我的展示作业.mp4</div>
                    <div className="text-xs text-neutral-500">上传成功</div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setVideoUrl(null);
                    setScore(null);
                  }}
                  className="text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  重新上传
                </button>
              </div>
            </div>
          )}

          {/* Standard Info */}
          <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5">
            <h4 className="text-sm font-medium text-neutral-300 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              详细评分标准
            </h4>
            
            <div className="space-y-4">
              {/* Category 1 */}
              <div>
                <div className="text-sm font-medium text-indigo-400 mb-2">一、主持内容（45分）</div>
                <ul className="text-xs text-neutral-400 space-y-1.5 pl-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-500/50 mt-1.5 shrink-0" />
                    <span>1. 具有社会价值和大局意识（15分）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-500/50 mt-1.5 shrink-0" />
                    <span>2. 具有鲜明的个人特色（15分）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-500/50 mt-1.5 shrink-0" />
                    <span>3. 具有清晰的内容逻辑线（15分）</span>
                  </li>
                </ul>
              </div>

              {/* Category 2 */}
              <div>
                <div className="text-sm font-medium text-blue-400 mb-2">二、话语标准（30分）</div>
                <ul className="text-xs text-neutral-400 space-y-1.5 pl-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500/50 mt-1.5 shrink-0" />
                    <span>1. 发音标准、吐字清晰（10分）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500/50 mt-1.5 shrink-0" />
                    <span>2. 声音洪亮，富有感染力（10分）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500/50 mt-1.5 shrink-0" />
                    <span>3. 语言表达自然流畅、全程脱稿（10分）</span>
                  </li>
                </ul>
              </div>

              {/* Category 3 */}
              <div>
                <div className="text-sm font-medium text-violet-400 mb-2">三、汇报效果（共25分）</div>
                <ul className="text-xs text-neutral-400 space-y-1.5 pl-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-violet-500/50 mt-1.5 shrink-0" />
                    <span>1. 服装得体，视觉效果好（10分）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-violet-500/50 mt-1.5 shrink-0" />
                    <span>2. 动作自然，有辅助道具（15分）</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scoring Dashboard */}
        <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 flex flex-col gap-6 backdrop-blur-sm overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              多维度智能评分报告
            </h3>
            {score && (
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-emerald-400 font-mono">{score.totalScore}</span>
                <span className="text-sm text-neutral-500">/100分</span>
              </div>
            )}
          </div>

          {!score && !isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 space-y-4 py-12">
              <BarChart3 className="w-12 h-12 opacity-20" />
              <p className="text-sm">上传视频后，AI 将自动生成详细的评分报告</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12">
              <div className="w-full max-w-md space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>分析主持内容...</span>
                    <span>45%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>评估话语标准...</span>
                    <span>等待中</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>检测汇报效果...</span>
                    <span>等待中</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-violet-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 2 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {score && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* Category 1: Content */}
              <div className="bg-neutral-950 rounded-2xl p-5 border border-neutral-800/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                    一、主持内容 <span className="text-xs text-neutral-500 font-normal ml-1">(45分)</span>
                  </h4>
                  <span className="text-lg font-bold text-indigo-400">{score.content.total}分</span>
                </div>
                <div className="space-y-3">
                  <ScoreBar label="1. 具有社会价值和大局意识" score={score.content.socialValue} max={15} />
                  <ScoreBar label="2. 具有鲜明的个人特色" score={score.content.personalStyle} max={15} />
                  <ScoreBar label="3. 具有清晰的内容逻辑线" score={score.content.logic} max={15} />
                </div>
              </div>

              {/* Category 2: Speech */}
              <div className="bg-neutral-950 rounded-2xl p-5 border border-neutral-800/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                    二、话语标准 <span className="text-xs text-neutral-500 font-normal ml-1">(30分)</span>
                  </h4>
                  <span className="text-lg font-bold text-blue-400">{score.speech.total}分</span>
                </div>
                <div className="space-y-3">
                  <ScoreBar label="1. 发音标准、吐字清晰" score={score.speech.pronunciation} max={10} color="bg-blue-500" />
                  <ScoreBar label="2. 声音洪亮，富有感染力" score={score.speech.voice} max={10} color="bg-blue-500" />
                  <ScoreBar label="3. 语言表达自然流畅、全程脱稿" score={score.speech.fluency} max={10} color="bg-blue-500" />
                </div>
              </div>

              {/* Category 3: Presentation */}
              <div className="bg-neutral-950 rounded-2xl p-5 border border-neutral-800/50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-violet-500 rounded-full"></span>
                    三、汇报效果 <span className="text-xs text-neutral-500 font-normal ml-1">(25分)</span>
                  </h4>
                  <span className="text-lg font-bold text-violet-400">{score.presentation.total}分</span>
                </div>
                <div className="space-y-3">
                  <ScoreBar label="1. 服装得体，视觉效果好" score={score.presentation.clothing} max={10} color="bg-violet-500" />
                  <ScoreBar label="2. 动作自然，有辅助道具" score={score.presentation.bodyLanguage} max={15} color="bg-violet-500" />
                </div>
              </div>

              {/* Overall Feedback */}
              <div className="bg-indigo-500/5 rounded-2xl p-5 border border-indigo-500/20">
                <h4 className="text-sm font-medium text-indigo-300 mb-3">综合点评</h4>
                <div className="space-y-2">
                  {score.feedback.map((fb, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                      <p className="leading-relaxed">{fb}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ScoreBar({ label, score, max, color = "bg-indigo-500" }: { label: string, score: number, max: number, color?: string }) {
  const percentage = (score / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-neutral-400">{label}</span>
        <span className="text-neutral-300 font-medium">{score} / {max}</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
