import { useState, useEffect, useRef } from "react";
import "./table.css";

function FilterDropdown({ col, activeValue, onSelect, onClose }) {
  const ref = useRef();
  const [options, setOptions] = useState(
    col.filter.mode === "static" ? col.filter.values : []
  );

  useEffect(() => {
    if (col.filter.mode === "dynamic") {
      fetch(col.filter.endpoint)
        .then(r => r.json())
        .then(res => setOptions(res.data?.[col.filter.valueKey] || []));
    }
  }, []);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="filter-dropdown">
      <div className="filter-mode-label">
        {col.filter.mode === "static" ? "Static values" : "Dynamic (backend)"}
      </div>
      {["", ...options].map(opt => (
        <div
          key={opt}
          className={`filter-option ${activeValue === opt || (!activeValue && opt === "") ? "active" : ""}`}
          onClick={() => onSelect(opt)}
        >
          <span className="filter-check">
            {(activeValue || "") === opt ? "✓" : ""}
          </span>
          {opt === "" ? <span className="filter-all">All</span> : opt}
        </div>
      ))}
    </div>
  );
}

export default function ProTable({ columns, fetchUrl, limit = 5 }) {
  const [data, setData]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [sort, setSort]         = useState({ key: "", order: "asc" });
  const [filters, setFilters]   = useState({});
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [colWidths, setColWidths] = useState(
    () => columns.reduce((a, c) => ({ ...a, [c.key]: c.width || 180 }), {})
  );
  const resizing = useRef(null);

  // Fetch data from backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams({
        page, limit,
        sortBy: sort.key,
        order: sort.order,
        search,
        ...Object.entries(filters).reduce((acc, [k, v]) => {
          if (v) acc[columns.find(c => c.key === k)?.filter?.paramName || k] = v;
          return acc;
        }, {})
      });
      fetch(`${fetchUrl}?${params}`)
        .then(r => r.json())
        .then(res => { setData(res.data || []); setTotal(res.total || 0); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [page, sort, filters, search, fetchUrl, limit]);

  const handleSort = (key) => {
    setSort(prev => ({ key, order: prev.key === key && prev.order === "asc" ? "desc" : "asc" }));
    setPage(1);
  };

  const handleFilter = (colKey, value) => {
    setFilters(prev => ({ ...prev, [colKey]: value }));
    setActiveFilter(null);
    setPage(1);
  };

  // Column resize
  const startResize = (e, key) => {
    e.preventDefault();
    resizing.current = { key, startX: e.clientX, startW: colWidths[key] };
    const onMove = (e) => {
      const d = e.clientX - resizing.current.startX;
      setColWidths(prev => ({ ...prev, [resizing.current.key]: Math.max(80, resizing.current.startW + d) }));
    };
    const onUp = () => {
      resizing.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container">
      <h2>PRO TABLE</h2>

      {/* Toolbar */}
      <div className="top-bar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            placeholder="Search name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {activeFiltersCount > 0 && (
          <button className="clear-btn" onClick={() => { setFilters({}); setPage(1); }}>
            Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} ×
          </button>
        )}
        <span className="record-count">{total} records</span>
      </div>

      {loading && <p className="loading-text">Loading...</p>}

      {/* Table */}
      <div className="table-wrap">
        <table className="table">
          <colgroup>
            {columns.map(col => <col key={col.key} style={{ width: colWidths[col.key] }} />)}
          </colgroup>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className="th">
                  <div className="th-inner">
                    {/* Sort */}
                    <span
                      className={col.sortable ? "th-title sortable" : "th-title"}
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    >
                      {col.title}
                      {col.sortable && (
                        <span className="sort-icon">
                          {sort.key === col.key ? (sort.order === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      )}
                    </span>

                    {/* Filter */}
                    {col.filter && (
                      <div className="filter-wrap">
                        <span
                          className={`filter-btn ${filters[col.key] ? "active" : ""}`}
                          onClick={() => setActiveFilter(activeFilter === col.key ? null : col.key)}
                        >▼</span>
                        {activeFilter === col.key && (
                          <FilterDropdown
                            col={col}
                            activeValue={filters[col.key] || ""}
                            onSelect={(val) => handleFilter(col.key, val)}
                            onClose={() => setActiveFilter(null)}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Resize handle */}
                  {col.resizable !== false && (
                    <div className="resize-handle" onMouseDown={e => startResize(e, col.key)} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && data.length === 0 ? (
              <tr><td colSpan={columns.length} className="empty-cell">No records found</td></tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i} className="tr">
                  {columns.map(col => (
                    <td key={col.key} className="td">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)} className={page === p ? "active" : ""}>{p}</button>
        ))}
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
      </div>
    </div>
  );
}