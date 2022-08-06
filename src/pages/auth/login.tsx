import dynamic from "next/dynamic";
import Head from "next/head";
import { MainLayout } from "../../components/Layout/MainLayout";

const LoginForm = dynamic(() => import("../../components/Forms/LoginForm"), {
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
      <MainLayout centerContent={true} title="Login Page">
        {" "}
        <LoginForm />
      </MainLayout>
    </div>
  );
};
export default LoginPage;
