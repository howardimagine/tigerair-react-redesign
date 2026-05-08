import { Link, useParams } from 'react-router-dom';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { latestNews } from '../data/news';
import { articles } from '../data/articles';

const ArticleDetail = () => {
  const { id } = useParams();
  const article = [...latestNews, ...articles].find((item) => item.id === id);

  if (!article) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">找不到文章</h1>
            <p className="mt-3 text-sm text-gray-500">這篇最新消息可能已移除或網址不正確。</p>
            <Link to="/articles" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark">
              回文章清單
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <article className="mx-auto max-w-3xl px-4">
        <div className="rounded-xl bg-white p-6 sm:p-8">
          <Link to="/articles" className="text-sm font-semibold text-primary hover:underline">
            返回文章清單
          </Link>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900">{article.title}</h1>
          <div className="mt-4 flex items-center gap-1.5 text-sm text-gray-500">
            <CalendarDaysIcon className="h-4 w-4 text-primary" />
            <time dateTime={article.date}>{article.date}</time>
          </div>
          <p className="mt-6 rounded-lg bg-orange-50 px-4 py-3 text-sm leading-6 text-gray-700">{article.summary}</p>
          <div className="mt-8 space-y-5 text-base leading-8 text-gray-700">
            {(article.body || [article.summary]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
