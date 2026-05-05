import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "uz" | "ru" | "en";

type Translations = Record<string, Record<Language, string>>;

const t: Translations = {
  // Brand
  "brand.name": { uz: "BarberTop", ru: "BarberTop", en: "BarberTop" },

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
  "auth.success": { uz: "Muvaffaqiyatli", ru: "Успешно", en: "Success" },
  "auth.required": { uz: "Avval tizimga kiring", ru: "Сначала войдите в систему", en: "Please sign in first" },
  "auth.backHome": { uz: "Bosh sahifa", ru: "На главную", en: "Home" },

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
  "nav.bookings": { uz: "Bronlar", ru: "Записи", en: "Bookings" },
  "nav.myServices": { uz: "Xizmatlarim", ru: "Мои услуги", en: "My Services" },
  "nav.portfolio": { uz: "Portfolio", ru: "Портфолио", en: "Portfolio" },
  "nav.stats": { uz: "Statistika", ru: "Статистика", en: "Statistics" },
  "nav.reviews": { uz: "Sharhlar", ru: "Отзывы", en: "Reviews" },
  "nav.myProfile": { uz: "Profilim", ru: "Мой профиль", en: "My Profile" },
  "nav.schedule": { uz: "Ish jadvali", ru: "График работы", en: "Schedule" },

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
  "common.sum": { uz: "so'm", ru: "сум", en: "UZS" },
  "common.minutes": { uz: "daqiqa", ru: "мин", en: "min" },
  "common.year": { uz: "yil", ru: "лет", en: "yr" },

  // Dashboard - Admin
  "dash.admin.title": { uz: "Admin Dashboard", ru: "Панель Админа", en: "Admin Dashboard" },
  "dash.admin.todayBookings": { uz: "Bugungi bronlar", ru: "Записи сегодня", en: "Today's Bookings" },
  "dash.admin.todayRevenue": { uz: "Bugungi tushum", ru: "Выручка сегодня", en: "Today's Revenue" },
  "dash.admin.monthRevenue": { uz: "Oylik tushum", ru: "Доход за месяц", en: "Monthly Revenue" },
  "dash.admin.totalClients": { uz: "Mijozlar", ru: "Всего клиентов", en: "Total Clients" },
  "dash.admin.upcoming": { uz: "Yaqinlashayotgan bronlar", ru: "Ближайшие записи", en: "Upcoming bookings" },

  // Barber
  "dash.barber.title": { uz: "Mening kunim", ru: "Мой день", en: "My Day" },
  "dash.barber.todayList": { uz: "Bugungi navbatlar", ru: "Записи на сегодня", en: "Today's Appointments" },
  "dash.barber.markDone": { uz: "Bajarildi", ru: "Выполнено", en: "Mark Done" },
  "dash.barber.markPaid": { uz: "To'landi", ru: "Оплачено", en: "Mark Paid" },
  "dash.barber.totalRevenue": { uz: "Jami daromad", ru: "Общий доход", en: "Total revenue" },

  // Client
  "client.welcome": { uz: "Xush kelibsiz", ru: "Добро пожаловать", en: "Welcome" },
  "client.bookTitle": { uz: "Yangi bron qilish", ru: "Новая запись", en: "Book Appointment" },
  "client.selectService": { uz: "Xizmat tanlang", ru: "Выберите услугу", en: "Select service" },
  "client.selectBarber": { uz: "Sartarosh tanlang", ru: "Выберите барбера", en: "Select barber" },
  "client.selectDate": { uz: "Sana", ru: "Дата", en: "Date" },
  "client.selectTime": { uz: "Vaqt", ru: "Время", en: "Time" },
  "client.bookBtn": { uz: "Bron qilish", ru: "Записаться", en: "Book Now" },
  "client.bookingSuccess": { uz: "Bron muvaffaqiyatli yaratildi!", ru: "Запись создана!", en: "Booking created!" },
  "client.totalSpent": { uz: "Jami sarflagan", ru: "Всего потрачено", en: "Total spent" },

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
  "field.price": { uz: "Narxi", ru: "Цена", en: "Price" },
  "field.duration": { uz: "Davomiyligi (daqiqa)", ru: "Длительность (мин)", en: "Duration (min)" },
  "field.description": { uz: "Tavsif (ixtiyoriy)", ru: "Описание (необязательно)", en: "Description (optional)" },
  "field.specialty": { uz: "Mutaxassislik", ru: "Специализация", en: "Specialty" },
  "field.bio": { uz: "Tavsif", ru: "Описание", en: "Bio" },
  "field.phone": { uz: "Telefon", ru: "Телефон", en: "Phone" },
  "field.fullName": { uz: "F.I.O", ru: "Ф.И.О", en: "Full Name" },
  "field.notes": { uz: "Izoh", ru: "Заметки", en: "Notes" },
  "field.method": { uz: "To'lov usuli", ru: "Способ", en: "Method" },
  "field.amount": { uz: "Summa", ru: "Сумма", en: "Amount" },
  "field.date": { uz: "Sana", ru: "Дата", en: "Date" },
  "field.time": { uz: "Vaqt", ru: "Время", en: "Time" },

  // Plans
  "nav.plans": { uz: "Obuna", ru: "Подписка", en: "Plans" },
  "plans.title": { uz: "Obuna rejalari", ru: "Тарифные планы", en: "Subscription Plans" },
  "plans.subtitle": { uz: "O'zingizga mos rejani tanlang", ru: "Выберите подходящий план", en: "Choose your plan" },
  "plans.free": { uz: "Bepul", ru: "Бесплатно", en: "Free" },
  "plans.subscribe": { uz: "Obuna bo'lish", ru: "Подписаться", en: "Subscribe" },
  "plans.active": { uz: "Aktiv", ru: "Активен", en: "Active" },
  "plans.current": { uz: "Joriy reja", ru: "Текущий план", en: "Current plan" },
  "plans.until": { uz: "Tugaydi", ru: "До", en: "Until" },
  "plans.mockNote": { uz: "* Test rejimida — haqiqiy to'lov amalga oshmaydi", ru: "* Тестовый режим — реальная оплата не производится", en: "* Mock mode — no real payment is processed" },
  "plans.tier.free": { uz: "FREE — Bepul", ru: "FREE — Бесплатно", en: "FREE" },
  "plans.tier.pro": { uz: "PRO ⭐", ru: "PRO ⭐", en: "PRO ⭐" },
  "plans.tier.vip": { uz: "VIP 👑", ru: "VIP 👑", en: "VIP 👑" },

  // Chat
  "nav.messages": { uz: "Xabarlar", ru: "Сообщения", en: "Messages" },
  "chat.empty": { uz: "Suhbatlar yo'q", ru: "Нет чатов", en: "No conversations" },
  "chat.selectThread": { uz: "Suhbatni tanlang", ru: "Выберите чат", en: "Select a conversation" },
  "chat.placeholder": { uz: "Xabar yozing...", ru: "Сообщение...", en: "Type a message..." },

  // Barber detail
  "barber.portfolio": { uz: "Portfolio", ru: "Портфолио", en: "Portfolio" },
  "barber.schedule": { uz: "Ish vaqti", ru: "Расписание", en: "Schedule" },
  "barber.upload": { uz: "Rasm yuklash", ru: "Загрузить", en: "Upload" },
  "barber.working": { uz: "Ishlaydi", ru: "Работает", en: "Working" },
  "barber.off": { uz: "Dam olish", ru: "Выходной", en: "Off" },
  "barber.chat": { uz: "Yozish", ru: "Написать", en: "Message" },

  // Reviews
  "reviews.title": { uz: "Sharhlar", ru: "Отзывы", en: "Reviews" },
  "reviews.count": { uz: "ta sharh", ru: "отзывов", en: "reviews" },
  "reviews.leave": { uz: "Sharh qoldiring", ru: "Оставьте отзыв", en: "Leave a review" },
  "reviews.comment": { uz: "Sizning fikringiz...", ru: "Ваш отзыв...", en: "Your comment..." },
  "reviews.none": { uz: "Hali sharhlar yo'q", ru: "Пока нет отзывов", en: "No reviews yet" },

  // Landing
  "land.tag": { uz: "#1 O'zbekistondagi premium barber platforma", ru: "#1 Премиум барбер-платформа Узбекистана", en: "#1 premium barber platform in Uzbekistan" },
  "land.heroTitle1": { uz: "O'zingizga mos", ru: "Найдите своего", en: "Find your perfect" },
  "land.heroAccent": { uz: "TOP barberni", ru: "TOP барбера", en: "TOP barber" },
  "land.heroTitle2": { uz: "toping", ru: "", en: "" },
  "land.heroDesc": { uz: "1 daqiqada bron qiling. Yaqin atrofdagi eng yaxshi sartaroshlar, real sharhlar, AI tavsiyalar va premium xizmatlar — barchasi bir joyda.", ru: "Бронируйте за 1 минуту. Лучшие барберы рядом, реальные отзывы, AI-рекомендации и премиум-сервис — всё в одном месте.", en: "Book in 1 minute. The best barbers nearby, real reviews, AI recommendations and premium services — all in one place." },
  "land.findBarber": { uz: "Barber topish", ru: "Найти барбера", en: "Find a barber" },
  "land.joinBarber": { uz: "Barber sifatida qo'shilish", ru: "Стать барбером", en: "Join as a barber" },
  "land.happy": { uz: "10,000+ baxtli mijoz", ru: "10,000+ счастливых клиентов", en: "10,000+ happy clients" },
  "land.bookedToday": { uz: "Bugun bron qilindi", ru: "Записей сегодня", en: "Booked today" },
  "land.onlineNow": { uz: "Online hozir", ru: "Онлайн сейчас", en: "Online now" },
  "land.acceptingNow": { uz: "ta barber qabul qilmoqda", ru: "барберов принимают", en: "barbers accepting now" },
  "land.searchBarber": { uz: "Barber ismi yoki xizmat...", ru: "Имя барбера или услуга...", en: "Barber name or service..." },
  "land.searchLoc": { uz: "Toshkent, Yunusobod...", ru: "Ташкент, Юнусабад...", en: "Tashkent, Yunusabad..." },
  "land.searchBtn": { uz: "Qidirish", ru: "Найти", en: "Search" },
  "land.topBarbers": { uz: "Top sartaroshlar", ru: "Топ барберы", en: "Top barbers" },
  "land.topTitle1": { uz: "Eng yaxshilarni", ru: "Выберите", en: "Choose the" },
  "land.topTitle2": { uz: "tanlang", ru: "лучших", en: "best" },
  "land.viewAll": { uz: "Barchasini ko'rish", ru: "Все", en: "View all" },
  "land.exp": { uz: "yil tajriba", ru: "лет опыта", en: "yrs exp" },
  "land.from": { uz: "dan", ru: "от", en: "from" },
  "land.book": { uz: "Bron", ru: "Записаться", en: "Book" },
  "land.aiTag": { uz: "AI POWERED", ru: "AI POWERED", en: "AI POWERED" },
  "land.aiTitle1": { uz: "AI siz uchun", ru: "AI подберёт вам", en: "AI finds your" },
  "land.aiAccent": { uz: "mukammal stilni", ru: "идеальный стиль", en: "perfect style" },
  "land.aiTitle2": { uz: "topadi", ru: "", en: "" },
  "land.aiDesc": { uz: "Yuz shaklingiz, sochingiz turi va shaxsiyatingizga qarab AI sizga eng mos haircut va barberni tavsiya qiladi.", ru: "AI порекомендует стрижку и барбера на основе вашей формы лица, типа волос и образа жизни.", en: "AI recommends the perfect haircut and barber based on your face shape, hair type and lifestyle." },
  "land.aiBtn": { uz: "AI tavsiya olish", ru: "Получить AI-рекомендацию", en: "Get AI recommendation" },
  "land.trends2026": { uz: "2026 trendlari", ru: "Тренды 2026", en: "2026 trends" },
  "land.trendTitle1": { uz: "Hozir", ru: "Что", en: "What's" },
  "land.trendAccent": { uz: "nima trendda", ru: "в тренде", en: "trending now" },
  "land.whyTitle1": { uz: "Nega", ru: "Почему", en: "Why" },
  "land.feat.fast": { uz: "Tez bron", ru: "Быстрая запись", en: "Fast booking" },
  "land.feat.fastDesc": { uz: "1 daqiqada tasdiqlangan navbat", ru: "Подтверждённая запись за минуту", en: "Confirmed slot in a minute" },
  "land.feat.real": { uz: "Real sharhlar", ru: "Настоящие отзывы", en: "Real reviews" },
  "land.feat.realDesc": { uz: "Faqat haqiqiy mijozlardan", ru: "Только от реальных клиентов", en: "Only from real clients" },
  "land.feat.top": { uz: "TOP barberlar", ru: "TOP барберы", en: "TOP barbers" },
  "land.feat.topDesc": { uz: "Tekshirilgan professionalar", ru: "Проверенные профессионалы", en: "Verified professionals" },
  "land.feat.ai": { uz: "AI tavsiya", ru: "AI-рекомендации", en: "AI recommendations" },
  "land.feat.aiDesc": { uz: "Sizga mos stil va barber", ru: "Подходящий стиль и барбер", en: "Style and barber for you" },
  "land.feat.safe": { uz: "Xavfsiz to'lov", ru: "Безопасная оплата", en: "Secure payment" },
  "land.feat.safeDesc": { uz: "Hech qanday yashirin to'lov", ru: "Никаких скрытых платежей", en: "No hidden fees" },
  "land.feat.com": { uz: "10K+ mijoz", ru: "10K+ клиентов", en: "10K+ clients" },
  "land.feat.comDesc": { uz: "Bizga ishonadigan jamoa", ru: "Доверяющее сообщество", en: "A trusting community" },
  "land.howTag": { uz: "Qanday ishlaydi", ru: "Как это работает", en: "How it works" },
  "land.howTitle1": { uz: "3 oddiy", ru: "3 простых", en: "3 simple" },
  "land.howAccent": { uz: "qadam", ru: "шага", en: "steps" },
  "land.step1": { uz: "Barber tanlang", ru: "Выберите барбера", en: "Pick a barber" },
  "land.step1Desc": { uz: "Reyting, narx va joylashuvga qarab", ru: "По рейтингу, цене и локации", en: "By rating, price and location" },
  "land.step2": { uz: "Vaqtni belgilang", ru: "Выберите время", en: "Choose a time" },
  "land.step2Desc": { uz: "Bo'sh slotlardan birini tanlang", ru: "Из свободных слотов", en: "From the free slots" },
  "land.step3": { uz: "Bron qiling", ru: "Забронируйте", en: "Book it" },
  "land.step3Desc": { uz: "1 click — tasdiqlanadi", ru: "1 клик — подтверждено", en: "1 click — confirmed" },
  "land.premBenefit1": { uz: "Navbatsiz bron qilish", ru: "Бронь без очереди", en: "Skip-the-line booking" },
  "land.premBenefit2": { uz: "TOP barberlarga kirish", ru: "Доступ к TOP барберам", en: "Access to TOP barbers" },
  "land.premBenefit3": { uz: "Maxsus chegirmalar", ru: "Специальные скидки", en: "Special discounts" },
  "land.premBenefit4": { uz: "VIP qo'llab-quvvatlash", ru: "VIP поддержка", en: "VIP support" },
  "land.premTitle1": { uz: "Premium obuna bilan", ru: "С премиум-подпиской", en: "With Premium subscription" },
  "land.premAccent": { uz: "VIP imkoniyatlar", ru: "VIP возможности", en: "VIP features" },
  "land.premDesc": { uz: "Eng yaxshi sartaroshlarga doimiy kirish, eksklyuziv chegirmalar va navbatsiz bron qilish imkoniyati.", ru: "Постоянный доступ к лучшим барберам, эксклюзивные скидки и бронь без очереди.", en: "Permanent access to top barbers, exclusive discounts and skip-the-line booking." },
  "land.premPerMonth": { uz: "so'm/oy", ru: "сум/мес", en: "UZS/mo" },
  "land.premBtn": { uz: "Premium olish", ru: "Получить Premium", en: "Get Premium" },
  "land.forBarbers": { uz: "Barberlar uchun", ru: "Для барберов", en: "For barbers" },
  "land.joinTitle1": { uz: "Minglab klientlarga", ru: "Получите тысячи", en: "Get thousands of" },
  "land.joinAccent": { uz: "ega bo'ling", ru: "клиентов", en: "clients" },
  "land.joinDesc": { uz: "Professional CRM, AI tahlillar va premium bron tizimi bilan biznesingizni keyingi darajaga olib chiqing.", ru: "Профессиональная CRM, AI-аналитика и премиум система бронирования.", en: "Professional CRM, AI analytics and premium booking system." },
  "land.joinB1": { uz: "Avtomatik bron tizimi", ru: "Автоматическая система записи", en: "Automated booking system" },
  "land.joinB2": { uz: "Mijozlar bazasi va CRM", ru: "База клиентов и CRM", en: "Client base and CRM" },
  "land.joinB3": { uz: "Real-time analitika", ru: "Real-time аналитика", en: "Real-time analytics" },
  "land.joinB4": { uz: "AI tools va smart queue", ru: "AI инструменты и умная очередь", en: "AI tools and smart queue" },
  "land.joinBtn": { uz: "Barber sifatida qo'shilish", ru: "Стать барбером", en: "Join as barber" },
  "land.statBarbers": { uz: "Faol barberlar", ru: "Активных барберов", en: "Active barbers" },
  "land.statBookings": { uz: "Oylik bron", ru: "Записей в месяц", en: "Monthly bookings" },
  "land.statRating": { uz: "O'rtacha reyting", ru: "Средний рейтинг", en: "Average rating" },
  "land.statRetention": { uz: "Mijoz qaytishi", ru: "Возврат клиентов", en: "Client retention" },
  "land.reviewsTag": { uz: "Sharhlar", ru: "Отзывы", en: "Reviews" },
  "land.reviewsTitle1": { uz: "Mijozlarimiz", ru: "Что говорят", en: "What our" },
  "land.reviewsAccent": { uz: "nima deydi", ru: "наши клиенты", en: "clients say" },
  "land.review1": { uz: "Eng yaxshi xizmat! Davron aka shunaqa toza ishlaydi-ki, har oy faqat o'sha yerga boraman.", ru: "Лучший сервис! Давроном так чисто работает, что хожу к нему каждый месяц.", en: "The best service! Davron is so precise, I only go to him every month." },
  "land.review2": { uz: "AI tavsiya juda zo'r ishladi. Tavsiya qilingan stil mukammal mos keldi.", ru: "AI-рекомендация отлично сработала. Рекомендованный стиль идеально подошёл.", en: "The AI recommendation worked great. The suggested style fit perfectly." },
  "land.review3": { uz: "Tez, oson va sifatli. Bron qilish 30 sekundda bo'ladi, premium qiymat.", ru: "Быстро, удобно и качественно. Бронь за 30 секунд, премиум-уровень.", en: "Fast, easy and high quality. Booking in 30 seconds, premium value." },
  "land.client": { uz: "Mijoz", ru: "Клиент", en: "Client" },
  "land.mobileTag": { uz: "Mobile app", ru: "Mobile app", en: "Mobile app" },
  "land.mobileTitle1": { uz: "Cho'ntagingizda", ru: "В вашем кармане —", en: "Barber studio in" },
  "land.mobileAccent": { uz: "barber studiya", ru: "барбер-студия", en: "your pocket" },
  "land.mobileDesc": { uz: "Push-bildirishnomalar, offline bron, qulay interfeys. iOS va Android uchun tez orada.", ru: "Push-уведомления, офлайн-запись, удобный интерфейс. Для iOS и Android — скоро.", en: "Push notifications, offline booking, smooth UI. Coming soon to iOS and Android." },
  "land.menu.barbers": { uz: "Barberlar", ru: "Барберы", en: "Barbers" },
  "land.menu.trends": { uz: "Trendlar", ru: "Тренды", en: "Trends" },
  "land.menu.premium": { uz: "Premium", ru: "Premium", en: "Premium" },
  "land.menu.join": { uz: "Barber bo'lish", ru: "Стать барбером", en: "Become a barber" },
  "land.cta.start": { uz: "Boshlash", ru: "Начать", en: "Get started" },

  // Schedule page
  "sched.title": { uz: "Ish jadvali", ru: "График работы", en: "Work schedule" },
  "sched.subtitle": { uz: "Hafta kunlari uchun ish vaqtingizni belgilang", ru: "Установите рабочее время на каждый день недели", en: "Set your working hours per day of week" },
  "sched.day": { uz: "Kun", ru: "День", en: "Day" },
  "sched.start": { uz: "Boshlanish", ru: "Начало", en: "Start" },
  "sched.end": { uz: "Tugash", ru: "Конец", en: "End" },
  "sched.off": { uz: "Dam olish kuni", ru: "Выходной", en: "Day off" },

  // Admin barber form
  "barbers.addTitle": { uz: "Yangi barber qo'shish", ru: "Добавить нового барбера", en: "Add new barber" },
  "barbers.addNote": { uz: "Email va parol kiriting — barber shu ma'lumotlar bilan tizimga kira oladi", ru: "Введите email и пароль — барбер сможет войти с этими данными", en: "Enter email & password — barber can sign in with them" },

  // Filters
  "filter.title": { uz: "Filtrlar", ru: "Фильтры", en: "Filters" },
  "filter.search": { uz: "Barber ismi yoki xizmat...", ru: "Имя барбера или услуга...", en: "Barber name or service..." },
  "filter.region": { uz: "Viloyat", ru: "Регион", en: "Region" },
  "filter.district": { uz: "Tuman", ru: "Район", en: "District" },
  "filter.all": { uz: "Hammasi", ru: "Все", en: "All" },
  "filter.priceRange": { uz: "Narx oralig'i", ru: "Диапазон цен", en: "Price range" },
  "filter.rating": { uz: "Reyting", ru: "Рейтинг", en: "Rating" },
  "filter.experience": { uz: "Tajriba", ru: "Опыт", en: "Experience" },
  "filter.gender": { uz: "Jins", ru: "Пол", en: "Gender" },
  "filter.male": { uz: "Erkak", ru: "Мужчина", en: "Male" },
  "filter.female": { uz: "Ayol", ru: "Женщина", en: "Female" },
  "filter.sort": { uz: "Saralash", ru: "Сортировка", en: "Sort" },
  "filter.sort.rating": { uz: "Eng yaxshi reyting", ru: "Лучший рейтинг", en: "Top rated" },
  "filter.sort.priceLow": { uz: "Eng arzon", ru: "Сначала дешёвые", en: "Cheapest" },
  "filter.sort.priceHigh": { uz: "Eng qimmat", ru: "Сначала дорогие", en: "Most expensive" },
  "filter.sort.exp": { uz: "Tajribali", ru: "Опытные", en: "Most experienced" },
  "filter.chip.near": { uz: "📍 Yaqin", ru: "📍 Рядом", en: "📍 Nearby" },
  "filter.chip.top": { uz: "⭐ TOP", ru: "⭐ TOP", en: "⭐ TOP" },
  "filter.chip.cheap": { uz: "💰 Arzon", ru: "💰 Недорого", en: "💰 Cheap" },
  "filter.chip.open": { uz: "🕒 Ochiq", ru: "🕒 Открыто", en: "🕒 Open now" },
  "filter.chip.pro": { uz: "💎 PRO", ru: "💎 PRO", en: "💎 PRO" },
  "filter.chip.vip": { uz: "👑 VIP", ru: "👑 VIP", en: "👑 VIP" },
  "filter.chip.home": { uz: "🏠 Uyga boradi", ru: "🏠 На дом", en: "🏠 Home service" },
  "filter.chip.fast": { uz: "⚡ Tez javob", ru: "⚡ Быстрый ответ", en: "⚡ Fast response" },
  "filter.reset": { uz: "Tozalash", ru: "Сбросить", en: "Reset" },
  "filter.results": { uz: "ta natija", ru: "результатов", en: "results" },

  // Plan gating
  "gate.locked": { uz: "Bu funksiya yopiq", ru: "Эта функция недоступна", en: "Feature locked" },
  "gate.upgradeTo": { uz: "ga o'tkazing", ru: "обновитесь до", en: "Upgrade to" },
  "gate.viewPlans": { uz: "Rejalarni ko'rish", ru: "Посмотреть тарифы", en: "View plans" },
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
