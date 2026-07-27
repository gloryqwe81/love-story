import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished love story", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Для тебя, любовь моя/);
  assert.match(html, /моё самое красивое/);
  assert.match(html, /Открыть моё сердце/);
  assert.match(html, /ПИСЬМО ДЛЯ ТЕБЯ/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("keeps media instructions and GitHub Pages automation", async () => {
  const [instructions, workflow] = await Promise.all([
    readFile(new URL("../MEDIA-INSTRUCTIONS.md", import.meta.url), "utf8"),
    readFile(
      new URL("../.github/workflows/deploy-pages.yml", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(instructions, /public\/media\/photos/);
  assert.match(instructions, /our-song\.mp3/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  await access(new URL("../public/media/photos/.gitkeep", import.meta.url));
  await access(new URL("../public/media/music/.gitkeep", import.meta.url));
});
