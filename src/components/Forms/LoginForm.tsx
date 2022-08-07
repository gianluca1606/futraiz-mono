import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateUserInput, requestOtpinput } from "../../schema/user.schema";
import { trpc } from "../../utils/trpc";
import { useEffect } from "react";

const LoginForm = () => {
  const { error, mutate, data } = trpc.useMutation(["users.login"]);
  const googleLogin = trpc.useMutation(["users.google-login"], {
    onSuccess: (data) => {
      router.push("/");
    },
    onError: (error) => {
      // TODO handle error
    },
  });
  function handleCallbackResponse(response: any) {
    googleLogin.mutate({ token: response.credential });
  }

  useEffect(() => {
    // @ts-ignore
    window.google?.accounts.id.initialize({
      client_id:
        "721956373209-9vaenig8tm7g88lb9nm48tm1656ub2lo.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    // @ts-ignore
    window.google?.accounts.id.renderButton(
      document.getElementById("google-div"),
      {
        theme: "outline",
        size: "large",
      }
    );
  }, []);

  const { handleSubmit, register } = useForm<CreateUserInput>();
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  function onSubmit(values: CreateUserInput) {
    mutate({ ...values });
    if (data) {
      router.push("/");
    }
  }

  return (
    <>
      <div className="w-96 h-96">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@flowbite.com"
              {...register("email")}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register("password")}
              required
            />
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required
              />
            </div>
            <label
              htmlFor="remember"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
          <div id="google-div"></div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
        <Link href="/register">Register</Link>
      </div>
    </>
  );
};
export default LoginForm;
