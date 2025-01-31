import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { parse } from "cookie"; 

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parse(cookieHeader || ""); 

  if (!cookies.token) {
    if (url.pathname !== "/auth/login" && url.pathname !== "/auth/register") {
      return redirect("/auth/login"); // Hanya redirect ke login jika belum ada token
    }
  } else {
    if (url.pathname === "/") {
      return redirect("/person"); // Hanya redirect ke /person jika di root
    }
  }

  return null; // Biarkan user tetap di halaman jika tidak perlu redirect
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
