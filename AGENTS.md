<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 🌐 Sitemap & Robots.txt Dynamic Sync Rule
* **Dynamic Mapping**: Any additions of new static pages, service pillars, portfolio items, case studies, or blogs MUST be checked to ensure they are dynamically generated in [sitemap.ts](file:///d:/demo%202/app/sitemap.ts) and index permissions are properly set in [robots.ts](file:///d:/demo%202/app/robots.ts).
* **Automatic SEO Updates**: Never hardcode page indexes. All search discovery structures must resolve automatically on changes to data files to prevent indexing discrepancies.
