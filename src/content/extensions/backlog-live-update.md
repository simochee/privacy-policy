---
name:
  en: Backlog Live Update
  ja: Backlog Live Update
updated: "2026-11-08"
pattern: user-configured
unofficial: true
unofficialNote:
  en: This extension is unofficial and is not an official Nulab product.
  ja: 本拡張機能は非公式のもので、ヌーラボの公式製品ではありません。
supportUrl: https://github.com/simochee/live-for-backlog/issues
storedData:
  - en: "Settings: the Backlog spaces you add (space key, API key, and whether updates are on), and the update interval. They are stored only in your browser's extension storage (storage.local)."
    ja: "設定: 追加した Backlog スペース（スペースキー、API キー、更新のオン・オフ）と更新間隔。ブラウザの拡張機能用ストレージ（storage.local）にのみ保存します。"
  - en: "Suggested space: when you click the toolbar icon on a Backlog page, the space key and address of that page are kept in session storage (storage.session) so the options page can suggest adding it. It is cleared when the browser closes."
    ja: "スペースの候補: Backlog のページでツールバーのアイコンをクリックすると、そのページのスペースキーとアドレスをセッションストレージ（storage.session）に保持し、オプション画面で追加の候補として表示します。ブラウザを閉じると消えます。"
hosts:
  - "*.backlog.com"
  - "*.backlog.jp"
  - "*.backlogtool.com"
requests:
  en: >-
    Backlog Live Update keeps open Backlog issue and pull request pages up to date without reloading.
    It sends requests only to the Backlog host of the tab you are viewing, and only for spaces you added.
    Each API key is included only in requests to its own space.
    Issue and pull request data (the issue key or pull request number of the page you have open,
    and its fields, comments, stars, and notification read status) are fetched from your Backlog
    space only to update the page you are viewing, and are not stored by the extension.
  ja: Backlog Live Update は、開いている Backlog の課題ページとプルリクエストページをリロードなしで最新の状態に保つ拡張機能です。表示中のタブの Backlog ホストにのみ、追加したスペースに限ってリクエストを送ります。API キーも、それぞれのスペースへのリクエストにだけ含めます。課題とプルリクエストのデータ（開いている課題のキーやプルリクエストの番号と、その項目・コメント・スター・お知らせの既読状況）は、表示中のページを更新するためだけにあなたの Backlog スペースから取得し、本拡張機能が保存することはありません。
removal:
  en: >-
    Remove a space in the extension options, or uninstall the extension, to remove the stored settings
    from your browser. To revoke the API key itself, delete it from Personal Settings → API in Backlog.
  ja: 拡張機能のオプションでスペースを削除するか、本拡張機能をアンインストールすると、保存された設定はブラウザから削除されます。API キー自体を無効にするには、Backlog の「個人設定 → API」から削除してください。
---
