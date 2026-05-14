import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Scissors,
  Search,
  Star,
  MapPin,
  Crown,
  Sparkles,
  Brain,
  TrendingUp,
  Zap,
  Shield,
  Users,
  Calendar,
  ArrowRight,
  Check,
  Quote,
  Smartphone,
  Instagram,
  Send,
  Music2,
  Menu,
  X,
  Globe,
} from "lucide-react";
import {
  useLanguage,
  langLabels,
  type Language,
} from "@/contexts/LanguageContext";
import heroImg from "@/assets/landing-hero.jpg";
import styleFade from "@/assets/style-fade.jpg";
import styleTaper from "@/assets/style-taper.jpg";
import styleCrop from "@/assets/style-crop.jpg";
import styleBuzz from "@/assets/style-buzz.jpg";
import styleMullet from "@/assets/style-mullet.jpg";
import styleCurly from "@/assets/style-curly.jpg";
import { T } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";

// ============================================================
// DESIGN: White + Blue + Light theme
// All colors as inline tokens scoped to this page (blue = #2563eb)
// ============================================================

const GOLD = "#2563eb"; // Primary blue
const GOLD_SOFT = "#3b82f6"; // Soft blue

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const stagger = {
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-80px" },
};

// -------------------- Header --------------------
const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const langs: Language[] = ["uz", "ru", "en"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 backdrop-blur-xl bg-white/80 border-b border-blue-100"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
            }}
          >
            <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span
            className={`font-bold tracking-tight text-lg transition ${scrolled ? "text-blue-900" : "text-white"}`}
          >
            Barber<span style={{ color: GOLD }}>Top</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-blue-600 hover:text-blue-700">
          <a href="#barbers" className="hover:text-blue-800 transition">
            {t("land.menu.barbers")}
          </a>
          <a href="#trends" className="hover:text-blue-800 transition">
            {t("land.menu.trends")}
          </a>
          <a href="#premium" className="hover:text-blue-800 transition">
            {t("land.menu.premium")}
          </a>
          <a href="#join" className="hover:text-blue-800 transition">
            {t("land.menu.join")}
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            <Globe
              className={`w-3.5 h-3.5 ${scrolled ? "text-blue-600" : "text-white"}`}
            />
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded transition ${
                  lang === l
                    ? "text-white font-semibold"
                    : scrolled
                      ? "text-blue-600 hover:text-blue-800"
                      : "text-white hover:text-white/80"
                }`}
                style={lang === l ? { background: GOLD } : {}}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
          <Link
            to="/auth/login"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            {t("auth.login")}
          </Link>
          <Link
            to="/auth/login?mode=register"
            className="px-5 py-2.5 text-sm font-medium rounded-full text-black transition hover:scale-[1.03]"
            style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
            }}
          >
            {t("land.cta.start")}
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mx-6 mt-3 p-5 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 space-y-3"
        >
          {[
            { label: t("land.menu.barbers"), href: "#barbers" },
            { label: t("land.menu.trends"), href: "#trends" },
            { label: t("land.menu.premium"), href: "#premium" },
            { label: t("land.menu.join"), href: "#join" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-white/80 text-sm py-1.5"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <Link
              to="/auth/login"
              className="flex-1 px-4 py-2 text-sm text-center text-blue-600 border border-blue-300 rounded-full bg-white hover:bg-blue-50"
            >
              {t("auth.login")}
            </Link>
            <Link
              to="/auth/login?mode=register"
              className="flex-1 px-4 py-2 text-sm text-center text-black rounded-full font-medium"
              style={{ background: GOLD }}
            >
              {t("land.cta.start")}
            </Link>
          </div>
          <div className="flex items-center justify-center gap-1 pt-2 border-t border-white/10">
            <Globe className="w-3.5 h-3.5 text-white mr-1" />
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 text-xs rounded transition font-semibold ${lang === l ? "text-black" : "text-white"}`}
                style={lang === l ? { background: GOLD } : {}}
              >
                {langLabels[l]}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

// -------------------- Hero --------------------
const Hero = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Luxury barbershop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* Gold radial glow */}
      <div
        className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6 backdrop-blur-md border"
            style={{
              borderColor: `${GOLD}40`,
              background: `${GOLD}15`,
              color: GOLD_SOFT,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t("land.tag")}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            {t("land.heroTitle1")}{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT}, ${GOLD})`,
              }}
            >
              {t("land.heroAccent")}
            </span>{" "}
          </h1>

          <p className="text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
            {t("land.heroDesc")}
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => navigate("/auth/login?mode=register")}
              className="group px-7 py-3.5 rounded-full font-medium text-white flex items-center gap-2 transition hover:scale-[1.03]"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
                boxShadow: `0 10px 40px -10px ${GOLD}80`,
              }}
            >
              {t("land.findBarber")}
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </button>
            <Link
              to="/auth/login?mode=register&role=barber"
              className="px-7 py-3.5 rounded-full font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              {t("land.joinBarber")}
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-blue-600">
            <div className="flex -space-x-2">
              {[styleFade, styleTaper, styleCrop, styleBuzz].map((s, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                >
                  <img src={s} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-blue-900">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-current"
                    style={{ color: GOLD }}
                  />
                ))}
                <span className="ml-1 font-semibold">4.9</span>
              </div>
              <div className="text-xs">{t("land.happy")}</div>
            </div>
          </div>
        </motion.div>

        {/* Right: Glassmorphism floating cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden md:block h-[600px]"
        >
          {/* Main card */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-0 w-72 rounded-3xl overflow-hidden border backdrop-blur-md"
            style={{
              borderColor: `${GOLD}60`,
              boxShadow: `0 30px 80px -20px ${GOLD}50`,
            }}
          >
            <img src={styleFade} alt="" className="w-full h-80 object-cover" />
            <div className="p-4 bg-white/90">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-blue-900">Davron Karimov</p>
                <span
                  className="px-2 py-0.5 text-[10px] rounded-full text-white font-bold"
                  style={{ background: GOLD }}
                >
                  PRO
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-blue-600">
                <div className="flex items-center gap-1">
                  <Star
                    className="w-3 h-3 fill-current"
                    style={{ color: GOLD }}
                  />{" "}
                  4.9
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> 1.2 km
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating stat card */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-32 left-0 w-56 p-4 rounded-2xl backdrop-blur-xl border border-blue-200 bg-white/80"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${GOLD}15` }}
              >
                <Calendar className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">1,247</p>
                <p className="text-[11px] text-blue-600">
                  {t("land.bookedToday")}
                </p>{" "}
              </div>
            </div>
          </motion.div>

          {/* Floating live card */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-10 left-8 w-60 p-4 rounded-2xl backdrop-blur-xl border border-blue-200 bg-white/80"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-medium text-green-600">
                {t("land.onlineNow")}
              </p>
            </div>
            <p className="text-sm text-blue-900">{t("land.acceptingNow")}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom search bar */}
      <SearchBar />
    </section>
  );
};

// -------------------- Search Bar (overlapping hero & next) --------------------
const SearchBar = () => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-20"
    >
      <div
        className="rounded-2xl p-3 backdrop-blur-2xl border flex flex-col md:flex-row gap-2 items-stretch"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderColor: `${GOLD}40`,
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.15), 0 0 40px -10px ${GOLD}30`,
        }}
      >
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50">
          <Search className="w-4 h-4 text-blue-400" />
          <input
            placeholder={t("land.searchBarber")}
            className="flex-1 bg-transparent text-sm text-blue-900 placeholder:text-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50">
          <MapPin className="w-4 h-4 text-blue-400" />
          <input
            placeholder={t("land.searchLoc")}
            className="flex-1 bg-transparent text-sm text-blue-900 placeholder:text-blue-400 focus:outline-none"
          />
        </div>
        <button
          onClick={() => toast.error("Avval tizimga kiring")}
          className="px-8 py-3 rounded-xl text-sm font-semibold text-white transition hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
          }}
        >
          {t("land.searchBtn")}
        </button>
      </div>
    </motion.div>
  );
};

// -------------------- Top Barbers --------------------
const TopBarbers = () => {
  const { t } = useLanguage();
  const barbers = [
    {
      name: "Davron Karimov",
      img: styleFade,
      rating: 4.9,
      num: "8 ",
      price: "150k",
      dist: "1.2 km",
      pro: true,
    },
    {
      name: "Sardor Aliyev",
      img: styleTaper,
      rating: 4.8,
      num: "5 ",
      price: "120k",
      dist: "0.8 km",
      pro: true,
    },
    {
      name: "Jamshid Yusupov",
      img: styleCrop,
      rating: 5.0,
      num: "10 ",
      price: "200k",
      dist: "2.1 km",
      pro: true,
    },
    {
      name: "Bekzod Toshev",
      img: styleBuzz,
      rating: 4.7,
      num: "4 ",
      price: "100k",
      dist: "1.5 km",
      pro: false,
    },
  ];

  return (
    <section
      id="barbers"
      className="relative py-32 px-6 bg-gradient-to-b from-white via-blue-50 to-blue-100"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          {...fadeUp}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: GOLD }}
            >
              {t("land.topBarbers")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">
              {t("land.topTitle1")}{" "}
              <span className="italic font-light" style={{ color: GOLD }}>
                {t("land.topTitle2")}
              </span>
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition">
            {t("land.viewAll")} <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          {...stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {barbers.map((b, i) => (
            <motion.div
              key={i}
              variants={{
                initial: { opacity: 0, y: 30 },
                whileInView: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6 },
                },
              }}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: "linear-gradient(180deg, #f0f9ff, #e0f2fe)",
              }}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={b.img}
                  alt={b.name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                {b.pro && (
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1"
                    style={{
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
                    }}
                  >
                    <Crown className="w-3 h-3" /> {t("land.proBadge")}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md backdrop-blur-md bg-white/80">
                  <Star
                    className="w-3 h-3 fill-current"
                    style={{ color: GOLD }}
                  />
                  <span className="text-xs font-semibold text-blue-900">
                    {b.rating}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-blue-900 mb-1">{b.name}</h3>
                <div className="flex items-center justify-between text-xs text-blue-600 mb-3">
                  <span>
                    {b.num} {t("land.exp")}{" "}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {b.dist}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {t("land.from")}{" "}
                    <span className="text-blue-900 font-semibold">
                      {b.price}
                    </span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.error("Avval tizimga kiring");
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-full text-white transition group-hover:scale-105"
                    style={{ background: GOLD }}
                  >
                    {t("land.book")}
                  </button>
                </div>
              </div>
              {/* Glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 0 1px ${GOLD}60, 0 0 30px -5px ${GOLD}40`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// -------------------- AI Recommendation --------------------
const AISection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-blue-100 to-white">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${GOLD}40 0%, transparent 50%), radial-gradient(circle at 70% 50%, #60a5fa30 0%, transparent 50%)`,
        }}
      />
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp}>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5 border"
            style={{ borderColor: `${GOLD}60`, color: GOLD }}
          >
            <Brain className="w-3.5 h-3.5" /> AI POWERED
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight mb-5">
            {t("land.aiTitle1")} <br />
            <span style={{ color: GOLD }}>{t("land.aiAccent")}</span>{" "}
            {t("land.aiTitle2")}
          </h2>
          <p className="text-blue-700 mb-8 leading-relaxed">
            {t("land.aiDesc")}
          </p>
          <button
            className="px-7 py-3.5 rounded-full font-medium text-white inline-flex items-center gap-2 transition hover:scale-[1.03]"
            style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
              boxShadow: `0 10px 40px -10px ${GOLD}80`,
            }}
          >
            <Sparkles className="w-4 h-4" /> {t("land.aiBtn")}
          </button>
        </motion.div>

        <motion.div {...fadeUp} className="relative">
          <div
            className="relative p-6 rounded-3xl backdrop-blur-xl border"
            style={{
              borderColor: `${GOLD}50`,
              background: "rgba(255,255,255,0.7)",
            }}
          >
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-blue-200">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${GOLD}15` }}
              >
                <Brain className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Barber AI</p>
                <p className="text-[11px] text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />{" "}
                  Online
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="px-4 py-2.5 bg-blue-100 rounded-2xl rounded-tl-sm text-sm text-blue-900 max-w-[85%]">
                {t("land.aiHelloMessage")}
              </div>
              <div
                className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-white max-w-[75%] ml-auto"
                style={{ background: GOLD_SOFT }}
              >
                {t("land.aiUserMessage")}
              </div>
              <div className="px-4 py-2.5 bg-blue-100 rounded-2xl rounded-tl-sm text-sm text-blue-900 max-w-[85%]">
                {t("land.aiRecommendationMessagePart1")}{" "}
                <span style={{ color: GOLD }} className="font-semibold">
                  Classic Taper
                </span>{" "}
                {t("land.aiRecommendationMessagePart2")} Davron Karimov ✨
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// -------------------- Trending Hairstyles --------------------
const Trends = () => {
  const { t } = useLanguage();
  const trends = [
    { img: styleFade, name: "Fade", percent: 92 },
    { img: styleCrop, name: "Crop", percent: 87 },
    { img: styleBuzz, name: "Buzz", percent: 71 },
    { img: styleMullet, name: "Mullet", percent: 68 },
    { img: styleTaper, name: "Taper", percent: 84 },
    { img: styleCurly, name: "Curly", percent: 76 },
  ];
  return (
    <section
      id="trends"
      className="py-32 px-6 bg-gradient-to-b from-white via-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: GOLD }}
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />{" "}
            {t("land.trends2026")}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">
            {t("land.trendTitle1")}{" "}
            <span style={{ color: GOLD }}>{t("land.trendAccent")}</span>
          </h2>
        </motion.div>

        <motion.div
          {...stagger}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {trends.map((t, i) => (
            <motion.div
              key={i}
              variants={{
                initial: { opacity: 0, y: 20 },
                whileInView: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                },
              }}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-3">
                <p className="font-semibold text-blue-900 text-sm">{t.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <TrendingUp className="w-3 h-3" style={{ color: GOLD }} />
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: GOLD }}
                  >
                    {t.percent}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// -------------------- Why Choose Us --------------------
const WhyUs = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: Zap,
      titleKey: "land.feat.fast",
      descKey: "land.feat.fastDesc",
    },
    {
      icon: Star,
      titleKey: "land.feat.real",
      descKey: "land.feat.realDesc",
    },
    {
      icon: Crown,
      titleKey: "land.feat.top",
      descKey: "land.feat.topDesc",
    },
    {
      icon: Brain,
      titleKey: "land.feat.ai",
      descKey: "land.feat.aiDesc",
    },
    {
      icon: Shield,
      titleKey: "land.feat.safe",
      descKey: "land.feat.safeDesc",
    },
    {
      icon: Users,
      titleKey: "land.feat.com",
      descKey: "land.feat.comDesc",
    },
  ];
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight mb-3">
            {t("land.whyTitle1")} <span style={{ color: GOLD }}>BarberTop</span>
            ?
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="group p-7 rounded-2xl border border-blue-200 hover:border-blue-400 transition bg-gradient-to-br from-blue-50 to-white"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition group-hover:scale-110"
                style={{
                  background: `${GOLD}15`,
                  border: `1px solid ${GOLD}30`,
                }}
              >
                <f.icon className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-1.5">
                {t(f.titleKey)}
              </h3>
              <p className="text-sm text-blue-600">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------- How It Works --------------------
const HowItWorks = () => {
  const { t } = useLanguage();
  const steps = [
    {
      n: "1",
      titleKey: "land.step1",
      descKey: "land.step1Desc",
    },
    {
      n: "2",
      titleKey: "land.step2",
      descKey: "land.step2Desc",
    },
    {
      n: "3",
      titleKey: "land.step3",
      descKey: "land.step3Desc",
    },
  ];
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: GOLD }}
          >
            {t("land.howTag")}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">
            {t("land.howTitle1")}{" "}
            <span style={{ color: GOLD }}>{t("land.howAccent")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.15 }}
              className="relative p-8 rounded-2xl border border-blue-200 bg-white/70"
            >
              <div
                className="text-6xl font-bold mb-4 bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${GOLD}, transparent)`,
                }}
              >
                {s.n}
              </div>

              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                {t(s.titleKey)}
              </h3>

              <p className="text-sm text-blue-600">{t(s.descKey)}</p>

              {i < steps.length - 1 && (
                <ArrowRight
                  className="hidden md:block absolute -right-4 top-1/2 w-6 h-6"
                  style={{ color: `${GOLD}80` }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------- Premium --------------------
const Premium = () => {
  const { t } = useLanguage();
  const benefits = [
    t("land.premBenefit1"),
    t("land.premBenefit2"),
    t("land.premBenefit3"),
    t("land.premBenefit4"),
  ];

  return (
    <section
      id="premium"
      className="py-32 px-6 relative overflow-hidden bg-gradient-to-b from-white to-blue-50"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${GOLD}20 0%, transparent 60%)`,
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          {...fadeUp}
          className="rounded-3xl p-12 md:p-16 border backdrop-blur-xl text-center"
          style={{
            borderColor: `${GOLD}60`,
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(255,255,255,0.8))",
            boxShadow: `0 30px 80px -20px ${GOLD}40`,
          }}
        >
          <Crown className="w-12 h-12 mx-auto mb-5" style={{ color: GOLD }} />

          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight mb-4">
            {t("land.premiumTitle")}{" "}
            <span style={{ color: GOLD }}>
              {t("land.premiumTitleHighlight")}
            </span>
          </h2>

          <p className="text-blue-700 max-w-2xl mx-auto mb-8">
            {t("land.premiumDesc")}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-10 text-left">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-100/50"
              >
                <Check
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: GOLD }}
                />

                <span className="text-sm text-blue-900">{b}</span>
              </div>
            ))}
          </div>

          <div className="flex items-baseline justify-center gap-2 mb-6">
            <span className="text-5xl font-bold text-blue-900">39 000</span>
            <span className="text-blue-700">{t("land.perMonth")}</span>
          </div>

          <Link
            to="/auth/login?mode=register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition hover:scale-[1.03]"
            style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
              boxShadow: `0 10px 40px -10px ${GOLD}`,
            }}
          >
            <Crown className="w-4 h-4" />
            {t("land.getPremium")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// -------------------- Barber Join --------------------
const BarberJoin = () => {
  const { t } = useLanguage();
  const benefits = [
    t("land.joinB1"),
    t("land.joinB2"),
    t("land.joinB3"),
    t("land.joinB4"),
  ];

  const stats = [
    { label: t("land.statBarbers"), value: "1,200+" },
    { label: t("land.statBookings"), value: "45K" },
    { label: t("land.statRating"), value: "4.8" },
    { label: t("land.statRetention"), value: "78%" },
  ];

  return (
    <section id="join" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp}>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: GOLD }}
          >
            {t("land.forBarbers")}
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight mb-5">
            {t("land.joinTitle1")} <br />
            <span style={{ color: GOLD }}>{t("land.joinAccent")}</span>
          </h2>

          <p className="text-blue-700 mb-8">{t("land.joinDesc")}</p>

          <div className="space-y-3 mb-8">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: `${GOLD}20` }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: GOLD }} />
                </div>

                <span className="text-blue-700">{b}</span>
              </div>
            ))}
          </div>

          <Link
            to="/auth/login?mode=register&role=barber"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-blue-600 border-2 transition hover:scale-[1.03] hover:bg-blue-50"
            style={{ borderColor: GOLD, color: GOLD }}
          >
            {t("land.joinBtn")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div {...fadeUp} className="relative">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white"
              >
                <p className="text-3xl font-bold text-blue-900 mb-1">
                  {s.value}
                </p>

                <p className="text-xs text-blue-600">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// -------------------- Reviews --------------------
const Reviews = () => {
  const { t } = useLanguage();
  const reviews = [
    {
      name: "Aziz Komilov",
      role: t("land.customer"),
      text: t("land.review1"),
      img: styleFade,
    },
    {
      name: "Sherzod Norov",
      role: t("land.customer"),
      text: t("land.review2"),
      img: styleTaper,
    },
    {
      name: "Nodir Saidov",
      role: t("land.customer"),
      text: t("land.review3"),
      img: styleCrop,
    },
  ];

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-14">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: GOLD }}
          >
            {t("land.reviewsTag")}
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">
            {t("land.reviewsTitle1")}{" "}
            <span style={{ color: GOLD }}>{t("land.reviewsAccent")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="p-7 rounded-2xl border border-blue-200 bg-white/70 relative"
            >
              <Quote
                className="absolute top-5 right-5 w-8 h-8 opacity-30"
                style={{ color: GOLD }}
              />

              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-3.5 h-3.5 fill-current"
                    style={{ color: GOLD }}
                  />
                ))}
              </div>

              <p className="text-blue-700 mb-6 leading-relaxed text-sm">
                {r.text}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="font-medium text-blue-900 text-sm">{r.name}</p>

                  <p className="text-xs text-blue-600">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// -------------------- Mobile App --------------------
const MobileApp = () => {
  const { t } = useLanguage();

  return (
    <section className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp}>
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: GOLD }}
          >
            <Smartphone className="w-3.5 h-3.5 inline mr-1" />
            {t("land.mobileTag")}
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight mb-5">
            {t("land.mobileTitle1")} <br />
            <span style={{ color: GOLD }}>{t("land.mobileAccent")}</span>
          </h2>

          <p className="text-blue-700 mb-8">{t("land.mobileDesc")}</p>

          <div className="flex flex-wrap gap-3">
            {["App Store", "Google Play"].map((s) => (
              <button
                key={s}
                className="px-6 py-3 rounded-xl border border-blue-300 bg-white text-blue-600 text-sm hover:bg-blue-50 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="relative flex justify-center">
          <div
            className="relative w-64 h-[520px] rounded-[3rem] border-8 border-blue-200 overflow-hidden"
            style={{
              boxShadow: `0 40px 80px -20px ${GOLD}30, 0 0 0 1px ${GOLD}40`,
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-blue-200 rounded-b-2xl z-10" />

            <img
              src={heroImg}
              alt="App preview"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />

            <div className="absolute bottom-6 inset-x-4 p-4 rounded-2xl backdrop-blur-xl bg-white/80 border border-blue-200">
              <p className="text-xs text-blue-600 mb-1">
                {t("land.nextBooking")}
              </p>

              <p className="text-blue-900 font-semibold mb-2">Davron Karimov</p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-700">{t("land.bookingTime")}</span>

                <span
                  className="px-2 py-0.5 rounded-full text-white font-semibold"
                  style={{ background: GOLD }}
                >
                  {t("land.confirmed")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// -------------------- Footer --------------------
const Footer = () => {
  const { t } = useLanguage();
  const footerSections = [
    {
      title: t("land.footerCompany"),
      items: [
        t("land.footerAbout"),
        t("land.footerCareer"),
        t("land.footerContact"),
      ],
    },
    {
      title: t("land.footerProduct"),
      items: [
        t("land.footerFeatures"),
        t("land.footerPremium"),
        t("land.footerBarbers"),
      ],
    },
    {
      title: t("land.footerLegal"),
      items: [
        t("land.footerTerms"),
        t("land.footerPrivacy"),
        t("land.footerSecurity"),
      ],
    },
  ];

  return (
    <footer className="bg-white border-t border-blue-200 px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_SOFT})`,
                }}
              >
                <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>

              <span className="font-semibold text-blue-900 text-lg">
                Barber<span style={{ color: GOLD }}>Top</span>
              </span>
            </Link>

            <p className="text-sm text-blue-600 leading-relaxed">
              {t("land.footerDesc")}
            </p>
          </div>

          {footerSections.map((c, i) => (
            <div key={i}>
              <p className="font-semibold text-blue-900 text-sm mb-4">
                {c.title}
              </p>

              <ul className="space-y-2.5">
                {c.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-800 transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-blue-200 gap-4">
          <p className="text-xs text-blue-500">{t("land.footerRights")}</p>

          <div className="flex items-center gap-3">
            {[Send, Instagram, Music2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-blue-300 flex items-center justify-center text-blue-600 hover:text-blue-800 hover:border-blue-500 transition"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// -------------------- Main Landing --------------------
const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-blue-900">
      <Header />
      <Hero />
      <div className="pt-12 bg-gradient-to-b from-white to-blue-50" />{" "}
      {/* spacing for floating search bar */}
      <TopBarbers />
      <AISection />
      <Trends />
      <WhyUs />
      <HowItWorks />
      <Premium />
      <BarberJoin />
      <Reviews />
      <MobileApp />
      <Footer />
    </div>
  );
};

export default Landing;
