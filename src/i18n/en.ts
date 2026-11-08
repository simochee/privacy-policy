export const en = {
  locale: "en-US",
  title: "Privacy Policy",
  languageLabel: "Language",
  notesHeading: "Additional notes",
  updated: "Last updated: {date}",
  dataHeading: "Data",
  destinationsHeading: "Destinations",
  removalHeading: "Removing your data",
  disclaimer: "This extension is provided “as is,” without warranty.",
  contact: "For questions about this privacy policy, email {email}.",
  patterns: {
    "no-data": "This extension does not collect, store, or transmit any data.",
    "local-only":
      "This extension stores settings and credentials only in your browser to provide its functionality. They are never sent anywhere; all processing takes place locally on your device.",
    "user-configured":
      "This extension stores settings and credentials in your browser and sends them only to the service you configured, for the extension's functionality. Nothing is sent to the developer.",
  },
};

export type Messages = typeof en;
