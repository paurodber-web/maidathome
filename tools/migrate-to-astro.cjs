const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pagesDir = path.join(root, 'src', 'pages');
const componentsDir = path.join(root, 'src', 'components');
const layoutsDir = path.join(root, 'src', 'layouts');
const publicDir = path.join(root, 'public');

const sourcePages = [
  'index.html', 'about-us.html', 'areas-we-serve.html', 'booking.html', 'contact.html',
  'faqs.html', 'pricing.html', 'privacy-policy.html', 'terms-and-conditions.html',
  'blog/index.html', 'services/index.html', 'services/standard-clean.html',
  'services/deep-clean.html', 'services/end-of-lease-clean.html', 'services/move-in-clean.html',
  'services/hourly-clean.html', 'services/carpet-clean.html', 'services/oven-clean.html',
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function cleanText(value = '') {
  return value.replace(/\r\n/g, '\n').trim();
}

// Astro does not minify CSS supplied via set:html. The legacy pages keep
// their styles in <style> blocks, so normalize only syntactic whitespace
// before generating the Astro pages.
function minifyCss(value = '') {
  return cleanText(value)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function extractBody(html) {
  const match = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) throw new Error('No body found');
  return match[1];
}

function extractHeaderAndMenu(html) {
  const body = extractBody(html);
  const header = body.match(/<header\b[\s\S]*?<\/header>/i)?.[0];
  const headerEnd = header ? body.indexOf(header) + header.length : -1;
  const mainStart = body.search(/<main\b/i);
  if (!header || headerEnd < 0 || mainStart < 0) throw new Error('Shared navigation not found');
  const menu = body.slice(headerEnd, mainStart);
  return `${header}${menu}`;
}

function absolutizeLinks(markup, sourceFile) {
  const base = `https://maid-at-home.local/${path.posix.dirname(sourceFile) === '.' ? '' : `${path.posix.dirname(sourceFile)}/`}`;
  return markup.replace(/\b(href|src)=(['\"])([^'\"]+)\2/gi, (full, attribute, quote, value) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(value)) return full;
    const url = new URL(value, base);
    if (attribute.toLowerCase() === 'src') return `${attribute}=${quote}${url.pathname}${url.search}${url.hash}${quote}`;
    return `${attribute}=${quote}${normalizeRoute(url.pathname)}${url.search}${url.hash}${quote}`;
  });
}

function normalizeRoute(pathname) {
  const normalized = pathname.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
  return normalized === '/index' ? '/' : normalized || '/';
}

function routeForSource(sourceFile) {
  return normalizeRoute(`/${sourceFile}`);
}

function extractImages(markup) {
  const images = [];
  const content = markup.replace(/<img\b[^>]*>/gi, (tag) => {
    const attributes = {};
    for (const match of tag.matchAll(/([:\w-]+)(?:=(['\"])([\s\S]*?)\2)?/g)) {
      const [, name, , value = ''] = match;
      if (name.toLowerCase() !== 'img') attributes[name] = value;
    }
    const { src, alt = '', width, height, loading, fetchpriority, srcset, sizes, decoding, ...rest } = attributes;
    if (!src) return tag;
    images.push({
      src,
      alt,
      ...(width ? { width: Number(width) } : {}),
      ...(height ? { height: Number(height) } : {}),
      ...(loading ? { loading } : {}),
      ...(fetchpriority ? { fetchpriority } : {}),
      ...rest,
    });
    return `__ASTRO_IMAGE_${images.length - 1}__`;
  });
  return { content, images };
}

function escapeTemplate(value) {
  return value.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function extractPage(sourceFile) {
  const html = read(sourceFile);
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  let body = extractBody(html);
  const headerStart = body.search(/<header\b/i);
  const preHeader = headerStart >= 0
    ? body.slice(0, headerStart).replace(/<a\b[^>]*class=(['\"])[^'\"]*\bskip-link\b[^'\"]*\1[^>]*>[\s\S]*?<\/a>\s*/i, '')
    : '';
  const title = cleanText(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? 'Maid At Home');
  const description = cleanText(head.match(/<meta\b[^>]*name=(['\"])description\1[^>]*content=(['\"])([\s\S]*?)\2[^>]*>/i)?.[3] ?? head.match(/<meta\b[^>]*content=(['\"])([\s\S]*?)\1[^>]*name=(['\"])description\3[^>]*>/i)?.[2] ?? 'Friendly home cleaning across Melbourne.');
  const styles = [...head.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1]).join('\n');
  let scripts = [...body.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(match => match[0]).join('\n');
  scripts = scripts.replaceAll('document.getElementById("currentYear").textContent', '(document.getElementById("currentYear") || document.getElementById("year")).textContent');
  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  body = body.replace(/<header\b[\s\S]*?<\/header>\s*/i, '');
  const mainStart = body.search(/<main\b/i);
  if (mainStart < 0) throw new Error(`No main found in ${sourceFile}`);
  body = body.slice(mainStart);
  body = body.replace(/<footer\b[\s\S]*?<\/footer>/i, '');
  if (sourceFile === 'index.html') {
    body = body.replace('photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=88', 'photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1440&q=82');
    body = body.replace(
      'src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1440&q=82"',
      'src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1440&q=82" srcset="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=640&q=72 640w, https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=960&q=80 960w, https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1440&q=82 1440w, https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=88 2200w" sizes="100vw"'
    );
  }
  body = absolutizeLinks(body, sourceFile);
  const { content, images } = extractImages(body);
  return { title, description, styles: minifyCss(styles), content: cleanText(content), images, scripts: cleanText(scripts), preHeader: cleanText(preHeader), legacy: /<header\b[^>]*\bid=(['\"])header\1/i.test(html), skipLink: /<a\b[^>]*class=(['\"])[^'\"]*\bskip-link\b[^'\"]*\1/i.test(extractBody(html)), yearId: /\bid=(['\"])currentYear\1/i.test(html) ? 'currentYear' : 'year', bodyClass: sourceFile === 'index.html' ? 'home-page' : '' };
}

function makeComponent(name, markup) {
  return `---\ninterface Props { currentPath?: string; }\nconst { currentPath = '' } = Astro.props;\nconst markup = \`${escapeTemplate(markup)}\`;\nconst withoutCurrent = markup.replace(/\\saria-current=(['\"])page\\1/g, '');\nconst current = currentPath.replace(/\\/+$/, '') || '/index.html';\nconst html = withoutCurrent.replace(new RegExp('(href=([\\\"\\\'])' + current + '\\\\2)', 'g'), '$1 aria-current=\\\"page\\\"');\n---\n<Fragment set:html={html} />\n`;
}

function makeLayout() {
  return `---\nimport Header from '../components/Header.astro';\nimport Footer from '../components/Footer.astro';\n\ninterface Props {\n  title: string;\n  description: string;\n  styles?: string;\n  scripts?: string;\n  preHeader?: string;\n  legacyHeader?: boolean;\n  skipLink?: boolean;\n  yearId?: string;\n  currentPath?: string;\n  bodyClass?: string;\n}\n\nconst { title, description, styles = '', scripts = '', preHeader = '', legacyHeader = false, skipLink = false, yearId = 'year', currentPath = '', bodyClass = '' } = Astro.props;\n---\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\" />\n    <meta name=\"theme-color\" content=\"#f7fbfd\" />\n    <meta name=\"description\" content={description} />\n    <title>{title}</title>\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/assets/favicon.svg\" />\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin=\"anonymous\" />\n    <link rel=\"preconnect\" href=\"https://images.unsplash.com\" />\n    <link id=\"font-styles\" rel=\"preload\" as=\"style\" href=\"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap\" />\n    <script is:inline>document.getElementById('font-styles')?.addEventListener('load', event => { event.currentTarget.rel = 'stylesheet'; }, { once: true });</script>\n    <noscript><link href=\"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap\" rel=\"stylesheet\" /></noscript>\n    {styles && <style is:inline set:html={styles} />}\n    <link rel=\"stylesheet\" href=\"/assets/site-shell.css\" />\n    <link rel=\"stylesheet\" href=\"/assets/performance.css\" />\n  </head>\n  <body class={bodyClass}>\n    {skipLink && <a class=\"skip-link\" href=\"#main-content\">Skip to content</a>}\n    {preHeader && <Fragment set:html={preHeader} />}\n    <Header currentPath={currentPath} legacy={legacyHeader} />\n    <slot />\n    <Footer currentPath={currentPath} yearId={yearId} />\n    {scripts && <Fragment set:html={scripts} />}\n  </body>\n</html>\n`;
}

fs.rmSync(path.join(root, 'src'), { recursive: true, force: true });
fs.mkdirSync(pagesDir, { recursive: true });
fs.mkdirSync(componentsDir, { recursive: true });
fs.mkdirSync(layoutsDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.cpSync(path.join(root, 'assets'), path.join(publicDir, 'assets'), { recursive: true });
fs.writeFileSync(path.join(componentsDir, 'OptimizedImage.astro'), `---
import { Image } from 'astro:assets';

interface Props {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  loading?: string;
  fetchpriority?: string;
  [key: string]: unknown;
}

const { src = '', alt = '', width, height, loading, fetchpriority, ...attributes } = Astro.props;
const priority = fetchpriority === 'high';
const dimensions = width && height ? { width, height } : { inferSize: true };
const safeLoading = loading === 'lazy' ? 'lazy' : undefined;
---
<Image src={src} alt={alt} {...dimensions} quality={priority ? 35 : 60} priority={priority} loading={priority ? 'eager' : safeLoading} {...attributes} />
`);

const modernHeader = absolutizeLinks(extractHeaderAndMenu(read('contact.html')), 'contact.html');
const legacyHeader = absolutizeLinks(extractHeaderAndMenu(read('booking.html')), 'booking.html');
const footer = absolutizeLinks(extractBody(read('contact.html')).match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? '', 'contact.html');
fs.writeFileSync(path.join(componentsDir, 'Header.astro'), `---\ninterface Props { currentPath?: string; legacy?: boolean; }\nconst { currentPath = '', legacy = false } = Astro.props;\nconst modern = \`${escapeTemplate(modernHeader)}\`;\nconst old = \`${escapeTemplate(legacyHeader)}\`;\nconst markup = legacy ? old : modern;\nconst withoutCurrent = markup.replace(/\\saria-current=(['\"])page\\1/g, '');\nconst current = currentPath.replace(/\\/+$/, '') || '/index.html';\nconst html = withoutCurrent.replace(new RegExp('(href=([\\\"\\\'])' + current + '\\\\2)', 'g'), '$1 aria-current=\\\"page\\\"');\n---\n<Fragment set:html={html} />\n`);
fs.writeFileSync(path.join(componentsDir, 'Footer.astro'), makeComponent('Footer', footer).replace('interface Props { currentPath?: string; }', 'interface Props { currentPath?: string; yearId?: string; }').replace("const { currentPath = '' } = Astro.props;", "const { currentPath = '', yearId = 'year' } = Astro.props;").replace('const withoutCurrent = markup.replace', 'const datedMarkup = markup.replace(\'id=\\\"year\\\"\', `id=\\\"${yearId}\\\"`);' + '\n' + 'const withoutCurrent = datedMarkup.replace'));
const layoutPath = path.join(layoutsDir, 'SiteLayout.astro');
const sharedStyles = minifyCss(`${read('assets/fonts.css')}\n${read('assets/site-shell.css')}\n${read('assets/performance.css')}`);
fs.writeFileSync(layoutPath, makeLayout());
fs.writeFileSync(
  layoutPath,
  fs.readFileSync(layoutPath, 'utf8')
    .replace(
      /    <link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[\s\S]*?    <noscript>[\s\S]*?<\/noscript>\n/,
      '    <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossorigin />\n    <link rel="preload" href="/fonts/dm-sans-latin-ext.woff2" as="font" type="font/woff2" crossorigin />\n    <link rel="preload" href="/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin />\n    <link rel="preload" href="/fonts/plus-jakarta-sans-latin-ext.woff2" as="font" type="font/woff2" crossorigin />\n',
    )
    .replace('    <link rel="preconnect" href="https://images.unsplash.com" />\n', '')
    .replace(
      '    <link rel="stylesheet" href="/assets/site-shell.css" />\n    <link rel="stylesheet" href="/assets/performance.css" />',
      `    <style is:inline>${sharedStyles}</style>`,
    ),
);

for (const sourceFile of sourcePages) {
  const page = extractPage(sourceFile);
  // Astro turns a normal page into a .html file. Its conventional index route
  // collapses one directory, so the two legacy /index.html URLs need an extra
  // source directory to retain their exact output paths.
  const output = sourceFile.endsWith('/index.html')
    ? path.join(pagesDir, sourceFile.replace('/index.html', '/index.astro'))
    : path.join(pagesDir, sourceFile.replace(/\.html$/, '.astro'));
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const relativeLayout = path.relative(path.dirname(output), path.join(layoutsDir, 'SiteLayout.astro')).replace(/\\/g, '/');
  const relativeImage = path.relative(path.dirname(output), path.join(componentsDir, 'OptimizedImage.astro')).replace(/\\/g, '/');
  const pagePath = routeForSource(sourceFile);
  fs.writeFileSync(output, `---\nimport SiteLayout from '${relativeLayout.startsWith('.') ? relativeLayout : `./${relativeLayout}`}';\nimport OptimizedImage from '${relativeImage.startsWith('.') ? relativeImage : `./${relativeImage}`}';\n\nconst title = \`${escapeTemplate(page.title)}\`;\nconst description = \`${escapeTemplate(page.description)}\`;\nconst styles = \`${escapeTemplate(page.styles)}\`;\nconst scripts = \`${escapeTemplate(page.scripts)}\`;\nconst preHeader = \`${escapeTemplate(page.preHeader)}\`;\nconst content = \`${escapeTemplate(page.content)}\`;\nconst contentParts = content.split(/__ASTRO_IMAGE_\\d+__/);\nconst images = ${JSON.stringify(page.images, null, 2)};\n---\n<SiteLayout title={title} description={description} styles={styles} scripts={scripts} preHeader={preHeader} legacyHeader={${page.legacy}} skipLink={${page.skipLink}} yearId=\"${page.yearId}\" currentPath=\"${pagePath}\" bodyClass=\"${page.bodyClass}\">\n  {contentParts.map((part, index) => (<>\n    <Fragment set:html={part} />\n    {images[index] && <OptimizedImage {...images[index]} />}\n  </>))}\n</SiteLayout>\n`);
  fs.writeFileSync(output, fs.readFileSync(output, 'utf8').replace('const images =', 'const images: Array<Record<string, any>> ='));
}

console.log(`Migrated ${sourcePages.length} pages into Astro components.`);
