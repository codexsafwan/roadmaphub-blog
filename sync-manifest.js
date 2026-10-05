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
  const data = {};
  
  yaml.split(/\r?\n/).forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1 && !line.startsWith(' ') && !line.startsWith('-')) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      data[key] = value;
    }
  });
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
          filePath: 'posts/' + cat + '/' + file
        });
      }
    });
  }
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
