import { Link } from "@tanstack/react-router"
import type { JSX } from "react"

export function RouteRootNotFound(): JSX.Element {
  return (
    <main
      className="
        flex min-h-dvh items-center justify-center bg-gray-1 px-(--margin-page)
        py-48
      "
    >
      <div
        className="
          w-full max-w-[44rem] rounded-[2.4rem] border border-gray-4 bg-gray-2
          p-32 text-center shadow-2
        "
      >
        <p
          className="
            font-semibold m-0 text-14 tracking-[0.08em] text-primary-11
            uppercase
          "
        >
          404
        </p>
        <h1 className="text-32 mt-12 mb-8 text-gray-12">Page not found</h1>
        <p className="m-0 leading-[1.6] text-gray-11">
          The page you were looking for does not exist or may have moved.
        </p>
        <Link
          className="
            font-semibold mt-24 inline-flex rounded-full bg-primary-9 px-16
            py-12 text-primary-1 transition-opacity
            hover:opacity-90
          "
          to="/"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
