import { useLoaderData, Form, Link, redirect } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import { parse } from "cookie";

// Loader to fetch favorite characters
export const loader: LoaderFunction = async ({ request, params }) => {
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;
  const personId = params.id;

  try {
    // Fetch favorite characters associated with the person
    const response = await axios.get(`http://localhost:3000/api/v1/favorite-characters/person/${personId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { favoriteCharacters: response.data, personId };
  } catch (error) {
    console.error("Error fetching favorite characters:", error);
    return { favoriteCharacters: [] };
  }
};

// Action to handle adding, updating, and deleting favorite characters
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;
  const personId = parseInt(formData.get("personId") as string, 10);
  const actionType = formData.get("_action");

  try {
    if (actionType === "delete") {
      const characterId = formData.get("characterId");
      await axios.delete(`http://localhost:3000/api/v1/favorite-characters/${characterId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (actionType === "add") {
      const name = formData.get("name");
      const origin = formData.get("origin");
      await axios.post(
        `http://localhost:3000/api/v1/favorite-characters`,
        { name, origin, personId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    if (actionType === "update") {
      const characterId = formData.get("characterId");
      const name = formData.get("name");
      const origin = formData.get("origin");
      await axios.patch(
        `http://localhost:3000/api/v1/favorite-characters/${characterId}`,
        { name, origin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    return redirect(`/person/${personId.toString()}/favorite-characters`);
  } catch (error) {
    console.error("Error:", error);
    return { error: "Action failed" };
  }
};

export default function PersonFavoriteCharacters() {
  const { favoriteCharacters, personId }: { favoriteCharacters: { id: number; name: string; origin: string }[]; personId: string } = useLoaderData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Favorite Characters of Person {personId}</h1>

      <Link to={`/person/`} className="text-blue-500 mb-4 inline-block">
        Back to Person
      </Link>

      {/* Form to Add New Favorite Character */}
      <Form method="post" className="mb-4">
        <input type="hidden" name="_action" value="add" />
        <input type="hidden" name="personId" value={personId} />
        <div>
          <h2 className="font-semibold">Add a New Favorite Character</h2>
          <input
            type="text"
            name="name"
            placeholder="Enter character name"
            required
            className="border border-gray-300 px-4 py-2 w-full rounded"
          />
          <input
            type="text"
            name="origin"
            placeholder="Enter character origin"
            required
            className="border border-gray-300 px-4 py-2 w-full rounded mt-2"
          />
          <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Add Character
          </button>
        </div>
      </Form>

      <h2 className="font-semibold mt-4">Existing Favorite Characters</h2>
      <ul>
        {favoriteCharacters.map((character) => (
          <li key={character.id} className="flex justify-between items-center mb-2">
            <span>{character.name} ({character.origin})</span>

            <div className="flex gap-2">
              {/* Form to Update Favorite Character */}
              <Form method="post" className="flex gap-2">
                <input type="hidden" name="_action" value="update" />
                <input type="hidden" name="characterId" value={character.id} />
                <input type="hidden" name="personId" value={personId} />
                <input
                  type="text"
                  name="name"
                  placeholder="New name"
                  required
                  className="border border-gray-300 px-2 py-1 rounded"
                />
                <input
                  type="text"
                  name="origin"
                  placeholder="New origin"
                  required
                  className="border border-gray-300 px-2 py-1 rounded"
                />
                <button type="submit" className="bg-yellow-500 text-white px-3 py-1 rounded">
                  Update
                </button>
              </Form>

              {/* Form to Delete Favorite Character */}
              <Form method="post">
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="characterId" value={character.id} />
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
