import { Manrope } from "next/font/google";
import "./globals.css";
import ScrollWrapper from "@/components/ScrollWrapper";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
  title: "Work – Jonas Reymondin",
  description: "Clone of Jonas Reymondin Work Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <ScrollWrapper>{children}</ScrollWrapper>
      </body>
    </html>
  );
}
