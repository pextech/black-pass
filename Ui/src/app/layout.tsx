import NavBar from "./components/NavBar";
import "./globals.css";
import { Inter } from "next/font/google";
import { ReduxProvider } from "../redux/provider";
import HashConnectProvider from "./context/useHashConnect";
import ToasterContext from "./context/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Black Pass",
  description: "Loyalty Program",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <HashConnectProvider>
            <NavBar />
            <ToasterContext />
            {children}
          </HashConnectProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
