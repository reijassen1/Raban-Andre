import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Heart, AlertTriangle, Play, Square, Map as MapIcon, ChevronRight, Upload, Video as VideoIcon, CheckCircle, BarChart, Star, X } from 'lucide-react';

// --- 10 Scenarios based on Xinjiang Tourism (including 5A spots) ---
const SCENARIOS = [
  {
    id: 'kanas',
    title: '喀纳斯湖探秘之旅',
    productName: '喀纳斯3日深度游',
    originalPrice: '2980.0',
    discountPrice: '1980.0',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '哈喽家人们！欢迎来到“神的后花园”——喀纳斯！看这变幻莫测的湖水，是不是美得像仙境？' },
      { id: 'product', label: '讲品', text: '今天给大家带来的是喀纳斯3日深度游，包含月亮湾、神仙湾、卧龙湾全景，还有图瓦人村落家访。绝对是全网第一的纯玩路线！' },
      { id: 'action', label: '促单', text: '原价2980，今天直播间文旅补贴价只要1980！1号链接，名额有限，带上家人来一场说走就走的旅行！' },
      { id: 'retain', label: '留存', text: '没抢到的家人点点关注，主播马上带大家去寻找传说中的“水怪”！' },
    ],
    mockComments: [
      { user: '旅游达人', text: '喀纳斯秋天最美' },
      { user: '想去新疆', text: '这个价格包机票吗？' },
      { user: '已下单', text: '期待神仙湾的晨雾！' },
    ]
  },
  {
    id: 'tianchi',
    title: '天山天池仙境游',
    productName: '天池1日VIP纯玩',
    originalPrice: '399.0',
    discountPrice: '199.0',
    imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们，我现在就在海拔1900米的天山天池！看这雪山倒影，感受一下西王母瑶池的仙气！' },
      { id: 'product', label: '讲品', text: '天池1日VIP纯玩团，包含门票、区间车和特色午餐。全程无购物，导游服务可以说是极品中的极品！' },
      { id: 'action', label: '促单', text: '今天破价福利，只要199元！2号链接，来新疆必打卡的5A景区，闭眼入！' },
      { id: 'retain', label: '留存', text: '拍完的家人扣个1，我们马上坐游船去看看定海神针！' },
    ],
    mockComments: [
      { user: '新疆老乡', text: '天池的水真清' },
      { user: '打工人', text: '周末去刚好' },
      { user: '已拍', text: '冲冲冲' },
    ]
  },
  {
    id: 'sayram',
    title: '赛里木湖环湖自驾',
    productName: '赛湖自驾2日游',
    originalPrice: '1280.0',
    discountPrice: '880.0',
    imageUrl: 'https://images.unsplash.com/photo-1506744626753-1fa44df14d28?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '欢迎来到“大西洋的最后一滴眼泪”——赛里木湖！这片蓝，看一眼就能治愈所有的烦恼！' },
      { id: 'product', label: '讲品', text: '赛湖环湖自驾2日游，提供越野车和专业领队，带你打卡网红S弯，晚上住星空营地，这体验绝对是绝无仅有的！' },
      { id: 'action', label: '促单', text: '今天直播间特惠880元！3号链接，带上你最爱的人，来感受这片纯净的蓝！' },
      { id: 'retain', label: '留存', text: '感谢大家支持新疆文旅，没抢到的不要走，马上给大家抽送赛湖门票！' },
    ],
    mockComments: [
      { user: '摄影爱好者', text: '赛湖的蓝太绝了' },
      { user: '浪漫之旅', text: '星空营地听起来不错' },
      { user: '已下单', text: '期待自驾！' },
    ]
  },
  {
    id: 'turpan',
    title: '吐鲁番葡萄沟风情',
    productName: '吐鲁番文化1日游',
    originalPrice: '288.0',
    discountPrice: '158.0',
    imageUrl: 'https://images.unsplash.com/photo-1596363505729-41f7a478e40d?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们，感受一下火洲的热情！我们现在在吐鲁番的葡萄沟，满眼都是绿色的藤蔓！' },
      { id: 'product', label: '讲品', text: '吐鲁番文化1日游，带你游览交河故城、坎儿井，还能在葡萄沟品尝最甜的葡萄，这路线是全网独家的！' },
      { id: 'action', label: '促单', text: '今天只要158元！4号链接，体验浓郁的维吾尔族风情，品尝甜蜜的新疆味道！' },
      { id: 'retain', label: '留存', text: '拍完的家人，主播马上给大家表演一段新疆舞，不要走开！' },
    ],
    mockComments: [
      { user: '吃货', text: '想吃葡萄' },
      { user: '历史迷', text: '交河故城很震撼' },
      { user: '已拍', text: '支持新疆旅游' },
    ]
  },
  {
    id: 'nalati',
    title: '那拉提空中草原',
    productName: '那拉提深度2日游',
    originalPrice: '1580.0',
    discountPrice: '980.0',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '欢迎来到世界四大河谷草原之一的那拉提！看这连绵的雪山和碧绿的草甸，心都飞起来了！' },
      { id: 'product', label: '讲品', text: '那拉提深度2日游，带你骑马驰骋空中草原，体验哈萨克族毡房，这风景可以说是天下无敌的美！' },
      { id: 'action', label: '促单', text: '今天直播间只要980元！5号链接，来伊犁必去的5A景区，赶紧抢！' },
      { id: 'retain', label: '留存', text: '抢到的家人扣个666，我们马上带大家去看看草原上的土拨鼠！' },
    ],
    mockComments: [
      { user: '向往自由', text: '想去骑马' },
      { user: '风景党', text: '那拉提真的太美了' },
      { user: '已下单', text: '期待大草原' },
    ]
  },
  {
    id: 'kashgar',
    title: '喀什古城人文之旅',
    productName: '喀什古城漫步半日游',
    originalPrice: '198.0',
    discountPrice: '99.0',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们，不到喀什不算到新疆！今天带大家走进这座活着的千年古城！' },
      { id: 'product', label: '讲品', text: '喀什古城漫步半日游，专业金牌导游带你穿梭在迷宫般的街巷，品尝百年老茶馆的红茶，这体验绝对是百分之百纯正的西域风情！' },
      { id: 'action', label: '促单', text: '今天只要99元！6号链接，来感受浓郁的民族特色和历史沉淀！' },
      { id: 'retain', label: '留存', text: '感谢大家，没抢到的等一下，马上带大家去看古城的开城仪式！' },
    ],
    mockComments: [
      { user: '人文控', text: '喀什很有味道' },
      { user: '老茶客', text: '想去百年老茶馆' },
      { user: '已拍', text: '期待古城漫步' },
    ]
  },
  {
    id: 'koktokay',
    title: '可可托海地质奇观',
    productName: '可可托海2日游',
    originalPrice: '1180.0',
    discountPrice: '780.0',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '欢迎来到《可可托海的牧羊人》的故乡！看这神奇的额尔齐斯大峡谷和神钟山！' },
      { id: 'product', label: '讲品', text: '可可托海2日游，探秘三号矿坑的工业奇迹，欣赏白桦林的秋色，这条路线是我们的销量冠军！' },
      { id: 'action', label: '促单', text: '今天直播间特惠780元！7号链接，来感受地质奇观和动人的爱情故事！' },
      { id: 'retain', label: '留存', text: '拍完的家人记得多喝水，喜欢新疆风景的点个关注，明天带大家去禾木！' },
    ],
    mockComments: [
      { user: '音乐迷', text: '因为一首歌想去一个地方' },
      { user: '地质爱好者', text: '三号矿坑很震撼' },
      { user: '已购', text: '期待可可托海' },
    ]
  },
  {
    id: 'bayanbulak',
    title: '巴音布鲁克九曲十八弯',
    productName: '巴音布鲁克日落游',
    originalPrice: '458.0',
    discountPrice: '258.0',
    imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们，这里是天鹅的故乡——巴音布鲁克！准备好迎接最美的草原日落了吗？' },
      { id: 'product', label: '讲品', text: '巴音布鲁克日落游，带你去看九个太阳的奇观，还有优雅的天鹅湖，这景色可以说是史无前例的震撼！' },
      { id: 'action', label: '促单', text: '今天只要258元！8号链接，摄影爱好者的天堂，千万不要错过！' },
      { id: 'retain', label: '留存', text: '感谢大家支持！拍下后客服会联系您确认行程，没抢到的扣1。' },
    ],
    mockComments: [
      { user: '摄影师', text: '九个太阳太难拍了' },
      { user: '天鹅控', text: '想看天鹅' },
      { user: '111', text: '1' },
    ]
  },
  {
    id: 'taklamakan',
    title: '塔克拉玛干沙漠探险',
    productName: '沙漠越野1日游',
    originalPrice: '680.0',
    discountPrice: '380.0',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '欢迎来到死亡之海——塔克拉玛干沙漠！感受一下大漠孤烟直的壮阔！' },
      { id: 'product', label: '讲品', text: '沙漠越野1日游，专业车手带你冲沙，体验失重的快感，还能骑骆驼漫步沙海，这刺激感绝对是万能的解压神器！' },
      { id: 'action', label: '促单', text: '今天只要380元！9号链接，来一场勇敢者的游戏，挑战自我！' },
      { id: 'retain', label: '留存', text: '拍完的家人，主播马上给大家展示沙漠冲浪，不要眨眼！' },
    ],
    mockComments: [
      { user: '探险家', text: '太刺激了' },
      { user: '想骑骆驼', text: '骆驼可爱吗' },
      { user: '已拍', text: '冲沙走起' },
    ]
  },
  {
    id: 'hemu',
    title: '禾木村童话世界',
    productName: '禾木星空木屋2日游',
    originalPrice: '1880.0',
    discountPrice: '1280.0',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '哈喽家人们！这里是神的自留地——禾木村！看这袅袅炊烟和原始木屋，是不是像童话一样？' },
      { id: 'product', label: '讲品', text: '禾木星空木屋2日游，住特色尖顶木屋，看晨雾弥漫，晚上围着篝火跳舞，这体验是以前的特供路线，现在开放给大家！' },
      { id: 'action', label: '促单', text: '今天直播间只要1280元！10号链接，远离城市喧嚣，来这里寻找内心的宁静！' },
      { id: 'retain', label: '留存', text: '感谢大家，马上带大家去观景台看禾木全景，点关注不迷路！' },
    ],
    mockComments: [
      { user: '童话迷', text: '真的像童话世界' },
      { user: '想看晨雾', text: '晨雾几点有？' },
      { user: '已买', text: '期待星空木屋' },
    ]
  }
];

const FORBIDDEN_DICT: Record<string, string> = {
  '最': '极限词',
  '第一': '极限词',
  '绝对': '绝对化用语',
  '顶级': '极限词',
  '极品': '极限词',
  '最好': '极限词',
  '最低价': '极限词',
  '国家级': '权威词',
  '特供': '权威词',
  '专供': '权威词',
  '包治百病': '医疗夸大',
  '神效': '医疗夸大',
  '神药': '医疗夸大',
  '一秒': '虚假夸大',
  '百分之百': '绝对化用语',
  '史无前例': '虚假夸大',
  '万能': '虚假夸大',
  '永久': '虚假夸大',
  '天下无敌': '虚假夸大',
  '销量冠军': '极限词',
  '首选': '极限词',
  '独家': '极限词',
  '绝无仅有': '虚假夸大'
};
const FORBIDDEN_WORDS = Object.keys(FORBIDDEN_DICT);

interface ScoreReport {
  total: number;
  sentiment: number; // 文旅情怀表达
  completeness: number; // 话术完整度
  compliance: number; // 违禁词规避
  emotion: number; // 情绪感染力
  interaction: number; // 互动响应度
  feedback: string;
}

export function LiveTourism() {
  const [activeTab, setActiveTab] = useState<'live' | 'upload'>('live');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  
  // Live State
  const [isLive, setIsLive] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [comments, setComments] = useState<{ id: number; user: string; text: string }[]>([]);
  const [spokenText, setSpokenText] = useState('');
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Upload State
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Score State
  const [scoreReport, setScoreReport] = useState<ScoreReport | null>(null);

  const currentScenario = SCENARIOS[selectedScenarioIndex];

  // Handle Camera Setup
  useEffect(() => {
    if (activeTab === 'live') {
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
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab]);

  // Simulate scrolling comments
  useEffect(() => {
    if (!isLive) return;
    let idCounter = 0;
    const interval = setInterval(() => {
      const randomComment = currentScenario.mockComments[Math.floor(Math.random() * currentScenario.mockComments.length)];
      setComments(prev => {
        const newComments = [...prev, { ...randomComment, id: idCounter++ }];
        if (newComments.length > 5) newComments.shift();
        return newComments;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isLive, currentScenario]);

  // Simulate speech recognition and forbidden word detection
  useEffect(() => {
    if (!isLive) {
      setSpokenText('');
      setDetectedWords([]);
      return;
    }

    const currentScript = currentScenario.scriptStages[currentStage].text;
    let charIndex = 0;
    
    const interval = setInterval(() => {
      if (charIndex < currentScript.length) {
        const nextChar = currentScript[charIndex];
        setSpokenText(prev => prev + nextChar);
        
        // Check for forbidden words in the accumulated text
        const currentText = spokenText + nextChar;
        const foundWords = FORBIDDEN_WORDS.filter(word => currentText.includes(word));
        if (foundWords.length > 0) {
          setDetectedWords(prev => Array.from(new Set([...prev, ...foundWords])));
        }
        
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 120); // Typing speed simulation

    return () => clearInterval(interval);
  }, [isLive, currentStage, currentScenario]);

  const handleNextStage = () => {
    if (currentStage < currentScenario.scriptStages.length - 1) {
      setCurrentStage(prev => prev + 1);
      setSpokenText('');
      setDetectedWords([]);
    }
  };

  const generateScore = () => {
    // Simulate granular scoring logic based on performance
    const baseScore = 85;
    const compliancePenalty = detectedWords.length * 5;
    
    const sentiment = Math.floor(Math.random() * 5) + 15; // 15-20
    const completeness = currentStage === currentScenario.scriptStages.length - 1 ? 20 : 10;
    const compliance = Math.max(0, 20 - compliancePenalty);
    const emotion = Math.floor(Math.random() * 5) + 15; // 15-20
    const interaction = Math.floor(Math.random() * 5) + 15; // 15-20
    
    const total = sentiment + completeness + compliance + emotion + interaction;
    
    let feedback = "表现非常出色！情感充沛，极具文旅推介官的风范，有效传递了新疆美景的魅力。";
    if (compliance < 15) feedback = "文旅情怀表达很好，但请注意规避绝对化用语等违禁词，以免直播间被限流。";
    if (completeness < 20) feedback = "话术流程未完整走完，请注意把控直播节奏，确保讲品和促单环节完整。";

    setScoreReport({ total, sentiment, completeness, compliance, emotion, interaction, feedback });
  };

  const toggleLive = () => {
    if (isLive) {
      setIsLive(false);
      generateScore();
    } else {
      setIsLive(true);
      setCurrentStage(0);
      setScoreReport(null);
      setSpokenText('');
      setDetectedWords([]);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
      setScoreReport(null);
    }
  };

  const startVideoEvaluation = () => {
    setIsEvaluating(true);
    // Simulate AI processing time
    setTimeout(() => {
      setIsEvaluating(false);
      generateScore();
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 h-full flex flex-col relative"
    >
      {/* Header & Tabs */}
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">直播文旅实训</h2>
          <p className="text-neutral-400">依托新疆特色5A级景区，打造沉浸式文旅直播场景</p>
        </div>
        
        <div className="flex bg-neutral-900/80 p-1 rounded-xl border border-neutral-800 backdrop-blur-sm">
          <button
            onClick={() => { setActiveTab('live'); setScoreReport(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'live' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <VideoIcon className="w-4 h-4" /> 实时直播实训
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setScoreReport(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'upload' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" /> 视频作品上传
          </button>
        </div>
      </header>

      {/* Scenario Selector */}
      <div className="mb-6 overflow-x-auto custom-scrollbar pb-2">
        <div className="flex gap-3 min-w-max">
          {SCENARIOS.map((scenario, idx) => (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setCurrentStage(0);
                setScoreReport(null);
                if (isLive) setIsLive(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedScenarioIndex === idx
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
              }`}
            >
              {scenario.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left/Center: Simulator or Upload */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-black border border-neutral-800 shadow-2xl flex flex-col">
          
          {activeTab === 'live' ? (
            <>
              {/* Camera Feed */}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-60"
              />
              
              {/* Live UI Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                {/* Top Bar */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-full p-1.5 pr-4 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">主播</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{currentScenario.title}</div>
                      <div className="text-[10px] text-neutral-300 flex items-center gap-1">
                        <Users className="w-3 h-3" /> 2.8w 观看
                      </div>
                    </div>
                    {isLive && (
                      <div className="ml-2 px-2 py-0.5 bg-red-500 rounded-full text-[10px] font-bold text-white animate-pulse">
                        LIVE
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <div className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 flex items-center gap-1.5">
                      <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                      <span className="text-xs font-medium text-white">15.6w</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Area */}
                <div className="flex justify-between items-end">
                  {/* Comments */}
                  <div className="w-64 h-48 flex flex-col justify-end gap-2 mask-image-gradient-to-t">
                    <AnimatePresence>
                      {comments.map(comment => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/5 text-sm"
                        >
                          <span className="text-blue-300 font-medium mr-2">{comment.user}:</span>
                          <span className="text-white">{comment.text}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Product Link */}
                  <div className="bg-white rounded-xl p-2 w-24 flex flex-col items-center gap-1 shadow-2xl pointer-events-auto cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-full aspect-square bg-neutral-100 rounded-lg overflow-hidden relative">
                      <img src={currentScenario.imageUrl} alt="Product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-[8px] px-1 rounded font-bold">1号链接</div>
                    </div>
                    <div className="text-red-500 font-bold text-sm">¥{currentScenario.discountPrice}</div>
                    <div className="text-[10px] text-neutral-500 line-through">¥{currentScenario.originalPrice}</div>
                  </div>
                </div>
              </div>

              {/* Live Control Button */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                <button
                  onClick={toggleLive}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-2xl ${
                    isLive 
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/30' 
                      : 'bg-blue-500 text-white hover:bg-blue-400 shadow-blue-500/30'
                  }`}
                >
                  {isLive ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  {isLive ? '结束文旅直播' : '开始文旅直播'}
                </button>
              </div>
            </>
          ) : (
            /* Upload Mode UI */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-neutral-900/50">
              {!uploadedVideo ? (
                <label className="w-full max-w-md aspect-video border-2 border-dashed border-neutral-700 rounded-3xl flex flex-col items-center justify-center p-8 text-neutral-400 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/5 transition-all cursor-pointer group">
                  <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                  <div className="w-16 h-16 rounded-full bg-neutral-800 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">上传文旅实训视频</h3>
                  <p className="text-sm text-center">点击或拖拽视频文件到此处<br/>(支持 MP4, WebM)</p>
                </label>
              ) : (
                <div className="w-full h-full flex flex-col items-center">
                  <video src={uploadedVideo} controls className="w-full h-full object-contain rounded-2xl bg-black" />
                  <div className="absolute bottom-6 flex gap-4">
                    <button 
                      onClick={() => setUploadedVideo(null)}
                      className="px-6 py-2.5 rounded-full bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition-colors"
                    >
                      重新上传
                    </button>
                    <button 
                      onClick={startVideoEvaluation}
                      disabled={isEvaluating}
                      className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEvaluating ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> AI 评测中...</>
                      ) : (
                        <><CheckCircle className="w-5 h-5" /> 开始 AI 评测</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Script & Analysis */}
        <div className="flex flex-col gap-4 min-h-0">
          {/* Script Progress */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <MapIcon className="w-4 h-4" />
              话术逻辑拆解 ({currentScenario.productName})
            </h3>
            <div className="flex gap-2">
              {currentScenario.scriptStages.map((stage, idx) => (
                <button
                  key={stage.id}
                  onClick={() => setCurrentStage(idx)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    idx === currentStage
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : idx < currentStage
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Teleprompter */}
          <div className="flex-1 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-neutral-800">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStage + 1) / currentScenario.scriptStages.length) * 100}%` }}
              />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>当前阶段：{currentScenario.scriptStages[currentStage].label}</span>
              {currentStage < currentScenario.scriptStages.length - 1 && (
                <button 
                  onClick={handleNextStage}
                  className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                >
                  下一阶段 <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-2xl leading-relaxed font-medium text-neutral-300">
                {currentScenario.scriptStages[currentStage].text.split('').map((char, i) => {
                  const isSpoken = i < spokenText.length;
                  let isForbidden = false;
                  FORBIDDEN_WORDS.forEach(word => {
                    const wordIndex = currentScenario.scriptStages[currentStage].text.indexOf(word);
                    if (wordIndex !== -1 && i >= wordIndex && i < wordIndex + word.length) {
                      isForbidden = true;
                    }
                  });

                  return (
                    <span 
                      key={i} 
                      className={`transition-colors duration-200 ${
                        isForbidden && isSpoken 
                          ? 'text-red-500 font-bold bg-red-500/20 px-0.5 rounded' 
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

          {/* Forbidden Word Alert */}
          <div className={`rounded-2xl p-5 border transition-all duration-300 ${
            detectedWords.length > 0 
              ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
              : 'bg-neutral-900/80 border-neutral-800'
          }`}>
            <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
              <AlertTriangle className={`w-4 h-4 ${detectedWords.length > 0 ? 'text-red-500' : 'text-neutral-500'}`} />
              <span className={detectedWords.length > 0 ? 'text-red-400' : 'text-neutral-400'}>违禁词实时监测</span>
            </h3>
            
            {detectedWords.length > 0 ? (
              <div className="space-y-2">
                <div className="text-sm text-red-300">检测到违规话术：</div>
                <div className="flex flex-wrap gap-2">
                  {detectedWords.map((word, i) => (
                    <span key={i} className="px-2.5 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/30 flex items-center gap-1">
                      "{word}" <span className="text-[10px] bg-red-500/30 px-1 rounded text-red-300">{FORBIDDEN_DICT[word]}</span>
                    </span>
                  ))}
                </div>
                <div className="text-xs text-red-400/70 mt-2">直播规范提示：请使用客观、真实的描述，避免夸大宣传、极限词汇及医疗用语。</div>
              </div>
            ) : (
              <div className="text-sm text-neutral-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                当前话术合规，请继续保持
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Report Modal */}
      <AnimatePresence>
        {scoreReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md rounded-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <button 
                onClick={() => setScoreReport(null)}
                className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <BarChart className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">多维能力评测报告</h2>
                  <p className="text-neutral-400 text-sm">基于文旅直播标准的颗粒度分析</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Total Score */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-black/50 rounded-2xl border border-neutral-800 w-48">
                  <div className="text-sm text-neutral-400 mb-2">综合得分</div>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-600 mb-2">
                    {scoreReport.total}
                  </div>
                  <div className="flex text-blue-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(scoreReport.total / 20) ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                </div>

                {/* Granular Metrics */}
                <div className="flex-1 space-y-4">
                  {[
                    { label: '文旅情怀表达', score: scoreReport.sentiment, max: 20, color: 'bg-orange-500' },
                    { label: '情绪感染力', score: scoreReport.emotion, max: 20, color: 'bg-pink-500' },
                    { label: '话术完整度', score: scoreReport.completeness, max: 20, color: 'bg-blue-500' },
                    { label: '违禁词规避', score: scoreReport.compliance, max: 20, color: 'bg-cyan-500' },
                    { label: '互动响应度', score: scoreReport.interaction, max: 20, color: 'bg-purple-500' },
                  ].map((metric, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-300">{metric.label}</span>
                        <span className="font-bold text-white">{metric.score} <span className="text-neutral-600 font-normal">/ {metric.max}</span></span>
                      </div>
                      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(metric.score / metric.max) * 100}%` }}
                          transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                          className={`h-full ${metric.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> AI 导师点评
                </h4>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {scoreReport.feedback}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
