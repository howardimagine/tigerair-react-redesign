import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, Edit3, Upload, Camera, Sparkles, Check, ScanLine } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useSavedTravelers } from '../context/SavedTravelersContext';
import { useAuth } from '../context/AuthContext';

const emptyTraveler = () => ({
  nickname: '',
  lastNameEn: '',
  firstNameEn: '',
  lastNameZh: '',
  firstNameZh: '',
  gender: 'male',
  birthDate: '',
  nationality: 'TW',
  passportNumber: '',
  passportExpiry: '',
});

// Mock OCR output pool — simulates parsing different passport photos
const ocrMockResults = [
  {
    lastNameEn: 'HUANG',
    firstNameEn: 'YU-CHEN',
    lastNameZh: '黃',
    firstNameZh: '宇辰',
    gender: 'male',
    birthDate: '1995-07-21',
    nationality: 'TW',
    passportNumber: 'A2238871',
    passportExpiry: '2031-04-15',
  },
  {
    lastNameEn: 'LIN',
    firstNameEn: 'HSIAO-MIN',
    lastNameZh: '林',
    firstNameZh: '曉敏',
    gender: 'female',
    birthDate: '1998-11-03',
    nationality: 'TW',
    passportNumber: 'B7841290',
    passportExpiry: '2029-08-22',
  },
  {
    lastNameEn: 'WANG',
    firstNameEn: 'CHIA-HAO',
    lastNameZh: '王',
    firstNameZh: '家豪',
    gender: 'male',
    birthDate: '1988-02-19',
    nationality: 'TW',
    passportNumber: 'C5612300',
    passportExpiry: '2033-12-05',
  },
];

const PassportOCR = ({ onResult }) => {
  const fileRef = useRef(null);
  const [stage, setStage] = useState('idle'); // idle | uploading | analyzing | done
  const [preview, setPreview] = useState(null);

  const triggerFile = () => fileRef.current?.click();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStage('uploading');
    setTimeout(() => {
      setStage('analyzing');
      setTimeout(() => {
        const result = ocrMockResults[Math.floor(Math.random() * ocrMockResults.length)];
        onResult(result);
        setStage('done');
      }, 1400);
    }, 700);
  };

  const reset = () => {
    setPreview(null);
    setStage('idle');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="rounded-xl border border-dashed border-primary/40 bg-orange-50/50 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <ScanLine className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">護照 OCR 自動辨識</p>
          <p className="mt-0.5 text-xs text-gray-600">上傳護照資料頁照片，系統自動辨識姓名、護照號碼、效期等欄位</p>

          {stage === 'idle' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={triggerFile}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-dark"
              >
                <Upload className="h-3.5 w-3.5" /> 上傳護照照片
              </button>
              <button
                type="button"
                onClick={triggerFile}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
              >
                <Camera className="h-3.5 w-3.5" /> 開啟相機
              </button>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
            </div>
          )}

          {preview && stage !== 'idle' && (
            <div className="mt-3 flex items-start gap-3">
              <div className="relative h-24 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <img src={preview} alt="passport" className="h-full w-full object-cover" />
                {stage === 'analyzing' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-xs">
                {stage === 'uploading' && <p className="text-gray-600">上傳中…</p>}
                {stage === 'analyzing' && (
                  <p className="flex items-center gap-1.5 text-gray-700">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                    AI 正在辨識護照資料…
                  </p>
                )}
                {stage === 'done' && (
                  <div>
                    <p className="flex items-center gap-1.5 font-bold text-emerald-600">
                      <Check className="h-3.5 w-3.5" /> 辨識完成，已自動填入欄位
                    </p>
                    <button type="button" onClick={reset} className="mt-2 text-xs font-semibold text-primary hover:underline">重新上傳</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TravelerForm = ({ open, initial, onClose, onSave, mode }) => {
  const [draft, setDraft] = useState(initial || emptyTraveler());

  if (!open) return null;

  const update = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const applyOcr = (result) => {
    setDraft((d) => ({ ...d, ...result }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(draft);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{mode === 'edit' ? '編輯常用旅客' : '新增常用旅客'}</h2>
            <p className="mt-1 text-xs text-gray-500">儲存常出行的家人朋友資料，下次訂票一鍵帶入</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100" aria-label="關閉">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <PassportOCR onResult={applyOcr} />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-gray-600">暱稱 (僅自己看到)</span>
              <input
                type="text"
                value={draft.nickname}
                onChange={(e) => update({ nickname: e.target.value })}
                placeholder="例如：爸爸 / 老婆 / 小米"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">英文姓 *</span>
              <input
                type="text"
                required
                value={draft.lastNameEn}
                onChange={(e) => update({ lastNameEn: e.target.value.toUpperCase() })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase tracking-wider focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">英文名 *</span>
              <input
                type="text"
                required
                value={draft.firstNameEn}
                onChange={(e) => update({ firstNameEn: e.target.value.toUpperCase() })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase tracking-wider focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">中文姓</span>
              <input
                type="text"
                value={draft.lastNameZh}
                onChange={(e) => update({ lastNameZh: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">中文名</span>
              <input
                type="text"
                value={draft.firstNameZh}
                onChange={(e) => update({ firstNameZh: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">性別 *</span>
              <select value={draft.gender} onChange={(e) => update({ gender: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">出生日期 *</span>
              <input type="date" required value={draft.birthDate} onChange={(e) => update({ birthDate: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">國籍 *</span>
              <select value={draft.nationality} onChange={(e) => update({ nationality: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="TW">中華民國</option>
                <option value="JP">日本</option>
                <option value="KR">韓國</option>
                <option value="TH">泰國</option>
                <option value="VN">越南</option>
                <option value="HK">香港</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">護照號碼 *</span>
              <input type="text" required value={draft.passportNumber} onChange={(e) => update({ passportNumber: e.target.value.toUpperCase() })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm uppercase tracking-wider focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">護照效期 *</span>
              <input type="date" required value={draft.passportExpiry} onChange={(e) => update({ passportExpiry: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary">
              取消
            </button>
            <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark">
              儲存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SavedTravelers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { travelers, addTraveler, updateTraveler, removeTraveler } = useSavedTravelers();
  const [editing, setEditing] = useState(null); // null | 'new' | traveler object

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-gray-600">請先登入會員以管理常用旅客</p>
          <button type="button" onClick={() => navigate('/login')} className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark">
            前往登入
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (draft) => {
    if (editing && editing !== 'new') {
      updateTraveler(editing.id, draft);
    } else {
      addTraveler(draft);
    }
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="relative -mt-14 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-14 md:-mt-16 md:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(250,168,54,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary">會員中心</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">常用旅客</h1>
          <p className="mt-2 text-sm text-white/70">儲存常出行的家人朋友資料 — 訂票時一鍵帶入，支援護照 OCR 辨識</p>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">共 <span className="font-bold text-gray-900">{travelers.length}</span> 位旅客</p>
          <button type="button" onClick={() => setEditing('new')} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark">
            <Plus className="h-4 w-4" /> 新增旅客
          </button>
        </div>

        {travelers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-gray-600">尚未建立常用旅客</p>
            <button type="button" onClick={() => setEditing('new')} className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark">
              立即新增
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {travelers.map((t) => (
              <div key={t.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {t.nickname || `${t.lastNameZh}${t.firstNameZh}` || `${t.lastNameEn} ${t.firstNameEn}`}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-gray-500">{t.lastNameEn} {t.firstNameEn}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setEditing(t)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-primary" aria-label="編輯">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => removeTraveler(t.id)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-rose-600" aria-label="刪除">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">護照號碼</p>
                    <p className="font-semibold text-gray-700">{t.passportNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">護照效期</p>
                    <p className="font-semibold text-gray-700">{t.passportExpiry}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">出生日期</p>
                    <p className="font-semibold text-gray-700">{t.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">性別</p>
                    <p className="font-semibold text-gray-700">{t.gender === 'female' ? '女' : '男'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TravelerForm
        open={editing !== null}
        initial={editing && editing !== 'new' ? editing : null}
        mode={editing === 'new' ? 'new' : 'edit'}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default SavedTravelers;
