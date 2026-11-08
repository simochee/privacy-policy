import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const prose = z
  .object({ en: z.string().trim().min(1), ja: z.string().trim().min(1) })
  .strict();
const common = {
  name: prose,
  updated: z.iso.date(),
  unofficial: z.boolean(),
  unofficialNote: prose.optional(),
  supportUrl: z
    .url()
    .refine((url) => url.startsWith("https://"), "Use an HTTPS support URL")
    .optional(),
  removal: prose,
};

const extensions = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/extensions",
    generateId: ({ entry }) => {
      const slug = entry.slice(0, -3);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug === "404") {
        throw new Error(`Invalid or reserved extension slug: ${slug}`);
      }
      return slug;
    },
  }),
  schema: z
    .discriminatedUnion("pattern", [
      z
        .object({
          ...common,
          pattern: z.literal("no-data"),
          storedData: z.array(prose).length(0),
        })
        .strict(),
      z
        .object({
          ...common,
          pattern: z.literal("local-only"),
          storedData: z.array(prose).min(1),
        })
        .strict(),
      z
        .object({
          ...common,
          pattern: z.literal("user-configured"),
          storedData: z.array(prose).min(1),
          hosts: z
            .array(
              z
                .string()
                .regex(/^(\*\.)?[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}$/),
            )
            .min(1),
          requests: prose,
        })
        .strict(),
    ])
    .superRefine((data, context) => {
      if (data.unofficial !== Boolean(data.unofficialNote)) {
        context.addIssue({
          code: "custom",
          path: ["unofficialNote"],
          message: "Provide unofficialNote exactly when unofficial is true",
        });
      }
    }),
});

export const collections = { extensions };
