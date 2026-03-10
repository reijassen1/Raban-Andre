import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Heart, AlertTriangle, Play, Square, ShoppingBag, ChevronRight, Upload, Video as VideoIcon, CheckCircle, BarChart, Star, X } from 'lucide-react';

// --- 10 Scenarios based on Xinjiang E-commerce Products ---
const SCENARIOS = [
  {
    id: 'cotton-towel',
    title: '产地溯源：长绒棉浴巾',
    productName: '新疆长绒棉加厚浴巾',
    originalPrice: '129.0',
    discountPrice: '59.0',
    imageUrl: 'https://images.unsplash.com/photo-1584949514123-474cb0c62bd3?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '哈喽直播间的宝宝们！今天给大家带来的是我们新疆的骄傲——真正的阿克苏长绒棉！' },
      { id: 'product', label: '讲品', text: '大家看这毛巾的厚度，吸水性是普通纯棉的3倍！日照超过3000小时的棉花，柔软亲肤，绝对是全网第一的品质！' },
      { id: 'action', label: '促单', text: '线下超市一条就要上百元，今天直播间厂家直发，59元直接带走两条！1号链接，拼手速！' },
      { id: 'retain', label: '留存', text: '没抢到的宝宝不要走，点点关注，我们马上上下一波新疆好物福利！' },
    ],
    mockComments: [
      { user: '居家小能手', text: '新疆棉花确实好' },
      { user: '买买买', text: '已经拍了，期待柔软度' },
      { user: '支持国货', text: '支持新疆棉！' },
    ]
  },
  {
    id: 'hetian-jade',
    title: '文化讲书：和田玉平安扣',
    productName: '羊脂级和田玉平安扣',
    originalPrice: '2999.0',
    discountPrice: '999.0',
    imageUrl: 'https://images.unsplash.com/photo-1599643478524-fb66f70d0082?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '欢迎来到直播间！今天带大家品鉴东方之美，来自新疆玉龙喀什河的馈赠。' },
      { id: 'product', label: '讲品', text: '看这枚平安扣，温润如脂，白如截肪。佩戴和田玉不仅是气质的象征，更是保平安的美好寓意，可以说是极品中的极品！' },
      { id: 'action', label: '促单', text: '今天源头直供，省去中间商差价，只要999元！附带国检证书，2号链接仅限10单！' },
      { id: 'retain', label: '留存', text: '抢到的翠友扣个已拍，主播给大家展示一下怎么用手电筒打光看玉的结构。' },
    ],
    mockComments: [
      { user: '玉石爱好者', text: '看着很润啊' },
      { user: '送礼佳品', text: '有证书吗？' },
      { user: '手速慢了', text: '还有吗？' },
    ]
  },
  {
    id: 'lavender-hydrosol',
    title: '成分解析：薰衣草纯露',
    productName: '伊犁薰衣草纯露500ml',
    originalPrice: '158.0',
    discountPrice: '68.0',
    imageUrl: 'https://images.unsplash.com/photo-1611078519658-45e0f760193c?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '熬夜跨脸、皮肤出油的姐妹们看过来！今天带你们走进伊犁的万亩花海！' },
      { id: 'product', label: '讲品', text: '配料表只有水和薰衣草提取物！古法蒸馏，深层补水控油，一秒吸收，简直是油痘肌的神药！' },
      { id: 'action', label: '促单', text: '今天品牌方破价，500ml大容量只要68元，还送喷雾瓶！3号链接，赶紧去囤货！' },
      { id: 'retain', label: '留存', text: '拍完的姐妹扣已拍，我教大家怎么用纯露做水疗湿敷，效果翻倍！' },
    ],
    mockComments: [
      { user: '油皮亲妈', text: '夏天用正好' },
      { user: '成分党', text: '无添加很安心' },
      { user: '冲冲冲', text: '抢到了两瓶' },
    ]
  },
  {
    id: 'camel-milk',
    title: '痛点营销：新疆骆驼奶粉',
    productName: '初乳配方骆驼奶粉',
    originalPrice: '398.0',
    discountPrice: '198.0',
    imageUrl: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家里有老人小孩、抵抗力差的家人们，停下脚步！今天给大家带来沙漠里的“软黄金”！' },
      { id: 'product', label: '讲品', text: '来自新疆双峰驼的初乳，钙含量是牛奶的数倍，小分子更好吸收。喝了它包治百病，绝对是补充营养的首选！' },
      { id: 'action', label: '促单', text: '今天厂家直补，买一罐送一罐，198元带走两大罐！4号链接，给家人最好的健康投资！' },
      { id: 'retain', label: '留存', text: '感谢大家，你们的每一单都是对健康的负责，点关注，每天分享养生小知识！' },
    ],
    mockComments: [
      { user: '孝心满满', text: '买给爸妈喝' },
      { user: '乳糖不耐受', text: '这个喝了会拉肚子吗？' },
      { user: '已下单', text: '期待效果' },
    ]
  },
  {
    id: 'atlas-silk',
    title: '非遗传承：艾德莱斯丝巾',
    productName: '非遗手工真丝丝巾',
    originalPrice: '258.0',
    discountPrice: '128.0',
    imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '直播间的仙女们，今天带大家领略流传千年的西域色彩美学——艾德莱斯绸！' },
      { id: 'product', label: '讲品', text: '100%桑蚕丝，纯手工扎染工艺，每一条的纹理都是独一无二的。戴上它，你就是整条街最靓的风景，绝无仅有的艺术品！' },
      { id: 'action', label: '促单', text: '今天非遗文化推广价，只要128元！5号链接，送妈妈、送闺蜜都非常有面子！' },
      { id: 'retain', label: '留存', text: '抢到的姐妹扣个666，我马上给大家演示三种丝巾的高级系法！' },
    ],
    mockComments: [
      { user: '丝巾控', text: '颜色太好看了' },
      { user: '民族风', text: '很有新疆特色' },
      { user: '手速慢了', text: '还有别的颜色吗？' },
    ]
  },
  {
    id: 'wool-carpet',
    title: '场景代入：手工羊毛地毯',
    productName: '新疆和田手工羊毛地毯',
    originalPrice: '1580.0',
    discountPrice: '880.0',
    imageUrl: 'https://images.unsplash.com/photo-1534889156217-d643df14f14a?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '想让家里的客厅瞬间提升几个档次吗？家人们，看看我脚下踩的这块艺术品！' },
      { id: 'product', label: '讲品', text: '新疆和田纯羊毛手工编织，植物染色，踩上去软糯舒适。铺在家里，整个空间的格调瞬间拉满，百分之百的高级感！' },
      { id: 'action', label: '促单', text: '线下实体店大几千，今天直播间工厂清仓，只要880！6号链接，仅限最后10条！' },
      { id: 'retain', label: '留存', text: '感谢支持新疆手工艺！没抢到的等一下，我让厂长再拿几条不同花色的出来！' },
    ],
    mockComments: [
      { user: '家居达人', text: '铺在沙发前肯定好看' },
      { user: '好打理吗', text: '羊毛的怎么清洗？' },
      { user: '支持手艺人', text: '已拍！' },
    ]
  },
  {
    id: 'daily-nuts',
    title: '吃播诱惑：每日坚果',
    productName: '吐鲁番葡萄干每日坚果',
    originalPrice: '89.0',
    discountPrice: '49.9',
    imageUrl: 'https://images.unsplash.com/photo-1599598425947-330026216d05?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '下午茶时间到！肚子饿的宝宝们看过来，今天带你们吃点健康又解馋的！' },
      { id: 'product', label: '讲品', text: '里面有吐鲁番的黑加仑葡萄干、阿克苏的核桃仁、巴旦木！科学配比，营养均衡，可以说是全网最好吃的坚果组合！' },
      { id: 'action', label: '促单', text: '今天49.9元直接发一大箱，整整30小包！7号链接，够吃一个月，快去抢！' },
      { id: 'retain', label: '留存', text: '拍完的家人记得多喝水哦，喜欢新疆美食的点个关注，明天带大家吃烤肉！' },
    ],
    mockComments: [
      { user: '办公室零食', text: '每天一包很方便' },
      { user: '宝妈', text: '小孩子能吃吗？' },
      { user: '已购', text: '期待酸酸甜甜的味道' },
    ]
  },
  {
    id: 'copper-craft',
    title: '工艺展示：喀什铜器',
    productName: '喀什手工雕花铜壶',
    originalPrice: '399.0',
    discountPrice: '199.0',
    imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '家人们，听这清脆的敲击声！今天带大家走进喀什老城，看看传承百年的铜器手工艺！' },
      { id: 'product', label: '讲品', text: '看这把铜壶上的雕花，全都是老手艺人一锤一锤敲出来的。不仅是实用的茶具，更是值得收藏的艺术品，天下无敌的精美！' },
      { id: 'action', label: '促单', text: '今天手艺人直供，不要399，只要199！8号链接，让非遗手艺走进千家万户！' },
      { id: 'retain', label: '留存', text: '感谢大家支持！拍下48小时内发货，没抢到的扣1，我看看有多少人。' },
    ],
    mockComments: [
      { user: '茶具控', text: '用来泡茶肯定有感觉' },
      { user: '匠人精神', text: '致敬手艺人' },
      { user: '111', text: '1' },
    ]
  },
  {
    id: 'tomato-hotpot',
    title: '福利秒杀：番茄火锅底料',
    productName: '新疆番茄火锅底料3包',
    originalPrice: '59.0',
    discountPrice: '29.9',
    imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '不能吃辣的宝宝们有福了！今天给大家带来新疆的阳光味道——番茄火锅底料！' },
      { id: 'product', label: '讲品', text: '选用新疆日照充足的红熟番茄熬制，酸甜浓郁，汤都能喝光！没有任何科技与狠活，绝对是火锅底料的销量冠军！' },
      { id: 'action', label: '促单', text: '今天29.9元交个朋友，直接发3大包！9号链接，闭眼入，周末在家吃顿好的！' },
      { id: 'retain', label: '留存', text: '29.9包邮纯粹是给大家送福利，感谢大家的支持，点点关注！' },
    ],
    mockComments: [
      { user: '太划算了', text: '酸汤肥牛安排上' },
      { user: '番茄控', text: '新疆番茄确实好' },
      { user: '已拍', text: '支持！' },
    ]
  },
  {
    id: 'rose-tea',
    title: '生活方式：和田玫瑰花茶',
    productName: '和田玫瑰花茶礼盒',
    originalPrice: '129.0',
    discountPrice: '69.9',
    imageUrl: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?auto=format&fit=crop&w=200&q=80',
    scriptStages: [
      { id: 'intro', label: '引流', text: '哈喽家人们！想要气色红润有光泽吗？今天教你一招养颜秘籍！' },
      { id: 'product', label: '讲品', text: '来自塔克拉玛干沙漠边缘的和田玫瑰，花冠饱满，精油含量极高。每天泡一杯，让你素颜也好看，效果史无前例的好！' },
      { id: 'action', label: '促单', text: '今天精美礼盒装，只要69.9元！10号链接，赶紧囤起来，送自己送闺蜜都合适！' },
      { id: 'retain', label: '留存', text: '拍完的家人，我马上在直播间教大家怎么搭配红枣枸杞泡茶，不要走开！' },
    ],
    mockComments: [
      { user: '养生少女', text: '玫瑰花茶我的最爱' },
      { user: '颜值高', text: '礼盒很好看' },
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
  sentiment: number; // 商业转化力
  completeness: number; // 话术完整度
  compliance: number; // 违禁词规避
  emotion: number; // 情绪感染力
  interaction: number; // 互动响应度
  feedback: string;
}

export function LiveStreaming() {
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
    
    let feedback = "表现非常出色！带货节奏紧凑，痛点抓得准，有效激发了用户的购买欲望。";
    if (compliance < 15) feedback = "商业转化力不错，但请注意规避绝对化用语等违禁词，以免直播间被限流或封禁。";
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
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">直播带货实训</h2>
          <p className="text-neutral-400">依托新疆特色好物，打造沉浸式带货直播场景</p>
        </div>
        
        <div className="flex bg-neutral-900/80 p-1 rounded-xl border border-neutral-800 backdrop-blur-sm">
          <button
            onClick={() => { setActiveTab('live'); setScoreReport(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'live' ? 'bg-purple-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <VideoIcon className="w-4 h-4" /> 实时直播实训
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setScoreReport(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'upload' ? 'bg-purple-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
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
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
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
                          <span className="text-purple-300 font-medium mr-2">{comment.user}:</span>
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
                      : 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-500/30'
                  }`}
                >
                  {isLive ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  {isLive ? '结束带货直播' : '开始带货直播'}
                </button>
              </div>
            </>
          ) : (
            /* Upload Mode UI */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-neutral-900/50">
              {!uploadedVideo ? (
                <label className="w-full max-w-md aspect-video border-2 border-dashed border-neutral-700 rounded-3xl flex flex-col items-center justify-center p-8 text-neutral-400 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/5 transition-all cursor-pointer group">
                  <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                  <div className="w-16 h-16 rounded-full bg-neutral-800 group-hover:bg-purple-500/20 flex items-center justify-center mb-4 transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">上传带货实训视频</h3>
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
                      className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                      : idx < currentStage
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
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
                className="h-full bg-purple-500"
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
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <button 
                onClick={() => setScoreReport(null)}
                className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <BarChart className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">多维能力评测报告</h2>
                  <p className="text-neutral-400 text-sm">基于带货直播标准的颗粒度分析</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Total Score */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-black/50 rounded-2xl border border-neutral-800 w-48">
                  <div className="text-sm text-neutral-400 mb-2">综合得分</div>
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-600 mb-2">
                    {scoreReport.total}
                  </div>
                  <div className="flex text-purple-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(scoreReport.total / 20) ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                </div>

                {/* Granular Metrics */}
                <div className="flex-1 space-y-4">
                  {[
                    { label: '商业转化力', score: scoreReport.sentiment, max: 20, color: 'bg-orange-500' },
                    { label: '情绪感染力', score: scoreReport.emotion, max: 20, color: 'bg-pink-500' },
                    { label: '话术完整度', score: scoreReport.completeness, max: 20, color: 'bg-blue-500' },
                    { label: '违禁词规避', score: scoreReport.compliance, max: 20, color: 'bg-purple-500' },
                    { label: '互动响应度', score: scoreReport.interaction, max: 20, color: 'bg-indigo-500' },
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

              <div className="mt-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <h4 className="text-purple-400 font-bold text-sm mb-2 flex items-center gap-2">
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
