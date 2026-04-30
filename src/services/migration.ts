import { portfolioService } from "./portfolioService";
import i18n from "i18next";
import { 
  personalInfo, 
  skills, 
  projects, 
  experience, 
  education, 
  testimonials,
  seoExpertise
} from "@/data/portfolio";

const t = (key: string) => i18n.t(key);

export const migrateDataToFirebase = async () => {
  try {
    console.log(`🚀 ${t("admin.common.migration.starting")}`);

    // ── 1. Personal Info ──────────────────────────────────────────────────────
    console.log(t("admin.common.migration.migratingPersonal"));
    await portfolioService.save("metadata", "personalInfo", {
      name_en: "Ahmed Maher",
      name_ar: "أحمد ماهر",
      role_en: "Full-Stack MERN Developer | Next.js Developer | SEO Specialist",
      role_ar: "مطور MERN Full-Stack | مطور Next.js | متخصص SEO",
      tagline_en: "Building SEO-Optimized & High-Performance Web Applications",
      tagline_ar: "بناء تطبيقات ويب عالية الأداء ومحسنة لمحركات البحث",
      bio_en: "I'm a Full Stack Developer (MERN & Next.js) with a strong background in SEO and web performance, focused on building scalable, fast, and search-engine friendly applications. I specialize in developing modern web applications where code quality, performance, and discoverability work together as core architectural principles.",
      bio_ar: "أنا مطور Full Stack (MERN & Next.js) مع خلفية قوية في تحسين محركات البحث (SEO) وأداء الويب، أركز على بناء تطبيقات سريعة وقابلة للتطوير وصديقة لمحركات البحث. أتخصص في تطوير تطبيقات الويب الحديثة حيث تعمل جودة الكود والأداء وقابلية الاكتشاف معًا كمبادئ معمارية أساسية.",
      email: "elkoushaservice@gmail.com",
      phone: "+201011788540",
      location_en: "Alexandria, Egypt",
      location_ar: "الإسكندرية، مصر",
      github: "https://github.com/ahmedelkousha",
      linkedin: "https://linkedin.com/in/ahmedelkousha",
      cvUrl: "https://drive.google.com/file/d/1ujODr6dCumJy7-gPTeDSLWjFCVmf0h7C/view?usp=sharing",
      profileImage: "/profile.jpg",
      
      // Hero Typing Effect Roles
      openToRoles: [
        { name_en: "Full Stack MERN Developer", name_ar: "مطور Full Stack MERN" },
        { name_en: "Frontend Developer (React/Next.js)", name_ar: "مطور واجهات أمامية" },
        { name_en: "Backend Developer (Node.js)", name_ar: "مطور واجهات خلفية" },
        { name_en: "Technical SEO / Web Performance Specialist", name_ar: "أخصائي سيو تقني وأداء الويب" },
      ],

      // Stats
      stats: [
        { label_en: "Years Experience", label_ar: "سنوات الخبرة", value: "4+" },
        { label_en: "Projects Completed", label_ar: "مشروع مكتمل", value: "45+" },
        { label_en: "Happy Clients", label_ar: "عميل سعيد", value: "35+" },
        { label_en: "Technologies", label_ar: "تقنية مستخدمة", value: "15+" },
      ],

      // Contact Section Localization
      contact_title_en: "Get In Touch",
      contact_title_ar: "تواصل معي",
      contact_subtitle_en: "Have a project in mind? Let's build something amazing together.",
      contact_subtitle_ar: "لديك مشروع في بالك؟ دعنا نبني شيئاً مذهلاً معاً.",
      contact_info_title_en: "Contact Information",
      contact_info_title_ar: "معلومات الاتصال",
      contact_info_desc_en: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.",
      contact_info_desc_ar: "أنا متاح دائماً لمناقشة المشاريع الجديدة، الأفكار الإبداعية، أو فرص العمل معاً لتحقيق رؤيتك.",

      // Contact Info Box Labels
      contact_email_label_en: "Email",
      contact_email_label_ar: "البريد الإلكتروني",
      contact_phone_label_en: "Phone",
      contact_phone_label_ar: "رقم الهاتف",
      contact_location_label_en: "Location",
      contact_location_label_ar: "الموقع",
      
      // Footer Section Localization
      footer_tagline_en: "Building SEO-Optimized & High-Performance Web Applications",
      footer_tagline_ar: "بناء تطبيقات ويب عالية الأداء ومحسنة لمحركات البحث",
    });
    console.log(`✅ ${t("admin.common.migration.migratingPersonal")}`);

    // ── 2. Skills ─────────────────────────────────────────────────────────────
    console.log(t("admin.common.migration.migratingSkills"));
    const skillTitleMap: Record<string, string> = {
      frontend: "الواجهة الأمامية",
      backend: "الواجهة الخلفية",
      tools: "الأدوات والتقنيات",
      seo: "تحسين محركات البحث",
    };
    const skillsArray = Object.entries(skills).map(([key, value]) => ({
      title_en: key.charAt(0).toUpperCase() + key.slice(1),
      title_ar: skillTitleMap[key] || key,
      skills: value,
    }));
    await portfolioService.save("metadata", "skills", { categories: skillsArray });
    console.log(`✅ ${t("admin.common.migration.migratingSkills")}`);

    // ── 3. Projects ───────────────────────────────────────────────────────────
    console.log(t("admin.common.migration.migratingProjects"));

    const dbProjects = [
      {
        id: "1777229377862",
        title_en: "STARTOVA",
        title_ar: "ستارتوفا",
        description_en: "STARTOVA is a digital marketing agency that operates in the United States.",
        description_ar: "ستارتوفا هي وكالة تسويق رقمي تعمل في الولايات المتحدة، متخصصة في النمو الرقمي والحلول الإبداعية.",
        technologies: ["React", "GSAP", "Framer Motion", "MongoDB", "TailwindCSS"],
        liveDemo: "https://startova-marketing-agency.vercel.app/",
        featured: true,
        image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69ee8ffc0018f5753bb6/files/69ee94ea003ac3fd66c0/view?project=69ee8c970001fb908342"
      },
      {
        id: "1777229896623",
        title_en: "WellneXfreQ",
        title_ar: "ويلنيكس فريك",
        description_en: "WellneXfreQ is a wellness store that sells frequency technology devices that optimise biological systems for vitality and recovery.",
        description_ar: "ويلنيكس فريك هو متجر صحي يبيع أجهزة تكنولوجيا الترددات التي تعمل على تحسين الأنظمة الحيوية للحيوية والاستشفاء.",
        technologies: ["React", "Framer Motion", "Zod", "Firebase", "Supabase", "Wellness"],
        liveDemo: "https://wellnexfreq-store.vercel.app/en/",
        featured: true,
        image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69ee8ffc0018f5753bb6/files/69ee9859001cf87a34fc/view?project=69ee8c970001fb908342"
      },
      {
        id: "1777230482212",
        title_en: "Pure Marketing SA",
        title_ar: "بيور ماركتينج SA",
        description_en: "Pure Marketing is a digital marketing agency that operates in Saudi Arabia.",
        description_ar: "بيور ماركتينج هي وكالة تسويق رقمي تعمل في المملكة العربية السعودية، وتقدم حلولاً تسويقية متكاملة.",
        technologies: ["React", "Firebase", "Framer Motion", "Luicide React", "Zod", "Node.js", "Marketing", "EN", "AR"],
        liveDemo: "https://pure-marketing-sa.vercel.app/ar",
        featured: true,
        image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69ee8ffc0018f5753bb6/files/69ee98bb00189561e2ec/view?project=69ee8c970001fb908342"
      },
      {
        id: "1777230680475",
        title_en: "Aura Marketing SA",
        title_ar: "أورا ماركتينج SA",
        description_en: "Aura Marketing is a digital marketing agency operates in Saudi Arabia.",
        description_ar: "أورا ماركتينج هي وكالة تسويق رقمي تعمل في المملكة العربية السعودية، تركز على النتائج والأداء العالي.",
        technologies: ["React", "Framer Motion", "Zod", "Tailwind CSS", "SEO", "Performance", "Marketing", "EN", "AR"],
        liveDemo: "https://aura-sa.vercel.app/",
        featured: true,
        image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69ee8ffc0018f5753bb6/files/69ee98e3001346a2da94/view?project=69ee8c970001fb908342"
      },
      {
        id: "1777244623103",
        title_en: "Floral By Dalia",
        title_ar: "فلورال باي داليا",
        description_en: "Floral By Dalia is a US-based business that offers different bouquet services in Chicago.",
        description_ar: "فلورال باي داليا هو عمل تجاري مقره الولايات المتحدة يقدم خدمات تنسيق الزهور المختلفة في شيكاغو.",
        technologies: ["React", "Framer Motion", "TailwindCSS", "Lucide React", "Business"],
        liveDemo: "https://floral-by-dalia.vercel.app/",
        featured: false,
        image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69ee8ffc0018f5753bb6/files/69ee99b10029fd60d5ac/view?project=69ee8c970001fb908342"
      },
      {
        id: "1777246892194",
        title_en: "STARTOVA Neon Edition",
        title_ar: "ستارتوفا - نسخة نيون",
        description_en: "An extra fade-effect and scroll-based version for the original STARTOVA marketing agency website.",
        description_ar: "نسخة إضافية من موقع وكالة ستارتوفا بتأثيرات التلاشي والتمرير، تقدم تجربة بصرية فريدة.",
        technologies: ["React", "Framer Motion", "SwiperJs", "TailwindCSS", "Marketing"],
        liveDemo: "https://startova-neon-edition.vercel.app/",
        featured: false,
        image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69ee8ffc0018f5753bb6/files/69eea223002e4d431cb2/view?project=69ee8c970001fb908342"
      },
      {
        id: "1777247521635",
        title_en: "Elegant Options KW",
        title_ar: "إيليجانت أوبشنز KW",
        description_en: "Elegant Options delivers AI-based Solutions for WhatsApp automation, intelligent customer service, and smart business growth strategies in Kuwait.",
        description_ar: "تقدم إيليجانت أوبشنز حلولاً قائمة على الذكاء الاصطناعي لأتمتة واتساب، وخدمة العملاء الذكية، واستراتيجيات نمو الأعمال الذكية في الكويت.",
        technologies: ["React", "TailwindCSS", "Framer Motion", "Lucide React", "EN", "AR", "Marketing", "Business"],
        liveDemo: "https://elegantoptions.vercel.app/",
        featured: true,
        image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69ee8ffc0018f5753bb6/files/69eea3090002bdd386d0/view?project=69ee8c970001fb908342"
      },
      {
        id: "2",
        title_en: "Pure Touch US",
        title_ar: "بيور تاتش US",
        description_en: "Pure Touch is a cleaning services website that offers its services in the United States.",
        description_ar: "بيور تاتش هو موقع لخدمات التنظيف يقدم خدماته في الولايات المتحدة، مع التركيز على الجودة والاحترافية.",
        technologies: ["React", "Node.js", "SEO", "TailwindCSS", "Lucide React", "Services"],
        liveDemo: "https://pure-touch-cleaning.vercel.app/",
        featured: false,
        image: "https://fra.cloud.appwrite.io/v1/storage/buckets/69ee8ffc0018f5753bb6/files/69ee990e00366d25a517/view?project=69ee8c970001fb908342"
      }
    ];

    for (const project of dbProjects) {
      await portfolioService.save("projects", project.id, {
        ...project,
        title: project.title_en,
        description: project.description_en,
      });
    }
    console.log(`✅ ${t("admin.common.migration.migratingProjects")}`);

    // ── 4. Experience ─────────────────────────────────────────────────────────
    console.log(t("admin.common.migration.migratingExperience"));

    const experienceTranslations: Record<number, {
      role_ar: string;
      location_ar: string;
      description_ar: string[];
    }> = {
      1: {
        role_ar: "مطور Full Stack MERN وNext.js",
        location_ar: "عن بُعد",
        description_ar: [
          "طوّرت تطبيقات ويب متكاملة باستخدام MongoDB وExpress وReact وNode.js وNext.js",
          "بنيت تطبيقات محسّنة لمحركات البحث باستخدام Server-Side Rendering (SSR) وStatic Site Generation (SSG)",
          "صممت وصنت RESTful APIs مع مصادقة وتصريح آمنَين",
          "حسّنت أداء التطبيقات ومقاييس Core Web Vitals (LCP وCLS وINP)",
          "نفّذت بنية مكونات نظيفة وقابلة للتوسع",
          "دمجت واجهات برمجية وأدوات تحليلات تابعة لجهات خارجية",
          "تعاونت مع المصممين وأصحاب المصلحة لتسليم حلول جاهزة للإنتاج",
        ],
      },
      2: {
        role_ar: "متخصص SEO (التقني والداخلي)",
        location_ar: "عن بُعد",
        description_ar: [
          "أجريت تدقيقات SEO تقنية شاملة للمواقع والتطبيقات",
          "حسّنت بنية الموقع والروابط الداخلية وهيكل URL",
          "نفّذت البيانات المنظمة Schema.org لتحسين الظهور في نتائج البحث",
          "عزّزت سرعة الصفحة وسهولة الاستخدام على الهواتف المحمولة",
          "تعاونت مع المطورين لضمان تطبيق أفضل ممارسات SEO على مستوى الكود",
          "حسّنت الأداء العضوي من خلال التحسينات التقنية والداخلية",
        ],
      },
    };

    for (const exp of experience) {
      const translation = experienceTranslations[exp.id] || {
        role_ar: exp.role,
        location_ar: exp.location,
        description_ar: exp.description,
      };
      await portfolioService.save("experience", exp.id.toString(), {
        id: exp.id,
        role_en: exp.role,
        role_ar: translation.role_ar,
        company: exp.company,
        period: exp.period,
        location_en: exp.location,
        location_ar: translation.location_ar,
        description_en: exp.description,
        description_ar: translation.description_ar,
      });
    }
    console.log(`✅ ${t("admin.common.migration.migratingExperience")}`);

    // ── 5. Education ──────────────────────────────────────────────────────────
    console.log(t("admin.common.migration.migratingEducation"));

    const educationTranslations: Record<number, {
      degree_ar: string;
      institution_ar: string;
      description_ar: string;
    }> = {
      1: {
        degree_ar: "بكالوريوس هندسة الاتصالات والإلكترونيات",
        institution_ar: "جامعة الإسكندرية",
        description_ar: "تخصّصت في الأنظمة الرقمية ومعالجة الإشارات والأنظمة المدمجة. طوّرت مهارات تحليلية وحل مشكلات قوية قابلة للتطبيق في تطوير البرمجيات.",
      },
    };

    for (const edu of education) {
      const translation = educationTranslations[edu.id] || {
        degree_ar: edu.degree,
        institution_ar: edu.institution,
        description_ar: edu.description,
      };
      await portfolioService.save("education", edu.id.toString(), {
        id: edu.id,
        degree_en: edu.degree,
        degree_ar: translation.degree_ar,
        institution_en: edu.institution,
        institution_ar: translation.institution_ar,
        period: edu.period,
        location: edu.location,
        description_en: edu.description,
        description_ar: translation.description_ar,
      });
    }
    console.log(`✅ ${t("admin.common.migration.migratingEducation")}`);

    // ── 6. Testimonials ───────────────────────────────────────────────────────
    console.log(t("admin.common.migration.migratingTestimonials"));

    const testimonialTranslations: Record<number, {
      role_ar: string;
      content_ar: string;
    }> = {
      1: {
        role_ar: "مديرة التجارة الإلكترونية",
        content_ar: "قام أحمد بتحويل متجرنا القديم على ووردبريس إلى تحفة فنية باستخدام React. تضاعف معدل التحويل لدينا ثلاث مرات، والأداء مذهل حقاً!",
      },
      2: {
        role_ar: "شريك أول",
        content_ar: "بطاقة العمل الرقمية التي صممها أحمد لمكتبي القانوني أنيقة وذات هيبة. إنها أول شيء أعرضه على العملاء، وتترك دائماً انطباعاً رائعاً.",
      },
      3: {
        role_ar: "مدير تقني",
        content_ar: "عمل لا يصدق في كشط البيانات لموقع نايس ون. تعامل أحمد مع جلسات API المعقدة وتجاوز حظر 403 باحترافية عالية. متخصص تقني حقيقي.",
      },
      4: {
        role_ar: "المؤسسة",
        content_ar: "تجاوز التصميم المتميز لمنصة المجوهرات توقعاتنا. الاهتمام بالتفاصيل في واجهة المستخدم والرسوم المتحركة السلسة لا يعلى عليه.",
      },
      5: {
        role_ar: "مدير العمليات",
        content_ar: "تكامل سلس لمجموعات بيانات منتجاتنا في زد. وفر لنا أحمد مئات الساعات من العمل اليدوي بفضل برامج الأتمتة التي طورها.",
      },
      6: {
        role_ar: "مديرة تسويق",
        content_ar: "مهارات عالية في تحسين محركات البحث وتقنيات الويب الحديثة. تم التعامل مع التعريب ثنائي اللغة لمحفظة أعمالنا بشكل مثالي، وحركة المرور العضوية لدينا تنمو يومياً.",
      },
    };

    for (const t of testimonials) {
      const translation = testimonialTranslations[t.id] || {
        role_ar: t.role,
        content_ar: t.content,
      };
      await portfolioService.save("testimonials", t.id.toString(), {
        id: t.id,
        name: t.name,
        role_en: t.role,
        role_ar: translation.role_ar,
        company: t.company,
        content_en: t.content,
        content_ar: translation.content_ar,
        rating: t.rating,
      });
    }
    console.log(`✅ ${t("admin.common.migration.migratingTestimonials")}`);

    // ── 7. SEO Expertise ──────────────────────────────────────────────────────
    console.log(t("admin.common.migration.migratingSEO"));

    const seoTranslations: Record<number, { title_ar: string; description_ar: string }> = {
      1: {
        title_ar: "SEO التقني",
        description_ar: "بنية الموقع، قابلية الزحف والفهرسة، خرائط XML، تحسين robots.txt، والعرض من جانب الخادم لمحركات البحث.",
      },
      2: {
        title_ar: "مقاييس Core Web Vitals",
        description_ar: "تحسين LCP وCLS وINP لتحسين تجربة المستخدم ورفع ترتيب محركات البحث من خلال تدقيقات الأداء والإصلاحات.",
      },
      3: {
        title_ar: "ترميز Schema.org",
        description_ar: "تنفيذ البيانات المنظمة للمقتطفات المنسّقة ولوحات المعلومات وتعزيز الظهور في نتائج البحث لجميع أنواع المحتوى.",
      },
      4: {
        title_ar: "سرعة الصفحة",
        description_ar: "تحسين الصور وتقسيم الكود والتحميل الكسول واستراتيجيات التخزين المؤقت لتحقيق أوقات تحميل سريعة على جميع الأجهزة.",
      },
      5: {
        title_ar: "بنية الموقع",
        description_ar: "هيكل URL والروابط الداخلية والتنقل الهرمي وتنظيم المحتوى لأقصى كفاءة في الزحف.",
      },
      6: {
        title_ar: "تحسين الهواتف المحمولة",
        description_ar: "التصميم المتجاوب والامتثال لفهرسة الهاتف المحمول أولاً وواجهات مريحة باللمس لتجارب جوال سلسة.",
      },
    };

    for (const item of seoExpertise) {
      const translation = seoTranslations[item.id] || {
        title_ar: item.title,
        description_ar: item.description,
      };
      await portfolioService.save("seoExpertise", item.id.toString(), {
        id: item.id,
        title_en: item.title,
        title_ar: translation.title_ar,
        description_en: item.description,
        description_ar: translation.description_ar,
        icon: item.icon,
      });
    }
    console.log(`✅ ${t("admin.common.migration.migratingSEO")}`);

    console.log(`✨ ${t("admin.common.migration.complete")} 🇬🇧🇸🇦`);
    return true;
  } catch (error) {
    console.error(`❌ ${t("admin.common.migration.failed")}:`, error);
    throw error;
  }
};
