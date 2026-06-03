"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Feather, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }
    router.push("/login?registered=1");
  }

  const inputClass = "w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-violet-600 dark:focus:bg-stone-900";

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
            <Feather size={22} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">Create an account</h1>
            <p className="mt-1 text-sm text-stone-400">Start writing today</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-stone-200 bg-white px-8 py-8 shadow-sm dark:border-stone-800 dark:bg-stone-900 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600 dark:text-stone-400">Name</label>
            <input name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600 dark:text-stone-400">Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600 dark:text-stone-400">Password</label>
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required minLength={8} className={inputClass + " pr-10"} />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-stone-600 dark:text-stone-400">Confirm Password</label>
            <input name="confirm" type={showPassword ? "text" : "password"} placeholder="Repeat your password" value={form.confirm} onChange={handleChange} required className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-violet-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
