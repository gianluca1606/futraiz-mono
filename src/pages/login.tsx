import Head from "next/head";
import dynamic from "next/dynamic";
import { MainLayout } from "../components/Layout/MainLayout";
import { useEffect } from "react";
import Script from "next/script";

const LoginForm = dynamic(() => import("../components/LoginForm"), {
  ssr: false,
});

const LoginPage = () => {
  return (
    <div>
      <Head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </Head>
      <MainLayout centerContent={true}>
        {" "}
        <LoginForm />
      </MainLayout>
    </div>
  );
};
export default LoginPage;
