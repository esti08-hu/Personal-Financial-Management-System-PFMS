"use client";


import Footer from "@/app/components/Footer";
import UserNavbar from "@/app/components/user components/UserNavbar";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <title> My App</title>{" "}
      </Head>

      <div className="relative min-h-screen bg-gray-2 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <UserNavbar />
        <div className="flex flex-col justify-center items-center h-40 font-black text-gray-800 dark:text-gray-100"></div>

        <main className="flex-grow">
          <div className="container mx-auto px-4 py-">
            <div className="mx-auto">{children}</div>
          </div>
        </main>

        <Footer />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />
    </html>
  );
};

export default Layout;
