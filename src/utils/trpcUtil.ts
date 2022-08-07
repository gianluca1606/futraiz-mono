import * as trpc from "@trpc/server";
export const notFoundError = () => {
  throw new trpc.TRPCError({
    code: "NOT_FOUND",
    message: "User not found",
  });
};
