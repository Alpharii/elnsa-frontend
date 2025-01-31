import { useLoaderData, Link, Form } from "@remix-run/react";

export async function loader() {
  const persons = {
    persons: [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
      { id: 3, name: "Bob Smith" },
    ],
  };
  return persons;
}

export default function PersonIndex() {
  const { persons }: { persons: { id: number; name: string }[] } = useLoaderData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Person List</h1>
      
      <Link to="/person/create" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Create Person
      </Link>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-slate-700">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id} className="text-center">
              <td className="border border-gray-300 p-2">{person.id}</td>
              <td className="border border-gray-300 p-2">{person.name}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                <Link to={`/person/${person.id}/edit`} className="text-blue-500">Edit</Link>
                <Link to={`/person/${person.id}/hobbies`} className="text-green-500">Show Hobbies</Link>
                <Link to={`/person/${person.id}/favorite-characters`} className="text-purple-500">Show Fave Chars</Link>
                <Form method="post" action={`/person/${person.id}/delete`}>
                  <button type="submit" className="text-red-500">Delete</button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
