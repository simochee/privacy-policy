---
name:
  en: Backlog Live Update
  ja: Backlog Live Update
icon: https://raw.githubusercontent.com/simochee/backlog-live-update/main/assets/icon.svg
updated: "2026-11-09"
pattern: user-configured
unofficial: true
unofficialNote:
  en: This extension is unofficial and is not an official Nulab product.
  ja: 本拡張機能は非公式のもので、ヌーラボの公式製品ではありません。
storedData:
  - en: The Backlog spaces you add (space key, API key, and on/off) and the update interval.
    ja: 追加した Backlog スペース（スペースキー、API キー、オン/オフ）と更新間隔。
hosts:
  - "*.backlog.com"
  - "*.backlog.jp"
  - "*.backlogtool.com"
requests:
  en: While a Backlog issue or pull request page is visible, the extension checks that page's space for updates at the interval you set. An API key is sent only to its own space. Some updates are also read through the Backlog session you are already signed in to on that page.
  ja: Backlog の課題またはプルリクエストのページが表示されている間、設定した間隔でそのページのスペースに更新を確認します。API キーは、そのキーのスペースにだけ送信します。一部の更新は、そのページでサインイン済みの Backlog セッションを使って取得します。
removal:
  en: Remove a space in the extension options to delete its API key, or uninstall the extension to remove all stored settings.
  ja: 拡張機能のオプションでスペースを削除すると API キーが削除されます。拡張機能をアンインストールすると、保存されたすべての設定を削除できます。
---
