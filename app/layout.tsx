import "./globals.css";

export const metadata = {
  title: "Rave Social",
  description: "An independent social network.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
