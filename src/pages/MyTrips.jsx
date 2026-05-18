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
    '客製化你的專屬行程',
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
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-primary" style={{ animationDuration: '1.4s' }} />
        <Sparkles className="relative h-7 w-7 text-primary" />
      </div>
      <h2 className="mt-7 text-xl font-semibold text-white sm:text-2xl">
        正在為你規劃旅程
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

const TimelineNode = ({ children, last }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-primary/40 bg-gray-900 text-primary">
        {children.icon}
      </div>
      {!last && <div className="my-2 flex-1 w-px bg-white/10" />}
    </div>
    <div className={`flex-1 ${last ? 'pb-0' : 'pb-7'}`}>
      {children.content}
    </div>
  </div>
);

const formatDate = (start, offsetDays) => {
  const d = new Date(start);
  d.setDate(d.getDate() + offsetDays);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

const buildTimeline = (plan, startDate) => {
  const totalDays = 5; // 5 days, 4 nights
  const days = Array.from({ length: totalDays }, (_, i) => ({
    num: i + 1,
    date: formatDate(startDate, i),
    items: [],
  }));
  // Day 1: arrival transit
  const arrival = plan.transit.find((t) => t.day === 1);
  if (arrival) days[0].items.push({ ...arrival, _type: 'transit' });
  // Each day's attractions
  plan.attractions.forEach((a) => {
    const dIdx = Math.min((a.day || 1) - 1, totalDays - 2);
    days[dIdx].items.push({ ...a, _type: 'attraction' });
  });
  // Spread restaurants — 1 per day from day 1 onwards
  plan.restaurants.slice(0, totalDays - 1).forEach((r, i) => {
    days[i].items.push({ ...r, _type: 'restaurant' });
  });
  // Departure transit on last day
  const dep = plan.transit.find((t) => t.day === 5 || t.day === totalDays);
  if (dep) days[totalDays - 1].items.push({ ...dep, _type: 'transit' });
  // Daily-passes/transit
  const daily = plan.transit.find((t) => t.day === '每日');
  if (daily) days[0].items.push({ ...daily, _type: 'transit', dailyPass: true });
  return days;
};

const ItemCard = ({ item }) => {
  const baseClasses = 'rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/20';
  if (item._type === 'attraction') {
    return (
      <div className={baseClasses}>
        <div className="flex items-start gap-3">
          <Ticket className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/40" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{item.name}</p>
            <p className="mt-0.5 text-[11px] text-white/50">{item.kind}</p>
          </div>
          <div className="text-right">
            <span className="block text-xs font-semibold text-white">
              {item.price === 0 ? '免費' : `NT$ ${item.price.toLocaleString()}`}
            </span>
            <button type="button" className="mt-1 text-[11px] text-primary hover:underline">
              訂購門票
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (item._type === 'restaurant') {
    return (
      <div className={baseClasses}>
        <div className="flex items-start gap-3">
          <Utensils className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/40" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{item.name}</p>
            <p className="mt-0.5 text-[11px] text-white/50">{item.kind} · 人均 NT$ {item.avgPrice}</p>
          </div>
          <button type="button" className="self-center whitespace-nowrap text-[11px] text-primary hover:underline">
            訂位
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={baseClasses}>
      <div className="flex items-start gap-3">
        <Train className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/40" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{item.item}</p>
          <p className="mt-0.5 text-[11px] text-white/50">{item.mode}</p>
        </div>
        <span className="self-center whitespace-nowrap text-xs font-semibold text-white">NT$ {item.price.toLocaleString()}</span>
      </div>
    </div>
  );
};

const TripPlanContent = ({ plan, onRegen, startDate }) => {
  const total = plan.hotels[0].price + plan.attractions.reduce((s, a) => s + a.price, 0) + plan.transit.reduce((s, a) => s + a.price, 0);
  const timeline = buildTimeline(plan, startDate);

  return (
    <div className="space-y-5">
      {/* Trip summary */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{plan.name}之旅</h2>
          <p className="mt-1 text-xs text-white/60">{plan.dateRange} · {plan.duration} · 2 大人 1 嬰兒 · 預估 NT$ {total.toLocaleString()}</p>
        </div>
        <button
          type="button"
          onClick={onRegen}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80 transition hover:border-white/30 hover:text-white"
        >
          <RotateCw className="h-3 w-3" /> 重新生成
        </button>
      </div>

      {/* Hotels */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Hotel className="h-4 w-4 text-white/60" />
          <h3 className="text-sm font-semibold text-white">建議入住 · {plan.hotels[0].nights} 晚</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {plan.hotels.map((h, idx) => (
            <div key={h.name} className={`overflow-hidden rounded-lg border ${idx === 0 ? 'border-primary/50' : 'border-white/10'} bg-white/5`}>
              <img src={h.img} alt={h.name} className="h-28 w-full object-cover" />
              <div className="p-3 text-white">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{h.name}</p>
                  {idx === 0 && <span className="rounded border border-primary/40 px-1.5 py-0.5 text-[9px] font-semibold text-primary">推薦</span>}
                </div>
                <p className="mt-0.5 text-[11px] text-white/50">{h.area} · {'★'.repeat(h.stars)}</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-white">NT$ {h.price.toLocaleString()}</span>
                  <button type="button" className="text-[11px] text-primary hover:underline">
                    立即預訂
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-white/60" />
          <h3 className="text-sm font-semibold text-white">行程安排</h3>
        </div>

        <div>
          {timeline.map((day, idx) => (
            <TimelineNode key={day.num} last={idx === timeline.length - 1}>
              {{
                icon: <span className="text-[11px] font-semibold">{day.num}</span>,
                content: (
                  <div>
                    <div className="mb-2.5 flex items-baseline gap-2">
                      <p className="text-xs font-semibold tracking-wide text-white">Day {day.num}</p>
                      <p className="font-mono text-xs text-white/50">{day.date}</p>
                    </div>
                    {day.items.length === 0 ? (
                      <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/40">自由活動 — 與 AI 對話加入安排</p>
                    ) : (
                      <div className="space-y-2">
                        {day.items.map((item, i) => <ItemCard key={i} item={item} />)}
                      </div>
                    )}
                  </div>
                ),
              }}
            </TimelineNode>
          ))}
        </div>
      </section>

      {/* Total + bulk order */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/50">總計</p>
          <p className="mt-0.5 text-2xl font-semibold text-white">NT$ {total.toLocaleString()}</p>
          <p className="text-[10px] text-white/40">含飯店、門票、交通（餐廳費用另計）</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
          <ShoppingCart className="h-4 w-4" /> 一鍵全部訂購
        </button>
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
    <div className="flex h-[480px] flex-col rounded-lg border border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <p className="text-xs font-semibold tracking-wide text-white">調整這份行程</p>
        <p className="text-[10px] text-white/40">與 AI 對話</p>
      </div>
      <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-md px-3 py-2 text-xs leading-relaxed ${
              m.role === 'user' ? 'bg-primary text-white' : 'border border-white/10 bg-white/[0.04] text-white/85'
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
          placeholder="例如：換成更便宜的飯店"
          className="flex-1 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-primary focus:outline-none"
        />
        <button type="submit" className="rounded-md bg-primary px-3 py-2 text-white hover:bg-primary-dark">
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
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="relative -mt-14 border-b border-white/5 bg-gray-950 pt-14 md:-mt-16 md:pt-16">
        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-7 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">My Trip</p>
              <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">我的行程 — {destinationName}</h1>
              <p className="mt-1 text-xs text-white/50">{dateRange} · 由 AI 規劃 · 可即時對話調整</p>
            </div>
            <button type="button" onClick={() => navigate(-1)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:border-white/30 hover:text-white">
              返回登機證
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {generating ? (
          <GenAnimation destinationName={destinationName} onDone={() => setGenerating(false)} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <TripPlanContent plan={plan} onRegen={handleRegen} startDate={passes.find((p) => p.flight.to === destinationCode)?.flight?.date || '2026-06-15'} />
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <ChatPanel onAsk={() => {/* noop in demo */}} />
              <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-[11px] text-white/50">
                <p className="text-white/70">試試這些</p>
                <ul className="mt-2 space-y-1">
                  <li>· 換成更便宜的飯店</li>
                  <li>· 我喜歡親子景點</li>
                  <li>· 素食餐廳推薦</li>
                  <li>· Day 3 改成自由活動</li>
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
