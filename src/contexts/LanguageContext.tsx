import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "uz" | "ru" | "en";

type Translations = Record<string, Record<Language, string>>;

const t: Translations = {
  // Auth
  "auth.login": { uz: "Kirish", ru: "Войти", en: "Sign In" },
  "auth.register": { uz: "Ro'yxatdan o'tish", ru: "Регистрация", en: "Sign Up" },
  "auth.loginDesc": { uz: "Hisobingizga kiring", ru: "Войдите в свой аккаунт", en: "Sign in to your account" },
  "auth.registerDesc": { uz: "Yangi hisob yarating", ru: "Создайте новый аккаунт", en: "Create a new account" },
  "auth.name": { uz: "Ism", ru: "Имя", en: "Name" },
  "auth.namePlaceholder": { uz: "To'liq ismingiz", ru: "Ваше полное имя", en: "Your full name" },
  "auth.email": { uz: "Email", ru: "Электронная почта", en: "Email" },
  "auth.password": { uz: "Parol", ru: "Пароль", en: "Password" },
  "auth.noAccount": { uz: "Hisobingiz yo'qmi?", ru: "Нет аккаунта?", en: "Don't have an account?" },
  "auth.hasAccount": { uz: "Hisobingiz bormi?", ru: "Уже есть аккаунт?", en: "Already have an account?" },
  "auth.success": { uz: "Muvaffaqiyatli ro'yxatdan o'tdingiz!", ru: "Регистрация прошла успешно!", en: "Registration successful!" },

  // Sidebar
  "nav.main": { uz: "Asosiy", ru: "Главное", en: "Main" },
  "nav.crm": { uz: "CRM", ru: "CRM", en: "CRM" },
  "nav.system": { uz: "Tizim", ru: "Система", en: "System" },
  "nav.dashboard": { uz: "Dashboard", ru: "Дашборд", en: "Dashboard" },
  "nav.pipeline": { uz: "Pipeline", ru: "Воронка", en: "Pipeline" },
  "nav.activities": { uz: "Faoliyatlar", ru: "Активности", en: "Activities" },
  "nav.leads": { uz: "Leadlar", ru: "Лиды", en: "Leads" },
  "nav.contacts": { uz: "Kontaktlar", ru: "Контакты", en: "Contacts" },
  "nav.communications": { uz: "Xabarlar", ru: "Сообщения", en: "Messages" },
  "nav.analytics": { uz: "Analitika", ru: "Аналитика", en: "Analytics" },
  "nav.integrations": { uz: "Integratsiya", ru: "Интеграции", en: "Integrations" },
  "nav.settings": { uz: "Sozlamalar", ru: "Настройки", en: "Settings" },
  "nav.automation": { uz: "Avtomatlashtirish", ru: "Автоматизация", en: "Automation" },
  "nav.search": { uz: "Qidirish...", ru: "Поиск...", en: "Search..." },
  "nav.logout": { uz: "Chiqish", ru: "Выход", en: "Logout" },

  // Dashboard
  "dash.title": { uz: "Dashboard", ru: "Дашборд", en: "Dashboard" },
  "dash.subtitle": { uz: "Sotuvni boshqarish, ma'lumotlarni emas.", ru: "Управление продажами, а не данными.", en: "Manage sales, not data." },
  "dash.totalRevenue": { uz: "Umumiy daromad", ru: "Общий доход", en: "Total Revenue" },
  "dash.activeDeals": { uz: "Faol bitimlar", ru: "Активные сделки", en: "Active Deals" },
  "dash.conversion": { uz: "Konversiya", ru: "Конверсия", en: "Conversion" },
  "dash.newContacts": { uz: "Yangi kontaktlar", ru: "Новые контакты", en: "New Contacts" },
  "dash.newDeal": { uz: "Yangi bitim", ru: "Новая сделка", en: "New Deal" },
  "dash.recentDeals": { uz: "So'nggi bitimlar", ru: "Последние сделки", en: "Recent Deals" },
  "dash.activity": { uz: "Faoliyat", ru: "Активность", en: "Activity" },
  "dash.noDeals": { uz: "Hali bitimlar yo'q", ru: "Пока нет сделок", en: "No deals yet" },
  "dash.noActivity": { uz: "Hali faoliyat yo'q", ru: "Пока нет активности", en: "No activity yet" },

  // Pipeline
  "pipe.title": { uz: "Pipeline", ru: "Воронка продаж", en: "Pipeline" },
  "pipe.subtitle": { uz: "Bitimlarni bosqichlar orasida sudrab o'tkazing", ru: "Перетаскивайте сделки между этапами", en: "Drag deals between stages" },
  "pipe.lead": { uz: "Lead", ru: "Лид", en: "Lead" },
  "pipe.qualified": { uz: "Qualified Lead", ru: "Квалифицированный", en: "Qualified Lead" },
  "pipe.negotiation": { uz: "Muzokara", ru: "Переговоры", en: "Negotiation" },
  "pipe.proposal": { uz: "Taklif / Shartnoma", ru: "Предложение / Контракт", en: "Proposal / Contract" },
  "pipe.won": { uz: "Yutildi ✅", ru: "Выиграна ✅", en: "Won ✅" },
  "pipe.lost": { uz: "Yo'qotildi", ru: "Потеряна", en: "Lost" },
  "pipe.add": { uz: "Qo'shish", ru: "Добавить", en: "Add" },
  "pipe.today": { uz: "Bugun", ru: "Сегодня", en: "Today" },
  "pipe.days": { uz: "kun", ru: "дн.", en: "days" },
  "pipe.filter": { uz: "Filter", ru: "Фильтр", en: "Filter" },
  "pipe.view": { uz: "Ko'rinish", ru: "Вид", en: "View" },

  // New deal modal
  "deal.new": { uz: "Yangi bitim", ru: "Новая сделка", en: "New Deal" },
  "deal.name": { uz: "Bitim nomi", ru: "Название сделки", en: "Deal Name" },
  "deal.namePlaceholder": { uz: "Kompaniya nomi yoki bitim sarlavhasi", ru: "Название компании или сделки", en: "Company name or deal title" },
  "deal.contact": { uz: "Kontakt", ru: "Контакт", en: "Contact" },
  "deal.contactPlaceholder": { uz: "Kontakt shaxs ismi", ru: "Имя контактного лица", en: "Contact person name" },
  "deal.amount": { uz: "Summa ($)", ru: "Сумма ($)", en: "Amount ($)" },
  "deal.cancel": { uz: "Bekor qilish", ru: "Отмена", en: "Cancel" },
  "deal.add": { uz: "Qo'shish", ru: "Добавить", en: "Add" },
  "deal.afterAdd": { uz: "Ushbu bitim qo'shilgandan so'ng:", ru: "После добавления этой сделки:", en: "After adding this deal:" },

  // Leads
  "leads.title": { uz: "Leadlar", ru: "Лиды", en: "Leads" },
  "leads.subtitle": { uz: "Potentsial mijozlarni boshqaring", ru: "Управление потенциальными клиентами", en: "Manage potential clients" },
  "leads.new": { uz: "Yangi lead", ru: "Новый лид", en: "New Lead" },
  "leads.total": { uz: "Jami leadlar", ru: "Всего лидов", en: "Total Leads" },
  "leads.newCount": { uz: "Yangi", ru: "Новые", en: "New" },
  "leads.qualified": { uz: "Qualified", ru: "Квалифицированные", en: "Qualified" },
  "leads.conversion": { uz: "Konversiya", ru: "Конверсия", en: "Conversion" },
  "leads.search": { uz: "Lead qidirish...", ru: "Поиск лидов...", en: "Search leads..." },
  "leads.name": { uz: "Ism", ru: "Имя", en: "Name" },
  "leads.company": { uz: "Kompaniya", ru: "Компания", en: "Company" },
  "leads.source": { uz: "Manba", ru: "Источник", en: "Source" },
  "leads.status": { uz: "Status", ru: "Статус", en: "Status" },
  "leads.date": { uz: "Sana", ru: "Дата", en: "Date" },

  // Contacts
  "contacts.title": { uz: "Kontaktlar", ru: "Контакты", en: "Contacts" },
  "contacts.count": { uz: "ta kontakt", ru: "контактов", en: "contacts" },
  "contacts.new": { uz: "Yangi kontakt", ru: "Новый контакт", en: "New Contact" },
  "contacts.search": { uz: "Kontakt qidirish...", ru: "Поиск контактов...", en: "Search contacts..." },
  "contacts.name": { uz: "Ism", ru: "Имя", en: "Name" },
  "contacts.company": { uz: "Kompaniya", ru: "Компания", en: "Company" },
  "contacts.role": { uz: "Lavozim", ru: "Должность", en: "Role" },
  "contacts.deals": { uz: "Bitimlar", ru: "Сделки", en: "Deals" },
  "contacts.value": { uz: "Qiymat", ru: "Стоимость", en: "Value" },
  "contacts.noContacts": { uz: "Hali kontaktlar yo'q", ru: "Пока нет контактов", en: "No contacts yet" },

  // Settings
  "settings.title": { uz: "Sozlamalar", ru: "Настройки", en: "Settings" },
  "settings.subtitle": { uz: "Profil, jamoa va tizim sozlamalari", ru: "Профиль, команда и системные настройки", en: "Profile, team and system settings" },
  "settings.profile": { uz: "Profil", ru: "Профиль", en: "Profile" },
  "settings.team": { uz: "Jamoa", ru: "Команда", en: "Team" },
  "settings.roles": { uz: "Rollar", ru: "Роли", en: "Roles" },
  "settings.notifications": { uz: "Bildirishnomalar", ru: "Уведомления", en: "Notifications" },
  "settings.appearance": { uz: "Ko'rinish", ru: "Внешний вид", en: "Appearance" },
  "settings.save": { uz: "Saqlash", ru: "Сохранить", en: "Save" },
  "settings.saving": { uz: "Saqlanmoqda...", ru: "Сохранение...", en: "Saving..." },
  "settings.fullName": { uz: "To'liq ism", ru: "Полное имя", en: "Full Name" },
  "settings.teamMembers": { uz: "Jamoa a'zolari", ru: "Члены команды", en: "Team Members" },
  "settings.members": { uz: "ta a'zo", ru: "участников", en: "members" },
  "settings.noTeam": { uz: "Hali jamoa a'zolari yo'q", ru: "Пока нет участников", en: "No team members yet" },
  "settings.rolesAndPermissions": { uz: "Rollar va huquqlar", ru: "Роли и полномочия", en: "Roles & Permissions" },
  "settings.rolesDesc": { uz: "Har bir rol turli darajadagi ruxsatlarga ega", ru: "Каждая роль имеет разные уровни доступа", en: "Each role has different access levels" },
  "settings.darkMode": { uz: "Qorong'u rejim", ru: "Тёмный режим", en: "Dark Mode" },
  "settings.lightMode": { uz: "Yorug' rejim", ru: "Светлый режим", en: "Light Mode" },
  "settings.language": { uz: "Til", ru: "Язык", en: "Language" },

  // Analytics
  "analytics.title": { uz: "Analitika", ru: "Аналитика", en: "Analytics" },
  "analytics.subtitle": { uz: "Sotuv ko'rsatkichlari va tendentsiyalar", ru: "Показатели продаж и тенденции", en: "Sales metrics and trends" },

  // Activities
  "activities.title": { uz: "Faoliyatlar", ru: "Активности", en: "Activities" },
  "activities.subtitle": { uz: "Qo'ng'iroqlar, uchrashuvlar, vazifalar va hujjatlar", ru: "Звонки, встречи, задачи и документы", en: "Calls, meetings, tasks and documents" },
  "activities.new": { uz: "Yangi faoliyat", ru: "Новая активность", en: "New Activity" },
  "activities.today": { uz: "Bugungi", ru: "Сегодня", en: "Today" },
  "activities.overdue": { uz: "Muddati o'tgan", ru: "Просроченные", en: "Overdue" },
  "activities.completed": { uz: "Bajarilgan", ru: "Выполненные", en: "Completed" },
  "activities.planned": { uz: "Rejalashtirilgan", ru: "Запланированные", en: "Planned" },

  // Automation
  "auto.title": { uz: "Avtomatlashtirish", ru: "Автоматизация", en: "Automation" },
  "auto.subtitle": { uz: "Trigger va workflow'larni boshqaring", ru: "Управление триггерами и рабочими процессами", en: "Manage triggers and workflows" },
  "auto.newWorkflow": { uz: "Yangi workflow", ru: "Новый процесс", en: "New Workflow" },
  "auto.active": { uz: "Faol", ru: "Активные", en: "Active" },
  "auto.paused": { uz: "To'xtatilgan", ru: "Приостановленные", en: "Paused" },
  "auto.trigger": { uz: "Trigger", ru: "Триггер", en: "Trigger" },
  "auto.action": { uz: "Harakat", ru: "Действие", en: "Action" },
  "auto.runs": { uz: "Ishga tushish", ru: "Запуски", en: "Runs" },
  "auto.lastRun": { uz: "Oxirgi ishga tushish", ru: "Последний запуск", en: "Last Run" },
  "auto.noWorkflows": { uz: "Hali workflow'lar yo'q", ru: "Пока нет процессов", en: "No workflows yet" },
  "auto.leadStageChange": { uz: "Lead bosqichi o'zgarganda", ru: "При смене этапа лида", en: "When lead stage changes" },
  "auto.dealWon": { uz: "Bitim yutilganda", ru: "При выигрыше сделки", en: "When deal is won" },
  "auto.dealLost": { uz: "Bitim yo'qotilganda", ru: "При потере сделки", en: "When deal is lost" },
  "auto.newLead": { uz: "Yangi lead qo'shilganda", ru: "При добавлении нового лида", en: "When new lead is added" },
  "auto.sendNotification": { uz: "Bildirishnoma yuborish", ru: "Отправить уведомление", en: "Send notification" },
  "auto.sendEmail": { uz: "Email yuborish", ru: "Отправить email", en: "Send email" },
  "auto.assignTask": { uz: "Vazifa berish", ru: "Назначить задачу", en: "Assign task" },
  "auto.moveStage": { uz: "Bosqichni o'zgartirish", ru: "Сменить этап", en: "Change stage" },

  // Communications
  "comm.title": { uz: "Xabarlar", ru: "Сообщения", en: "Messages" },
  "comm.subtitle": { uz: "Barcha kommunikatsiyalar bir joyda", ru: "Все коммуникации в одном месте", en: "All communications in one place" },

  // Integrations
  "int.title": { uz: "Integratsiya", ru: "Интеграции", en: "Integrations" },
  "int.subtitle": { uz: "Tashqi xizmatlar bilan ulanish", ru: "Подключение внешних сервисов", en: "Connect external services" },

  // Common
  "common.filter": { uz: "Filter", ru: "Фильтр", en: "Filter" },
  "common.all": { uz: "Barchasi", ru: "Все", en: "All" },
  "common.loading": { uz: "Yuklanmoqda...", ru: "Загрузка...", en: "Loading..." },
  "common.user": { uz: "Foydalanuvchi", ru: "Пользователь", en: "User" },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "uz",
  setLang: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("forge-lang");
    return (saved as Language) || "uz";
  });

  useEffect(() => {
    localStorage.setItem("forge-lang", lang);
  }, [lang]);

  const translate = (key: string) => {
    return t[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const langLabels: Record<Language, string> = {
  uz: "O'zbek",
  ru: "Русский",
  en: "English",
};
