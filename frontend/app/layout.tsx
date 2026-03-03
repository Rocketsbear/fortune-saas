import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.vercel.app"),
  title: {
    default: "命理融合咨询 Pro | 专业紫微斗数 + 八字分析",
    template: "%s | Fortune SaaS",
  },
  description: "专业命理咨询服务，紫微斗数与八字融合分析，为您提供事业发展、财运、健康、感情等全方位命理指导",
  keywords: ["命理", "紫微斗数", "八字", "算命", "命理咨询", "运势分析", "风水"],
  authors: [{ name: "Fortune SaaS" }],
  creator: "Fortune SaaS",
  publisher: "Fortune SaaS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://your-domain.vercel.app",
    siteName: "命理融合咨询 Pro",
    title: "命理融合咨询 Pro | 专业紫微斗数 + 八字分析",
    description: "专业命理咨询服务，紫微斗数与八字融合分析，为您提供事业发展、财运、健康、感情等全方位命理指导",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "命理融合咨询 Pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "命理融合咨询 Pro",
    description: "专业命理咨询服务 - 紫微斗数 + 八字融合分析",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://your-domain.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
