export default function Filters({ filters, filter, setFilter }) {
  return (
    <div>
      <select
        value={filter.status}
        onChange={(e) =>
          setFilter((prev) => ({
            ...prev,
            status: e.target.value
          }))
        }
      >
        <option value="">All Status</option>
        {(filters.status || []).map((f, i) => (
          <option key={i} value={f}>{f}</option>
        ))}
      </select>

      <select
        value={filter.role}
        onChange={(e) =>
          setFilter((prev) => ({
            ...prev,
            role: e.target.value
          }))
        }
      >
        <option value="">All Roles</option>
        {(filters.role || []).map((f, i) => (
          <option key={i} value={f}>{f}</option>
        ))}
      </select>
    </div>
  );
}