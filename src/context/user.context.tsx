import { inferProcedureOutput } from "@trpc/server";
import { createContext, useContext } from "react";
import { AppRouter } from "../server/router/app.router";

const UserContext = createContext<InferQueryOutput<"users.me">>(null);

type TQuery = keyof AppRouter["_def"]["queries"];

type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter["_def"]["queries"][TRouteKey]
>;

function UserContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: InferQueryOutput<"users.me"> | undefined;
}) {
  return (
    <UserContext.Provider value={value || null}>
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => useContext(UserContext);
export { useUserContext, UserContextProvider };
