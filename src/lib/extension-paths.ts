import { type CollectionEntry, getCollection } from "astro:content";

export interface ExtensionProps {
  extension: CollectionEntry<"extensions">;
}

export async function getExtensionPaths() {
  const extensions = await getCollection("extensions");
  return extensions.map((extension) => ({
    params: { slug: extension.id },
    props: { extension },
  }));
}
