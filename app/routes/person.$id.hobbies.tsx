import { useLoaderData, Form, Link, redirect } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import { parse } from "cookie";

export const loader: LoaderFunction = async ({ request, params }) => {
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;
  const personId = params.id;

  try {
    // Fetch hobbies associated with the person
    const response = await axios.get(`http://localhost:3000/api/v1/hobbies/person/${personId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { hobbies: response.data, personId };
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    return { hobbies: [] };
  }
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const cookies = parse(request.headers.get("Cookie") || "");
    const token = cookies.token;
    const personId = parseInt(formData.get("personId") as string, 10);
    const actionType = formData.get("_action");
  
    try {
      if (actionType === "delete") {
        const hobbyId = formData.get("hobbyId");
        await axios.delete(`http://localhost:3000/api/v1/hobbies/${hobbyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      if (actionType === "add") {
        const name = formData.get("name");
        await axios.post(
          `http://localhost:3000/api/v1/hobbies`,
          { name, personId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
  
      if (actionType === "update") {
        const hobbyId = formData.get("hobbyId");
        const name = formData.get("name");
        await axios.patch(
          `http://localhost:3000/api/v1/hobbies/${hobbyId}`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
  
      return redirect(`/person/${personId.toString()}/hobbies`);
    } catch (error) {
      console.error("Error:", error);
      return { error: "Action failed" };
    }
  };

  export default function PersonHobbies() {
    const { hobbies, personId }: { hobbies: { id: number; name: string }[]; personId: string } = useLoaderData();
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Hobbies of Person {personId}</h1>
  
        <Link to={`/person/`} className="text-blue-500 mb-4 inline-block">
          Back to Person
        </Link>
  
        {/* Form untuk Menambahkan Hobi */}
        <Form method="post" className="mb-4">
          <input type="hidden" name="_action" value="add" />
          <input type="hidden" name="personId" value={personId} />
          <div>
            <h2 className="font-semibold">Add a New Hobby</h2>
            <input
              type="text"
              name="name"
              placeholder="Enter hobby name"
              required
              className="border border-gray-300 px-4 py-2 w-full rounded"
            />
            <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              Add Hobby
            </button>
          </div>
        </Form>
  
        <h2 className="font-semibold mt-4">Existing Hobbies</h2>
        <ul>
          {hobbies.map((hobby) => (
            <li key={hobby.id} className="flex justify-between items-center mb-2">
              <span>{hobby.name}</span>
  
              <div className="flex gap-2">
                {/* Form Update Hobby */}
                <Form method="post" className="flex gap-2">
                  <input type="hidden" name="_action" value="update" />
                  <input type="hidden" name="hobbyId" value={hobby.id} />
                  <input type="hidden" name="personId" value={personId} />
                  <input
                    type="text"
                    name="name"
                    placeholder="New name"
                    required
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                  <button type="submit" className="bg-yellow-500 text-white px-3 py-1 rounded">
                    Update
                  </button>
                </Form>
  
                {/* Form Hapus Hobby */}
                <Form method="post">
                  <input type="hidden" name="_action" value="delete" />
                  <input type="hidden" name="hobbyId" value={hobby.id} />
                  <input type="hidden" name="personId" value={personId} />
                  <button type="submit" className="text-red-500">
                    Delete
                  </button>
                </Form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  