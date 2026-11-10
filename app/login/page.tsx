import { signIn } from "@/app/actions";
import { APP } from "@/app.config";

export default async function LoginPage(props: PageProps<"/login">) {
  const { error, next } = await props.searchParams;
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="text-2xl font-semibold">{APP.name}</h1>
        <p className="mt-1 text-stone-600">Enter the team password to continue.</p>
      </div>
      <form action={signIn} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={typeof next === "string" ? next : "/"} />
        <label htmlFor="password" className="text-sm font-medium">
          Team password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="h-11 rounded-lg border border-stone-300 bg-white px-3 outline-none focus:border-stone-900"
        />
        {error ? <p className="text-sm text-red-700">That password didn&apos;t work. Try again.</p> : null}
        <button type="submit" className="h-11 rounded-lg bg-stone-900 font-medium text-white hover:bg-stone-700">
          Sign in
        </button>
      </form>
    </main>
  );
}
