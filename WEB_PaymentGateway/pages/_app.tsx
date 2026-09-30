import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { CartProvider } from "../context/CartContext";

const font = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <div className={font.className}>
        <Component {...pageProps} />
      </div>
    </CartProvider>
  );
}