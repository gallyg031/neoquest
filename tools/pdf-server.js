// Server local Puppeteer pour générer les PDFs des docs Neoquest.
//
// Lancement :   node tools/pdf-server.js     (ou : npm run pdf-server)
// Port :        3001 (modifiable via PORT env)
//
// Workflow :
//   1. L'admin (browser, file:// ou Live Server) prépare le HTML rendu via
//      `__adminParentPrintRender(data, ctx)`.
//   2. L'admin POSTe { html, type, chapId } sur http://localhost:3001/pdf.
//   3. Le server :
//        - inline le CSS du type concerné dans le HTML (les liens relatifs
//          ne marchent pas dans setContent),
//        - lance Chromium headless (Puppeteer),
//        - génère le PDF en respectant @page (preferCSSPageSize: true),
//        - écrit le PDF dans `pdfs/{type}/{chapId}.pdf` à la racine du repo.
//   4. Renvoie { ok: true, path, size } à l'admin pour feedback.
//
// Puppeteer respecte parfaitement @page CSS (pas de headers/footers browser
// injectés, marges précises). C'est l'intérêt principal vs `window.print()`.
//
// Le browser Chromium reste chargé entre les requêtes (singleton) pour
// éviter le coût ~2s de relancement à chaque PDF.

const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const PORT = parseInt(process.env.PORT || '3001', 10);
const REPO_ROOT = path.resolve(__dirname, '..');

// Mapping type → fichier CSS à inliner dans le HTML.
// Extensible quand on branchera fiche / lexique / etude-doc sur Puppeteer.
const CSS_BY_TYPE = {
  parent: 'admin/templates/parent-print.css'
  // fiche:      'admin/templates/fiche-print.css',
  // lexique:    'admin/templates/lexique-print.css',
  // 'etude-doc': 'admin/templates/etude-doc-print.css',
};

const app = express();
app.use(express.json({ limit: '10mb' }));

// CORS — l'admin tourne en file:// ou http://localhost (Live Server), il
// doit pouvoir POSTer ici. Headers permissifs car server LOCAL only.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Singleton browser — coûte ~2s à lancer, on garde chaud entre requêtes.
let browserPromise = null;
function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
  return browserPromise;
}

// Inline le CSS du type dans le HTML — remplace le <link rel="stylesheet">
// par un <style> contenant le contenu du CSS. Nécessaire car setContent
// part d'une URL about:blank et ne peut pas résoudre les liens relatifs.
function inlineCss(html, type) {
  const cssRelPath = CSS_BY_TYPE[type];
  if (!cssRelPath) return html;
  const cssAbsPath = path.join(REPO_ROOT, cssRelPath);
  if (!fs.existsSync(cssAbsPath)) {
    console.warn(`[pdf-server] CSS introuvable pour type=${type}: ${cssAbsPath}`);
    return html;
  }
  const css = fs.readFileSync(cssAbsPath, 'utf-8');
  // Match tout <link rel="stylesheet" href="...{filename}..."> où filename
  // est le basename du CSS (ex. "parent-print.css").
  const basename = path.basename(cssRelPath);
  const re = new RegExp(`<link[^>]*href="[^"]*${basename.replace(/\./g, '\\.')}"[^>]*>`, 'gi');
  if (re.test(html)) {
    return html.replace(re, `<style>${css}</style>`);
  }
  // Pas de link tag détecté → injecte le style dans le <head>
  return html.replace(/<\/head>/i, `<style>${css}</style></head>`);
}

app.get('/health', (req, res) => res.json({ ok: true, port: PORT }));

app.post('/pdf', async (req, res) => {
  const { html, type, chapId } = req.body || {};

  // Validation stricte
  if (!html || typeof html !== 'string' || html.length < 100) {
    return res.status(400).json({ ok: false, error: 'html manquant ou trop court' });
  }
  if (!CSS_BY_TYPE[type]) {
    return res.status(400).json({ ok: false, error: `type "${type}" non supporté (allowed: ${Object.keys(CSS_BY_TYPE).join(', ')})` });
  }
  if (!chapId || !/^[a-z0-9-]{1,80}$/.test(chapId)) {
    return res.status(400).json({ ok: false, error: 'chapId invalide (a-z 0-9 - seulement)' });
  }

  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    const finalHtml = inlineCss(html, type);
    await page.setContent(finalHtml, { waitUntil: 'networkidle0', timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,  // respecte le @page de notre CSS
      margin: { top: 0, right: 0, bottom: 0, left: 0 }  // @page CSS gère les marges
    });

    // Écriture dans le repo
    const outDir = path.join(REPO_ROOT, 'pdfs', type);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${chapId}.pdf`);
    fs.writeFileSync(outPath, pdfBuffer);

    const relPath = path.relative(REPO_ROOT, outPath).replace(/\\/g, '/');
    const sizeKb = (pdfBuffer.length / 1024).toFixed(1);
    console.log(`[pdf-server] ✓ ${relPath} (${sizeKb} ko)`);
    res.json({ ok: true, path: relPath, sizeKb: parseFloat(sizeKb) });
  } catch (err) {
    console.error('[pdf-server]', err);
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    if (page) await page.close().catch(() => {});
  }
});

app.listen(PORT, () => {
  console.log(`[pdf-server] listening on http://localhost:${PORT}`);
  console.log(`[pdf-server] POST /pdf  body: { html, type, chapId }`);
  console.log(`[pdf-server] GET  /health`);
  console.log(`[pdf-server] types supportés: ${Object.keys(CSS_BY_TYPE).join(', ')}`);
});

// Fermeture propre — libère Chromium au Ctrl+C
function shutdown() {
  console.log('\n[pdf-server] shutting down…');
  if (browserPromise) browserPromise.then(b => b.close()).catch(() => {});
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
