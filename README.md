# Extension privacy policies

Standalone English and Japanese privacy policies for simochee's browser extensions,
built with Astro and published in English at `https://privacy.simochee.net/<slug>/`
and in Japanese at `https://privacy.simochee.net/ja/<slug>/`. A header language
switcher links to the same extension in the other language.
There is no home page or navigation between extensions. GitHub Pages serves the
custom `404.html` for `/` and unknown page paths; generated CSS is served as an asset.
The published pages contain no client-side JavaScript or external font dependencies.

## Development

Use Node.js **24.22.2** (see `.node-version`) and pnpm **12.18.0** (see
`package.json#packageManager`). Install that pnpm version with your preferred
package manager/version manager, then run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `/backlog-live-update/` (English) or `/ja/backlog-live-update/` (Japanese).
`/` and `/ja/` intentionally have no index page.

```sh
pnpm check   # Astro type checks and Biome lint/format checks
pnpm test    # Builds, verifies output, tests invalid metadata, then rebuilds restored content
pnpm build   # Static files in dist/
pnpm preview # Preview the built site
pnpm format  # Format TS, JS, JSON, and CSS with Biome
```

Biome is limited to the file types above; Astro templates and Markdown are kept
readable by hand. TypeScript 6 matches `astro check`'s supported range, and the
`pnpm-workspace.yaml` override keeps its WASM runtime on stable emnapi 1.x, matching
its core instead of the incompatible automatically selected 2.x beta peer.
`pnpm test` temporarily modifies the example entry and creates
two fixture entries, restores them in a `finally` block, and leaves a production
build with just the real pages. Run it in an idle checkout, not alongside `dev`
or another build. Tests check the build output; the live domain and DNS are
verified after the human finishes deployment setup.

## Add an extension

1. Add `src/content/extensions/<slug>.md` using a lowercase kebab-case filename.
   The filename generates both `/<slug>/` and `/ja/<slug>/`; no route or navigation
   registration is needed. Keep slugs unique; `404` and `ja` are reserved.
2. Select the pattern that matches the extension's actual permissions and data use.
   Copy the example below or `backlog-live-update.md` for an API-using extension.
   To show its icon, place the file in `public/icons/` and set `icon: /icons/file.svg`;
   omit `icon` to use the shared icon. SVG, PNG, WebP, and JPEG are supported.
3. Supply both `en` and `ja` for every prose parameter. Review both languages
   against the implementation and store disclosures, including session storage,
   transient data and credential scope. Keep the policy concise and add extra
   details only when an extension differs from its shared pattern.
   Write Japanese values on one line; YAML folded blocks (`>-`) insert unwanted spaces at line joins.
4. Run `pnpm check`, `pnpm test`, and `pnpm build`. Inspect the new page in
   `pnpm preview` before submitting a pull request.

```yaml
---
name:
  en: Example Extension
  ja: サンプル拡張機能
updated: "2026-11-08"
pattern: local-only
unofficial: false
removal:
  en: Uninstall the extension to remove its settings.
  ja: 拡張機能をアンインストールすると設定が削除されます。
---
```

### Frontmatter schema

`src/content.config.ts` defines the `extensions` collection and a strict
schema: missing required fields, unknown keys (including misspellings), empty
translations, and invalid pattern-specific fields fail the build.

| Field | Shape / requirement |
| --- | --- |
| `name` | Required `{ en, ja }` nonempty strings |
| `icon` | Optional local `/icons/filename` path; the file must exist in `public/icons/`. Defaults to `/icons/extension.svg` |
| `updated` | Required quoted ISO calendar date, `YYYY-MM-DD` |
| `pattern` | Required `no-data`, `local-only`, or `user-configured` |
| `unofficial` | Required boolean |
| `unofficialNote` | Required `{ en, ja }` exactly when `unofficial: true`; state whose official product it is not |
| `storedData` | Optional `{ en, ja }` list when stored data needs more explanation; empty only for `no-data` |
| `removal` | Required `{ en, ja }` deletion instructions for data stored by the extension |
| `hosts` | Optional nonempty hostname list for `user-configured` when destinations need to be listed; leading `*.` allowed |
| `requests` | Optional `{ en, ja }` for `user-configured` only: additional request behavior that the shared pattern and host list do not cover |

- `no-data`: the extension collects, stores, and sends nothing.
- `local-only`: settings and credentials stay in the browser and are never sent anywhere.
- `user-configured`: settings and credentials are sent only to the service the user
  configured. Nothing goes to the developer.

The pattern, deletion instructions, and unofficial notice are normally enough.
Use `storedData`, `hosts`, or `requests` only for details that need to be disclosed
beyond the shared pattern. `no-data` does not allow a nonempty `storedData` list.

Shared wording lives in `src/i18n/en.ts` and `src/i18n/ja.ts`, following Astro's
[translation dictionary recipe](https://docs.astro.build/en/recipes/i18n/).
Templates select `messages[lang]`; the Japanese dictionary must satisfy the
English dictionary's key and value types, including nested pattern wording.
Extension-specific translations remain in frontmatter. Astro
[built-in i18n routing](https://docs.astro.build/en/guides/internationalization/)
uses English as the default without a prefix, and Japanese under `/ja/`.
Language links and canonical/alternate URLs use the official `astro:i18n` helpers. Each page
identifies the extension and its developer, explains the pattern's data handling,
and shows deletion instructions and the unofficial notice when applicable.
The page header groups the icon, extension name, and the shared English heading
“Privacy Policy”. Extension-specific data handling appears first; the footer
contains only the email contact and a brief “as is” notice.

The Markdown body is optional and shared by both language versions. It renders
in an **appendix after the policy**; provide English and Japanese together for
extra notes (use `##` headings and mark Japanese HTML sections with `lang="ja"`
if appropriate). Keep all facts needed to understand data use in the bilingual
frontmatter, so each language's policy is complete. Normal Markdown line breaks
render as `<br>` through `remark-breaks`; blank lines still separate paragraphs.
This applies to the Markdown body, not YAML frontmatter values. Use plain Markdown
without scripts, embeds, or links to other policies on this site.

## Deployment and manual setup

`.github/workflows/deploy.yml` checks pull requests and builds/deploys pushes to
`main`. It uses `.node-version`, `packageManager`, and the frozen lockfile. Build
and deployment run in separate jobs, and only deployment receives write/OIDC
permissions. The Astro `site` is `https://privacy.simochee.net`, with no base path.

The repository owner must perform these steps; this change does not alter
repository settings or DNS:

1. In **simochee/privacy-policy → Settings → Pages → Build and deployment**, set
   **Source: GitHub Actions**.
2. In **Pages → Custom domain**, save **privacy.simochee.net**.
3. In Cloudflare DNS for `simochee.net`, add a **CNAME** named **privacy** targeting
   **simochee.github.io**, with **DNS only** (proxy off) so GitHub can validate
   DNS and provision TLS. Do not include the repository name in the target.
4. Merge the PR to `main` (or rerun the deployment workflow after setup), wait for
   the Pages deployment and DNS/certificate checks, and enable **Enforce HTTPS**
   when available. Confirm both `/backlog-live-update/` and
   `/ja/backlog-live-update/` load and the header switches languages; `/`, `/ja/`,
   and unknown paths must return HTTP 404 with the error page.

There is deliberately **no `public/CNAME`**: with a custom GitHub Actions
workflow, GitHub Pages ignores it and does not require it. The custom domain is
stored in the repository's Pages settings. See GitHub's
[custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
and Astro's [Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/).
