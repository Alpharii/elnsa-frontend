import { parse } from "cookie";
import axios from "axios";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, Form, redirect } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;

  try {
    const response = await axios.get("http://localhost:3000/api/v1/persons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    response.data.map((person : { picture: string}) => {
      person.picture = `http://localhost:3000${person.picture}`
    })

    response.data.push(
      {
        id: 129030918203,
        name: "John Doe (dummy tidak dinamis)",
        phone: "08123456789",
        email: "john.doe@example.com",
        picture: "https://placehold.co/600x400",
      },
      {
        id: 22390381890,
        name: "Jane Doe (dummy tidak dinamis)",
        phone: "08129876543",
        email: "jane.doe@example.com",
        picture: "https://placehold.co/600x400",
      },
      {
        id: 3239203182,
        name: "Alice Smith (dummy tidak dinamis)",
        phone: "08211222333",
        email: "alice.smith@example.com",
        picture: "https://placehold.co/600x400",
      }
    );

    return { persons: response.data };
  } catch (error) {
    console.error("Failed to fetch persons:", error);

    // Jika terjadi error, dummy data tetap ditambahkan
    return {
      persons: [
        {
          id: 1,
          name: "John Doe",
          phone: "08123456789",
          email: "john.doe@example.com",
        },
        {
          id: 2,
          name: "Jane Doe",
          phone: "08129876543",
          email: "jane.doe@example.com",
        },
        {
          id: 3,
          name: "Alice Smith",
          phone: "08211222333",
          email: "alice.smith@example.com",
        },
      ],
    };
  }
};

export const action: LoaderFunction = async ({ request }) => {
  const formData = await request.formData();
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;
  const personId = formData.get("personId");

  try {
    const res = await axios.delete(`http://localhost:3000/api/v1/persons/${personId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res.data);

    return redirect("/person");
  } catch (error) {
    console.error("Error deleting person:", error);
    return { error: "Failed to delete person" };
  }
};

export default function PersonIndex() {
  const { persons }: { persons: { id: number; name: string; phone: string; email: string; picture: string }[] } = useLoaderData();

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
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id} className="text-center">
              <td className="border border-gray-300 p-2">{person.id}</td>
              <td className="border border-gray-300 p-2">{person.name}</td>
              <td className="border border-gray-300 p-2">{person.phone}</td>
              <td className="border border-gray-300 p-2">{person.email}</td>
              <td className="border border-gray-300 p-2">
                <img src={person.picture} alt={person.name} className="w-16 h-16 object-cover mx-auto" />
              </td>
              <td className="border border-gray-300 p-2 space-x-2">
                <Link to={`/person/${person.id}/edit`} className="text-blue-500">Edit</Link>
                <Link to={`/person/${person.id}/hobbies`} className="text-green-500">Show Hobbies</Link>
                <Link to={`/person/${person.id}/favorite-characters`} className="text-purple-500">Show Fave Chars</Link>
                <Form method="post">
                  <input type="hidden" name="personId" value={person.id} />
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
