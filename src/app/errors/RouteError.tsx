import { Link, isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'

function getRouteErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: 'Page not found',
        message: 'The page you requested does not exist or may have moved.',
      }
    }

    if (error.status >= 500) {
      return {
        title: 'Server error',
        message: 'Something went wrong while loading this page.',
      }
    }

    return {
      title: `${error.status} ${error.statusText}`,
      message: 'An unexpected routing error occurred.',
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Something went wrong',
      message: error.message || 'An unexpected error occurred.',
    }
  }

  return {
    title: 'Something went wrong',
    message: 'An unexpected routing error occurred.',
  }
}

export function RouteError() {
  const error = useRouteError()
  const navigate = useNavigate()
  const { title, message } = getRouteErrorMessage(error)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Go Home
          </Link>
        </div>

        {import.meta.env.DEV ? (
          <details className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <summary className="cursor-pointer text-sm font-medium text-slate-700">Error details</summary>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs text-slate-700">
              {isRouteErrorResponse(error)
                ? `${error.status} ${error.statusText}\n${error.data ? JSON.stringify(error.data, null, 2) : ''}`
                : error instanceof Error
                  ? error.stack || error.message
                  : JSON.stringify(error, null, 2)}
            </pre>
          </details>
        ) : null}
      </section>
    </main>
  )
}
