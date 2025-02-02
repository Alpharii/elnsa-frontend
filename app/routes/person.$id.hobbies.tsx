import { useLoaderData, Link, redirect, json, Form } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import axios from "axios";
import { parse } from "cookie";
import { useFieldArray, useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";

// Loader untuk mengambil data hobi
export const loader: LoaderFunction = async ({ request, params }) => {
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;
  const personId = params.id;

  if (!token) {
    return redirect("/auth/login"); // Redirect jika token tidak ada
  }

  try {
    // Fetch hobbies associated with the person
    const response = await axios.get(`http://localhost:3000/api/v1/hobbies/person/${personId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { hobbies: response.data, personId };
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    return { hobbies: [] };
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
      const hobbyId = body.hobbyId;
      if (!hobbyId) {
        return json({ error: "Hobby ID is required for delete action" }, { status: 400 });
      }
      await axios.delete(`http://localhost:3000/api/v1/hobbies/${hobbyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (actionType === "add") {
      const hobbies = Array.isArray(body.hobbies) ? body.hobbies : [body.hobbies];
      const filteredHobbies = hobbies.map((hobby: string) => hobby.toString().trim()).filter(Boolean);

      if (filteredHobbies.length === 0) {
        return json({ error: "No valid hobbies provided" }, { status: 400 });
      }

      for (const name of filteredHobbies) {
        await axios.post(
          `http://localhost:3000/api/v1/hobbies`,
          { name, personId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    }

    if (actionType === "update") {
      const hobbyId = body.hobbyId;
      const name = body.name;

      if (!hobbyId || !name) {
        return json({ error: "Both hobbyId and name are required for update action" }, { status: 400 });
      }

      await axios.patch(
        `http://localhost:3000/api/v1/hobbies/${hobbyId}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    return redirect(`/person/${personId}/hobbies`);
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

// Komponen utama
export default function PersonHobbies() {
  const { hobbies, personId }: { hobbies: { id: number; name: string }[]; personId: string } =
    useLoaderData();

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      hobbies: [""], // Default value for the hobbies array
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  const onSubmit = async (data: { hobbies: string[] }) => {
    const filteredHobbies = data.hobbies.filter((hobby) => hobby.trim() !== "");

    if (filteredHobbies.length === 0) {
      alert("Harap isi setidaknya satu hobi");
      return;
    }

    const payload = {
      personId: parseInt(personId, 10),
      hobbies: filteredHobbies,
    };

    console.log("Payload JSON:", payload);

    try {
      const token = Cookies.get("token")
      console.log(token);
          if (!token) {
        throw new Error("Token not found in cookies");
      }

      const response = await axios.post(
        `http://localhost:3000/api/v1/hobbies`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);
      reset({ hobbies: [""] }); // Reset form
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Hobby berhasil ditambahkan",
      })
      return redirect(`/person/${personId}/hobbies`);
    } catch (error) {
      console.error("Gagal menyimpan hobi:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Hobbies of Person {personId}</h1>
      <Link to="/person" className="text-blue-500 mb-4 inline-block">
        Back to Person
      </Link>

      {/* Form untuk Menambahkan Hobi */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <input type="hidden" name="personId" value={personId} />
        <div>
          <h2 className="font-semibold mb-4">Tambah Hobi Baru</h2>

          {/* Dynamic Hobby Inputs */}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                {...register(`hobbies.${index}`)}
                placeholder={`Hobi ke-${index + 1}`}
                className="border border-gray-300 px-4 py-2 w-full rounded"
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
              onClick={() => append("")}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Tambah Input Hobi
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Simpan Semua Hobi
            </button>
          </div>
        </div>
      </form>

      {/* Existing Hobbies */}
      <h2 className="font-semibold mt-4">Existing Hobbies</h2>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby.id} className="flex justify-between items-center mb-2">
            <span>{hobby.name}</span>
            <div className="flex gap-2">
              {/* Update Hobby Form */}
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

              {/* Delete Hobby Form */}
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