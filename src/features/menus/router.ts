import express from "express";
import { MenusService } from ".";

export const createRouter = (service: MenusService) => {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    const menus = await service.getAllMenus();
    res.status(200).json(menus);
  });

  // router.get("/:id", getMenu);
  // router.post("/", addMenu);
  // router.put("/:id", updateMenu);
  // router.delete("/:id", deleteMenu);
  return router;
};
