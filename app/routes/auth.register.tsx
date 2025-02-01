import { useForm } from "react-hook-form";
import { Form, useActionData, redirect, Link } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import axios from "axios";
import Swal from "sweetalert2";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) {
    return json({ error: "Username and password are required" }, { status: 400 });
  }

  console.log(username, password);

  try {
    await axios.post(
      "http://localhost:3000/api/v1/auth/register",
      { username, password }
    );

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Akun berhasil dibuat!",
    })
    return redirect("/auth/login");
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data;
      return json(
        { error: serverError?.message || "Server error" },
        { status: error.response?.status || 500 }
      );
    }
  }
}


export default function RegisterPage() {
  const { register } = useForm();
  const actionData = useActionData();

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto p-6 bg-slate-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Buat Akun Baru
        </h1>

        {actionData?.error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register("username")}
              id="username"
              placeholder="Masukkan username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Daftar
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Sudah punya akun?{' '}
            <Link to="/auth/login" className="text-green-600 hover:underline">
              Masuk disini
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
