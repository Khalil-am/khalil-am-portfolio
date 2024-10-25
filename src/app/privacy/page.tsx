import Link from "next/link";

const lastUpdated = "Sep 2024";

export default function PrivacyPolicy() {
  return (
    <article className="prose mt-8 pb-16 dark:prose-invert">
      <div className="space-y-4">
        <h1 className="title text-5xl">Privacy Policy</h1>
        <p>Last Updated: {lastUpdated}</p>
      </div>
      <div className="space-y-4">
        <h2 className="title text-3xl">Welcome!</h2>
        <p>
          This <b>Privacy Policy</b> explains how I handle your data on my site, which is mainly for showcasing my work as a data scientist. I respect your privacy and collect very little information.
        </p>
        <h2 className="title">What Information I Collect</h2>
        <p>
          This site is mostly static, meaning I don’t collect personal information unless you choose to reach out via email or through the chatbot.
        </p>
        <h3>1. Chatbot Conversations</h3>
        <p>
          Any chatbot interaction may be stored temporarily for training and improvement purposes. Avoid sharing confidential information.
        </p>
        <h3>2. Contact Info</h3>
        <p>
          If you reach out, I’ll only use your information to respond to your inquiry.
        </p>
        <h2 className="title">How I Use the Info</h2>
        <p>Here’s what I might do with the data I collect:</p>
        <ul>
          <li>Ensure the site runs smoothly</li>
          <li>Respond to your questions or feedback</li>
        </ul>
        <h2 className="title">Sharing Your Info</h2>
        <p>
          I don’t share or sell your information. If you want something removed, just let me know.
        </p>
        <h2 className="title">Security</h2>
        <p>
          I take reasonable steps to protect your data, but no system is 100% secure.
        </p>
        <h2 className="title">Policy Updates</h2>
        <p>
          This policy was last updated in <b>{lastUpdated}</b>. I’ll update it here if things change.
        </p>
        <h2 className="title">Got Questions?</h2>
        <p>
          If you have questions or concerns, feel free to contact me at{" "}
          <Link href="mailto:Khalil-am@outlook.com">Khalil-am@outlook.com</Link> or use the{" "}
          <Link href="/contact">contact form</Link>.
        </p>
      </div>
    </article>
  );
}