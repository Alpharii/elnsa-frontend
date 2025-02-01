import { Form, redirect, Link, useActionData, useNavigate } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "cookie";
import Swal from "sweetalert2";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const file = formData.get("file");
  const cookies = parse(request.headers.get("Cookie") || "");
  const token = cookies.token;

  if (!name || !phone || !email) {
    return { error: "All fields are required" };
  }

  if (!(file instanceof Blob) || file.size === 0) {
    return { error: "Image file is required" };
  }

  try {
    await axios.post("http://localhost:3000/api/v1/persons", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    
    return redirect("/person");
  } catch (error) {
    console.log(error);
    return { error: "Failed to create person" };
  }
};

export default function CreatePerson() {
  const actionData = useActionData<{ error?: string; success?: boolean }>();
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log(actionData?.success)

  useEffect(() => {
    console.log(actionData?.success, 'actionData?.success')
    if (actionData?.success) {
      console.log(actionData?.success, 'actionData?.success')
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Person created successfully",
      }).then(() => {
        navigate("/person");
      });
    }
  }, [actionData, navigate]);

  useEffect(() => {
    console.log('tololll')
  }, [actionData]);

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
      <h1 className="text-2xl font-bold mb-4">Create Person</h1>
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
      <Form method="post" encType="multipart/form-data" className="space-y-4">
        <div>
          <h1 className="block font-semibold">Name:</h1>
          <input
            type="text"
            name="name"
            required
            className="border border-gray-300 px-4 py-2 w-full rounded"
          />
        </div>

        {/* Tambahkan input phone */}
        <div>
          <h1 className="block font-semibold">Phone:</h1>
          <input
            type="tel"
            name="phone"
            required
            className="border border-gray-300 px-4 py-2 w-full rounded"
          />
        </div>

        {/* Tambahkan input email */}
        <div>
          <h1 className="block font-semibold">Email:</h1>
          <input
            type="email"
            name="email"
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
            required
            onChange={handleFileChange}
            className="border border-gray-300 px-4 py-2 w-full rounded"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
          )}
        </div>
        
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Create
          </button>
          <Link to="/person" className="bg-gray-500 text-white px-4 py-2 rounded">
            Back
          </Link>
        </div>
      </Form>
    </div>
  );
}