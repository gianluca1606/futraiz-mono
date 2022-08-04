import { z } from "zod";

export const createTimeSchema = z.object({
  time: z.date(),
});

export type createTimeInput = z.TypeOf<typeof createTimeSchema>;

export const getSingleTimeSchema = z.object({
  id: z.string().uuid(),
});
