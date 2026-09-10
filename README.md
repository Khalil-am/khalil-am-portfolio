# Khalil Abu Mushref — Official Portfolio

Source for [khalil-am.com](https://www.khalil-am.com), the official portfolio and professional profile of **Khalil Abu Mushref** (also known as **Khalil AM**), Principal Product Manager / Product Owner | Team Lead at Digital Next.

Khalil works across Riyadh and Abu Dhabi on product strategy, AI-enabled products, enterprise delivery, business analysis, business intelligence, and digital transformation.

## Public pages

- [Home](https://www.khalil-am.com)
- [About Khalil Abu Mushref](https://www.khalil-am.com/about)
- [Arabic profile — خليل أبو مشرف](https://www.khalil-am.com/ar)
- [Product and AI case studies](https://www.khalil-am.com/projects)
- [Business intelligence portfolio](https://www.khalil-am.com/bi)
- [Applied AI and machine-learning toolkit](https://www.khalil-am.com/ml-models)
- [Product, AI, and delivery insights](https://www.khalil-am.com/blog)
- [Contact](https://www.khalil-am.com/contact)

## Technical foundation

The site uses Next.js App Router, TypeScript, Tailwind CSS, MDX, Vercel Analytics, and Vercel Speed Insights. Public content is server-rendered or statically generated.

Its discovery layer includes:

- unique page titles, descriptions, canonical URLs, and social previews;
- Person, WebSite, ProfilePage, CollectionPage, BlogPosting, BreadcrumbList, and relevant FAQPage structured data;
- an XML sitemap, robots.txt, RSS feed, web manifest, and llms.txt;
- reciprocal English/Arabic profile hreflang annotations;
- permanent redirects from legacy article URLs;
- explicit support for search and answer-engine crawlers.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Run the production verification build with:

```bash
npm run build
```

## Content

Long-form articles and case studies live in `content/*.mdx`. Route metadata and machine-readable discovery endpoints are generated from the same content files so published URLs stay consistent.

## Deployment

Production is hosted on Vercel at [www.khalil-am.com](https://www.khalil-am.com). The `www` HTTPS origin is the canonical host; alternate protocol and host variants permanently redirect to it.

## Contact

- [LinkedIn](https://www.linkedin.com/in/khalil-am/)
- [GitHub](https://github.com/Khalil-am)
- [Professional inquiries](https://www.khalil-am.com/contact)
