import Address from "../models/addressModel.js";

export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const address = await Address.create({
      userId,
      ...req.body,
    });

    res.json({ message: "Address added", address });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const id = req.params.id;

    const address = await Address.findByPk(id);

    if (!address) return res.status(404).json({ message: "Address not found" });

    await address.destroy();

    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};
