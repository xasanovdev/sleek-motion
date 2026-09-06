import type { LandingCopy, Locale } from "./landing.types";

export const landingCopy: Record<Locale, LandingCopy> = {
  en: {
    localeLabel: "O‘zbek",
    localeHref: "/uz",
    nav: [
      ["Library", "/animations"],
      ["Principles", "#principles"],
      ["Playground", "#playground"],
    ],
    navAction: "Browse library",
    menu: "Open navigation",
    eyebrow: "Small details. Better interfaces.",
    titleIntro: "A little motion.",
    title: "A better experience.",
    previewNote: "interactive previews. A growing library of purposeful motion.",
    description:
      "39 thoughtful animations for everyday interfaces. Try a preview, copy its prompt, and bring the motion into your project.",
    primary: "Explore animations",
    secondary: "See the principles",
    proof: [
      ["39", "ready-to-use animations"],
      ["2", "runtime dependencies"],
      ["0", "required providers"],
    ],
    libraryEyebrow: "The foundation · Ready to copy",
    libraryTitle: "Small primitives for real interface work",
    libraryDescription:
      "Six primitives, each solving one recurring motion problem. Preview the real components, inspect every file, and copy them into your project.",
    items: [
      ["Fade", "Bring content in and out without inventing a spatial story."],
      ["Scale fade", "Give compact surfaces subtle depth without scaling from nothing."],
      ["Slide fade", "Show where temporary content entered from and where it went."],
      ["Content swap", "Bridge keyed content changes with a clean crossfade."],
      ["Directional swap", "Keep forward and backward navigation spatially consistent."],
      ["Collapse", "Expand dynamic content and unmount it only after exit completes."],
    ],
    playgroundEyebrow: "Try the motion",
    playgroundTitle: "Feel the difference before you copy it",
    playgroundDescription:
      "Switch between real interface patterns. Every example uses the same restrained timing, purposeful movement, and reduced-motion strategy that ships in the source.",
    principlesEyebrow: "The standard",
    principlesTitle: "Every animation has to earn its place",
    principlesDescription:
      "The library is intentionally smaller than an effects gallery. A pattern ships only when motion improves feedback, orientation, state clarity, or continuity.",
    principles: [
      ["Purpose before polish", "No motion exists only because it looks impressive."],
      ["Fast where it matters", "Most interface responses settle in under 240ms."],
      ["Accessible by default", "Movement softens while useful opacity feedback remains."],
    ],
    codeLabel: "A readable API · Yours to shape",
    codeDescription:
      "Good defaults stay visible in the implementation. Nothing important is hidden behind a preset name.",
    details: [
      "Style-agnostic React components",
      "No provider or configuration required",
      "Typed props and exported variants",
      "Reduced-motion behavior included",
    ],
    ctaEyebrow: "Start with the foundation",
    ctaTitle: "Build motion you can still love after the hundredth use",
    ctaDescription:
      "Explore all 39 animations. Copy a complete prompt with an integration guide, GitHub references, a working example and every required source file.",
    ctaAction: "Explore the library",
    footer: "Purposeful motion primitives for React.",
  },
  uz: {
    localeLabel: "English",
    localeHref: "/",
    nav: [
      ["Kutubxona", "/animations"],
      ["Prinsiplar", "#principles"],
      ["Sinov maydoni", "#playground"],
    ],
    navAction: "Kutubxonani ko‘rish",
    menu: "Navigatsiyani ochish",
    eyebrow: "Kichik detallar. Yaxshiroq interfeyslar.",
    titleIntro: "Biroz harakat.",
    title: "Yaxshiroq taassurot.",
    previewNote: "interaktiv namuna. Maqsadli animatsiyalar to‘plami kengaymoqda.",
    description:
      "Kundalik interfeyslar uchun 39 ta animatsiya. Namunasini sinang, promptini nusxalang va agent yordamida loyihangizga qo‘shing.",
    primary: "Animatsiyalarni ko‘rish",
    secondary: "Prinsiplarni ko‘rish",
    proof: [
      ["39", "tayyor animatsiya"],
      ["2", "runtime dependency"],
      ["0", "majburiy provider"],
    ],
    libraryEyebrow: "Foundation · Ko‘chirishga tayyor",
    libraryTitle: "Real interfeyslar uchun kichik primitivlar",
    libraryDescription:
      "Oltita primitivning har biri bitta motion muammosini yechadi. Haqiqiy komponentlarni sinang, fayllarni ko‘ring va loyihangizga ko‘chiring.",
    items: [
      ["Fade", "Yangi fazoviy ma’no o‘ylab topmasdan kontentni ko‘rsating va yashiring."],
      ["Scale fade", "Kichik surface’ga scale noldan boshlanmasdan yengil chuqurlik bering."],
      ["Slide fade", "Vaqtinchalik kontent qayerdan kelib, qayerga ketganini ko‘rsating."],
      ["Content swap", "Key bilan almashadigan kontentni toza crossfade orqali bog‘lang."],
      ["Directional swap", "Oldinga va orqaga navigatsiyada fazoviy izchillikni saqlang."],
      ["Collapse", "Dinamik kontentni oching va exit tugagandan keyingina unmount qiling."],
    ],
    playgroundEyebrow: "Motion’ni sinang",
    playgroundTitle: "Ko‘chirishdan oldin farqni his qiling",
    playgroundDescription:
      "Real interfeys patternlari orasida almashing. Har bir namuna source’da keladigan qisqa timing, maqsadli harakat va reduced-motion strategiyasidan foydalanadi.",
    principlesEyebrow: "Standart",
    principlesTitle: "Har bir animatsiya o‘z o‘rnini oqlashi kerak",
    principlesDescription:
      "Kutubxona ataylab effektlar galereyasidan kichikroq. Pattern faqat motion feedback, orientatsiya, holat aniqligi yoki continuity’ni yaxshilaganda qo‘shiladi.",
    principles: [
      ["Avval maqsad", "Hech bir motion faqat ta’sirli ko‘rinishi uchun mavjud emas."],
      ["Kerakli joyda tez", "Interfeys javoblarining ko‘pi 240ms ichida yakunlanadi."],
      ["Accessibility default", "Harakat yumshaydi, foydali opacity feedback esa qoladi."],
    ],
    codeLabel: "Tushunarli API · O‘zingizga moslang",
    codeDescription:
      "Yaxshi defaultlar implementation ichida ko‘rinib turadi. Muhim qarorlar preset nomi ortiga yashirilmaydi.",
    details: [
      "Style-agnostic React komponentlar",
      "Provider yoki configuration talab qilinmaydi",
      "Typed props va exported variants",
      "Reduced-motion holati ichida keladi",
    ],
    ctaEyebrow: "Foundation’dan boshlang",
    ctaTitle: "Yuzinchi ishlatishda ham yoqimli qoladigan motion yarating",
    ctaDescription:
      "39 ta animatsiyani sinab ko‘ring. Qo‘shish yo‘riqnomasi, GitHub havolalari, ishlaydigan namuna va kerakli fayllar bilan tayyor promptni nusxalang.",
    ctaAction: "Kutubxonani ko‘rish",
    footer: "React uchun maqsadli motion primitivlari.",
  },
};
