# Extension privacy policies

Standalone English and Japanese privacy policies for simochee's browser extensions,
built with Astro and published at `https://privacy.simochee.net/<slug>/`.
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

Open `/backlog-live-update/`; `/` intentionally has no page.

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
   The filename becomes `/<slug>/`; no route or navigation registration is needed.
   Keep slugs unique and do not use `404`, which is reserved for the error page.
2. Select the pattern that matches the extension's actual permissions and data use.
   Copy the example below or `backlog-live-update.md` for an API-using extension.
3. Supply both `en` and `ja` for every prose parameter. Review both languages
   against the implementation and store disclosures, including session storage,
   transient API data, credential scope, and revocation.
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
storedData:
  - en: Display preferences, stored only in the browser.
    ja: ブラウザ内にのみ保存する表示設定。
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
| `updated` | Required quoted ISO calendar date, `YYYY-MM-DD` |
| `pattern` | Required `no-data`, `local-only`, or `user-configured` |
| `unofficial` | Required boolean |
| `unofficialNote` | Required `{ en, ja }` exactly when `unofficial: true`; state whose official product it is not |
| `supportUrl` | Optional HTTPS URL for the extension's existing support channel; email contact is always shown |
| `storedData` | Required list of `{ en, ja }` descriptions, including purpose, storage location, and lifetime |
| `removal` | Required `{ en, ja }` deletion instructions; include credential revocation separately where relevant |
| `hosts` | Required nonempty hostname list for `user-configured` only; optional leading `*.` allowed |
| `requests` | Required `{ en, ja }` for `user-configured` only: what is sent/fetched, when, to which configured service, and how credentials are scoped; describe data that is not stored here |

- `no-data`: `storedData: []`; the extension collects, stores, and sends nothing.
  Use `removal` to explain that there is no stored data to remove.
- `local-only`: nonempty `storedData`; settings and credentials stay in the browser
  and are never sent anywhere.
- `user-configured`: nonempty `storedData`, `hosts`, and `requests`; settings and
  credentials are sent only to the service the user configured. Nothing goes to
  the developer.

Shared wording lives in `src/components/patterns/` and `Policy.astro`. Each page
includes the developer's identity, absence of developer-operated servers,
analytics/tracking, sale/sharing, and remote code, an “as is” disclaimer, and
`contact@simochee.net`. Backlog Live Update also retains the original GitHub
Issue contact. Its reviewed source policy is reproduced in meaning, with the
shared disclaimer and email contact added.

The Markdown body is optional. It is rendered once in a fixed **appendix after
both complete policies**; use it only for extra extension-specific notes, with
English first and Japanese second (use `##` headings and mark Japanese HTML
sections with `lang="ja"` if appropriate). Keep all facts needed to understand
data use in the bilingual frontmatter, so each language's policy is complete.
Use plain Markdown without scripts, embeds, or links to other pages on this site.

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
   when available. Confirm `/backlog-live-update/` loads and `/` and an unknown
   path return HTTP 404 with the error page.

There is deliberately **no `public/CNAME`**: with a custom GitHub Actions
workflow, GitHub Pages ignores it and does not require it. The custom domain is
stored in the repository's Pages settings. See GitHub's
[custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
and Astro's [Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/).
