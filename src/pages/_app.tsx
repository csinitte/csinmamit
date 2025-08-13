import { type AppType } from "next/app";
// import { Poppins } from "next/font/google";
// import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Navbar } from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { Toaster } from "~/components/ui/sonner";

// Using system fonts instead of Google Fonts to avoid build-time network issues
// const poppins = Poppins({
//   subsets: ["latin"],
//   variable: "--font-sans",
//   weight: ["400", "500", "600", "700"],
//   display: "swap",
//   fallback: ["system-ui", "arial"],
//   adjustFontFallback: true,
//   preload: true,
// });

const MyApp: AppType = ({
  Component,
  pageProps,
}) => {
  return (
    <main className="font-sans">
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <Toaster />
    </main>
  );
};

export default MyApp;
