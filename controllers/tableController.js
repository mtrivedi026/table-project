const tableService = require("../services/tableService");

const getTable = (req, res) => {
  console.log("🔥 QUERY:", req.query);

  const result = tableService.getTableData({
    filterStatus: req.query.filterStatus || "",
    filterRole: req.query.filterRole || "",
    search: req.query.search || "",
    sortBy: req.query.sortBy || "",
    order: req.query.order || "asc",
    page: req.query.page || 1,
    limit: req.query.limit || 10
  });

  res.json({
    success: true,
    data: result.data,
    total: result.total
  });
};

const getFilters = (req, res) => {
  res.json({
    success: true,
    data: {
      status: ["Active", "Inactive"],
      role: ["Developer", "Designer", "Manager"]
    }
  });
};

module.exports = {
  getTable,
  getFilters
};