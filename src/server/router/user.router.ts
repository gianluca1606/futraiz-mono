import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import * as bcrypt from "bcryptjs";
import { serialize } from "cookie";
import {
  createUserSchema,
  googleSchema,
  loginSchema,
  requestOtpSchema,
  verifyOptSchema,
} from "../../schema/user.schema";
import { decode } from "../../utils/base64";
import { decodeJwt, signJwt } from "../../utils/jwt";
import { notFoundError } from "../../utils/trpcUtil";
import { createRouter } from "../createRouter";

export const userRouter = createRouter()
  .mutation("register-user", {
    input: createUserSchema,
    resolve: async ({ ctx, input }) => {
      const { email, password } = input;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            password: hash,
            isActive: false,
          },
        });

        // TODO Email rausschicken um user zu bestätigen
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
    async resolve({ input, ctx }) {
      const { email, password } = input;

      const user = await ctx.prisma.user.findUnique({ where: { email } });
      if (!user) {
        notFoundError();
      }

      if (user!.isActive === false || user!.tryedLogins > 3) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "User is blocked",
        });
      }
      let passwordOk = false;
      if (user?.password) {
        passwordOk = bcrypt.compareSync(password, user!.password!);
      } else {
        await ctx.prisma.user.update({
          data: {
            tryedLogins: user!.tryedLogins + 1 || 1,
          },
          where: {
            id: user!.id,
          },
        });
      }

      if (passwordOk) {
        const jwt = signJwt({
          email: user!.email,
          id: user!.id,
          name: user!.username,
          roles: user?.roles,
        });

        // TODO token gültigkeit anpassen
        ctx.res.setHeader("Set-Cookie", serialize("token", jwt));
        return { success: true };
      } else {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Invalid passsword",
        });
      }
    },
  })
  .mutation("google-login", {
    input: googleSchema,
    async resolve({ input, ctx }) {
      // TODO verify mit Client Secret von google
      let googleUser: { email: string } = decodeJwt(input.token);
      let user = null;
      if (googleUser.email) {
        user = await ctx.prisma.user.findUnique({
          where: { email: googleUser.email },
        });
      }

      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: googleUser.email,
          },
        });
      } else {
        if (user!.isActive === false || user!.tryedLogins > 3) {
          throw new trpc.TRPCError({
            code: "FORBIDDEN",
            message: "User is blocked",
          });
        }
      }

      const jwt = signJwt({
        email: user.email,
        id: user.id,
        name: user.username,
        roles: user.roles,
      });

      // TODO token gültigkeit anpassen
      ctx.res.setHeader("Set-Cookie", serialize("token", jwt));
      return { success: true };
    },
  });
