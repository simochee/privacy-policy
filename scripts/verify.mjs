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

function checkLocalePage(html, lang, slug) {
  assert(html.includes(`<html lang="${lang}">`));
  assert(
    html.includes(`<h1 id="policy-${lang}" lang="en">Privacy Policy</h1>`),
  );
  assert(!html.includes(`id="policy-${lang === "en" ? "ja" : "en"}"`));
  const paths = { en: `/${slug}/`, ja: `/ja/${slug}/` };
  const navigation = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert(navigation, `Missing language navigation for ${slug}`);
  const active = [...navigation.matchAll(/<a\b([^>]*)>/g)].filter((link) =>
    link[1].includes('aria-current="page"'),
  );
  assert.equal(active.length, 1);
  assert(active[0][1].includes(`href="${paths[lang]}"`));
  for (const locale of ["en", "ja"]) {
    assert(navigation.includes(`href="${paths[locale]}"`));
    assert(
      html.includes(
        `<link rel="alternate" hreflang="${locale}" href="https://privacy.simochee.net${paths[locale]}"`,
      ),
    );
  }
  assert(
    html.includes(
      `<link rel="canonical" href="https://privacy.simochee.net${paths[lang]}"`,
    ),
  );
  for (const link of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
    if (
      link[1].startsWith("/") ||
      link[1].startsWith("https://privacy.simochee.net")
    ) {
      assert(
        Object.values(paths).includes(link[1]),
        `Unexpected policy navigation: ${link[1]}`,
      );
    }
  }
}

function checkOutput() {
  assert(!existsSync("dist/index.html"), "The root must have no index page");
  assert(
    !existsSync("dist/ja/index.html"),
    "The locale root must have no index page",
  );
  const slugs = readdirSync("src/content/extensions")
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -3));
  const expectedPages = slugs.flatMap((slug) => [
    `dist/${slug}/index.html`,
    `dist/ja/${slug}/index.html`,
  ]);
  assert.deepEqual(
    htmlFiles("dist").sort(),
    ["dist/404.html", ...expectedPages].sort(),
  );
  for (const slug of slugs) {
    for (const lang of ["en", "ja"]) {
      const prefix = lang === "en" ? "" : "ja/";
      const html = readFileSync(`dist/${prefix}${slug}/index.html`, "utf8");
      checkLocalePage(html, lang, slug);
    }
  }
  for (const lang of ["en", "ja"]) {
    const prefix = lang === "en" ? "" : "ja/";
    const html = readFileSync(
      `dist/${prefix}backlog-live-update/index.html`,
      "utf8",
    );
    const output = text(html);
    assert(html.includes(`src="${data.icon ?? "/icons/extension.svg"}"`));
    assert(existsSync(`dist${data.icon ?? "/icons/extension.svg"}`));
    for (const value of [
      data.name[lang],
      data.unofficialNote[lang],
      data.removal[lang],
      ...(data.requests ? [data.requests[lang]] : []),
      ...(data.storedData ?? []).map((item) => item[lang]),
      ...(data.hosts ?? []),
      "contact@simochee.net",
    ]) {
      assert(output.includes(value), `Missing ${lang} policy text: ${value}`);
    }
    assert(html.includes('href="mailto:contact@simochee.net"'));
  }
  for (const path of htmlFiles("dist")) {
    const page = readFileSync(path, "utf8");
    assert(!/<script\b/i.test(page), `Client script in ${path}`);
    if (page.includes('<html lang="ja">')) {
      assert.doesNotMatch(
        text(page),
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
    "PASS: locale routes, language switcher, alternate/canonical URLs, every parameter, contacts, no client scripts",
  );

  const { name: _name, ...missingName } = data;
  writeFileSync(entryPath, `---\n${stringify(missingName)}---\n`);
  assert.match(build(false), /name/);
  console.log("PASS: removing required name fails the build");

  writeFileSync(
    entryPath,
    `---\n${stringify({ ...data, hostz: ["*.example.com"] })}---\n`,
  );
  assert.match(build(false), /hostz/);
  console.log("PASS: misspelled/unknown frontmatter fails the build");
  writeFileSync(entryPath, original);

  writeFileSync(
    entryPath,
    `---\n${stringify({ ...data, icon: "/icons/missing.svg" })}---\n`,
  );
  assert.match(build(false), /Icon file must exist/);
  console.log("PASS: missing icon files fail the build");
  writeFileSync(entryPath, original);

  writeFileSync(
    entryPath,
    `---\n${stringify({
      ...data,
      storedData: [{ en: "Special local item", ja: "個別の保存項目" }],
      hosts: ["api.example.com"],
      requests: {
        en: "Service-specific request note.",
        ja: "サービス固有の通信に関する補足。",
      },
    })}---\n`,
  );

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
      `---\n${stringify(fixture)}---\n## Additional note\n\nEnglish test note.\nSecond line.\n\n## 補足\n\n日本語のテスト補足。\n二行目です。\n`,
    );
  }
  build();
  assert(
    readFileSync("dist/backlog-live-update/index.html", "utf8").includes(
      "Service-specific request note.",
    ),
  );
  assert(
    readFileSync("dist/ja/backlog-live-update/index.html", "utf8").includes(
      "サービス固有の通信に関する補足。",
    ),
  );
  assert(
    readFileSync("dist/backlog-live-update/index.html", "utf8").includes(
      "Special local item",
    ),
  );
  assert(
    readFileSync("dist/ja/backlog-live-update/index.html", "utf8").includes(
      "個別の保存項目",
    ),
  );
  for (const prefix of ["", "ja/"]) {
    assert(
      readFileSync(
        `dist/${prefix}backlog-live-update/index.html`,
        "utf8",
      ).includes("api.example.com"),
    );
  }
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
    assert(html.includes('src="/icons/extension.svg"'));
    assert(html.indexOf("English test note") > html.indexOf('id="policy-en"'));
    assert(
      html.indexOf("English test note") <
        html.indexOf('href="mailto:contact@simochee.net"'),
    );
    assert.match(html, /English test note\.<br\s*\/?>\s*Second line\./);
    assert.match(html, /日本語のテスト補足。<br\s*\/?>\s*二行目です。/);
    const japanese = readFileSync(`dist/ja/test-${pattern}/index.html`, "utf8");
    checkLocalePage(japanese, "ja", `test-${pattern}`);
    assert(
      japanese.includes(
        pattern === "no-data"
          ? "データを収集・保存・送信しません"
          : "これらを外部に送信することはなく",
      ),
    );
    assert.match(japanese, /日本語のテスト補足。<br\s*\/?>\s*二行目です。/);
    assert(!/<script\b/i.test(html));
  }
  console.log(
    "PASS: no-data and local-only templates, unofficial flag, optional request notes, Markdown soft line breaks",
  );
} finally {
  writeFileSync(entryPath, original);
  for (const path of fixturePaths) rmSync(path, { force: true });
}

build();
checkOutput();
console.log("PASS: restored content and rebuilt clean production output");
