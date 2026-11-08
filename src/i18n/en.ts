export const en = {
  locale: "en-US",
  title: "Privacy Policy",
  updated: "Last updated: ",
  introduction: (name: string) =>
    `This privacy policy describes how simochee (the developer) handles data for the browser extension “${name}”.`,
  dataHeading: "Data the extension handles",
  destinationsHeading: "Where data is sent",
  commitments:
    "The developer does not operate any servers for this extension. The extension does not use analytics or tracking, does not sell or share your data with third parties, and does not load remote code.",
  removalHeading: "Removing your data",
  disclaimerHeading: "Disclaimer",
  disclaimer:
    "This extension is provided “as is,” without warranty of any kind. As this is a personal project, the developer shall not be liable for any damages arising out of its use.",
  contactHeading: "Contact",
  emailBefore: "For questions about this policy, email ",
  emailAfter: "",
  support: "You can also open an issue on GitHub.",
  patterns: {
    noData: "This extension does not collect, store, or transmit any data.",
    localOnly:
      "This extension stores settings and credentials only in your browser to provide its functionality. They are never sent anywhere; all processing takes place locally on your device.",
    userConfigured:
      "This extension stores settings and credentials in your browser and sends them only to the service you configured, for the extension's functionality. Nothing is sent to the developer.",
  },
};

export type Messages = typeof en;
