const xlsx = require("xlsx");

const parseExcelFile = (buffer) => {
  const workbook = xlsx.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  return data.map(row => ({
    name: row.name,
    description: row.description || "",
    size: row.size || "",
    unit: row.unit || "",
    quantity: Number(row.quantity),
    threshold: Number(row.threshold || 0),
    price: Number(row.price),
    batchNumber: row.batchNumber || "",
    expiryDate: row.expiryDate ? new Date(row.expiryDate) : null,
    location_id: row.location_id || null,
    parent_item_id: row.parent_item_id || null,
    lastAddedAt: new Date()
  }));
};

module.exports = { parseExcelFile };
