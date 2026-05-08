import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { articles, blogCategoryMeta } from '../data/articles';

const PAGE_SIZE = 12;

const Blog = () => {
  const { category = 'theme-travel' } = useParams();
  const [page, setPage] = useState(1);
  const meta = blogCategoryMeta[category] || blogCategoryMeta['theme-travel'];
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);

  const pagedArticles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return articles.slice(start, start + PAGE_SIZE);
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">Tigerair Blog</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{meta.label}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">{meta.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pagedArticles.map((article) => (
            <article key={article.id} className="overflow-hidden rounded-lg bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <img src={article.cover} alt={article.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <CalendarDaysIcon className="h-4 w-4 text-primary" />
                  <time dateTime={article.date}>{article.date}</time>
                </div>
                <h2 className="text-lg font-bold leading-snug text-gray-900">{article.title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{article.summary}</p>
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

export default Blog;

