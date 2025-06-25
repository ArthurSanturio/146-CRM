import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

interface SidebarProps {
	onNewProfileClick: () => void;
	onSectionChange: (section: string) => void;
	activeSection: string;
	role?: string;
}

export default function Sidebar({
	onNewProfileClick,
	onSectionChange,
	activeSection,
	role,
}: SidebarProps) {
	const { t } = useTranslation();
	const [showPremiumBanner, setShowPremiumBanner] = useState(true);
	const [isProductsExpanded, setIsProductsExpanded] = useState(false);

	useEffect(() => {
		// Verificar se o banner deve ser mostrado
		const bannerHidden = localStorage.getItem("premiumBannerHidden");
		if (bannerHidden) {
			setShowPremiumBanner(false);
		}
	}, []);

	const handlePremiumAction = () => {
		// Esconder o banner
		setShowPremiumBanner(false);
		// Salvar no localStorage
		localStorage.setItem("premiumBannerHidden", "true");
	};

	const handleSectionClick = (section: string) => {
		// Se estiver mudando para uma seção diferente de "profiles", limpar parâmetros específicos
		if (section !== "profiles") {
			const url = new URL(window.location.href);
			// Limpar parâmetros que só fazem sentido para profiles
			url.searchParams.delete("group");
			window.history.replaceState({}, "", url.toString());
		}

		onSectionChange(section);
	};

	const toggleProductsSection = () => {
		setIsProductsExpanded(!isProductsExpanded);
	};

	return (
		<div
			className="sidebar"
			style={{ display: "flex", flexDirection: "column", height: "100vh" }}
		>
			{/* Logo */}
			<div className="logo-container">
				<div className="logo-icon">
					<span>M</span>
				</div>
				<h1 className="logo-text">146</h1>
			</div>

			{/* New Profile Button */}
			<div className="new-profile-container">
				<button
					className="new-profile-button custom-new-profile-btn"
					onClick={onNewProfileClick}
				>
					<span className="new-profile-text">{t("newProfile")}</span>
					<span className="new-profile-icon-box">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="3" y="3" width="18" height="18" rx="4" fill="none" />
							<line x1="12" y1="8" x2="12" y2="16" />
							<line x1="8" y1="12" x2="16" y2="12" />
						</svg>
					</span>
				</button>
			</div>

			{/* Navigation */}
			<nav className="sidebar-nav" style={{ flex: 1, overflowY: "auto" }}>
				{role === "client" ? (
					<div className="nav-section">
						<div
							className={`nav-item ${
								activeSection === "profiles" ? "active" : ""
							}`}
							onClick={() => handleSectionClick("profiles")}
						>
							<span className="nav-icon">
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
									<line x1="8" y1="21" x2="16" y2="21" />
									<line x1="12" y1="17" x2="12" y2="21" />
								</svg>
							</span>
							<span className="nav-text">{t("profiles")}</span>
						</div>
					</div>
				) : (
					<>
						<div className="nav-section">
							<div
								className={`nav-item ${
									activeSection === "profiles" ? "active" : ""
								}`}
								onClick={() => handleSectionClick("profiles")}
							>
								<span className="nav-icon">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
										<line x1="8" y1="21" x2="16" y2="21" />
										<line x1="12" y1="17" x2="12" y2="21" />
									</svg>
								</span>
								<span className="nav-text">{t("profiles")}</span>
							</div>

							<div
								className={`nav-item ${
									activeSection === "groups" ? "active" : ""
								}`}
								onClick={() => handleSectionClick("groups")}
							>
								<span className="nav-icon">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M3 6h18M3 12h18M3 18h18" />
									</svg>
								</span>
								<span className="nav-text">{t("groups")}</span>
							</div>

							<div
								className={`nav-item ${
									activeSection === "proxies" ? "active" : ""
								}`}
								onClick={() => handleSectionClick("proxies")}
							>
								<span className="nav-icon">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
									</svg>
								</span>
								<span className="nav-text">{t("proxies")}</span>
							</div>

							<div
								className={`nav-item ${
									activeSection === "extensions" ? "active" : ""
								}`}
								onClick={() => handleSectionClick("extensions")}
							>
								<span className="nav-icon">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M20 14H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z" />
										<path d="M12 14v6" />
										<path d="M8 20h8" />
									</svg>
								</span>
								<span className="nav-text">{t("extensions")}</span>
							</div>

							<div
								className={`nav-item ${
									activeSection === "trash" ? "active" : ""
								}`}
								onClick={() => handleSectionClick("trash")}
							>
								<span className="nav-icon">
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<polyline points="3 6 5 6 21 6" />
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
									</svg>
								</span>
								<span className="nav-text">{t("trash")}</span>
							</div>
						</div>
						<div className="nav-section automation-section">
							<div
								className="section-header"
								onClick={toggleProductsSection}
								style={{ cursor: "pointer" }}
							>
								<span>{t("Produtos")}</span>
								<span
									className="dropdown-icon"
									style={{
										transform: isProductsExpanded
											? "rotate(180deg)"
											: "rotate(0deg)",
										transition: "transform 0.3s ease",
									}}
								>
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<polyline points="6 9 12 15 18 9" />
									</svg>
								</span>
							</div>

							{isProductsExpanded && (
								<>
									<div
										className={`nav-item ${
											activeSection === "produtoA" ? "active" : ""
										}`}
										onClick={() => handleSectionClick("produtoA")}
									>
										<span className="nav-icon">
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											>
												<rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
												<rect
													x="2"
													y="14"
													width="20"
													height="8"
													rx="2"
													ry="2"
												/>
												<line x1="6" y1="6" x2="6" y2="6" />
												<line x1="6" y1="18" x2="6" y2="18" />
											</svg>
										</span>
										<span className="nav-text">{t("Produto A")}</span>
									</div>

									<div
										className={`nav-item ${
											activeSection === "produtoB" ? "active" : ""
										}`}
										onClick={() => handleSectionClick("produtoB")}
									>
										<span className="nav-icon">
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											>
												<rect
													x="2"
													y="3"
													width="20"
													height="14"
													rx="2"
													ry="2"
												/>
												<line x1="8" y1="21" x2="16" y2="21" />
												<line x1="12" y1="17" x2="12" y2="21" />
											</svg>
										</span>
										<span className="nav-text">{t("Produto B")}</span>
									</div>

									<div
										className={`nav-item ${
											activeSection === "produtoC" ? "active" : ""
										}`}
										onClick={() => handleSectionClick("produtoC")}
									>
										<span className="nav-icon">
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
												<circle cx="12" cy="7" r="4" />
											</svg>
										</span>
										<span className="nav-text">{t("Produto C")}</span>
									</div>
								</>
							)}
						</div>
					</>
				)}
			</nav>

			{/* Premium Banner na parte inferior */}
			{showPremiumBanner && (
				<div className="premium-banner" style={{ marginTop: "auto" }}>
					<div className="premium-header">
						<span className="premium-title">{t("getMoreFeatures")}</span>
						<span className="premium-icon">🔆</span>
					</div>
					<p className="premium-description">{t("premiumDescription")}</p>
					<div className="premium-actions">
						<button className="btn-outline" onClick={handlePremiumAction}>
							{t("tryFree")}
						</button>
						<button className="btn-primary" onClick={handlePremiumAction}>
							{t("upgrade")}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
