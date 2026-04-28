export default function Search({ setSearch }) {
  return (
    <input
      placeholder="Search name..."
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}