import { Form, redirect, Link } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";

// Fungsi untuk menangani form submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");

  if (!name) {
    return { error: "Name is required" };
  }

  // Simpan data ke database (simulasi)
  console.log("New person created:", { name });

  return redirect("/person"); // Redirect kembali ke daftar person
};

export default function CreatePerson() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Person</h1>
      <Form method="post" className="space-y-4">
        <div>
          <h1 className="block font-semibold">Name:</h1>
          <input
            type="text"
            name="name"
            required
            className="border border-gray-300 px-4 py-2 w-full rounded"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
          {/* Tombol Back */}
          <Link
            to="/person"
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </Link>
        </div>
      </Form>
    </div>
  );
}
