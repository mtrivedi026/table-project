export default function Pagination({ total, page, setPage, limit }) {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={page === i + 1 ? "active" : ""}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}