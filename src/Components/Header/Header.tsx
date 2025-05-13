import { useState } from 'react';

type Props = {
    setLanguage: (lang: string) => void;
    language: string;
};

const Header = ({ language, setLanguage }: Props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'pt', name: 'Português' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'zh', name: '中文' },
    ];

    const handleLanguageChange = (code: string) => {
        setLanguage(code);
        setIsLanguageDropdownOpen(false);
    };

    return (
        <header className="header">
            <div className="container header-container">
                <a href="/" className="logo">
                    <img src="/logo.png" alt="(logo)" />
                    146
                </a>

                <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <a href="#features" className="nav-link">Recursos</a>
                    <a href="#pricing" className="nav-link">Preços</a>
                    <a href="#faq" className="nav-link">FAQ</a>
                    <a href="#blog" className="nav-link">Blog</a>
                    <a href="#contact" className="nav-link">Contato</a>
                </nav>

                <div className="header-actions">
                    <div className="language-selector" onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}>
                        {languages.find(lang => lang.code === language)?.name}
                        <span className="dropdown-icon">▼</span>

                        {isLanguageDropdownOpen && (
                            <div className="language-dropdown">
                                {languages.map((lang) => (
                                    <div
                                        key={lang.code}
                                        className="language-option"
                                        onClick={() => handleLanguageChange(lang.code)}
                                    >
                                        {lang.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <a href="/login" className="btn btn-secondary">Entrar</a>
                    <a href="/register" className="btn btn-primary">Cadastrar</a>

                    <button
                        className="mobile-nav-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        ☰
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
