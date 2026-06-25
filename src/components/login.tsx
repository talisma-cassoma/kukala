import { useState } from "react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string;
  statusMessage?: string;
}

export function LoginDialog({
  onLogin,
  loading = false,
  error,
  statusMessage,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background1/90 px-4 py-20 text-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-8 shadow-2xl">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-text/70">
            Admin access
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Login to edit products
          </h1>
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="rounded border border-grey px-4 py-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className="rounded border border-grey px-4 py-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-text px-4 py-3 font-semibold text-primary"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {statusMessage && (
          <p className="text-sm text-text/70">
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}