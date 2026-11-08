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
hosts:
  - "*.backlog.com"
  - "*.backlog.jp"
requests:
  en: The extension periodically checks your space for notifications. The API key is sent only to that space.
  ja: 設定したスペースのお知らせを定期的に確認します。API キーは、そのスペースにだけ送信します。
removal:
  en: Clear the space domain and API key in the extension options and save, or uninstall the extension to remove all stored settings.
  ja: 拡張機能のオプションでスペースドメインと API キーを空にして保存するか、拡張機能をアンインストールすると、保存された設定を削除できます。
---
