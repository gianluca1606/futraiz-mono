import { NextSeo } from "next-seo";
import Script from "next/script";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
export const MainLayout = ({ children, centerContent, title }: any) => {
  return (
    <>
      <NextSeo title={title} description="A short description goes here." />
      <Script id="show-banner" strategy="lazyOnload">
        {`if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}`}
      </Script>
      <div className="bg-white dark:bg-gray-900 h-screen">
        <Header />

        <div className="flex mb-auto relative justify-center justify-items-center h-5/6 overflow-y-visible">
          <Sidebar />
          <div
            className={
              "sm:ml-0  p-4 w-full " +
              (centerContent ? "flex justify-center" : "")
            }
          >
            {" "}
            {children}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};
