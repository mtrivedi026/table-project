import ProTable from "./components/Table/ProTable";

// Column config — yahan define karo kaun sortable/filterable hai
const columns = [
  {
    key: "name",
    title: "Name",
    sortable: true,
    resizable: true,
    width: 220,
    // filter nahi — sirf search se milega
  },
  {
    key: "role",
    title: "Role",
    sortable: true,
    resizable: true,
    width: 180,
    filter: {
      mode: "dynamic",              // backend se values aayengi
      endpoint: "http://localhost:5000/api/table/filters",
      valueKey: "role",             // res.data.role
      paramName: "filterRole"       // backend ko ye naam bhejo
    }
  },
  {
    key: "status",
    title: "Status",
    sortable: false,
    resizable: true,
    width: 150,
    filter: {
      mode: "static",               // frontend mein hardcoded
      values: ["Active", "Inactive"],
      paramName: "filterStatus"     // backend ko ye naam bhejo
    },
    render: (val) => (
      <span style={{
        padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500,
        background: val === "Active" ? "#dcfce7" : "#f3f4f6",
        color: val === "Active" ? "#166534" : "#6b7280"
      }}>{val}</span>
    )
  }
];

function App() {
  return (
    <ProTable
      columns={columns}
      fetchUrl="http://localhost:5000/api/table"
      limit={10}
    />
  );
}

export default App;