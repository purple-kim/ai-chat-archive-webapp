import "./globals.css";

export const metadata = {
  title: "AI 대화 아카이빙",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
