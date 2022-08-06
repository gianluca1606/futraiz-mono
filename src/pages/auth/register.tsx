import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { MainLayout } from "../../components/Layout/MainLayout";
import { CreateUserInput } from "../../schema/user.schema";
import { trpc } from "../../utils/trpc";

const RegisterPage = () => {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const router = useRouter();
  const { mutate, error } = trpc.useMutation(["users.register-user"], {
    onSuccess: () => {
      router.push("/auth/login");
    },
  });
  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }
  return (
    <>
      <MainLayout centerContent={true} title="Futraiz - Register">
        <form onSubmit={handleSubmit(onSubmit)}>
          {error && <div>{JSON.stringify(error)}</div>}

          <input
            type="text"
            placeholder="jane.doe@example.com"
            {...register("email")}
          />
          <input type="text" placeholder="Jane" {...register("password")} />

          <button type="submit">Register</button>
        </form>

        <Link href="/login">Login</Link>
      </MainLayout>
    </>
  );
};
export default RegisterPage;
