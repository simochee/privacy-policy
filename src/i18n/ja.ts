import type { Messages } from "./en";

export const ja = {
  locale: "ja-JP",
  title: "プライバシーポリシー",
  languageLabel: "言語",
  notesHeading: "補足",
  updated: "最終更新日: ",
  dataHeading: "データの扱い",
  destinationsHeading: "送信先",
  removalHeading: "データの削除",
  disclaimer:
    "本拡張機能は現状のまま提供され、動作や利用結果を保証するものではありません。",
  emailBefore: "お問い合わせ: ",
  emailAfter: "",
  patterns: {
    noData: "本拡張機能はデータを収集・保存・送信しません。",
    localOnly:
      "本拡張機能は、機能を提供するための設定や認証情報をブラウザ内にのみ保存します。これらを外部に送信することはなく、すべての処理を端末内で行います。",
    userConfigured:
      "本拡張機能は設定や認証情報をブラウザ内に保存し、機能の提供に必要な範囲で、利用者が設定したサービスにのみ送信します。開発者には送信しません。",
  },
} satisfies Messages;
