import { en } from "./en";
import { ja } from "./ja";

export const messages = { en, ja };
export type Language = keyof typeof messages;
