const pool = require("../config/db");

// Create new item
const createItem = async (req, res) => {
  try {
    const { name, sku, purchase_price, selling_price, quantity, unit, gst_percent } = req.body;
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if company id is provided
    if (!company_id) {
      return res.status(400).json({ message: "Company ID required" });
    }

    // Save new item in database
    const newItem = await pool.query(
      "INSERT INTO items (company_id, name, sku, purchase_price, selling_price, quantity, unit, gst_percent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [company_id, name, sku, purchase_price, selling_price, quantity, unit, gst_percent]
    );

    res.status(201).json({
      message: "Item created successfully ✅",
      item: newItem.rows[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all items of a company
const getItems = async (req, res) => {
  try {
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if company id is provided
    if (!company_id) {
      return res.status(400).json({ message: "Company ID required" });
    }

    // Fetch all items of this company
    const items = await pool.query(
      "SELECT * FROM items WHERE company_id = $1 ORDER BY created_at DESC",
      [company_id]
    );

    res.status(200).json({
      message: "Items fetched successfully ✅",
      items: items.rows,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params; // Get item id from URL
    const { name, sku, purchase_price, selling_price, quantity, unit, gst_percent } = req.body;
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if item belongs to this company
    const item = await pool.query(
      "SELECT * FROM items WHERE id = $1 AND company_id = $2",
      [id, company_id]
    );

    if (item.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update item in database
    const updatedItem = await pool.query(
      "UPDATE items SET name = $1, sku = $2, purchase_price = $3, selling_price = $4, quantity = $5, unit = $6, gst_percent = $7 WHERE id = $8 RETURNING *",
      [name, sku, purchase_price, selling_price, quantity, unit, gst_percent, id]
    );

    res.status(200).json({
      message: "Item updated successfully ✅",
      item: updatedItem.rows[0],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params; // Get item id from URL
    const company_id = req.headers["company-id"]; // Get company id from header

    // Check if item belongs to this company
    const item = await pool.query(
      "SELECT * FROM items WHERE id = $1 AND company_id = $2",
      [id, company_id]
    );

    if (item.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete item from database
    await pool.query("DELETE FROM items WHERE id = $1", [id]);

    res.status(200).json({
      message: "Item deleted successfully ✅",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createItem, getItems, updateItem, deleteItem };