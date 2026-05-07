import { useState } from 'react';
import { Phone, Mail, MessageCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const Support = () => {
  const [open, setOpen] = useState(null);
  const [query, setQuery] = useState('');

  const faqs = [
    { q: '如何線上訂票？ How to book?', a: '在首頁輸入出發地、目的地、日期，點擊搜尋後選擇航班並完成付款。您也可以直接前往「訂票」頁面開始搜尋。' },
    { q: '可以修改訂位嗎？ Can I modify?', a: '可以。請至「我的訂單」頁面修改，起飛前 4 小時可免費更改一次日期，之後可能會收取手續費 NT$ 500。' },
    { q: '手提行李限制？ Cabin baggage?', a: '每位旅客可攜帶一件手提行李（不超過 7 公斤，尺寸 54 x 38 x 23 cm）及一件個人物品。' },
    { q: '何時可以線上報到？ When check-in?', a: '起飛前 48 小時至 1 小時開放線上報到。建議提早報到以選擇偏好座位。' },
    { q: '如何取消訂位？ How to cancel?', a: '請至「我的訂單」頁面點選取消，起飛前 24 小時取消可獲得全額退款（扣除手續費）。' },
    { q: '嬰兒票如何購買？ Infant ticket?', a: '2 歲以下嬰兒不佔位，票價為成人票價的 10%。請在訂票時選擇旅客類型為「嬰兒」。' },
  ];

  const filteredFaqs = faqs.filter(f =>
    !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Help Center 客服中心</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
            <Phone className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-1">電話客服</h3>
            <p className="text-sm text-gray-500 mb-2">週一至週五 09:00-18:00</p>
            <a href="tel:+886-2-5599-2555" className="text-primary font-medium text-sm hover:underline">+886-2-5599-2555</a>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
            <Mail className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-1">電子郵件</h3>
            <p className="text-sm text-gray-500 mb-2">24 小時內回覆</p>
            <a href="mailto:service@tigerair.com.tw" className="text-primary font-medium text-sm hover:underline break-all">service@tigerair.com.tw</a>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-bold mb-1">線上客服</h3>
            <p className="text-sm text-gray-500 mb-2">即時協助</p>
            <button className="text-primary font-medium text-sm hover:underline">開始對話 Start Chat</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">FAQ 常見問題</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="搜尋問題..."
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div className="space-y-2">
            {filteredFaqs.map((f, i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition">
                  <span className="font-medium text-sm sm:text-base pr-2">{f.q}</span>
                  {open === i ? <ChevronUp className="text-primary shrink-0" size={20} /> : <ChevronDown className="text-gray-400 shrink-0" size={20} />}
                </button>
                {open === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t pt-3 bg-gray-50">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="text-center text-gray-500 py-8">找不到相關問題，請聯繫客服</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
