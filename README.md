# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.


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