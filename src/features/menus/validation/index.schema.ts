import { z } from "zod";

export const idSchema = z.object({
  id: z.string().uuid(),
});

const menuNameSchema = z.enum(["Breakfast Menu", "Lunch Menu", "Dinner Menu"]);

export const menuSchema = z.object({
  name: menuNameSchema,
  dishes: z.array(z.string()),
});

const fullMenuSchema = menuSchema.merge(idSchema);

export type Menu = z.infer<typeof fullMenuSchema>;