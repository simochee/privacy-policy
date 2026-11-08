import type { Messages } from "./en";

export const ja = {
  locale: "ja-JP",
  title: "プライバシーポリシー",
  updated: "最終更新日: ",
  introduction: (name: string) =>
    `本ポリシーでは、simochee（開発者）によるブラウザ拡張機能「${name}」のデータの取り扱いについて説明します。`,
  dataHeading: "扱うデータ",
  destinationsHeading: "データの送信先",
  commitments:
    "開発者は本拡張機能のためのサーバーを運営していません。本拡張機能は解析やトラッキングを行わず、データを販売したり第三者と共有したりすることはなく、リモートのコードも読み込みません。",
  removalHeading: "データの削除",
  disclaimerHeading: "免責事項",
  disclaimer:
    "本拡張機能は現状のまま提供され、いかなる保証も行いません。個人のプロジェクトであり、本拡張機能の使用によって生じたいかなる損害についても、開発者は責任を負いません。",
  contactHeading: "お問い合わせ",
  emailBefore: "本ポリシーについてのお問い合わせは、",
  emailAfter: " までご連絡ください。",
  support: "GitHub に Issue を作成することもできます。",
  patterns: {
    noData: "本拡張機能はデータを収集・保存・送信しません。",
    localOnly:
      "本拡張機能は、機能を提供するための設定や認証情報をブラウザ内にのみ保存します。これらを外部に送信することはなく、すべての処理を端末内で行います。",
    userConfigured:
      "本拡張機能は設定や認証情報をブラウザ内に保存し、機能の提供に必要な範囲で、利用者が設定したサービスにのみ送信します。開発者には送信しません。",
  },
} satisfies Messages;
