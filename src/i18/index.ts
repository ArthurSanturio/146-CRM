import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pt from "./pt.json";
import es from "./es.json";
import en from "./en.json";
import fr from "./fr.json";
import zh from "./zh.json";

// Recursos de tradução
const resources = {
	pt: { translation: pt },
	es: { translation: es },
	en: { translation: en },
	fr: { translation: fr },
	zh: { translation: zh },
};

// Inicializa i18next
i18n.use(initReactI18next).init({
	resources,
	lng: localStorage.getItem("language") || "pt", // Usa o idioma salvo ou pt
	fallbackLng: "en",
	interpolation: {
		escapeValue: false, // React já escapa os valores
	},
});

export default i18n;
