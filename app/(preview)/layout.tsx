import "@/app/(preview)/globals.css";
import "@/app/(preview)/xyflow-theme.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "Bookworm",
  description: "Map mind generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-system">
        {children}
      </body>
    </html>
  )
}
