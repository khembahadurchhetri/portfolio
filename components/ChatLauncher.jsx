import Script from "next/script";

export default function ChatLauncher() {
  return (
    <Script
      id="hamro-chat-widget"
      src="https://hamrochatbot.vercel.app/widget.js"
      strategy="afterInteractive"
      data-org="portfolio-khem"
      data-key="ba939fe4ebf1aefb30293c5bd97fd013e0293df14d13266a"
    />
  );
}
