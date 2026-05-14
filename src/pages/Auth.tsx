import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useLanguage,
  langLabels,
  type Language,
} from "@/contexts/LanguageContext";
import { Globe, Sparkles, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email: string) =>
  EMAIL_REGEX.test(email.trim().toLowerCase());

const Auth = () => {
  const [params] = useSearchParams();
  const [isLogin, setIsLogin] = useState(params.get("mode") !== "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    if (params.get("mode") === "register") setIsLogin(false);
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");

    if (!email.trim()) {
      setEmailError(t("auth.emailRequired"));
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t("auth.emailInvalid"));
      return;
    }

    if (!password.trim()) {
      setError(t("auth.passwordRequired"));
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, phone },
          },
        });
        if (error) throw error;
        toast.success(t("auth.success") || "Success");
        navigate("/");
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const langs: Language[] = ["uz", "ru", "en"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <Link
        to="/auth"
        className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {t("auth.backHome")}
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-1 mb-6">
          <Globe className="w-3.5 h-3.5 text-muted-foreground mr-1" />
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 text-xs rounded-md forge-transition ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              {langLabels[l]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground text-lg">
            {t("brand.name")}
          </span>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {isLogin ? t("auth.login") : t("auth.register")}
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            {isLogin ? t("auth.loginDesc") : t("auth.registerDesc")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {t("auth.name")}
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t("auth.namePlaceholder")}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/20"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    {t("auth.phone")}
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/20"
                  />
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {t("auth.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  if (!value.trim()) {
                    setEmailError(t("auth.emailRequired"));
                  } else if (!validateEmail(value)) {
                    setEmailError(t("auth.emailInvalid"));
                  } else {
                    setEmailError("");
                  }
                }}
                placeholder="email@barber.uz"
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/20"
                required
              />
              {emailError && (
                <p className="text-xs text-destructive mt-1">{emailError}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/20"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={
                loading ||
                !!emailError ||
                !email.trim() ||
                !validateEmail(email) ||
                !password.trim() ||
                (!isLogin && !fullName.trim())
              }
              className="w-full py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md forge-transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLogin ? t("auth.login") : t("auth.register")}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? t("auth.register") : t("auth.login")}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
