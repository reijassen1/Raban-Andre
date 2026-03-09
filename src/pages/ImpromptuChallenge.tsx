import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Clock, AlertOctagon, RefreshCw, Play, Square, BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react';

const SCENARIOS = [
  { title: "乡村振兴话题", desc: "请以“新农人的田野梦”为题，讲述一个返乡创业青年的故事。" },
  { title: "大国外交故事", desc: "请以“构建人类命运共同体”为切入点，评述近期的一项重要外交活动。" },
  { title: "民生话题", desc: "针对近期“老旧小区改造”的社会热点，发表一段90秒的新闻评论。" },
  { title: "传统文化传承", desc: "请以“非遗里的中国”为主题，介绍一项你家乡的非物质文化遗产。" },
  { title: "科技创新前沿", desc: "请以“AI改变生活”为题，探讨人工智能对未来职业发展的影响。" },
  { title: "生态环境保护", desc: "请以“绿水青山就是金山银山”为核心，呼吁大家关注身边的环保小事。" },
  { title: "青年责任担当", desc: "请以“奋斗的青春最美丽”为题，结合自身经历谈谈青年的时代责任。" },
  { title: "体育精神赞歌", desc: "请结合某位奥运健儿的拼搏故事，阐述你对体育精神的理解。" },
  { title: "城市文明建设", desc: "针对“垃圾分类”或“文明出行”现象，做一段倡导性的现场播报。" },
  { title: "突发事件报道", desc: "模拟你在某自然灾害救援现场，进行一段90秒的连线报道，要求传递客观信息与人文关怀。" },
  { title: "晚会开场主持", desc: "请模拟一场以“迎新春”为主题的社区文艺晚会的开场白。" },
  { title: "读书分享推荐", desc: "请为大家推荐一本对你影响深远的书，并说明推荐理由。" },
  { title: "历史人物评述", desc: "请选取一位中国历史上的杰出人物，用90秒的时间讲述他的高光时刻。" },
  { title: "旅游风光推介", desc: "请以“寻找最美中国”为题，向观众推介一个你最喜欢的旅游目的地。" },
  { title: "凡人微光故事", desc: "请讲述一个发生在你身边的普通人“见义勇为”或“无私奉献”的感人故事。" },
  { title: "职场百态观察", desc: "针对“年轻人整顿职场”的网络热词，发表你的客观理性看法。" },
  { title: "心理健康关注", desc: "请以“拒绝内耗，拥抱阳光”为题，做一段治愈系的情感电台开场。" },
  { title: "航天梦想探索", desc: "请结合中国航天的最新成就，谈谈你对“星辰大海”的向往。" },
  { title: "节日文化解读", desc: "请选取一个中国传统节日（如端午、中秋），阐述其背后的文化内涵。" },
  { title: "榜样力量传递", desc: "请以“时代楷模”为主题，讲述一位让你敬佩的时代先锋的故事。" }
];

interface SubScore {
  score: number;
  feedback: string;
}

interface ScoreDetails {
  content: {
    socialValue: SubScore; // /15
    personalStyle: SubScore; // /15
    logic: SubScore; // /15
    total: number; // /45
  };
  speech: {
    pronunciation: SubScore; // /10
    voice: SubScore; // /10
    fluency: SubScore; // /10
    total: number; // /30
  };
  presentation: {
    appearance: SubScore; // /10
    bodyLanguage: SubScore; // /15
    total: number; // /25
  };
  totalScore: number; // /100
  generalFeedback: string;
}

export function ImpromptuChallenge() {
  const [isChallenging, setIsChallenging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [currentScenario, setCurrentScenario] = useState<{title: string, desc: string} | null>(null);
  const [score, setScore] = useState<ScoreDetails | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('content');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isChallenging && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isChallenging) {
      handleEndChallenge();
    }
    return () => clearInterval(timer);
  }, [isChallenging, timeLeft]);

  const handleStartChallenge = () => {
    setIsChallenging(true);
    setTimeLeft(90);
    setCurrentScenario(SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]);
    setScore(null);
  };

  const handleEndChallenge = () => {
    setIsChallenging(false);
    // Simulate scoring
    setTimeout(() => {
      const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const topic = currentScenario?.title || "该话题";

      const svScore = getRandom(11, 15);
      const psScore = getRandom(11, 15);
      const lgScore = getRandom(11, 15);
      const contentTotal = svScore + psScore + lgScore;

      const prScore = getRandom(7, 10);
      const voScore = getRandom(7, 10);
      const flScore = getRandom(7, 10);
      const speechTotal = prScore + voScore + flScore;

      const apScore = getRandom(7, 10);
      const blScore = getRandom(11, 15);
      const presentationTotal = apScore + blScore;

      const totalScore = contentTotal + speechTotal + presentationTotal;

      const contentRatio = contentTotal / 45;
      const speechRatio = speechTotal / 30;
      const presentationRatio = presentationTotal / 25;

      const ratios = [
        { name: '主持内容', ratio: contentRatio, good: '内容立意深刻、逻辑清晰', bad: '内容的深度和逻辑组织' },
        { name: '话语标准', ratio: speechRatio, good: '发音标准、语言流畅', bad: '语音面貌和表达流畅度' },
        { name: '汇报效果', ratio: presentationRatio, good: '台风稳健、肢体语言丰富', bad: '镜头前的表现力和肢体配合' }
      ];

      ratios.sort((a, b) => b.ratio - a.ratio);
      const best = ratios[0];
      const worst = ratios[2];

      let overallEval = "尚可";
      if (totalScore >= 85) overallEval = "优秀";
      else if (totalScore >= 75) overallEval = "良好";

      const improvementSuggestions: Record<string, string> = {
        '主持内容': `在内容创作上，建议多阅读主流媒体评论积累素材。拿到题目后，先定核心立意（社会价值），再找切入点（个人特色），最后列出1-2-3的提纲（逻辑线），确保90秒内言之有物。`,
        '话语标准': `在语音面貌上，建议每天坚持早功练习。重点进行气息控制（如快吸慢呼）和口腔控制（如提打挺收）训练。日常可尝试对镜朗读，录音复盘，纠正发音瑕疵，提升语言流畅度。`,
        '汇报效果': `在镜头表现力上，建议进行“无声练习”——关掉声音回看自己的录像，观察肢体语言是否自然、眼神是否有交流感。平时多观摩优秀主持人的台风，学习他们如何用手势和表情辅助表达。`
      };

      const generalFeedback = `【综合评价】在本次“${topic}”的90秒即兴考核中，你的整体表现${overallEval}（总分 ${totalScore}分）。\n\n【高光时刻】你在【${best.name}】方面表现最为突出，${best.good}，展现了扎实的基本功。\n\n【建设性改进意见】当前在【${worst.name}】方面还有较大的提升空间，主要体现在${worst.bad}。\n💡 导师建议：${improvementSuggestions[worst.name]}`;

      const getSocialValueFeedback = (score: number) => {
        if (score >= 14) return `在“${topic}”的论述中，你不仅停留在表面现象，更深刻挖掘了背后的时代意义，展现了极强的宏观视野与社会责任感。`;
        if (score >= 12) return `能够围绕“${topic}”展开，具备一定的社会价值意识，但如果在结尾处能进一步升华到国家或社会层面，立意会更高远。`;
        return `针对“${topic}”，目前的讲述较为平铺直叙，缺乏对核心价值的深度剖析，建议多关注时事热点，提升大局观。`;
      };

      const getPersonalStyleFeedback = (score: number) => {
        if (score >= 14) return `你的切入点非常新颖，在讲述“${topic}”时融入了强烈的个人情感与独特视角，形成了极具辨识度的主持风格。`;
        if (score >= 12) return `表达自然亲切，但在“${topic}”的同质化表达中，还缺少一些能让人眼前一亮的“金句”或独特的个人标签。`;
        return `整体表达偏向模式化，缺乏个性化处理。建议在准备类似话题时，多结合自身真实经历，增加人情味。`;
      };

      const getLogicFeedback = (score: number) => {
        if (score >= 14) return `内容架构严密，从破题、展开到升华，层次分明，逻辑链条完整，论证过程极具说服力和感染力。`;
        if (score >= 12) return `整体框架清晰，但在部分段落的过渡上略显生硬，建议多使用关联词和过渡句，使内容的起承转合更加丝滑。`;
        return `90秒的讲述中出现了内容发散、主次不分的情况。建议采用“总-分-总”或“现象-原因-对策”的结构化思维进行刻意练习。`;
      };

      const getPronunciationFeedback = (score: number) => {
        if (score >= 9) return `字正腔圆，吐字归音清晰饱满，唇齿力度恰到好处，展现了非常扎实的播音主持基本功。`;
        if (score >= 8) return `整体发音标准，但个别词语的咬字不够清晰，尾音处理略显拖沓，需注意归音的干脆利落。`;
        return `存在部分平翘舌音或前后鼻音混淆的现象，在快速表达时容易出现“吃字”，建议每天坚持进行口部操和绕口令训练。`;
      };

      const getVoiceFeedback = (score: number) => {
        if (score >= 9) return `气息下沉且支撑稳定，声音洪亮通透，能够根据内容的起伏自如调整音高与音色，极具舞台感染力。`;
        if (score >= 8) return `音量适中，但声音的弹性和色彩变化稍显不足，在表达高潮部分时爆发力欠缺，感染力有待加强。`;
        return `发声位置偏浅，气息不够沉稳，导致声音单薄、缺乏穿透力。建议加强胸腹联合呼吸法的练习。`;
      };

      const getFluencyFeedback = (score: number) => {
        if (score >= 9) return `表达如行云流水，全程脱稿且无任何明显卡壳，展现了极强的语言组织能力和临场应变能力。`;
        if (score >= 8) return `整体较为流畅，但偶有语塞、重复词语或不自然的停顿，说明在边想边说时，思维与语言的同步率还需提升。`;
        return `卡顿较多，对内容的熟悉度和即兴转换能力不足，依赖记忆而非即兴组织，需加强脱稿状态下的连贯表达训练。`;
      };

      const getAppearanceFeedback = (score: number) => {
        if (score >= 9) return `着装得体大方，妆容精致，精神面貌极佳，整体视觉呈现高度契合专业主持人的形象标准。`;
        if (score >= 8) return `服装基本符合要求，但在细节搭配或镜头前的色彩呈现上可再优化，注意避免过于花哨或随意的元素。`;
        return `造型略显随意，未能很好地贴合当前场景的正式感，建议在镜头前更加注重仪容仪表的专业度。`;
      };

      const getBodyLanguageFeedback = (score: number) => {
        if (score >= 14) return `手势自然大方，眼神交流充分且坚定，能巧妙运用面部表情和肢体动作辅助语言表达，镜头感极强。`;
        if (score >= 12) return `有基本的肢体配合，但动作略显僵硬或单调，眼神有时游离，互动感和自信心还可以进一步增强。`;
        return `肢体语言匮乏，或存在频繁眨眼、摸鼻子等多余的小动作，未能有效辅助表达，反而分散了观众注意力。`;
      };

      setScore({
        content: {
          socialValue: { score: svScore, feedback: getSocialValueFeedback(svScore) },
          personalStyle: { score: psScore, feedback: getPersonalStyleFeedback(psScore) },
          logic: { score: lgScore, feedback: getLogicFeedback(lgScore) },
          total: contentTotal
        },
        speech: {
          pronunciation: { score: prScore, feedback: getPronunciationFeedback(prScore) },
          voice: { score: voScore, feedback: getVoiceFeedback(voScore) },
          fluency: { score: flScore, feedback: getFluencyFeedback(flScore) },
          total: speechTotal
        },
        presentation: {
          appearance: { score: apScore, feedback: getAppearanceFeedback(apScore) },
          bodyLanguage: { score: blScore, feedback: getBodyLanguageFeedback(blScore) },
          total: presentationTotal
        },
        totalScore,
        generalFeedback
      });
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
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
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">90s即兴考核</h2>
          <p className="text-neutral-400">20大真实场景模拟，全方位能力评测</p>
        </div>
        {!isChallenging && score && (
          <button
            onClick={handleStartChallenge}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all bg-neutral-800 text-white hover:bg-neutral-700"
          >
            <RefreshCw className="w-4 h-4" />
            重新考核
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Main Stage */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col items-center justify-center min-h-0">
          
          {/* Camera Feed */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className={`absolute inset-0 w-full h-full object-cover transform scale-x-[-1] transition-all duration-700 ${
              isChallenging ? 'opacity-100' : 'opacity-40 blur-sm'
            }`}
          />

          {/* Top Left: Scenario Pop-up */}
          <AnimatePresence>
            {currentScenario && isChallenging && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0, x: -20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.9, opacity: 0, x: -20 }}
                className="absolute top-6 left-6 bg-neutral-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-5 max-w-sm shadow-2xl text-left pointer-events-auto z-20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <AlertOctagon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{currentScenario.title}</h3>
                    <p className="text-neutral-300 text-sm leading-relaxed">{currentScenario.desc}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Right: Timer */}
          <AnimatePresence>
            {isChallenging && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.9, opacity: 0, x: 20 }}
                className={`absolute top-6 right-6 z-20 flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl border shadow-2xl pointer-events-auto ${
                  timeLeft <= 10 
                    ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse' 
                    : 'bg-black/50 border-white/10 text-white'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="text-2xl font-mono font-bold tracking-wider">{formatTime(timeLeft)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay UI */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 pointer-events-none">
            {/* Bottom: Controls */}
            <div className="flex justify-center pointer-events-auto">
              {!isChallenging && !score ? (
                <button
                  onClick={handleStartChallenge}
                  className="flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-105 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
                >
                  <Play className="w-6 h-6 fill-current" />
                  开始 90 秒考核
                </button>
              ) : isChallenging ? (
                <button
                  onClick={handleEndChallenge}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all bg-red-500/80 backdrop-blur-md text-white hover:bg-red-600 border border-red-400/50"
                >
                  <Square className="w-4 h-4 fill-current" />
                  提前结束
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Panel: Evaluation */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 backdrop-blur-sm flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 border-b border-neutral-800 pb-4 shrink-0">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              AI 综合评定体系
            </h3>

            {!score && !isChallenging && (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 space-y-4 py-12">
                <Zap className="w-12 h-12 opacity-20" />
                <p className="text-sm text-center">准备好后点击开始考核<br/>系统将对您的即兴表现进行多维度打分</p>
              </div>
            )}

            {isChallenging && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-12">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="283" strokeDashoffset="200" className="animate-pulse" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit className="w-8 h-8 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-indigo-400 font-medium">AI 实时分析中...</div>
                  <div className="text-xs text-neutral-500">正在评估主持内容、话语标准与汇报效果</div>
                </div>
              </div>
            )}

            {score && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-6"
              >
                <div className="text-center mb-2">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-mono mb-2">
                    {score.totalScore}
                  </div>
                  <div className="text-sm text-neutral-400 font-medium tracking-widest uppercase">综合得分 (满分100)</div>
                </div>

                <div className="space-y-4">
                  {/* Section 1: Content */}
                  <div className="border border-neutral-800 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleSection('content')}
                      className="w-full flex items-center justify-between p-4 bg-neutral-950 hover:bg-neutral-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">一</div>
                        <div className="text-left">
                          <div className="font-semibold text-white">主持内容</div>
                          <div className="text-xs text-neutral-500">满分 45 分</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xl font-mono font-bold text-blue-400">{score.content.total}</div>
                        {expandedSection === 'content' ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'content' && (
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: 'auto' }} 
                          exit={{ height: 0 }}
                          className="overflow-hidden bg-neutral-900/50"
                        >
                          <div className="p-4 space-y-4 border-t border-neutral-800">
                            <ScoreDetailItem label="1. 具有社会价值和大局意识" data={score.content.socialValue} max={15} color="bg-blue-500" />
                            <ScoreDetailItem label="2. 具有鲜明的个人特色" data={score.content.personalStyle} max={15} color="bg-blue-500" />
                            <ScoreDetailItem label="3. 具有清晰的内容逻辑线" data={score.content.logic} max={15} color="bg-blue-500" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Section 2: Speech */}
                  <div className="border border-neutral-800 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleSection('speech')}
                      className="w-full flex items-center justify-between p-4 bg-neutral-950 hover:bg-neutral-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm">二</div>
                        <div className="text-left">
                          <div className="font-semibold text-white">话语标准</div>
                          <div className="text-xs text-neutral-500">满分 30 分</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xl font-mono font-bold text-violet-400">{score.speech.total}</div>
                        {expandedSection === 'speech' ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'speech' && (
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: 'auto' }} 
                          exit={{ height: 0 }}
                          className="overflow-hidden bg-neutral-900/50"
                        >
                          <div className="p-4 space-y-4 border-t border-neutral-800">
                            <ScoreDetailItem label="1. 发音标准、吐字清晰" data={score.speech.pronunciation} max={10} color="bg-violet-500" />
                            <ScoreDetailItem label="2. 声音洪亮，富有感染力" data={score.speech.voice} max={10} color="bg-violet-500" />
                            <ScoreDetailItem label="3. 语言表达自然流畅、全程脱稿" data={score.speech.fluency} max={10} color="bg-violet-500" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Section 3: Presentation */}
                  <div className="border border-neutral-800 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => toggleSection('presentation')}
                      className="w-full flex items-center justify-between p-4 bg-neutral-950 hover:bg-neutral-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">三</div>
                        <div className="text-left">
                          <div className="font-semibold text-white">汇报效果</div>
                          <div className="text-xs text-neutral-500">满分 25 分</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xl font-mono font-bold text-amber-400">{score.presentation.total}</div>
                        {expandedSection === 'presentation' ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedSection === 'presentation' && (
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: 'auto' }} 
                          exit={{ height: 0 }}
                          className="overflow-hidden bg-neutral-900/50"
                        >
                          <div className="p-4 space-y-4 border-t border-neutral-800">
                            <ScoreDetailItem label="1. 服装得体，视觉效果好" data={score.presentation.appearance} max={10} color="bg-amber-500" />
                            <ScoreDetailItem label="2. 动作自然，有辅助道具" data={score.presentation.bodyLanguage} max={15} color="bg-amber-500" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-4 pt-6 border-t border-neutral-800">
                  <h4 className="text-sm font-medium text-neutral-300 mb-3">导师综合点评</h4>
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5">
                    <p className="text-sm text-indigo-200 leading-relaxed whitespace-pre-wrap">
                      {score.generalFeedback}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScoreDetailItem({ label, data, max, color }: { label: string; data: SubScore; max: number; color: string }) {
  const percentage = (data.score / max) * 100;
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-neutral-300 font-medium">{label}</span>
        <span className="text-neutral-400 font-mono"><span className="text-white font-medium">{data.score}</span> / {max}</span>
      </div>
      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-2.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
      <div className="text-xs text-neutral-400 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/50 leading-relaxed">
        {data.feedback}
      </div>
    </div>
  );
}
