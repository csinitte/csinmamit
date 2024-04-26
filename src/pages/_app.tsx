import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Poppins } from "next/font/google";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Navbar } from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "500",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={`${poppins.className}`}>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
