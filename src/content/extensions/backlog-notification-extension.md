---
name:
  en: Backlog Notification Extension
  ja: Backlog Notification Extension
icon: https://raw.githubusercontent.com/lollipop-onl/webextensions-backlog-notification/main/public/icons/128.png
updated: "2026-11-09"
pattern: user-configured
unofficial: true
unofficialNote:
  en: This extension is unofficial and is not an official Nulab product.
  ja: 本拡張機能は非公式のもので、ヌーラボの公式製品ではありません。
storedData:
  - en: The Backlog space domain and API key you enter in the options.
    ja: オプションで入力した Backlog のスペースドメインと API キー。
  - en: The tab you last selected in the popup.
    ja: ポップアップで最後に選択したタブ。
hosts:
  - "*.backlog.com"
  - "*.backlog.jp"
requests:
  en: The extension checks your unread notification count every minute. When you open the popup, it loads your notifications and recently viewed projects and issues. It marks notifications as read only when you ask it to. Notifications and issues are not saved.
  ja: 未読のお知らせの件数を 1 分ごとに確認します。ポップアップを開いたときに、お知らせと最近見たプロジェクト・課題を読み込みます。お知らせを既読にするのは、利用者が操作したときだけです。お知らせや課題の内容は保存しません。
removal:
  en: Clear the space domain and API key in the extension options and save, or uninstall the extension to remove all stored data.
  ja: 拡張機能のオプションでスペースドメインと API キーを空にして保存するか、拡張機能をアンインストールすると、保存されたデータを削除できます。
---
