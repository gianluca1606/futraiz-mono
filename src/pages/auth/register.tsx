import RegisterForm from "../../components/Forms/RegisterForm";
import { MainLayout } from "../../components/Layout/MainLayout";

const RegisterPage = () => {
  return (
    <>
      <MainLayout centerContent={true} title="Futraiz - Register">
        <RegisterForm></RegisterForm>
      </MainLayout>
    </>
  );
};
export default RegisterPage;
