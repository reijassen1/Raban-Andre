import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Heart, AlertTriangle, Play, Square, ShoppingBag, ChevronRight, Upload, Video as VideoIcon, CheckCircle, BarChart, Star, X } from 'lucide-react';

// --- 10 Scenarios based on Xinjiang/Ili Agricultural Products ---
const SCENARIOS = [
  {
    id: 'zhaosu-honey',
    title: '昭苏天马浴河与黑蜂蜜',
    productName: '天山纯天然黑蜂蜜',
    originalPrice: '128.0',
    discountPrice: '68.0',
    imageUrl: 'https://images.unsplash.com/photo-1587049352847-4d4b126a51d5?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '哈喽直播间的家人们！我是你们的助农主播。今天我们来到了大美新疆，美丽的昭苏大草原！看这万马奔腾的天马浴河，震撼吗？' },
      { id: 'product', label: '讲品', text: '大家看我手里的这款黑蜂蜜，这是我们天山深处黑蜂采集的百花蜜，纯天然无添加，绝对是全网第一的品质！' },
      { id: 'action', label: '促单', text: '原价128元，今天助农专场只要68元！拍下就是对我们新疆牧民最大的支持，1号链接拼手速！' },
      { id: 'retain', label: '留存', text: '没抢到的家人不要走，点点关注，我们马上带大家继续看天马浴河，还有更多福利！' },
    ],
    mockComments: [
      { user: '新疆老乡', text: '昭苏太美了！' },
      { user: '吃货小分队', text: '黑蜂蜜确实好' },
      { user: '爱心助农', text: '支持贺局，支持新疆！' },
      { user: '买买买', text: '已经下单啦' },
    ]
  },
  {
    id: 'ili-lavender',
    title: '伊犁薰衣草精油',
    productName: '霍城单方薰衣草精油',
    originalPrice: '199.0',
    discountPrice: '89.0',
    imageUrl: 'https://images.unsplash.com/photo-1611078519658-45e0f760193c?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们，欢迎来到塞外江南——伊犁！我身后就是霍城的万亩薰衣草庄园，隔着屏幕都能闻到花香对不对？' },
      { id: 'product', label: '讲品', text: '这就是我们当地花农提炼的单方精油。滴一滴在枕头上，让你一秒入睡，简直是失眠的神药！' },
      { id: 'action', label: '促单', text: '线下专柜大几百，今天直播间助农破价，只要89！仅限500单，支持咱们花农，赶紧去拍！' },
      { id: 'retain', label: '留存', text: '拍完扣已拍，主播给大家抽送薰衣草干花包！没抢到的刷新一下！' },
    ],
    mockComments: [
      { user: '失眠星人', text: '真的助眠吗？' },
      { user: '花香四溢', text: '去过伊犁，真的很香' },
      { user: '支持助农', text: '已拍！' },
    ]
  },
  {
    id: 'nileke-jam',
    title: '尼勒克黑加仑果酱',
    productName: '纯手工黑加仑果酱',
    originalPrice: '99.0',
    discountPrice: '39.9',
    imageUrl: 'https://images.unsplash.com/photo-1585502621453-9121c2c310c1?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '欢迎来到直播间！今天带大家品尝新疆的“黑珍珠”，来自尼勒克的高山馈赠！' },
      { id: 'product', label: '讲品', text: '尼勒克高寒山区生长的黑加仑，满满的花青素！纯手工熬制，酸甜可口，绝对是果酱界的销量冠军！' },
      { id: 'action', label: '促单', text: '今天厂家直发，不要99，只要39.9带走两大罐！快去2号链接，给家里的老人孩子备上！' },
      { id: 'retain', label: '留存', text: '感谢大家对新疆农产品的支持，没抢到的刷新一下，运营再上50单！' },
    ],
    mockComments: [
      { user: '早餐达人', text: '抹吐司肯定好吃' },
      { user: '新疆特产', text: '黑加仑营养价值很高' },
      { user: '冲冲冲', text: '抢到了两罐' },
    ]
  },
  {
    id: 'tekes-apricot',
    title: '特克斯树上干杏',
    productName: '特级吊死干杏',
    originalPrice: '88.0',
    discountPrice: '49.9',
    imageUrl: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们好！这里是八卦城特克斯。今天给大家带来一款会“嘎嘣脆”的神奇杏子！' },
      { id: 'product', label: '讲品', text: '树上自然风干的吊死干杏！果肉香甜有嚼劲，里面的杏核咬开，杏仁又香又脆，可以说是极品中的顶级美味！' },
      { id: 'action', label: '促单', text: '今天助农价，49.9元直接发3斤！顺丰包邮到家，3号链接，拼手速啦！' },
      { id: 'retain', label: '留存', text: '感谢大家，你们的每一单都在帮助果农增收，点关注不迷路，带你游遍八卦城！' },
    ],
    mockComments: [
      { user: '八卦城', text: '特克斯是个好地方' },
      { user: '爱吃杏', text: '一果两吃太棒了' },
      { user: '已下单', text: '期待收货' },
    ]
  },
  {
    id: 'gongliu-walnut',
    title: '巩留野核桃',
    productName: '纸皮野核桃5斤装',
    originalPrice: '129.0',
    discountPrice: '69.9',
    imageUrl: 'https://images.unsplash.com/photo-1599598425947-330026216d05?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '直播间的家人们，今天我们走进了巩留的野核桃林！带大家看看真正的野生好货！' },
      { id: 'product', label: '讲品', text: '看这皮薄如纸的野核桃，轻轻一捏就碎，果仁饱满，满口生香，绝对是补脑首选，绝无仅有的好货！' },
      { id: 'action', label: '促单', text: '今天不按斤卖，按箱卖！一箱5斤只要69.9！4号链接，库存不多，抢到就是赚到！' },
      { id: 'retain', label: '留存', text: '抢到的家人扣个666，我们马上给大家展示怎么徒手剥核桃！' },
    ],
    mockComments: [
      { user: '补脑必备', text: '给高三孩子买一箱' },
      { user: '纯天然', text: '没漂白的吃着放心' },
      { user: '手速慢了', text: '还有吗？' },
    ]
  },
  {
    id: 'xinjiang-beef',
    title: '新疆褐牛牛肉干',
    productName: '原味风干牛肉干',
    originalPrice: '158.0',
    discountPrice: '88.0',
    imageUrl: 'https://images.unsplash.com/photo-1599487405705-0210e75551c9?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们，无肉不欢的时刻到了！带你们看看吃中草药、喝冰川水长大的新疆褐牛！' },
      { id: 'product', label: '讲品', text: '纯正风干牛肉，纹理清晰，越嚼越香！没有任何科技与狠活，这是以前的特供产品，百分之百纯牛肉！' },
      { id: 'action', label: '促单', text: '平时舍不得买的，今天助农补贴价，半斤装只要88！5号链接，手慢无！' },
      { id: 'retain', label: '留存', text: '感谢支持新疆畜牧业！没抢到的等一下，我让厂长再加点库存！' },
    ],
    mockComments: [
      { user: '健身达人', text: '减脂期能吃吗？' },
      { user: '肉食动物', text: '看着就流口水' },
      { user: '支持牧民', text: '已拍两单！' },
    ]
  },
  {
    id: 'yining-cheese',
    title: '伊宁手工奶疙瘩',
    productName: '传统酸甜奶疙瘩',
    originalPrice: '59.0',
    discountPrice: '29.9',
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '欢迎来到直播间！想不想尝尝新疆游牧民族的传统零食？带你找回童年的味道！' },
      { id: 'product', label: '讲品', text: '纯手工熬制的酸甜奶疙瘩，奶香浓郁，补钙佳品！没有任何防腐剂，可以说是全网独家的传统手艺！' },
      { id: 'action', label: '促单', text: '今天助农价，29.9元带走两大袋！6号链接，给孩子当零食健康又放心！' },
      { id: 'retain', label: '留存', text: '拍完的家人记得多喝水哦，喜欢新疆美食的点个关注，明天带大家吃烤肉！' },
    ],
    mockComments: [
      { user: '怀旧', text: '小时候最爱吃这个' },
      { user: '宝妈', text: '配料表干净吗？' },
      { user: '已购', text: '期待酸酸甜甜的味道' },
    ]
  },
  {
    id: 'qapqal-rice',
    title: '察布查尔大米',
    productName: '雪水灌溉香米10斤',
    originalPrice: '99.0',
    discountPrice: '59.9',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们，谁说新疆只有瓜果？今天带你们看看伊犁河谷的“白珍珠”！' },
      { id: 'product', label: '讲品', text: '察布查尔天山雪水灌溉的大米，晶莹剔透，煮出来的饭满屋飘香，软糯弹牙，不用配菜都能吃两碗！' },
      { id: 'action', label: '促单', text: '今天产地直发，10斤装只要59.9！7号链接，史无前例的最低价，让全家人吃上正宗的新疆好米！' },
      { id: 'retain', label: '留存', text: '感谢大家支持！拍下48小时内发货，保证新鲜！没抢到的扣1，我看看有多少人。' },
    ],
    mockComments: [
      { user: '干饭人', text: '新疆大米确实好吃' },
      { user: '主妇日常', text: '买一袋尝尝' },
      { user: '111', text: '1' },
    ]
  },
  {
    id: 'huocheng-sachet',
    title: '霍城薰衣草干花包',
    productName: '助眠薰衣草香囊5包',
    originalPrice: '39.0',
    discountPrice: '9.9',
    imageUrl: 'https://images.unsplash.com/photo-1558234394-4ce1b46b080b?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们，想不想把新疆的春天带回家？今天给大家送一波纯纯的福利！' },
      { id: 'product', label: '讲品', text: '纯天然薰衣草干花包，放在衣柜里防虫防蛀，放在枕边安神助眠，香味永久不散，简直是万能香囊！' },
      { id: 'action', label: '促单', text: '今天9.9元交个朋友，直接发5包！8号链接，闭眼入，就当支持我们伊犁文旅了！' },
      { id: 'retain', label: '留存', text: '9.9包邮纯粹是给大家送福利，感谢大家对伊犁文旅和农产品的支持，点点关注！' },
    ],
    mockComments: [
      { user: '太划算了', text: '9.9包邮老板亏本吧' },
      { user: '香香的', text: '放车里也可以' },
      { user: '已拍', text: '支持伊犁！' },
    ]
  },
  {
    id: 'xinjiang-chicken',
    title: '新疆大盘鸡调料包',
    productName: '秘制大盘鸡调料5包',
    originalPrice: '49.0',
    discountPrice: '19.9',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '哈喽家人们！想在家里做出正宗的新疆大盘鸡吗？今天教你一招！' },
      { id: 'product', label: '讲品', text: '秘制大盘鸡调料包，几十种香料科学配比。只需准备鸡肉和土豆，厨房小白也能秒变大厨，味道天下无敌！' },
      { id: 'action', label: '促单', text: '今天19.9元发5包！够做5次大盘鸡！9号链接，赶紧囤起来，周末给家人露一手！' },
      { id: 'retain', label: '留存', text: '拍完的家人，我马上在直播间教大家怎么做大盘鸡，皮带面怎么和，不要走开！' },
    ],
    mockComments: [
      { user: '吃货', text: '大盘鸡我的最爱' },
      { user: '手残党', text: '真的那么简单吗？' },
      { user: '已买', text: '坐等教程' },
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
  sentiment: number; // 助农情怀表达
  completeness: number; // 话术完整度
  compliance: number; // 违禁词规避
  emotion: number; // 情绪感染力
  interaction: number; // 互动响应度
  feedback: string;
}

export function LiveAgriculture() {
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
    
    let feedback = "表现非常出色！情感充沛，极具贺娇龙局长的助农风范，有效传递了新疆农产品的优势。";
    if (compliance < 15) feedback = "助农情怀表达很好，但请注意规避绝对化用语等违禁词，以免直播间被限流。";
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">直播助农实训</h2>
          <p className="text-neutral-400">依托新疆特色农副产品，打造沉浸式助农直播场景</p>
        </div>
        
        <div className="flex bg-neutral-900/80 p-1 rounded-xl border border-neutral-800 backdrop-blur-sm">
          <button
            onClick={() => { setActiveTab('live'); setScoreReport(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'live' ? 'bg-emerald-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <VideoIcon className="w-4 h-4" /> 实时直播实训
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setScoreReport(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'upload' ? 'bg-emerald-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
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
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">主播</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{currentScenario.title}</div>
                      <div className="text-[10px] text-neutral-300 flex items-center gap-1">
                        <Users className="w-3 h-3" /> 1.5w 观看
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
                      <span className="text-xs font-medium text-white">10.2w</span>
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
                          <span className="text-emerald-300 font-medium mr-2">{comment.user}:</span>
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
                      : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/30'
                  }`}
                >
                  {isLive ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  {isLive ? '结束助农直播' : '开始助农直播'}
                </button>
              </div>
            </>
          ) : (
            /* Upload Mode UI */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-neutral-900/50">
              {!uploadedVideo ? (
                <label className="w-full max-w-md aspect-video border-2 border-dashed border-neutral-700 rounded-3xl flex flex-col items-center justify-center p-8 text-neutral-400 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all cursor-pointer group">
                  <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                  <div className="w-16 h-16 rounded-full bg-neutral-800 group-hover:bg-emerald-500/20 flex items-center justify-center mb-4 transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">上传助农实训视频</h3>
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
                      className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <ShoppingBag className="w-4 h-4" />
              话术逻辑拆解 ({currentScenario.productName})
            </h3>
            <div className="flex gap-2">
              {currentScenario.scriptStages.map((stage, idx) => (
                <button
                  key={stage.id}
                  onClick={() => setCurrentStage(idx)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    idx === currentStage
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : idx < currentStage
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
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
                className="h-full bg-emerald-500"
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
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <button 
                onClick={() => setScoreReport(null)}
                className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <BarChart className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">多维能力评测报告</h2>
                  <p className="text-neutral-400 text-sm">基于贺娇龙式助农直播标准的颗粒度分析</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Total Score */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-black/50 rounded-2xl border border-neutral-800 w-48">
                  <div className="text-sm text-neutral-400 mb-2">综合得分</div>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 mb-2">
                    {scoreReport.total}
                  </div>
                  <div className="flex text-emerald-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(scoreReport.total / 20) ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                </div>

                {/* Granular Metrics */}
                <div className="flex-1 space-y-4">
                  {[
                    { label: '助农情怀表达', score: scoreReport.sentiment, max: 20, color: 'bg-orange-500' },
                    { label: '情绪感染力', score: scoreReport.emotion, max: 20, color: 'bg-pink-500' },
                    { label: '话术完整度', score: scoreReport.completeness, max: 20, color: 'bg-blue-500' },
                    { label: '违禁词规避', score: scoreReport.compliance, max: 20, color: 'bg-emerald-500' },
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

              <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <h4 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
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
