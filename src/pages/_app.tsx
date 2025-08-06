import App, { type AppType } from "next/app";
import { Poppins } from "next/font/google";
// import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Navbar } from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { Toaster } from "~/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "500",
});

const MyApp: AppType = ({
  Component,
  pageProps,
}) => {
  return (
    <main className={`${poppins.className}`}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <Toaster />
    </main>
  );
};

export default MyApp;
