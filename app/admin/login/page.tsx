"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Heart } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push(callbackUrl);
  }

  return (
    <div className="min-h-screen bg-[#1A2B5F] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-5 h-5 text-[#F4A7B9] fill-current" />
          <span className="font-heading text-xl tracking-widest uppercase text-white">S & J — Admin</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-4">
          <h1 className="text-xl font-bold text-white mb-2">Connexion</h1>

          <div>
            <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs uppercase tracking-wider mb-1.5 block">Mot de passe</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]/60"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="mt-2 py-2.5 rounded-xl bg-[#e91e8c] hover:bg-[#c4177a] disabled:opacity-40 text-white text-sm font-semibold transition-colors"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
