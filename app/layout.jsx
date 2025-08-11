import "./globals.css";

export const metadata = {
  title: "AutoTrim – Instantly cut silence in your videos",
  description: "Speed up your editing workflow. AutoTrim removes silence automatically. Fast, accurate, and reliable.",
  openGraph: {
    title: "AutoTrim – Instantly cut silence in your videos",
    description: "Speed up your editing workflow. AutoTrim removes silence automatically.",
    images: [
      { url: "/assets/img/hero-screenshot.jpg" }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoTrim – Instantly cut silence in your videos",
    description: "Speed up your editing workflow. AutoTrim removes silence automatically.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
