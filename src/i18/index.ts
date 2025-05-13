import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// Recursos de tradução
const resources = {
    pt: {
        translation: {
            // Navegação
            newProfile: "Novo perfil",
            profiles: "Perfis",
            groups: "Grupos",
            proxies: "Proxies",
            extensions: "Extensões",
            trash: "Lixeira",

            // Automação
            automation: "Automação",
            synchronizer: "Sincronizador",
            rpa: "RPA",
            api: "API",

            // Premium
            getMoreFeatures: "Obtenha mais recursos",
            premiumDescription:
                "Sincronização de dados entre dispositivos, colaboração em equipe e outros recursos avançados.",
            tryFree: "Try Free",
            upgrade: "Atualizar",

            // Header
            downloadClient: "Baixar cliente",

            // Alertas
            passwordWarning: 'Você não configurou uma senha. Configure-o em "Configurações" o mais rápido possível.',
            setPassword: "Definir senha",

            // Pesquisa
            allGroups: "Todos os grupos",
            searchPlaceholder: "Pesquisa ou novos critérios de pesquisa",

            // Ações
            open: "Abrir",

            // Tabela
            name: "Nome",
            group: "Grupo",
            proxy: "Proxy",
            link: "Link",
            platform: "Plataforma",

            // Modal
            createNewProfile: "Criar Novo Perfil",
            profileName: "Nome do Perfil",
            enterProfileName: "Digite o nome do perfil",
            selectGroup: "Selecione um grupo",
            work: "Trabalho",
            personal: "Pessoal",
            marketing: "Marketing",
            proxyOptional: "Proxy (opcional)",
            proxyPlaceholder: "IP:Porta ou deixe em branco",
            siteLink: "Link do site",
            siteLinkPlaceholder: "https://exemplo.com",
            cancel: "Cancelar",
            createProfile: "Criar Perfil",
        },
    },
    en: {
        translation: {
            // Navigation
            newProfile: "New profile",
            profiles: "Profiles",
            groups: "Groups",
            proxies: "Proxies",
            extensions: "Extensions",
            trash: "Trash",

            // Automation
            automation: "Automation",
            synchronizer: "Synchronizer",
            rpa: "RPA",
            api: "API",

            // Premium
            getMoreFeatures: "Get more features",
            premiumDescription: "Data synchronization between devices, team collaboration and other advanced features.",
            tryFree: "Try Free",
            upgrade: "Upgrade",

            // Header
            downloadClient: "Download client",

            // Alerts
            passwordWarning: 'You have not set up a password. Set it up in "Settings" as soon as possible.',
            setPassword: "Set password",

            // Search
            allGroups: "All groups",
            searchPlaceholder: "Search or new search criteria",

            // Actions
            open: "Open",

            // Table
            name: "Name",
            group: "Group",
            proxy: "Proxy",
            link: "Link",
            platform: "Platform",

            // Modal
            createNewProfile: "Create New Profile",
            profileName: "Profile Name",
            enterProfileName: "Enter profile name",
            selectGroup: "Select a group",
            work: "Work",
            personal: "Personal",
            marketing: "Marketing",
            proxyOptional: "Proxy (optional)",
            proxyPlaceholder: "IP:Port or leave blank",
            siteLink: "Site link",
            siteLinkPlaceholder: "https://example.com",
            cancel: "Cancel",
            createProfile: "Create Profile",
        },
    },
}

// Inicializa i18next
i18n.use(initReactI18next).init({
    resources,
    lng: "pt", // Idioma padrão
    fallbackLng: "en",
    interpolation: {
        escapeValue: false, // React já escapa os valores
    },
})

export default i18n
