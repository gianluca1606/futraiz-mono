import ForgotPasswordForm from "../../components/Forms/ForgotPasswordForm";
import { MainLayout } from "../../components/Layout/MainLayout";

const ForgotPasswordPage = () => {
  return (
    <MainLayout centerContent={true} title="Futraiz - Reset Password">
      <ForgotPasswordForm></ForgotPasswordForm>
    </MainLayout>
  );
};
export default ForgotPasswordPage;
