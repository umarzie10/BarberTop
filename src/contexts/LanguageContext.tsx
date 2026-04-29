import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "uz" | "ru" | "en";

type Translations = Record<string, Record<Language, string>>;

const t: Translations = {
  // Brand
  "brand.name": { uz: "Barber Studio", ru: "Барбер Студия", en: "Barber Studio" },

  // Auth
  "auth.login": { uz: "Kirish", ru: "Войти", en: "Sign In" },
  "auth.register": { uz: "Ro'yxatdan o'tish", ru: "Регистрация", en: "Sign Up" },
  "auth.loginDesc": { uz: "Hisobingizga kiring", ru: "Войдите в свой аккаунт", en: "Sign in to your account" },
  "auth.registerDesc": { uz: "Yangi mijoz hisobi yarating", ru: "Создайте новый клиентский аккаунт", en: "Create a new client account" },
  "auth.name": { uz: "Ism", ru: "Имя", en: "Name" },
  "auth.namePlaceholder": { uz: "To'liq ismingiz", ru: "Ваше имя", en: "Your full name" },
  "auth.email": { uz: "Email", ru: "Email", en: "Email" },
  "auth.password": { uz: "Parol", ru: "Пароль", en: "Password" },
  "auth.phone": { uz: "Telefon", ru: "Телефон", en: "Phone" },
  "auth.noAccount": { uz: "Hisobingiz yo'qmi?", ru: "Нет аккаунта?", en: "Don't have an account?" },
  "auth.hasAccount": { uz: "Hisobingiz bormi?", ru: "Уже есть аккаунт?", en: "Already have an account?" },
  "auth.demoTitle": { uz: "Demo akkauntlar", ru: "Демо аккаунты", en: "Demo accounts" },
  "auth.seedBtn": { uz: "Demo akkauntlarni yaratish", ru: "Создать демо аккаунты", en: "Create demo accounts" },
  "auth.fillDemo": { uz: "To'ldirish", ru: "Заполнить", en: "Fill" },

  // Sidebar
  "nav.main": { uz: "Asosiy", ru: "Главное", en: "Main" },
  "nav.management": { uz: "Boshqaruv", ru: "Управление", en: "Management" },
  "nav.dashboard": { uz: "Bosh sahifa", ru: "Дашборд", en: "Dashboard" },
  "nav.appointments": { uz: "Bronlar", ru: "Записи", en: "Appointments" },
  "nav.services": { uz: "Xizmatlar", ru: "Услуги", en: "Services" },
  "nav.barbers": { uz: "Sartaroshlar", ru: "Барберы", en: "Barbers" },
  "nav.clients": { uz: "Mijozlar", ru: "Клиенты", en: "Clients" },
  "nav.payments": { uz: "To'lovlar", ru: "Платежи", en: "Payments" },
  "nav.book": { uz: "Bron qilish", ru: "Записаться", en: "Book Now" },
  "nav.myBookings": { uz: "Mening bronlarim", ru: "Мои записи", en: "My Bookings" },
  "nav.profile": { uz: "Profil", ru: "Профиль", en: "Profile" },
  "nav.logout": { uz: "Chiqish", ru: "Выход", en: "Logout" },

  // Common
  "common.loading": { uz: "Yuklanmoqda...", ru: "Загрузка...", en: "Loading..." },
  "common.save": { uz: "Saqlash", ru: "Сохранить", en: "Save" },
  "common.cancel": { uz: "Bekor", ru: "Отмена", en: "Cancel" },
  "common.delete": { uz: "O'chirish", ru: "Удалить", en: "Delete" },
  "common.edit": { uz: "Tahrirlash", ru: "Изменить", en: "Edit" },
  "common.add": { uz: "Qo'shish", ru: "Добавить", en: "Add" },
  "common.import": { uz: "Import (CSV)", ru: "Импорт (CSV)", en: "Import CSV" },
  "common.export": { uz: "Export (CSV)", ru: "Экспорт (CSV)", en: "Export CSV" },
  "common.search": { uz: "Qidirish...", ru: "Поиск...", en: "Search..." },
  "common.empty": { uz: "Hali ma'lumot yo'q", ru: "Пока нет данных", en: "No data yet" },
  "common.confirm": { uz: "Tasdiqlash", ru: "Подтвердить", en: "Confirm" },
  "common.user": { uz: "Foydalanuvchi", ru: "Пользователь", en: "User" },

  // Dashboard - Admin
  "dash.admin.title": { uz: "Admin Dashboard", ru: "Панель Админа", en: "Admin Dashboard" },
  "dash.admin.todayBookings": { uz: "Bugungi bronlar", ru: "Записи сегодня", en: "Today's Bookings" },
  "dash.admin.todayRevenue": { uz: "Bugungi tushum", ru: "Выручка сегодня", en: "Today's Revenue" },
  "dash.admin.monthRevenue": { uz: "Oylik tushum", ru: "Доход за месяц", en: "Monthly Revenue" },
  "dash.admin.totalClients": { uz: "Mijozlar", ru: "Всего клиентов", en: "Total Clients" },

  // Barber
  "dash.barber.title": { uz: "Mening kunim", ru: "Мой день", en: "My Day" },
  "dash.barber.todayList": { uz: "Bugungi navbatlar", ru: "Записи на сегодня", en: "Today's Appointments" },
  "dash.barber.markDone": { uz: "Bajarildi", ru: "Выполнено", en: "Mark Done" },
  "dash.barber.markPaid": { uz: "To'landi", ru: "Оплачено", en: "Mark Paid" },

  // Client
  "client.welcome": { uz: "Xush kelibsiz", ru: "Добро пожаловать", en: "Welcome" },
  "client.bookTitle": { uz: "Yangi bron qilish", ru: "Новая запись", en: "Book Appointment" },
  "client.selectService": { uz: "Xizmat tanlang", ru: "Выберите услугу", en: "Select service" },
  "client.selectBarber": { uz: "Sartarosh tanlang", ru: "Выберите барбера", en: "Select barber" },
  "client.selectDate": { uz: "Sana", ru: "Дата", en: "Date" },
  "client.selectTime": { uz: "Vaqt", ru: "Время", en: "Time" },
  "client.bookBtn": { uz: "Bron qilish", ru: "Записаться", en: "Book Now" },
  "client.bookingSuccess": { uz: "Bron muvaffaqiyatli yaratildi!", ru: "Запись создана!", en: "Booking created!" },

  // Status
  "status.pending": { uz: "Kutilmoqda", ru: "Ожидает", en: "Pending" },
  "status.confirmed": { uz: "Tasdiqlangan", ru: "Подтверждено", en: "Confirmed" },
  "status.completed": { uz: "Bajarildi", ru: "Выполнено", en: "Completed" },
  "status.cancelled": { uz: "Bekor qilindi", ru: "Отменено", en: "Cancelled" },
  "status.no_show": { uz: "Kelmadi", ru: "Не пришёл", en: "No-show" },

  // Roles
  "role.admin": { uz: "Administrator", ru: "Администратор", en: "Administrator" },
  "role.barber": { uz: "Sartarosh", ru: "Барбер", en: "Barber" },
  "role.client": { uz: "Mijoz", ru: "Клиент", en: "Client" },

  // Services / Barbers fields
  "field.name": { uz: "Nomi", ru: "Название", en: "Name" },
  "field.price": { uz: "Narx", ru: "Цена", en: "Price" },
  "field.duration": { uz: "Davomiyligi (daqiqa)", ru: "Длительность (мин)", en: "Duration (min)" },
  "field.specialty": { uz: "Mutaxassislik", ru: "Специализация", en: "Specialty" },
  "field.bio": { uz: "Tavsif", ru: "Описание", en: "Bio" },
  "field.phone": { uz: "Telefon", ru: "Телефон", en: "Phone" },
  "field.fullName": { uz: "F.I.O", ru: "Ф.И.О", en: "Full Name" },
  "field.notes": { uz: "Izoh", ru: "Заметки", en: "Notes" },
  "field.method": { uz: "To'lov usuli", ru: "Способ", en: "Method" },
  "field.amount": { uz: "Summa", ru: "Сумма", en: "Amount" },
  "field.date": { uz: "Sana", ru: "Дата", en: "Date" },
  "field.time": { uz: "Vaqt", ru: "Время", en: "Time" },
};

export const langLabels: Record<Language, string> = { uz: "UZ", ru: "RU", en: "EN" };

interface LanguageCtx {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageCtx>({ lang: "uz", setLang: () => {}, t: (k) => k });

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem("lang") as Language) || "uz");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Language) => setLangState(l);
  const translate = (key: string) => t[key]?.[lang] || key;

  return <LanguageContext.Provider value={{ lang, setLang, t: translate }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
