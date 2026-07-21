import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "京东健康活水岗位海报生成器",
  description: "填写岗位信息，自动生成可编辑 PPT 和 PNG 招聘海报。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
