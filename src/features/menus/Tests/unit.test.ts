import test from "node:test";
import { deepEqual, equal } from "node:assert/strict";
import assert from "node:assert";
import { createService } from "../service";
import { createRepository } from "../repository";
import { createDatabase } from "../db";
import { DuplicateKeyError, NotFoundError } from "../../../libs";
import type { Menu, NewMenu } from "../validation";

const db = createDatabase();

const service = createService(createRepository(db));

test("getAll should return [] when databas is empty", async () => {
  const service = createService(createRepository([]));

  const result = await service.getAllMenus();

  deepEqual(result, []);
});

test("getAll should return all menus", async () => {
  const result = await service.getAllMenus();

  deepEqual(result, db);
});

test("getMenu should return the correct menu by id", async () => {
  const validId = "9de3faf7-36f3-4449-b4b5-7c3393f00e10";

  const result = await service.getMenu(validId);

  deepEqual(
    result,
    db.find((menu) => menu.id === validId),
  );
});

test("getMenu should throw NotFoundError if menu not found", async () => {
  const invalidId = "invalid-id";

  await assert.rejects( 
    async () => { 
      await service.getMenu(invalidId); 
    }, new NotFoundError("Menu not found.")
  );
});

test("addMenu should throw DuplicateKeyError if menu already exists", async () => {
  const newMenu: NewMenu = {
    name: "Dinner Menu",
    dishes: ["Chicken wings"],
  };

  await assert.rejects( 
    async () => { 
      await service.addMenu(newMenu); 
    }, new DuplicateKeyError("Menu name already exists.")
  );  
});

test("addMenu should add a new menu", async () => {
  const db = createDatabase();
  const service = createService(createRepository(db));

  const initialMenus: Menu[] = [
    {
      id: "9de3faf7-36f3-4449-b4b5-7c3393f00e10",
      name: "Breakfast Menu",
      dishes: ["Pancakes", "Omelette"],
    },
    {
      id: "fd9c2bf1-8540-4ed9-9be7-155877262259",
      name: "Lunch Menu",
      dishes: ["Burger", "Salad"],
    },
  ];

  db.length = 0;
  db.push(...initialMenus);

  const newMenu: NewMenu = {
    name: "Dinner Menu",
    dishes: ["Steak", "Pasta"],
  };

  const result = await service.addMenu(newMenu);

  equal(result.name, newMenu.name);
});

test("update should modify an existing menu", async () => {
  const db = createDatabase();
  const service = createService(createRepository(db));

  const validId = "9de3faf7-36f3-4449-b4b5-7c3393f00e10";
  
  const updatedMenu: NewMenu = {
    name: "Breakfast Menu",
    dishes: ["Pancakes", "Omelette", "Nutella pancakes", "Strawberry milkshake"],
  };

  const result = await service.updateMenu(updatedMenu, validId);

  deepEqual(result, { id: validId, ...updatedMenu });  
});

test("update should reject if menu not found", async () => {
  const invalidId = "9de3faf7-36f3-4449-b4b5-7c3393f00e17";

  const menu: NewMenu = {
    name: "Breakfast Menu",
    dishes: ["Pancakes", "Omelette"],
  };  

  await assert.rejects( 
    async () => { 
      await service.updateMenu(menu, invalidId); 
    }, new NotFoundError("Menu not found.")
  );
});

test("remove should delete a menu by id", async () => {
  const validId = "9de3faf7-36f3-4449-b4b5-7c3393f00e10";

  const id = (await service.getMenu(validId)).id;

  equal(id, validId);

  await service.removeMenu(validId);

  await assert.rejects( 
    async () => { 
      await service.getMenu(validId); 
    }, new NotFoundError("Menu not found.")
  );
});

test("remove should reject if menu not found", async () => {
  const invalidId = "9de3faf7-36f3-4449-b4b5-7c3393f09e10";

  await assert.rejects( 
    async () => { 
      await service.getMenu(invalidId); 
    }, new NotFoundError("Menu not found.")
  );
});