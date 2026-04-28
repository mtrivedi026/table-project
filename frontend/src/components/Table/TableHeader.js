export default function TableHeader({ sort, setSort }) {
  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <thead>
      <tr>
        <th onClick={() => handleSort("name")}>
          Name {sort.key === "name" ? (sort.order === "asc" ? "↑" : "↓") : ""}
        </th>
        <th onClick={() => handleSort("role")}>
          Role {sort.key === "role" ? (sort.order === "asc" ? "↑" : "↓") : ""}
        </th>
        <th>Status</th>
      </tr>
    </thead>
  );
}