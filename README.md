# Tigerair Taiwan — React Redesign

A redesigned booking experience for [台灣虎航 Tigerair Taiwan](https://www.tigerairtw.com) — built with React + Vite + Tailwind CSS, exploring a more modern, immersive UI for the homepage and booking flow.

🔗 **Live demo:** https://howardimagine.github.io/tigerair-react-redesign/

![Tokyo cherry blossom hero](https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&h=600&fit=crop)

## ✨ Highlights

### Home

- **Immersive rotating hero** with 5 seasonal destinations (東京 春櫻、大阪 秋楓、沖繩 夏海、首爾 冬雪、曼谷 暖陽)
- **Split-flap flip-board animation** on the destination name — homage to airport mechanical departure boards
- **Parallax scroll** on the hero image (rAF-throttled `translate3d`)
- **Glassmorphism search card** merged into the banner, aligned with the hero title
- **Semi-transparent sticky navbar** so the banner shows through at the top of the page
- **Map search entry** below the search form transitions to a dark-themed fare map
- 5-icon quick-action toolbar (管理訂單 / 自助報到 / 航班動態 / 免稅品購買 / 常見問題)
- 5-square "焦點優惠" promo grid

### Date Picker

- 2-month price calendar with "最低價" tags
- Click input → page auto-scrolls so the popup lands centered in the viewport
- Backdrop blur + body-scroll lock so the user can focus on selecting
- Popup spans 出發地 → 回程 to anchor the spatial relationship

### Booking Flow (Stage 1 — completed)

- **Dark hero header** on search results with step indicator (1 去程 → 2 回程 → 3 旅客資料 → 4 加購)
- **Outbound / return split** into separate steps with smooth scroll transitions
- **Default-selected** first flight on each step (聰明首選 bundle by default)
- **`+方案` button** opens an enhanced fare-bundle modal with 6 feature comparisons (手提行李、託運行李、座位、餐食、變更、優先登機), check/X icons, "★ 熱賣推薦" badge

### Booking Flow (Stage 2 — planned)

- Passenger info page with right-sidebar selected-flight summary
- Login section (guest checkout supported) + member auto-fill
- "Select saved traveler" for passenger 2+
- Add-on page: rich image+text meal cards, icon+text baggage tiers
- Member section: "Manage Saved Travelers" with passport OCR

## 🛠 Tech Stack

- **React 18** + **Vite 7** with the rolldown bundler
- **React Router v7** (with `basename` set from Vite's `BASE_URL` for GH Pages support)
- **Tailwind CSS 4**
- **Heroicons** + **lucide-react** for iconography
- **Unsplash CDN** for hero/promo imagery

## 🚀 Local Development

```bash
npm install
npm run dev         # http://localhost:5173
npm run build       # outputs to dist/
npm run preview     # preview the production build
```

## 📦 Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`:

1. `npm ci` → `npm run build` (Vite produces `dist/` with `/tigerair-react-redesign/` base path)
2. `actions/upload-pages-artifact` + `actions/deploy-pages` publish to GitHub Pages

To deploy elsewhere (Vercel / Netlify), change `REPO_NAME` in `vite.config.js` to `''` (or remove the conditional base) and disable the basename in `src/App.jsx`.

## 📁 Project Structure

```
src/
├── components/
│   ├── DateRangeCalendar.jsx   # Centered-popup date picker with backdrop
│   ├── ExpandedPriceCalendar.jsx  # 2-month price grid
│   ├── FlipBoard.jsx           # Split-flap character animation
│   ├── Layout.jsx
│   ├── Navbar.jsx              # Semi-transparent on hero
│   └── PriceCalendar.jsx
├── pages/
│   ├── Home.jsx                # Hero + glass search + quick actions + promos
│   ├── LowFareMap.jsx          # Dark-themed fare map
│   ├── SearchResults.jsx       # Step-based flight selection
│   ├── Booking.jsx             # (Stage 2: to be redesigned as add-on page)
│   └── ...
├── context/AuthContext.jsx
└── data/news.js
```

## 🎨 Design Decisions

- **Primary color `#faa836`** (Tigerair orange) defined in `src/index.css` as a Tailwind CSS variable.
- **Hero z-index handling:** the navbar uses `sticky top-0 z-50` with `bg-white/65 backdrop-blur-md`. The hero overlaps the nav via `-mt-14 md:-mt-16` so its background extends behind the nav for the transparent effect.
- **Date popup centering:** the popup stays `absolute` below the date inputs (preserving the spatial connection), and the page auto-scrolls so the popup lands at the viewport center. After scroll, `body.overflow` is locked.

## 🙏 Acknowledgements

- Original Tigerair Taiwan booking UI as design reference
- Unsplash photographers for the destination hero images
- Iconography by Heroicons and Lucide

## 📄 License

Educational / portfolio project — not affiliated with 台灣虎航 Tigerair Taiwan.
