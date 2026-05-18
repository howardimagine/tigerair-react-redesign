import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles, Send, Hotel, Utensils, MapPin, Train, Plane, Check,
  Bot, RotateCw, ShoppingCart, Calendar, Ticket, Map,
} from 'lucide-react';
import { useBoardingPasses } from '../context/BoardingPassesContext';

// Destination-themed trip seeds — mock plan content
const tripSeeds = {
  NRT: {
    name: '東京',
    hotels: [
      { name: '東京新宿京王廣場大飯店', area: '新宿', stars: 4, nights: 4, price: 16800, img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=240&fit=crop' },
      { name: 'Shibuya Granbell', area: '澀谷', stars: 4, nights: 4, price: 14400, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=240&fit=crop' },
    ],
    attractions: [
      { name: '東京迪士尼海洋', kind: '主題樂園', price: 2800, day: 1 },
      { name: 'teamLab Planets 浸沉式藝術', kind: '展覽', price: 1280, day: 2 },
      { name: '東京晴空塔展望台', kind: '景點', price: 1080, day: 3 },
      { name: '淺草寺 + 雷門', kind: '景點', price: 0, day: 3 },
    ],
    restaurants: [
      { name: '一蘭拉麵 澀谷店', kind: '拉麵', avgPrice: 480 },
      { name: '築地玉壽司 銀座本店', kind: '壽司', avgPrice: 1800 },
      { name: '炭火燒肉 久 新宿店', kind: '燒肉', avgPrice: 2200 },
      { name: '台場 GUNDAM 咖啡店', kind: '主題餐廳', avgPrice: 980 },
    ],
    transit: [
      { day: 1, item: '機場 → 新宿', mode: 'N’EX 成田特快', price: 3070 },
      { day: 5, item: '飯店 → 機場', mode: '京成 Skyliner', price: 2570 },
      { day: '每日', item: '市區移動', mode: '東京 Metro 72hr Pass', price: 1500 },
    ],
  },
  KIX: {
    name: '大阪',
    hotels: [
      { name: '大阪難波光芒飯店', area: '難波', stars: 4, nights: 4, price: 12800, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=240&fit=crop' },
      { name: 'Cross Hotel Osaka', area: '心齋橋', stars: 4, nights: 4, price: 15200, img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=240&fit=crop' },
    ],
    attractions: [
      { name: '日本環球影城 USJ', kind: '主題樂園', price: 3380, day: 1 },
      { name: '大阪城公園 + 天守閣', kind: '景點', price: 320, day: 2 },
      { name: '京都嵐山一日遊', kind: '一日遊', price: 1980, day: 3 },
      { name: '海遊館 + 通天閣', kind: '景點', price: 1280, day: 4 },
    ],
    restaurants: [
      { name: '蟹道樂 道頓堀本店', kind: '螃蟹料理', avgPrice: 3500 },
      { name: '551 蓬萊 難波本店', kind: '中華包子', avgPrice: 380 },
      { name: '一蘭拉麵 道頓堀店', kind: '拉麵', avgPrice: 480 },
      { name: '元祖大阪燒 美津の', kind: '大阪燒', avgPrice: 1200 },
    ],
    transit: [
      { day: 1, item: '機場 → 難波', mode: 'Rapi:t 特急', price: 1450 },
      { day: 5, item: '飯店 → 機場', mode: 'JR HARUKA', price: 2380 },
      { day: '每日', item: '市區移動', mode: '大阪周遊卡 2 日', price: 1400 },
    ],
  },
  OKA: {
    name: '沖繩',
    hotels: [
      { name: '沖繩文藝復興度假村', area: '恩納', stars: 5, nights: 4, price: 24800, img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=240&fit=crop' },
      { name: '凱悅那霸沖繩酒店', area: '國際通', stars: 4, nights: 4, price: 18800, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=240&fit=crop' },
    ],
    attractions: [
      { name: '美麗海水族館', kind: '景點', price: 690, day: 1 },
      { name: '萬座毛 + 古宇利大橋', kind: '景點', price: 0, day: 2 },
      { name: '青之洞窟浮潛', kind: '海上活動', price: 3200, day: 3 },
      { name: '首里城 + 國際通逛街', kind: '景點', price: 280, day: 4 },
    ],
    restaurants: [
      { name: '燒肉本部牧場', kind: '燒肉', avgPrice: 2400 },
      { name: '通堂拉麵', kind: '拉麵', avgPrice: 380 },
      { name: '美ら海 海鮮市場', kind: '海鮮', avgPrice: 1600 },
      { name: '塩屋 雪鹽冰淇淋', kind: '甜點', avgPrice: 180 },
    ],
    transit: [
      { day: 1, item: '機場 → 飯店', mode: '機場巴士', price: 380 },
      { day: '每日', item: '租車自駕', mode: '小型房車 4 日', price: 8400 },
    ],
  },
  ICN: {
    name: '首爾',
    hotels: [
      { name: 'L7 Gangnam', area: '江南', stars: 4, nights: 4, price: 13600, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=240&fit=crop' },
      { name: 'Lotte Hotel Seoul', area: '明洞', stars: 5, nights: 4, price: 21600, img: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&h=240&fit=crop' },
    ],
    attractions: [
      { name: '愛寶樂園 EVERLAND', kind: '主題樂園', price: 1480, day: 1 },
      { name: '景福宮 + 北村韓屋村', kind: '景點', price: 80, day: 2 },
      { name: 'N 首爾塔 + 明洞夜市', kind: '景點', price: 480, day: 3 },
      { name: '弘大商圈 + 滑雪場一日遊', kind: '冬季活動', price: 2200, day: 4 },
    ],
    restaurants: [
      { name: '陳玉華一隻雞', kind: '韓式料理', avgPrice: 600 },
      { name: 'BHC 炸雞', kind: '炸雞', avgPrice: 480 },
      { name: '土俗村蔘雞湯', kind: '蔘雞湯', avgPrice: 580 },
      { name: '弘大豬肉湯飯', kind: '在地小吃', avgPrice: 280 },
    ],
    transit: [
      { day: 1, item: '機場 → 明洞', mode: 'AREX 機場快線', price: 280 },
      { day: 5, item: '飯店 → 機場', mode: '機場巴士', price: 380 },
      { day: '每日', item: '市區移動', mode: 'T-Money 卡', price: 600 },
    ],
  },
  HKT: {
    name: '普吉島',
    hotels: [
      { name: 'JW Marriott Phuket Resort', area: 'Mai Khao Beach', stars: 5, nights: 4, price: 32800, img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=240&fit=crop' },
      { name: 'Patong Bay Hill Resort', area: 'Patong', stars: 4, nights: 4, price: 14400, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=240&fit=crop' },
    ],
    attractions: [
      { name: 'PP 島跳島一日遊', kind: '海上活動', price: 2400, day: 1 },
      { name: 'Big Buddha 大佛廟', kind: '景點', price: 0, day: 2 },
      { name: '泰式按摩 SPA', kind: '療癒', price: 1500, day: 3 },
      { name: '幻多奇 Phuket FantaSea 秀', kind: '表演', price: 1680, day: 3 },
    ],
    restaurants: [
      { name: 'Tu Kab Khao 泰式餐廳', kind: '泰式料理', avgPrice: 800 },
      { name: 'Surf and Turf by Soul Kitchen', kind: '海景餐廳', avgPrice: 1600 },
      { name: 'Raya Restaurant', kind: '在地老店', avgPrice: 700 },
      { name: 'Saneh Jaan Phuket', kind: '泰皇室料理', avgPrice: 2200 },
    ],
    transit: [
      { day: 1, item: '機場 → 飯店', mode: '機場接駁車', price: 600 },
      { day: '每日', item: '島內移動', mode: 'Grab + 嘟嘟車', price: 2400 },
    ],
  },
};

const fallbackSeed = tripSeeds.NRT;

const GenAnimation = ({ destinationName, onDone }) => {
  const stages = [
    '正在分析你的航班...',
    `根據 ${destinationName || '目的地'} 天氣與季節挑選熱門景點...`,
    '比對合作飯店價格與評價...',
    '安排每日餐廳與交通建議...',
    '客製化你的專屬行程 ✨',
  ];
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    if (stageIdx >= stages.length - 1) {
      const t = setTimeout(() => onDone(), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStageIdx((s) => s + 1), 800);
    return () => clearTimeout(t);
  }, [stageIdx, onDone, stages.length]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Spinning gradient ring */}
        <div className="absolute inset-0 animate-spin rounded-full bg-gradient-to-tr from-primary via-fuchsia-500 to-violet-600" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-2 rounded-full bg-gray-950" />
        <Sparkles className="relative h-10 w-10 animate-pulse text-primary" />
      </div>
      <h2 className="mt-8 text-2xl font-black text-white sm:text-3xl">
        <span className="bg-gradient-to-r from-primary via-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
          AI 正在為你規劃旅程
        </span>
      </h2>
      <div className="mt-6 w-full max-w-md space-y-2">
        {stages.slice(0, stageIdx + 1).map((s, i) => (
          <div
            key={s}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
              i === stageIdx ? 'bg-primary/15 text-white' : 'text-white/60'
            }`}
          >
            {i < stageIdx ? (
              <Check className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            ) : (
              <span className="h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-primary" />
            )}
            <span>{s}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-white/40">通常需要 5–10 秒</p>
    </div>
  );
};

const TripPlanContent = ({ plan, onRegen }) => {
  const total = plan.hotels[0].price + plan.attractions.reduce((s, a) => s + a.price, 0) + plan.transit.reduce((s, a) => s + a.price, 0);

  return (
    <div className="space-y-4">
      {/* Hero block */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-fuchsia-500/10 to-violet-500/10 ring-1 ring-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Trip Plan</p>
            <h2 className="mt-0.5 text-xl font-bold text-white sm:text-2xl">{plan.dateRange} · {plan.name}之旅</h2>
            <p className="mt-1 text-xs text-white/70">{plan.duration} · 2 大人 1 嬰兒 · 預估 NT$ {total.toLocaleString()}</p>
          </div>
          <button
            type="button"
            onClick={onRegen}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <RotateCw className="h-3.5 w-3.5" /> 重新生成
          </button>
        </div>
      </div>

      {/* Hotels */}
      <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <div className="mb-3 flex items-center gap-2 text-white">
          <Hotel className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">建議入住</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {plan.hotels.map((h, idx) => (
            <div key={h.name} className={`overflow-hidden rounded-xl bg-gray-900/70 ring-1 ${idx === 0 ? 'ring-primary' : 'ring-white/10'}`}>
              <img src={h.img} alt={h.name} className="h-32 w-full object-cover" />
              <div className="p-3 text-white">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-bold">{h.name}</p>
                  {idx === 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold">推薦</span>}
                </div>
                <p className="mt-0.5 text-[10px] text-white/60">{h.area} · {'★'.repeat(h.stars)} · {h.nights} 晚</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-black text-primary">NT$ {h.price.toLocaleString()}</span>
                  <button type="button" className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white hover:bg-primary-dark">
                    <ShoppingCart className="h-3 w-3" /> 一鍵預訂
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily attractions */}
      <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <div className="mb-3 flex items-center gap-2 text-white">
          <Ticket className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">門票 & 景點</h3>
        </div>
        <div className="space-y-2">
          {plan.attractions.map((a) => (
            <div key={a.name} className="flex items-center gap-3 rounded-lg bg-gray-900/70 p-3 text-white ring-1 ring-white/10">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20 text-xs font-bold text-primary">
                Day {a.day}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold">{a.name}</p>
                <p className="text-[10px] text-white/60">{a.kind}</p>
              </div>
              <span className="text-sm font-bold text-primary">
                {a.price === 0 ? '免費' : `NT$ ${a.price.toLocaleString()}`}
              </span>
              <button type="button" className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white hover:bg-primary-dark">
                訂購
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurants */}
      <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <div className="mb-3 flex items-center gap-2 text-white">
          <Utensils className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">必吃餐廳</h3>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {plan.restaurants.map((r) => (
            <div key={r.name} className="flex items-center justify-between gap-2 rounded-lg bg-gray-900/70 p-3 text-white ring-1 ring-white/10">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{r.name}</p>
                <p className="text-[10px] text-white/60">{r.kind} · 人均 NT$ {r.avgPrice}</p>
              </div>
              <button type="button" className="rounded-lg border border-white/20 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-white/10">
                訂位
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Transit */}
      <section className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <div className="mb-3 flex items-center gap-2 text-white">
          <Train className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">交通安排</h3>
        </div>
        <div className="space-y-2">
          {plan.transit.map((t, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-gray-900/70 p-3 text-white ring-1 ring-white/10">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20 text-[10px] font-bold text-primary">
                {typeof t.day === 'number' ? `Day ${t.day}` : t.day}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold">{t.item}</p>
                <p className="text-[10px] text-white/60">{t.mode}</p>
              </div>
              <span className="text-sm font-bold text-primary">NT$ {t.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Total + bulk order */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-fuchsia-600 to-violet-600 p-5 text-white shadow-2xl shadow-primary/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total</p>
            <p className="mt-1 text-3xl font-black">NT$ {total.toLocaleString()}</p>
            <p className="text-xs opacity-80">含飯店 + 門票 + 交通（餐廳費用另計）</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-primary shadow-lg transition hover:scale-105">
            <ShoppingCart className="h-4 w-4" /> 一鍵全部訂購
          </button>
        </div>
      </section>
    </div>
  );
};

const ChatPanel = ({ onAsk }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: '嗨！我是你的旅程 AI 助手 — 你可以說「再多排一些親子景點」或「換成預算更低的飯店」，我會即時調整行程。' },
  ]);
  const submit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    const user = input.trim();
    setMessages((m) => [...m, { role: 'user', text: user }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: `好的，我已根據「${user}」調整了行程，請查看右側結果。` }]);
      onAsk?.(user);
    }, 600);
  };

  return (
    <div className="flex h-[480px] flex-col rounded-2xl bg-white/5 ring-1 ring-white/10">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary"><Bot className="h-4 w-4" /></span>
        <div className="flex-1">
          <p className="text-sm font-bold">Trip AI</p>
          <p className="text-[10px] text-emerald-400">● 線上中</p>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
              m.role === 'user' ? 'bg-primary text-white' : 'bg-white/10 text-white'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="告訴 AI 你想怎麼調整..."
          className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
        />
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-white hover:bg-primary-dark">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

const MyTrips = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { passes } = useBoardingPasses();

  const destinationCode = location.state?.destination || passes[0]?.flight?.to || 'NRT';
  const seed = tripSeeds[destinationCode] || fallbackSeed;
  const destinationName = location.state?.destinationName || seed.name;

  const dateRange = useMemo(() => {
    const date = passes.find((p) => p.flight.to === destinationCode)?.flight?.date || '2026-06-15';
    const start = new Date(date);
    const end = new Date(start.getTime() + 4 * 86400000);
    const fmt = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
    return `${fmt(start)} - ${fmt(end)}`;
  }, [passes, destinationCode]);

  const plan = useMemo(() => ({
    name: destinationName,
    duration: '5 天 4 夜',
    dateRange,
    hotels: seed.hotels,
    attractions: seed.attractions,
    restaurants: seed.restaurants,
    transit: seed.transit,
  }), [destinationName, dateRange, seed]);

  const [generating, setGenerating] = useState(true);
  const handleRegen = () => {
    setGenerating(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <div className="relative -mt-14 overflow-hidden bg-gradient-to-b from-black via-gray-950 to-gray-900 pt-14 md:-mt-16 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,168,54,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(168,85,247,0.18),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-white shadow-lg shadow-primary/40">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Trip Planner</p>
                <h1 className="text-xl font-bold text-white sm:text-2xl">我的行程 — {destinationName}</h1>
                <p className="mt-0.5 text-xs text-white/60">{dateRange} · AI 自動規劃 · 隨時與 AI 對話調整</p>
              </div>
            </div>
            <button type="button" onClick={() => navigate(-1)} className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20">
              返回登機證
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {generating ? (
          <GenAnimation destinationName={destinationName} onDone={() => setGenerating(false)} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <TripPlanContent plan={plan} onRegen={handleRegen} />
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <ChatPanel onAsk={() => {/* noop in demo */}} />
              <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] text-white/60">
                <p className="font-bold text-white/80">⚡ 快速試試</p>
                <ul className="mt-2 space-y-1">
                  <li>· 「換成更便宜的飯店」</li>
                  <li>· 「我喜歡親子景點」</li>
                  <li>· 「素食餐廳推薦」</li>
                  <li>· 「Day 3 改成自由活動」</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
