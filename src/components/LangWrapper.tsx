import { useEffect } from "react";
import { useParams, Outlet, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SUPPORTED_LANGS = ["en", "ar"] as const;
type Lang = typeof SUPPORTED_LANGS[number];

export const LangWrapper = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  const isValidLang = SUPPORTED_LANGS.includes(lang as Lang);

  useEffect(() => {
    if (!isValidLang) return;
    const validLang = lang as Lang;

    // Switch i18n language
    if (i18n.language !== validLang) {
      i18n.changeLanguage(validLang);
    }

    // Set document direction and lang attribute
    document.documentElement.dir = validLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = validLang;
  }, [lang, i18n, isValidLang]);

  if (!isValidLang) {
    return <Navigate to="/en" replace />;
  }

  return <Outlet />;
};
