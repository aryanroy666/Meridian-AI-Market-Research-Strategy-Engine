import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to Meridian"
      subtitle="Access your research briefs, evidence trails, and strategy reports."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#666666]">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-md font-medium border border-[#d9d7d0] bg-white px-3.5 py-2.5 text-sm text-[#040404] outline-none transition placeholder:text-[#999999] focus:border-[#171717] focus:ring-2 focus:ring-[#171717]/5"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#666666]">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-md border border-gray-500 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition placeholder:text-[#858484] focus:border-navy focus:ring-2 focus:ring-navy/10"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-bad/25 bg-bad/5 px-3 py-2.5 text-sm text-bad">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-md bg-[#171717] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {submitting ? "Signing in…" : "Sign in"}
          {!submitting && (
            <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-medium text-[#171717] underline decoration-[#b65a16] decoration-2 underline-offset-2 transition hover:text-[#b65a16]">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export function BrandMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-gold-soft">
      <Compass size={18} strokeWidth={2} />
    </span>
  );
}
