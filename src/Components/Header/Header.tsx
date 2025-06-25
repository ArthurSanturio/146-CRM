import React from "react";
import { useTranslation } from "react-i18next";

type HeaderProps = {
	language: string;
	setLanguage: (lang: string) => void;
};

const Header: React.FC<HeaderProps> = ({ setLanguage }) => {
	const { t, i18n } = useTranslation();
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] =
		React.useState(false);

	const languages = [
		{ code: "en", name: "English" },
		{ code: "pt", name: "Português" },
		{ code: "es", name: "Español" },
		{ code: "fr", name: "Français" },
		{ code: "zh", name: "中文" },
	];

	const handleLanguageChange = (code: string) => {
		i18n.changeLanguage(code);
		localStorage.setItem("language", code);
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

				<nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
					<a href="#features" className="nav-link">
						{t("features")}
					</a>
					<a href="#pricing" className="nav-link">
						{t("pricing")}
					</a>
					<a href="#faq" className="nav-link">
						{t("faq")}
					</a>
					<a href="#blog" className="nav-link">
						{t("blog")}
					</a>
					<a href="#contact" className="nav-link">
						{t("contact")}
					</a>
				</nav>

				<div className="header-actions">
					<div
						className="language-selector"
						onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
						style={{ cursor: "pointer", position: "relative" }}
					>
						{languages.find((lang) => lang.code === i18n.language)?.name}
						<span className="dropdown-icon"> ▼ </span>

						{isLanguageDropdownOpen && (
							<div
								className="language-dropdown"
								style={{
									position: "absolute",
									top: "100%",
									background: "#fff",
									border: "1px solid #ccc",
									boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
									zIndex: 1000,
								}}
							>
								{languages.map((lang) => (
									<div
										key={lang.code}
										className="language-option"
										onClick={() => handleLanguageChange(lang.code)}
										style={{
											padding: "8px 12px",
											cursor: "pointer",
											whiteSpace: "nowrap",
										}}
									>
										{lang.name}
									</div>
								))}
							</div>
						)}
					</div>

					<a href="/login" className="btn btn-secondary">
						{t("login")}
					</a>
					<a href="/register" className="btn btn-primary">
						{t("register")}
					</a>

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
