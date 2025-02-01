import { Form, redirect, Link, useActionData, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import Swal from "sweetalert2";

interface Person {
  id: string;
  name: string;
  phone: string;
  email: string;
  image?: string;
}


// Loader untuk mendapatkan data person berdasarkan ID
export const loader: LoaderFunction = async ({ params, request }) => {
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;

  try {
    const res = await axios.get(`http://localhost:3000/api/v1/persons/${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch person data", error);
    return redirect("/person");
  }
};

// Action untuk mengupdate data person
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const file = formData.get("file");
  const personId = formData.get("personId");
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;

  if (!name || !phone || !email) {
    return { error: "All fields are required" };
  }

  try {
    const updateData = new FormData();
    updateData.append("name", name);
    updateData.append("phone", phone);
    updateData.append("email", email);
    if (file instanceof Blob && file.size > 0) {
      updateData.append("file", file);
    }

    await axios.patch(`http://localhost:3000/api/v1/persons/${personId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    
    return redirect("/person");
  } catch (error) {
    console.error(error);
    return { error: "Failed to update person" };
  }
};

export default function EditPerson() {
  const person = useLoaderData<Person>();
  const actionData = useActionData<{ error?: string }>();
  const [preview, setPreview] = useState<string | null>(person.image || null);
  const [formData, setFormData] = useState({
    name: person.name || "",
    phone: person.phone || "",
    email: person.email || "",
  });

  useEffect(() => {
    if (actionData?.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: actionData.error,
      });
    }
  }, [actionData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Person</h1>
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
      <Form method="post" encType="multipart/form-data" className="space-y-4">
        <input type="hidden" name="personId" value={person.id} />
        <div>
          <h1 className="block font-semibold">Name:</h1>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="border border-gray-300 px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <h1 className="block font-semibold">Phone:</h1>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="border border-gray-300 px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <h1 className="block font-semibold">Email:</h1>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="border border-gray-300 px-4 py-2 w-full rounded"
          />
        </div>

        <div>
          <h1 className="block font-semibold">Upload Image:</h1>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 px-4 py-2 w-full rounded"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
          )}
        </div>
        
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update
          </button>
          <Link to="/person" className="bg-gray-500 text-white px-4 py-2 rounded">
            Back
          </Link>
        </div>
      </Form>
    </div>
  );
}
