import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import remarkBreaks from "remark-breaks";

export default defineConfig({
  site: "https://privacy.simochee.net",
  output: "static",
  trailingSlash: "always",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
    routing: { prefixDefaultLocale: false },
  },
  markdown: { processor: unified({ remarkPlugins: [remarkBreaks] }) },
});
