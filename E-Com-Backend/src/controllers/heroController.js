import Hero from "../models/heroModel.js";

// ⭐ GET ALL HERO BANNERS
export const getHero = async (req, res) => {
  try {
    const data = await Hero.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch hero banners" });
  }
};

// ⭐ ADD HERO BANNER
export const addHero = async (req, res) => {
  try {
    const item = await Hero.create(req.body);
    res.json({ message: "Hero Banner Added", item });
  } catch (err) {
    res.status(500).json({ message: "Failed to add hero banner" });
  }
};

// ⭐ DELETE HERO BANNER
export const deleteHero = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await Hero.findByPk(id);

    if (!hero) {
      return res.status(404).json({ message: "Hero banner not found" });
    }

    await hero.destroy();
    res.json({ message: "Hero Banner Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete hero banner" });
  }
};
