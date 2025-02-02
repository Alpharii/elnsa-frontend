
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { parse } from "cookie";
import Cookies from "js-cookie";
import { useFieldArray, useForm } from "react-hook-form";
import Swal from "sweetalert2";


// Loader untuk mengambil data favorite characters
export const loader: LoaderFunction = async ({ request, params }) => {
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;
  const personId = params.id;

  if (!token) {
    return redirect("/auth/login"); // Redirect jika token tidak ada
  }

  try {
    // Fetch favorite characters associated with the person
    const response = await axios.get(`http://localhost:3000/api/v1/favorite-characters/person/${personId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { favoriteCharacters: response.data, personId };
  } catch (error) {
    console.error("Error fetching favorite characters:", error);
    return { favoriteCharacters: [] };
  }
};

// Action untuk menangani operasi CRUD
export const action: ActionFunction = async ({ request }) => {
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;

  if (!token) {
    return redirect("/auth/login"); // Redirect jika token tidak ada
  }

  let body;
  try {
    const contentType = request.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      body = await parseJsonBody(request); // Parsing JSON body
    } else {
      body = Object.fromEntries(await request.formData()); // Parsing form data
    }
  } catch (error) {
    return json({ error: "Invalid payload" }, { status: 400 });
  }

  const actionType = body._action;
  const personId = parseInt(body.personId as string, 10);

  try {
    // Validasi personId
    if (!personId || isNaN(personId)) {
      return json({ error: "Invalid personId: Must be a valid number" }, { status: 400 });
    }

    // Handle actions berdasarkan _action
    if (actionType === "delete") {
      const characterId = body.characterId;
      if (!characterId) {
        return json({ error: "Character ID is required for delete action" }, { status: 400 });
      }
      await axios.delete(`http://localhost:3000/api/v1/favorite-characters/${characterId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (actionType === "add") {
      const favoriteCharacters = Array.isArray(body.favorite_characters)
        ? body.favorite_characters
        : [body.favorite_characters];

      if (favoriteCharacters.length === 0) {
        return json({ error: "No valid characters provided" }, { status: 400 });
      }

      for (const character of favoriteCharacters) {
        await axios.post(
          `http://localhost:3000/api/v1/favorite-characters`,
          { ...character, personId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    }

    if (actionType === "update") {
      const characterId = body.characterId;
      const origin = body.origin;
      const name = body.name;

      if (!characterId || !origin || !name) {
        return json({ error: "All fields are required for update action" }, { status: 400 });
      }

      await axios.patch(
        `http://localhost:3000/api/v1/favorite-characters/${characterId}`,
        { origin, name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    return redirect(`/person/${personId}/favorite-characters`);
  } catch (error) {
    console.error("Error:", error);
    return json({ error: "Action failed" }, { status: 500 });
  }
};

// Middleware untuk parsing JSON body
export async function parseJsonBody(request: Request): Promise<any> {
  const contentType = request.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    throw new Error("Invalid Content-Type: Expected application/json");
  }

  const body = await request.text();
  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error("Invalid JSON");
  }
}

export default function FavoriteCharacters() {
  const { favoriteCharacters, personId }: { favoriteCharacters: { id: number; origin: string; name: string }[]; personId: string } =
    useLoaderData();

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      favorite_characters: [{ origin: "", name: "" }], // Default value for the characters array
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "favorite_characters",
  });

  const onSubmit = async (data: { favorite_characters: { origin: string; name: string }[] }) => {
    const filteredCharacters = data.favorite_characters.filter(
      (character) => character.origin.trim() !== "" && character.name.trim() !== ""
    );

    if (filteredCharacters.length === 0) {
      alert("Harap isi setidaknya satu karakter favorit");
      return;
    }

    const payload = {
      personId: parseInt(personId, 10),
      favorite_characters: filteredCharacters,
    };

    console.log("Payload JSON:", payload);

    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const response = await axios.post(
        `http://localhost:3000/api/v1/favorite-characters`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);
      reset({ favorite_characters: [{ origin: "", name: "" }] }); // Reset form
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Karakter favorit berhasil ditambahkan",
      });
    } catch (error) {
      console.error("Gagal menyimpan karakter favorit:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Favorite Characters of Person {personId}</h1>
      <Link to="/person" className="text-blue-500 mb-4 inline-block">
        Back to Person
      </Link>

      {/* Form untuk Menambahkan Karakter Favorit */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <input type="hidden" name="personId" value={personId} />
        <div>
          <h2 className="font-semibold mb-4">Tambah Karakter Favorit Baru</h2>

          {/* Dynamic Character Inputs */}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                {...register(`favorite_characters.${index}.origin`)}
                placeholder="Asal Karakter (DC/Marvel)"
                className="border border-gray-300 px-4 py-2 w-1/2 rounded"
              />
              <input
                type="text"
                {...register(`favorite_characters.${index}.name`)}
                placeholder="Nama Karakter"
                className="border border-gray-300 px-4 py-2 w-1/2 rounded"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => append({ origin: "", name: "" })}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Tambah Input Karakter
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Simpan Semua Karakter
            </button>
          </div>
        </div>
      </form>

      {/* Existing Favorite Characters */}
      <h2 className="font-semibold mt-4">Existing Favorite Characters</h2>
      <ul>
        {favoriteCharacters.map((character) => (
          <li key={character.id} className="flex justify-between items-center mb-2">
            <span>
              {character.origin}: {character.name}
            </span>
            <div className="flex gap-2">
              {/* Update Character Form */}
              <Form method="post" className="flex gap-2">
                <input type="hidden" name="_action" value="update" />
                <input type="hidden" name="characterId" value={character.id} />
                <input type="hidden" name="personId" value={personId} />
                <input
                  type="text"
                  name="origin"
                  defaultValue={character.origin}
                  placeholder="New origin"
                  required
                  className="border border-gray-300 px-2 py-1 rounded"
                />
                <input
                  type="text"
                  name="name"
                  defaultValue={character.name}
                  placeholder="New name"
                  required
                  className="border border-gray-300 px-2 py-1 rounded"
                />
                <button type="submit" className="bg-yellow-500 text-white px-3 py-1 rounded">
                  Update
                </button>
              </Form>

              {/* Delete Character Form */}
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