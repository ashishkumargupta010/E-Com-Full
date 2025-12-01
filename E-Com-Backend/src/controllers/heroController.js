import Hero from "../models/heroModel.js";

export const getHero = async (req, res) => {
  const data = await Hero.findAll();
  res.json(data);
};

export const addHero = async (req, res) => {
  const item = await Hero.create(req.body);
  res.json({ message: "Hero Banner Added", item });
};

export const deleteHero = async (req, res) => {
  const { id } = req.params;
  const h = await Hero.findByPk(id);
  if (!h) return res.status(404).json({ message: "Not found" });

  await h.destroy();
  res.json({ message: "Hero Banner Deleted" });
};
