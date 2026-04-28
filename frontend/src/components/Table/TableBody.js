export default function TableBody({ data }) {
  return (
    <tbody>
      {data.map((item) => (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.role}</td>
          <td>{item.status}</td>
        </tr>
      ))}
    </tbody>
  );
}