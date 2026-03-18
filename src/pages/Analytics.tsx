import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const monthlyRevenue = [
  { month: "Yan", revenue: 42000, target: 50000 },
  { month: "Fev", revenue: 58000, target: 55000 },
  { month: "Mar", revenue: 51000, target: 55000 },
  { month: "Apr", revenue: 67000, target: 60000 },
  { month: "May", revenue: 72000, target: 65000 },
  { month: "Iyn", revenue: 85000, target: 70000 },
  { month: "Iyl", revenue: 78000, target: 75000 },
  { month: "Avg", revenue: 92000, target: 80000 },
  { month: "Sen", revenue: 88000, target: 85000 },
  { month: "Okt", revenue: 105000, target: 90000 },
  { month: "Noy", revenue: 98000, target: 95000 },
  { month: "Dek", revenue: 115000, target: 100000 },
];

const dealsByStage = [
  { name: "Yangi", value: 18, fill: "hsl(215, 16%, 47%)" },
  { name: "Kvalifikatsiya", value: 12, fill: "hsl(221, 83%, 53%)" },
  { name: "Taklif", value: 8, fill: "hsl(262, 83%, 58%)" },
  { name: "Muzokara", value: 5, fill: "hsl(38, 92%, 50%)" },
  { name: "Yopilgan", value: 7, fill: "hsl(142, 71%, 45%)" },
];

const conversionData = [
  { month: "Yan", rate: 28 },
  { month: "Fev", rate: 32 },
  { month: "Mar", rate: 29 },
  { month: "Apr", rate: 35 },
  { month: "May", rate: 38 },
  { month: "Iyn", rate: 34 },
  { month: "Iyl", rate: 36 },
  { month: "Avg", rate: 41 },
  { month: "Sen", rate: 39 },
  { month: "Okt", rate: 44 },
  { month: "Noy", rate: 42 },
  { month: "Dek", rate: 46 },
];

const topSellers = [
  { name: "Aziz K.", deals: 24, revenue: 248500 },
  { name: "Sardor R.", deals: 19, revenue: 195200 },
  { name: "Nilufar K.", deals: 17, revenue: 178400 },
  { name: "Bobur A.", deals: 15, revenue: 156800 },
  { name: "Jasur T.", deals: 12, revenue: 134000 },
];

const weeklyActivity = [
  { day: "Dush", calls: 18, emails: 32, meetings: 4 },
  { day: "Sesh", calls: 24, emails: 28, meetings: 6 },
  { day: "Chor", calls: 15, emails: 35, meetings: 3 },
  { day: "Pay", calls: 22, emails: 30, meetings: 7 },
  { day: "Jum", calls: 19, emails: 25, meetings: 5 },
];

const chartCard = "bg-card border border-border rounded-lg forge-shadow-sm p-5";

const Analytics = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Analitika</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Sotuv ko'rsatkichlari va tendentsiyalar</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
      >
        {/* Revenue chart - spans 2 cols */}
        <div className={`${chartCard} lg:col-span-2`}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Oylik daromad vs Maqsad</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3, 31.8%, 91.4%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid hsl(214.3, 31.8%, 91.4%)", fontSize: 12 }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="target" stroke="hsl(215, 16%, 80%)" fill="hsl(215, 16%, 95%)" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" fill="hsl(221, 83%, 53%, 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className={chartCard}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Bitimlar bosqichi</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={dealsByStage} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {dealsByStage.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214.3, 31.8%, 91.4%)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {dealsByStage.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: s.fill }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Conversion rate */}
        <div className={chartCard}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Konversiya darajasi (%)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3, 31.8%, 91.4%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214.3, 31.8%, 91.4%)", fontSize: 12 }} />
              <Line type="monotone" dataKey="rate" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top sellers */}
        <div className={chartCard}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Top sotuvchilar</h3>
          <div className="space-y-3">
            {topSellers.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <div className="w-full bg-muted rounded-sm h-1.5 mt-1">
                    <div className="bg-primary h-1.5 rounded-sm" style={{ width: `${(s.revenue / 248500) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground">${(s.revenue / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly activity */}
        <div className={chartCard}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Haftalik faoliyat</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3, 31.8%, 91.4%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214.3, 31.8%, 91.4%)", fontSize: 12 }} />
              <Bar dataKey="calls" fill="hsl(221, 83%, 53%)" radius={[3, 3, 0, 0]} barSize={12} />
              <Bar dataKey="emails" fill="hsl(262, 83%, 58%)" radius={[3, 3, 0, 0]} barSize={12} />
              <Bar dataKey="meetings" fill="hsl(142, 71%, 45%)" radius={[3, 3, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[{ label: "Qo'ng'iroqlar", color: "hsl(221, 83%, 53%)" }, { label: "Email", color: "hsl(262, 83%, 58%)" }, { label: "Uchrashuvlar", color: "hsl(142, 71%, 45%)" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
