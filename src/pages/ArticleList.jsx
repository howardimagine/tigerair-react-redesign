import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { articles } from '../data/articles';

const PAGE_SIZE = 12;

const ArticleList = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);

  const pagedArticles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return articles.slice(start, start + PAGE_SIZE);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">Article List</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">文章清單</h1>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {pagedArticles.map((article) => (
            <article key={article.id} className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                <Link to={`/articles/${article.id}`} className="transition hover:text-primary">
                  {article.title}
                </Link>
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <CalendarDaysIcon className="h-4 w-4 text-primary" />
                <time dateTime={article.date}>{article.date}</time>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:text-gray-300"
          >
            上一頁
          </button>
          <span className="text-sm font-medium text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:text-gray-300"
          >
            下一頁
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
