import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Gift, CheckCircle2, ScanLine, MessageCircle, Mail, Smartphone, Heart, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();

  // Featured (hero) task — passport OCR scan
  const featuredTask = {
    id: 'passport-ocr',
    title: '掃描護照確認英文姓名',
    desc: 'OCR 自動讀取護照資料，10 秒完成、完成後訂票免再手動輸入',
    tag: '熱門 · 最高獎勵',
    reward: 300,
    Icon: ScanLine,
    cta: '立即掃描',
  };

  // Basic verification tasks
  const initialBasic = [
    { id: 'line', title: '綁定 LINE 帳號', desc: '即時收到訂位與航班推播', reward: 200, Icon: MessageCircle, tone: 'green', done: true },
    { id: 'email', title: '驗證 Email', desc: '確認訂票通知與 Voucher 寄送地址', reward: 100, Icon: Mail, tone: 'blue', done: false, cta: '驗證' },
    { id: 'phone', title: '驗證手機號碼', desc: '用於航班異動即時通知與線上報到', reward: 100, Icon: Smartphone, tone: 'teal', done: false, cta: '驗證' },
    { id: 'pref', title: '設定旅行偏好', desc: '選擇常用航點、座位偏好，收到精準推薦', reward: 50, Icon: Heart, tone: 'purple', done: false, cta: '設定' },
  ];

  const [basicTasks, setBasicTasks] = useState(initialBasic);
  const [featuredDone, setFeaturedDone] = useState(false);

  const totalTasks = basicTasks.length + 1;
  const completedCount = basicTasks.filter((t) => t.done).length + (featuredDone ? 1 : 0);
  const totalReward = featuredTask.reward + basicTasks.reduce((s, t) => s + t.reward, 0);
  const progressPct = useMemo(() => Math.round((completedCount / totalTasks) * 100), [completedCount, totalTasks]);

  const markBasicDone = (id) => {
    setBasicTasks((cur) => cur.map((t) => (t.id === id ? { ...t, done: true } : t)));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <Target className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h2 className="text-lg font-bold text-gray-900">請先登入</h2>
          <p className="mt-1 text-sm text-gray-500">登入後即可查看會員任務</p>
          <Link to="/login" className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark">
            登入 Login
          </Link>
        </div>
      </div>
    );
  }

  const toneStyles = {
    green: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-sky-50 text-sky-600',
    teal: 'bg-teal-50 text-teal-600',
    purple: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">會員任務</h1>
          <p className="mt-1.5 text-sm text-gray-500">完成任務即賺取虎足跡，加速升等到完整會員，享受所有優惠權益</p>
        </header>

        {/* Progress card */}
        <section className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold text-gray-500">完成進度</p>
              <p className="mt-0.5 text-xl font-black text-gray-900">
                <span>{completedCount}</span>
                <span className="text-gray-400"> / {totalTasks}</span>
                <span className="ml-1 text-xs font-bold text-gray-500">已完成</span>
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-2 ring-1 ring-amber-200/60">
              <Gift className="h-4 w-4 text-amber-600" />
              <div className="leading-tight">
                <p className="text-[10px] font-semibold text-amber-700">完成所有任務可獲</p>
                <p className="text-sm font-black text-amber-700">+{totalReward.toLocaleString()} pts</p>
              </div>
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </section>

        {/* Featured / hero task */}
        <section className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 p-4 text-white shadow-lg shadow-orange-500/30 sm:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900/85 backdrop-blur ring-1 ring-white/15 sm:h-14 sm:w-14">
              <featuredTask.Icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-900/85 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-300">
                {featuredTask.tag}
              </span>
              <h3 className="mt-1.5 text-base font-bold leading-tight sm:text-lg">{featuredTask.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/90 sm:text-sm">{featuredTask.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-lg font-black sm:text-xl">+{featuredTask.reward} <span className="text-[11px] font-bold">pts</span></span>
              <button
                type="button"
                disabled={featuredDone}
                onClick={() => setFeaturedDone(true)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition sm:text-sm ${
                  featuredDone
                    ? 'bg-white/20 text-white/70'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {featuredDone ? '已掃描' : featuredTask.cta}
              </button>
            </div>
          </div>
        </section>

        {/* Basic verification tasks */}
        <h2 className="mb-2 text-sm font-bold text-gray-700">基本驗證任務</h2>
        <section className="space-y-2.5">
          {basicTasks.map((task) => {
            const Icon = task.Icon;
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:gap-4 sm:p-4"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneStyles[task.tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-sm font-bold text-gray-900">{task.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-gray-500 sm:text-xs">{task.desc}</p>
                </div>
                <span className="shrink-0 text-sm font-black text-gray-700 sm:text-base">+{task.reward} <span className="text-[10px] font-bold text-gray-500">pts</span></span>
                {task.done ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200/60">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 已完成
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => markBasicDone(task.id)}
                    className="shrink-0 rounded-full bg-gray-900 px-3.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-gray-700"
                  >
                    {task.cta}
                  </button>
                )}
              </div>
            );
          })}
        </section>

        {/* Bottom — full-member upsell */}
        <section className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
            <Award className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-sm font-bold text-gray-900">完成全部任務後</p>
            <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">自動升等為「完整會員」，享有 Voucher 折抵、會籍升等、合作品牌權益等完整權益</p>
          </div>
          <Link
            to="/member"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-700 transition hover:border-primary hover:text-primary"
          >
            了解完整權益 <ChevronRight className="h-3 w-3" />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Tasks;
