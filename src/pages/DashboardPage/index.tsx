"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseconfig";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "../../Styles/HomePage.css";

// Importando os componentes das seções
import Profiles from "./DashboardPages/Profiles";
import Groups from "./DashboardPages/Groups";
import Proxies from "./DashboardPages/Proxies";
import Extensions from "./DashboardPages/Extensions";
import Trash from "./DashboardPages/Trash";
import ProdutoA from "./DashboardPages/ProdutoA";
import ProdutoB from "./DashboardPages/ProdutoB";
import ProdutoC from "./DashboardPages/ProdutoC";
import NewProfile from "./DashboardPages/NewProfile";

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
	role: string;
}

export default function DashboardPage() {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const [userData, setUserData] = useState<UserData | null>(null);
	const [activeSection, setActiveSection] = useState("profiles");
	const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
	const navigate = useNavigate();
	const previousSection = useRef(activeSection);

	useEffect(() => {
		const storedUserData = localStorage.getItem("userData");
		if (storedUserData) {
			setUserData(JSON.parse(storedUserData));
		}
	}, []);

	// Efeito para lidar com mudanças de parâmetros de URL
	useEffect(() => {
		const sectionFromUrl = searchParams.get("section");

		if (sectionFromUrl && sectionFromUrl !== previousSection.current) {
			// Se a seção mudou, verificar se precisa limpar parâmetros
			if (sectionFromUrl !== "profiles") {
				const url = new URL(window.location.href);
				url.searchParams.delete("group");
				window.history.replaceState({}, "", url.toString());
			}
			setActiveSection(sectionFromUrl);
			previousSection.current = sectionFromUrl;
		}
	}, [searchParams]);

	const handleOpenModal = () => {
		setActiveSection("newProfile");
	};

	const handleSectionChange = (section: string) => {
		// Atualizar URL primeiro
		const url = new URL(window.location.href);
		url.searchParams.set("section", section);

		// Se não for a seção de profiles, limpar parâmetros específicos de profiles
		if (section !== "profiles") {
			url.searchParams.delete("group");
		}

		// Atualizar a URL
		window.history.replaceState({}, "", url.toString());

		// Atualizar o estado local
		setActiveSection(section);
		previousSection.current = section;
	};

	const handleProfileDropdown = () => {
		setProfileDropdownOpen((open) => !open);
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			localStorage.clear();
			navigate("/login");
		} catch (err) {
			console.error("Erro ao deslogar do Firebase:", err);
		}
	};

	// Função para renderizar o componente correto baseado na seção ativa
	const renderSection = () => {
		switch (activeSection) {
			case "profiles":
				return <Profiles />;
			case "groups":
				return <Groups />;
			case "proxies":
				return <Proxies />;
			case "extensions":
				return <Extensions />;
			case "trash":
				return <Trash />;
			case "productA":
				return <ProdutoA />;
			case "productB":
				return <ProdutoB />;
			case "productC":
				return <ProdutoC />;
			case "newProfile":
				return <NewProfile />;
			case "settings":
				return (
					<div style={{ color: "#fff", padding: 32 }}>
						Configurações (em breve)
					</div>
				);
			default:
				return <Profiles />;
		}
	};

	return (
		<div className="dashboard">
			<Sidebar
				onNewProfileClick={handleOpenModal}
				onSectionChange={handleSectionChange}
				activeSection={activeSection}
				role={userData?.role}
			/>

			{/* Main Content */}
			<div className="main-content">
				{/* Header */}
				<header className="main-header">
					<div className="header-title">
						<h2>{t(activeSection)}</h2>
					</div>
					<div className="header-actions">
						<div className="notification-icon orange">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="white"
								strokeWidth="2"
							>
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
								<path d="M13.73 21a2 2 0 0 1-3.46 0" />
							</svg>
						</div>
						<div
							className="user-profile"
							style={{ position: "relative" }}
							onClick={handleProfileDropdown}
						>
							<div className="user-avatar">
								{userData?.firstName?.[0] || "U"}
							</div>
							<span className="user-name">
								{userData
									? `${userData.firstName} ${userData.lastName}`
									: "User"}
							</span>
							<span className="dropdown-icon">
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
							{profileDropdownOpen && (
								<div
									style={{
										position: "absolute",
										top: "calc(100% + 8px)",
										right: 0,
										background: "#23262F",
										borderRadius: 8,
										boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
										padding: "12px 0",
										zIndex: 100,
										minWidth: 140,
									}}
								>
									<button
										style={{
											display: "block",
											width: "100%",
											background: "none",
											border: "none",
											color: "#fff",
											padding: "10px 20px",
											textAlign: "left",
											fontSize: 15,
											cursor: "pointer",
										}}
										onClick={(e) => {
											e.stopPropagation();
											setActiveSection("settings");
											setProfileDropdownOpen(false);
										}}
									>
										{t("settings", "Configurações")}
									</button>
									<button
										style={{
											display: "block",
											width: "100%",
											background: "none",
											border: "none",
											color: "#fff",
											padding: "10px 20px",
											textAlign: "left",
											fontSize: 14,
											cursor: "pointer",
										}}
										onClick={(e) => {
											e.stopPropagation();
											handleLogout();
										}}
									>
										{t("logout", "Sair")}
									</button>
								</div>
							)}
						</div>
					</div>
				</header>

				{/* Renderiza o componente da seção ativa */}
				{renderSection()}
			</div>
		</div>
	);
}
