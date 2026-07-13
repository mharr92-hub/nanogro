import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { get } from "node:http";
import { join } from "node:path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseUrl = process.env.VISUAL_QA_BASE_URL || "http://127.0.0.1:3001";
const outDir = join(process.cwd(), "docs", "visual-qa-screenshots");
const debugPort = Number(process.env.VISUAL_QA_DEBUG_PORT || 9223);
const routes = ["/", "/cases", "/diagnostico", "/admin/login", "/admin", "/admin/import", "/admin/review", "/admin/leads"];
const adminRoutes = new Set(["/admin", "/admin/import", "/admin/review", "/admin/leads"]);
const viewports = [
  { name: "mobile", width: 390, height: 1100 },
  { name: "tablet", width: 768, height: 1100 },
  { name: "desktop", width: 1440, height: 1100 }
];
const themes = ["dark", "light"];

mkdirSync(outDir, { recursive: true });

const edge = spawn(edgePath, [
  "--headless=new",
  `--remote-debugging-port=${debugPort}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=${join(process.cwd(), ".next", `visual-qa-edge-profile-${Date.now()}`)}`,
  "about:blank"
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function httpJson(url) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

async function getWebSocketUrl() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const version = await httpJson(`http://127.0.0.1:${debugPort}/json/version`);
      if (version.webSocketDebuggerUrl) return version.webSocketDebuggerUrl;
    } catch {
      await sleep(200);
    }
  }
  throw new Error("Edge DevTools endpoint did not start");
}

const ws = new WebSocket(await getWebSocketUrl());
let id = 0;
const pending = new Map();

ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));

function sendRaw(message) {
  const messageId = ++id;
  ws.send(JSON.stringify({ id: messageId, ...message }));
  return new Promise((resolve, reject) => pending.set(messageId, { resolve, reject }));
}

const target = await sendRaw({ method: "Target.createTarget", params: { url: "about:blank" } });
const session = await sendRaw({ method: "Target.attachToTarget", params: { targetId: target.targetId, flatten: true } });
const sessionId = session.sessionId;
const cdp = (method, params = {}) => sendRaw({ method, params, sessionId });

await cdp("Page.enable");
await cdp("Runtime.enable");
await cdp("DOM.enable");
await cdp("Network.enable");

async function waitReady() {
  for (let i = 0; i < 80; i += 1) {
    const state = await cdp("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
    if (state.result.value === "complete") return;
    await sleep(100);
  }
}

function safeName(route) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
}

const results = [];

for (const theme of themes) {
  for (const viewport of viewports) {
    await cdp("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false
    });

    for (const route of routes) {
      if (adminRoutes.has(route)) {
        await cdp("Network.setCookie", { name: "nano_gro_admin", value: "1", url: baseUrl, path: "/" });
      }
      await cdp("Page.navigate", { url: baseUrl });
      await waitReady();
      await cdp("Runtime.evaluate", {
        expression: `localStorage.setItem("nano-gro-theme", "${theme}"); document.documentElement.dataset.theme = "${theme}";`
      });
      await cdp("Page.navigate", { url: `${baseUrl}${route}` });
      await waitReady();
      await sleep(500);

      const metrics = await cdp("Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const body = document.body;
          const html = document.documentElement;
          const rects = [...document.querySelectorAll("body *")].map((el) => {
            const rect = el.getBoundingClientRect();
            return { tag: el.tagName, text: (el.innerText || el.getAttribute("aria-label") || "").slice(0, 80), left: rect.left, right: rect.right, width: rect.width };
          });
          const overflow = rects.filter((item) => item.width > 0 && (item.right > innerWidth + 2 || item.left < -2)).slice(0, 8);
          return {
            path: location.pathname,
            title: document.title,
            theme: html.dataset.theme,
            width: innerWidth,
            scrollWidth: Math.max(body.scrollWidth, html.scrollWidth),
            overflow,
            navLinks: [...document.querySelectorAll("header nav a")].map((a) => a.textContent.trim()),
            labels: [...document.querySelectorAll("form label")].map((label) => label.textContent.trim().replace(/\\s+/g, " ").slice(0, 80)),
            emptyInteractiveCount: [...document.querySelectorAll("button, a")].filter((el) => {
              const text = (el.innerText || el.getAttribute("aria-label") || "").trim();
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && !text;
            }).length,
            textSample: body.innerText.slice(0, 220)
          };
        })()`
      });

      const shot = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
      const filename = `${theme}-${viewport.name}-${safeName(route)}.png`;
      writeFileSync(join(outDir, filename), Buffer.from(shot.data, "base64"));
      results.push({ theme, viewport: viewport.name, route, screenshot: `docs/visual-qa-screenshots/${filename}`, ...metrics.result.value });
    }
  }
}

await cdp("Page.navigate", { url: baseUrl });
await waitReady();
await cdp("Runtime.evaluate", { expression: `localStorage.removeItem("nano-gro-theme")` });
await cdp("Page.reload", { ignoreCache: true });
await waitReady();
const systemPref = await cdp("Runtime.evaluate", {
  returnByValue: true,
  expression: `({ theme: document.documentElement.dataset.theme, stored: localStorage.getItem("nano-gro-theme"), prefersLight: matchMedia("(prefers-color-scheme: light)").matches })`
});

await cdp("Runtime.evaluate", { expression: `document.querySelector('button[aria-label="Toggle theme"]')?.click()` });
await sleep(250);
const toggleResult = await cdp("Runtime.evaluate", {
  returnByValue: true,
  expression: `({ theme: document.documentElement.dataset.theme, stored: localStorage.getItem("nano-gro-theme") })`
});

await cdp("Page.navigate", { url: `${baseUrl}/cases?crop=cacao&sort=complete` });
await waitReady();
const filterResult = await cdp("Runtime.evaluate", {
  returnByValue: true,
  expression: `({ path: location.pathname, query: location.search, hasFilters: !!document.querySelector('form[action="/cases"]') })`
});

await cdp("Page.navigate", { url: `${baseUrl}/diagnostico` });
await waitReady();
const leadFormResult = await cdp("Runtime.evaluate", {
  returnByValue: true,
  expression: `({ labels: [...document.querySelectorAll('form label')].map((label) => label.textContent.trim().replace(/\\s+/g, ' ')), hasSubmit: !!document.querySelector('button[type="submit"]') })`
});

const report = {
  generatedAt: new Date().toISOString(),
  results,
  interactions: {
    systemPref: systemPref.result.value,
    toggleResult: toggleResult.result.value,
    filterResult: filterResult.result.value,
    leadFormResult: leadFormResult.result.value
  }
};

writeFileSync(join(outDir, "visual-qa-results.json"), JSON.stringify(report, null, 2));
ws.close();
edge.kill();
console.log(JSON.stringify(report, null, 2));
