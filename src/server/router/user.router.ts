import {
  createUserOutputSchema,
  createUserSchema,
  loginSchema,
  requestOtpSchema,
  verifyOptSchema,
} from "../../schema/user.schema";
import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { sendLoginEmail } from "../../utils/mailer";
import { url } from "../../constants";
import { decode, encode } from "../../utils/base64";
import { signJwt } from "../../utils/jwt";
import { serialize } from "cookie";

export const userRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    resolve: async ({ ctx, input }) => {
      const { email, password } = input;
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            password,
          },
        });

        // TODO token generieren
        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    },
  })
  .mutation("request-otp", {
    input: requestOtpSchema,
    async resolve({ input, ctx }) {
      const { email, redirect } = input;
      /*const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      const token = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      // send email to user
      sendLoginEmail({
        token: encode(`${token.id}:${user.email}`),
        url: url,
        email: user.email,
      });*/

      return true;
    },
  })
  .query("verify-otp", {
    input: verifyOptSchema,
    async resolve({ input, ctx }) {
      const decoded = decode(input.hash).split(":");
      const [id, email] = decoded;

      /* const token = await ctx.prisma.loginToken.findFirst({
        where: {
          id,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      });

      if (!token) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Invalid token",
        });
      }

      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });

      ctx.res.setHeader("Set-Cookie", serialize("token", jwt, { path: "/" }));

      return {
        redirect: token.redirect,
      };*/
    },
  })
  .query("me", {
    resolve({ ctx }) {
      return ctx.user;
    },
  })
  .mutation("login", {
    input: loginSchema,
    async resolve({ input, ctx }) {},
  })
  .mutation("google-login", {
    async resolve({ input, ctx }) {
      console.log(input);
    },
  });
