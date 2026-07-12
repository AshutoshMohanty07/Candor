import Legal from "./Legal";

const sections = [
  {
    heading: "Acceptance of Terms",
    body: "By using Candor, you agree to these Terms. If you do not agree, do not use the app.",
  },
  {
    heading: "Eligibility",
    body: "You must be at least 13 years old to use Candor. By using the app, you represent that you meet this requirement.",
  },
  {
    heading: "Your Account",
    body: "You are responsible for maintaining the confidentiality of your private access credential and for all activity through your account.",
  },
  {
    heading: "Acceptable Use",
    body: "You agree not to use Candor to: send messages that are threatening, harassing, hateful, or intended to harm another person; send illegal content, including content that exploits or endangers minors; attempt to circumvent or interfere with the security or proper functioning of the app; impersonate any person or entity.",
  },
  {
    heading: "Content Ownership and Responsibility",
    body: "Messages sent through Candor are the responsibility of the sender. Candor does not review messages before delivery. Account owners may report or ignore messages they receive.",
  },
  {
    heading: "Moderation",
    body: "We reserve the right to remove content or terminate accounts that violate these Terms, at our discretion.",
  },
  {
    heading: "No Fabricated Content",
    body: "Candor does not generate, insert, or fabricate messages of any kind. Every message delivered to your inbox originates from a real visitor to your public link.",
  },
  {
    heading: "Account Deletion",
    body: "You may delete your account at any time. Deletion is permanent and cannot be reversed.",
  },
  {
    heading: "Disclaimer of Warranties",
    body: `Candor is provided "as is," without warranties of any kind. This is a demonstration/portfolio project and is not intended for high-stakes or commercial use.`,
  },
  {
    heading: "Limitation of Liability",
    body: "To the fullest extent permitted by law, Candor and its developer shall not be liable for indirect, incidental, or consequential damages arising from use of the app.",
  },
  {
    heading: "Changes to These Terms",
    body: "We may update these Terms from time to time. Continued use after changes constitutes acceptance.",
  },
  {
    heading: "Contact",
    body: "This is a portfolio/demonstration project. For questions, contact the developer via the GitHub repository.",
  },
];

export default function TermsOfService({ onBack }: { onBack: () => void }) {
  return (
    <Legal
      title="Candor Terms of Service"
      lastUpdated="Last updated: July 2026"
      sections={sections}
      onBack={onBack}
    />
  );
}
