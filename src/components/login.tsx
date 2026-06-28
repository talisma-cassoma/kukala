import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

interface LoginDialogProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const supabase = getSupabaseClient();

export function LoginDialog({
  setIsAuthenticated,
}: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        console.log("Usuário autenticado");
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log(data.session);

      // // Opcional. O Supabase já faz isso automaticamente.
      // localStorage.setItem(
      //   "access_token",
      //   data.session!.access_token
      // );

      setIsAuthenticated(true);
      
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background1/90 px-4 py-20 text-text">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border px-4 py-3"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border px-4 py-3"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-text px-4 py-3 text-primary"
          >
            {loading ? "Entrando..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}