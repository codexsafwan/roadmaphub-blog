# Roadmap Hub — Blog Repository

Welcome to the **Roadmap Hub Blog** content repository!

This repository manages all blog posts, categories, and markdown content displayed dynamically on **Roadmap Hub** (`/blog`).

---

## 📁 Repository Structure

```
roadmaphub-blog/
├── categories.json            # Available blog categories list
├── posts-manifest.json        # Auto-generated lightweight post index for instant sync
└── posts/                     # Category-organized Markdown files
    ├── features/              # Feature breakdowns & booking system architecture
    │   ├── 5-advantages-of-golf-scheduling-software.md
    │   ├── an-online-booking-system-how-does-it-work.md
    │   ├── 4-reasons-why-all-golf-professionals-need-golf-scheduling-software.md
    │   └── booking-a-golf-lesson-in-an-online-system-the-advantages-and-disadvantages.md
    ├── product-updates/       # Roadmap Hub releases & announcements
    │   └── announcing-roadmap-interactive-lab-2-live-mentor-sessions.md
    ├── news/                  # Industry news & engineering trends
    │   └── why-senior-engineers-are-turning-to-independent-mentorship.md
    ├── academy/               # System design tutorials & masterclasses
    │   └── architecting-high-throughput-distributed-queues-a-deep-dive.md
    ├── client-management/     # Consulting & advisory frameworks
    │   └── how-to-manage-client-expectations-in-technical-consulting.md
    └── ambassador/            # Engineering mentors & community highlights
        └── meet-our-ambassadors-engineering-leaders-transforming-mentorship.md
```

---

## ✍️ How to Add a New Blog Post

1. Navigate to the appropriate category folder under `posts/<category-slug>/`.
2. Create a new markdown file named `<your-slug>.md` (e.g. `posts/features/how-rate-limiting-works.md`).
3. Include YAML frontmatter at the top of the file:

```yaml
---
id: "how-rate-limiting-works"
title: "How Token Bucket Rate Limiting Works at Scale"
slug: "how-token-bucket-rate-limiting-works-at-scale"
category: "Features"
categorySlug: "features"
date: "Oct 5, 2026"
readTime: "5 min read"
featured: false
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
author:
  name: "Safwan Alamgir"
  role: "Lead Architect"
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
tags:
  - "Distributed Systems"
  - "Redis"
  - "API Gateways"
excerpt: "A deep dive into distributed token bucket algorithms and Redis sliding window rate limiters."
---

Your markdown article content goes here! You can use headings, lists, code blocks, quotes, and links.
```

4. Commit and push your changes to GitHub:

```bash
git add .
git commit -m "Add new blog post: How Rate Limiting Works"
git push origin main
```

---

## ⚡ Instant Dynamic Syncing

When you push updates to GitHub, the **Roadmap Hub** website (`@roadmap`) automatically fetches the latest markdown content directly from this repository via GitHub Raw Content & API endpoints with automatic cache revalidation. No manual rebuild or deployment required!
