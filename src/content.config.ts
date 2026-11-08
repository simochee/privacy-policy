import { defineCollection } from "astro:content";
import { existsSync } from "node:fs";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const prose = z
  .object({ en: z.string().trim().min(1), ja: z.string().trim().min(1) })
  .strict();
const common = {
  name: prose,
  icon: z
    .string()
    .regex(/^\/icons\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:svg|png|webp|jpe?g)$/)
    .refine(
      (path) => existsSync(`public${path}`),
      "Icon file must exist in public/icons",
    )
    .optional(),
  updated: z.iso.date(),
  unofficial: z.boolean(),
  unofficialNote: prose.optional(),
  removal: prose,
};

const extensions = defineCollection({
  loader: glob({
    pattern: "*.md",
    base: "./src/content/extensions",
    generateId: ({ entry }) => {
      const slug = entry.slice(0, -3);
      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
        ["404", "ja"].includes(slug)
      ) {
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
          storedData: z.array(prose).length(0).optional(),
        })
        .strict(),
      z
        .object({
          ...common,
          pattern: z.literal("local-only"),
          storedData: z.array(prose).min(1).optional(),
        })
        .strict(),
      z
        .object({
          ...common,
          pattern: z.literal("user-configured"),
          storedData: z.array(prose).min(1).optional(),
          hosts: z
            .array(
              z
                .string()
                .regex(/^(\*\.)?[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}$/),
            )
            .min(1)
            .optional(),
          requests: prose.optional(),
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
