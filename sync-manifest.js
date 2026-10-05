/**
 * Helper script to regenerate posts-manifest.json from markdown files in posts/
 * Run with: node sync-manifest.js
 */
const fs = require('fs');
const path = require('path');

const categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf8'));
const postsDir = path.join(__dirname, 'posts');

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yaml = match[1];
  const data = { tags: [] };

  const lines = yaml.split(/\r?\n/);
  let currentKey = null;
  let currentObj = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Check list item under a key (e.g. tags)
    if (trimmed.startsWith('- ') && currentKey) {
      let val = trimmed.replace(/^-\s*/, '').trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      if (Array.isArray(data[currentKey])) {
        data[currentKey].push(val);
      }
      continue;
    }

    // Check nested key-value under an object like author
    if (rawLine.startsWith('  ') && currentObj && currentKey) {
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1) {
        const subKey = trimmed.slice(0, colonIdx).trim();
        let subVal = trimmed.slice(colonIdx + 1).trim();
        if (subVal.startsWith('"') && subVal.endsWith('"')) subVal = subVal.slice(1, -1);
        if (subVal.startsWith("'") && subVal.endsWith("'")) subVal = subVal.slice(1, -1);
        if (subVal === 'true') subVal = true;
        if (subVal === 'false') subVal = false;
        currentObj[subKey] = subVal;
      }
      continue;
    }

    // Top-level key
    const colonIdx = rawLine.indexOf(':');
    if (colonIdx !== -1) {
      const key = rawLine.slice(0, colonIdx).trim();
      let value = rawLine.slice(colonIdx + 1).trim();
      if (value === '') {
        currentKey = key;
        if (key === 'tags') {
          data.tags = [];
          currentObj = null;
        } else {
          currentObj = {};
          data[key] = currentObj;
        }
      } else {
        currentKey = null;
        currentObj = null;
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        data[key] = value;
      }
    }
  }

  return data;
}

const manifestPosts = [];
const catDirs = fs.readdirSync(postsDir);

catDirs.forEach(cat => {
  const catPath = path.join(postsDir, cat);
  if (fs.statSync(catPath).isDirectory()) {
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      const filePath = path.join(catPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const meta = extractFrontmatter(content);
      if (meta.slug && meta.title) {
        manifestPosts.push({
          id: meta.id || file.replace('.md', ''),
          slug: meta.slug,
          title: meta.title,
          excerpt: meta.excerpt || '',
          category: meta.category || cat,
          categorySlug: cat,
          date: meta.date || 'Recent',
          readTime: meta.readTime || '5 min read',
          featured: Boolean(meta.featured),
          image: meta.image || null,
          isIllustration: Boolean(meta.isIllustration),
          illustrationType: meta.illustrationType || null,
          author: meta.author || {
            name: 'Roadmap Hub Team',
            role: 'Engineering Editorial',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          },
          tags: Array.isArray(meta.tags) && meta.tags.length > 0 ? meta.tags : [],
          filePath: 'posts/' + cat + '/' + file
        });
      }
    });
  }
});

// Sort posts by date or keep stable order with featured first
manifestPosts.sort((a, b) => {
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  return 0;
});

fs.writeFileSync(
  path.join(__dirname, 'posts-manifest.json'),
  JSON.stringify({
    lastUpdated: new Date().toISOString(),
    totalPosts: manifestPosts.length,
    categories,
    posts: manifestPosts
  }, null, 2),
  'utf8'
);

console.log('Successfully synced posts-manifest.json with ' + manifestPosts.length + ' posts.');
