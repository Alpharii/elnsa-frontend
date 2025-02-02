import { useForm } from "react-hook-form";
import { Form, useActionData, redirect, Link } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import axios from 'axios'
import Swal from "sweetalert2";
import { useEffect } from "react";

interface ActionData {
  error?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username || !password) {
    return json({ error: "Username and password are required" }, { status: 400 });
  }

  try {
    const res = await axios.post(
      "http://localhost:3000/api/v1/auth/login",
      { username, password }
    );

    const accessToken = res.data.access_token;

    return redirect("/person", {
      headers: {
        "Set-Cookie": `token=${accessToken}; Path=/; Secure; SameSite=Strict; Max-Age=3600`,
      },
    });

  } catch (error) {
    // Perbaikan 3: Tambahkan return default untuk error non-Axios
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data;
      return json(
        { error: serverError?.message || "Login failed" },
        { status: error.response?.status || 500 }
      );
    }
    
    // Perbaikan 4: Return default untuk error yang tidak terduga
    return json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export default function LoginPage() {
  const { register } = useForm();
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (actionData?.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: actionData.error,
      });
    }
  }, [actionData]);

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto p-6 bg-slate-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Selamat Datang
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Masuk
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Belum punya akun?{' '}
            <Link to="/auth/register" className="text-blue-500 hover:underline">
              Daftar disini
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}