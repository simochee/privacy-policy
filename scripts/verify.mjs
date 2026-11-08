import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { parse, stringify as stringifyYaml } from "yaml";

// Astro's YAML parser treats unquoted calendar dates as Date objects.
const stringify = (value) =>
  stringifyYaml(value, { defaultStringType: "QUOTE_DOUBLE" });

const entryPath = "src/content/extensions/backlog-live-update.md";
const original = readFileSync(entryPath, "utf8");
const [, frontmatter] = original.split("---");
const data = parse(frontmatter);
const fixturePaths = ["no-data", "local-only"].map(
  (pattern) => `src/content/extensions/test-${pattern}.md`,
);
for (const path of fixturePaths)
  assert(!existsSync(path), `Test fixture already exists: ${path}`);

function build(expectedSuccess = true) {
  const result = spawnSync("pnpm", ["build"], { encoding: "utf8" });
  assert.equal(result.error, undefined);
  if (expectedSuccess) {
    assert.equal(result.status, 0, result.stdout + result.stderr);
  } else {
    assert.notEqual(result.status, 0, "Invalid frontmatter unexpectedly built");
    assert.match(
      result.stdout + result.stderr,
      /InvalidContentEntryDataError|does not match collection schema/,
    );
  }
  return result.stdout + result.stderr;
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory()
      ? htmlFiles(path)
      : path.endsWith(".html")
        ? [path]
        : [];
  });
}

function text(html) {
  return html
    .replace(/<[^>]*>/g, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function checkOutput() {
  assert(!existsSync("dist/index.html"), "The root must have no index page");
  const expectedPages = readdirSync("src/content/extensions")
    .filter((file) => file.endsWith(".md"))
    .map((file) => `dist/${file.slice(0, -3)}/index.html`);
  assert.deepEqual(
    htmlFiles("dist").sort(),
    ["dist/404.html", ...expectedPages].sort(),
  );
  const html = readFileSync("dist/backlog-live-update/index.html", "utf8");
  const output = text(html);
  assert(
    html.indexOf('lang="en" aria-labelledby') <
      html.indexOf('lang="ja" aria-labelledby'),
  );
  for (const lang of ["en", "ja"]) {
    for (const value of [
      data.name[lang],
      data.unofficialNote[lang],
      data.removal[lang],
      data.requests[lang],
      ...data.storedData.map((item) => item[lang]),
    ]) {
      assert(output.includes(value), `Missing policy text: ${value}`);
    }
  }
  for (const host of data.hosts)
    assert(output.includes(host), `Missing host: ${host}`);
  assert(output.includes("contact@simochee.net"));
  assert(html.includes(data.supportUrl));
  assert(
    !/<a\s[^>]*href=["'](?:\/|https:\/\/privacy\.simochee\.net)/i.test(html),
    "No links to other site pages",
  );
  for (const path of htmlFiles("dist")) {
    const page = readFileSync(path, "utf8");
    assert(!/<script\b/i.test(page), `Client script in ${path}`);
    for (const section of page.matchAll(
      /<section\b[^>]*\blang="ja"[^>]*>([\s\S]*?)<\/section>/g,
    )) {
      assert.doesNotMatch(
        text(section[1]),
        /[。、] /u,
        `Unexpected space after Japanese punctuation in ${path}`,
      );
    }
  }
}

try {
  build();
  checkOutput();
  console.log(
    "PASS: exact routes, bilingual content, every parameter, external contacts, no client scripts",
  );

  const { name: _name, ...missingName } = data;
  writeFileSync(entryPath, `---\n${stringify(missingName)}---\n`);
  assert.match(build(false), /name/);
  console.log("PASS: removing required name fails the build");

  writeFileSync(
    entryPath,
    `---\n${stringify({ ...data, hostz: data.hosts })}---\n`,
  );
  assert.match(build(false), /hostz/);
  console.log("PASS: misspelled/unknown frontmatter fails the build");
  writeFileSync(entryPath, original);

  for (const [index, pattern] of ["no-data", "local-only"].entries()) {
    const fixture = {
      name: { en: `Test ${pattern}`, ja: `テスト ${pattern}` },
      updated: "2026-11-08",
      pattern,
      unofficial: false,
      storedData:
        pattern === "no-data"
          ? []
          : [{ en: "Local preference", ja: "端末内の設定" }],
      removal: {
        en: "Uninstall the extension.",
        ja: "拡張機能をアンインストールしてください。",
      },
    };
    writeFileSync(
      fixturePaths[index],
      `---\n${stringify(fixture)}---\n## Additional note\n\nEnglish test note.\n\n## 補足\n\n日本語のテスト補足。\n`,
    );
  }
  build();
  for (const pattern of ["no-data", "local-only"]) {
    const html = readFileSync(`dist/test-${pattern}/index.html`, "utf8");
    assert(
      html.includes(
        pattern === "no-data"
          ? "does not collect, store, or transmit"
          : "never sent anywhere",
      ),
    );
    assert(!html.includes("This extension is unofficial"));
    assert(
      html.indexOf("English test note") > html.indexOf("プライバシーポリシー"),
    );
    assert(html.includes("日本語のテスト補足。"));
    assert(!/<script\b/i.test(html));
  }
  console.log(
    "PASS: no-data and local-only templates, unofficial flag, optional Markdown appendix",
  );
} finally {
  writeFileSync(entryPath, original);
  for (const path of fixturePaths) rmSync(path, { force: true });
}

build();
checkOutput();
console.log("PASS: restored content and rebuilt clean production output");
