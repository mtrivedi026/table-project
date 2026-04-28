import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import Filters from "./Filters";
import Search from "./Search";
import "./table.css";

export default function Table() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState({ status: "", role: "" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "", order: "asc" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      fetch(
        `http://localhost:5000/api/table?filterStatus=${filter.status}&filterRole=${filter.role}&search=${search}&sortBy=${sort.key}&order=${sort.order}&page=${page}&limit=${limit}`
      )
        .then((res) => res.json())
        .then((res) => {
          setData(res.data || []);       // ✅ Fix 1
          setTotal(res.total || 0);      // ✅ Fix 2
        })
        .catch(() => setError("Something went wrong"))
        .finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [filter, search, sort, page]);

  useEffect(() => {
    fetch(`https://table-project-367d.onrender.com/api/table/filters`)  // ✅ Fix 3 - sahi endpoint
      .then((res) => res.json())
      .then((res) => setFilters(res.data || {}));
  }, []);

  return (
    <div className="container">
      <h2>PRO TABLE</h2>
      <div className="top-bar">
        <Search setSearch={setSearch} />
        <Filters filters={filters} filter={filter} setFilter={setFilter} />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && data.length === 0 && <p>No data found</p>}
      <table className="table">
        <TableHeader sort={sort} setSort={setSort} />
        <TableBody data={data} />
      </table>
      <Pagination total={total} page={page} setPage={setPage} limit={limit} />
    </div>
  );
}