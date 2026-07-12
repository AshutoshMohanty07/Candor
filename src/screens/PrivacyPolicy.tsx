import Legal from "./Legal";

const sections = [
  {
    heading: "Overview",
    body: `Candor ("the app," "we," "us") is an anonymous messaging application. This policy explains what limited information we collect and how it's used.`,
  },
  {
    heading: "Information We Collect",
    body: "Username (public, forms your shareable link); Owner token (a private credential generated at signup, never shown to anyone but you); Messages (content and timestamp of anonymous messages sent to your account); Replies (content of any replies you post). We do not collect your name, email, phone number, or other directly identifying information at signup.",
  },
  {
    heading: "Anonymous Senders",
    body: "Visitors who message you through your public link do not create an account. We do not collect or store identifying information about anonymous senders beyond message content and timestamp.",
  },
  {
    heading: "How We Use Information",
    body: "To operate core messaging functionality; to display basic usage statistics (Insights) to you; to enforce moderation actions you take (ignore, report).",
  },
  {
    heading: "Data Sharing",
    body: "We do not sell, rent, or share your data with third parties for advertising or marketing purposes.",
  },
  {
    heading: "Data Retention and Deletion",
    body: "You may delete your account at any time from Settings. Deleting your account permanently removes your username, messages, and replies from our systems. This action cannot be undone.",
  },
  {
    heading: "Children's Privacy",
    body: "Candor is not directed at, and should not be used by, children under 13. We do not knowingly collect information from children under 13.",
  },
  {
    heading: "Security",
    body: "We use reasonable technical measures, including private access tokens, to protect your account. No online service can guarantee absolute security.",
  },
  {
    heading: "Changes to This Policy",
    body: "We may update this policy from time to time. Continued use after changes constitutes acceptance.",
  },
  {
    heading: "Contact",
    body: "This is a portfolio/demonstration project. For questions, contact the developer via the GitHub repository.",
  },
];

export default function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  return (
    <Legal
      title="Candor Privacy Policy"
      lastUpdated="Last updated: July 2026"
      sections={sections}
      onBack={onBack}
    />
  );
}
