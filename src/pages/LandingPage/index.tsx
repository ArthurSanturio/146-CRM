"use client";

import type React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "../../Styles/HomePage.css";

export default function HomePage() {
	const { t } = useTranslation();
	const [showModal, setShowModal] = useState(false);
	const [newProfile, setNewProfile] = useState({
		name: "",
		group: "",
		proxy: "",
		platform: "Chrome",
		siteLink: "",
	});

	const [profiles, setProfiles] = useState<any[]>([]);

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setNewProfile((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Adiciona o novo perfil à lista existente
		setProfiles((prev) => [...prev, newProfile]);

		// Limpa o formulário e fecha o modal
		setNewProfile({
			name: "",
			group: "",
			proxy: "",
			platform: "Chrome",
			siteLink: "",
		});
		setShowModal(false);
	};

	return (
		<div className="dashboard">
			{/* Sidebar */}
			<div className="sidebar">
				{/* Logo */}
				<div className="logo-container">
					<div className="logo-icon">
						<span>M</span>
					</div>
					<h1 className="logo-text">146</h1>
				</div>

				{/* New Profile Button */}
				<div className="new-profile-container">
					<button className="new-profile-button" onClick={handleOpenModal}>
						{t("newProfile")}
						<span className="add-icon">⊕</span>
					</button>
				</div>

				{/* Navigation */}
				<nav className="sidebar-nav">
					<div className="nav-section">
						<div className="nav-item active">
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

						<div className="nav-item">
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

						<div className="nav-item">
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

						<div className="nav-item">
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

						<div className="nav-item">
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

					<div className="nav-section products-section">
						<div className="section-header">
							<span>{t("products")}</span>
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
						</div>
						<div className="nav-item">
							<span className="nav-icon">🅰️</span>
							<span className="nav-text">{t("productA")}</span>
						</div>
						<div className="nav-item">
							<span className="nav-icon">🅱️</span>
							<span className="nav-text">{t("productB")}</span>
						</div>
						<div className="nav-item">
							<span className="nav-icon">🅲️</span>
							<span className="nav-text">{t("productC")}</span>
						</div>
					</div>
				</nav>

				{/* Premium Banner */}
				<div className="premium-banner">
					<div className="premium-header">
						<span className="premium-title">{t("getMoreFeatures")}</span>
						<span className="premium-icon">🔆</span>
					</div>
					<p className="premium-description">{t("premiumDescription")}</p>
					<div className="premium-actions">
						<button className="btn-outline">{t("tryFree")}</button>
						<button className="btn-primary">{t("upgrade")}</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="main-content">
				{/* Header */}
				<header className="main-header">
					<div className="header-title">
						<h2>{t("profiles")}</h2>
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
						<div className="notification-icon blue">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="white"
								strokeWidth="2"
							>
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
								<circle cx="12" cy="7" r="4" />
							</svg>
						</div>
						<button className="download-button">
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
							{t("downloadClient")}
						</button>
						<button className="menu-button">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M3 6h18M3 12h18M3 18h18" />
							</svg>
						</button>
						<div className="user-profile">
							<div className="user-avatar">T</div>
							<span className="user-name">testborderless...</span>
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
						</div>
					</div>
				</header>

				{/* Warning Alert */}
				<div className="warning-alert">
					<div className="alert-content">
						<span className="alert-icon">⚠</span>
						<span className="alert-message">{t("passwordWarning")}</span>
					</div>
					<div className="alert-actions">
						<button className="btn-warning">{t("setPassword")}</button>
						<span className="alert-pagination">1/2</span>
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
					</div>
				</div>

				{/* Profiles Grid */}
				<div className="profiles-grid">
					{profiles.map((profile, index) => (
						<div key={index} className="profile-card">
							<div className="profile-header">
								<div className="profile-icon">
									<span>{profile.name.charAt(0)}</span>
								</div>
								<div className="profile-info">
									<h3>{profile.name}</h3>
									<span className="profile-group">{profile.group}</span>
								</div>
								<div className="profile-actions">
									<button className="action-button">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M12 20h9" />
											<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
										</svg>
									</button>
									<button className="action-button">
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
										>
											<path d="M3 6h18M3 12h18M3 18h18" />
										</svg>
									</button>
								</div>
							</div>
							<div className="profile-details">
								<div className="detail-item">
									<span className="detail-label">{t("platform")}</span>
									<span className="detail-value">{profile.platform}</span>
								</div>
								<div className="detail-item">
									<span className="detail-label">{t("proxy")}</span>
									<span className="detail-value">{profile.proxy}</span>
								</div>
								<div className="detail-item">
									<span className="detail-label">{t("siteLink")}</span>
									<span className="detail-value">{profile.siteLink}</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* New Profile Modal */}
			{showModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<div className="modal-header">
							<h2>{t("newProfile")}</h2>
							<button className="close-button" onClick={handleCloseModal}>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						</div>
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label htmlFor="name">{t("name")}</label>
								<input
									type="text"
									id="name"
									name="name"
									value={newProfile.name}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="group">{t("group")}</label>
								<input
									type="text"
									id="group"
									name="group"
									value={newProfile.group}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="proxy">{t("proxy")}</label>
								<input
									type="text"
									id="proxy"
									name="proxy"
									value={newProfile.proxy}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="form-group">
								<label htmlFor="platform">{t("platform")}</label>
								<select
									id="platform"
									name="platform"
									value={newProfile.platform}
									onChange={handleInputChange}
									required
								>
									<option value="Chrome">Chrome</option>
									<option value="Firefox">Firefox</option>
									<option value="Safari">Safari</option>
								</select>
							</div>
							<div className="form-group">
								<label htmlFor="siteLink">{t("siteLink")}</label>
								<input
									type="url"
									id="siteLink"
									name="siteLink"
									value={newProfile.siteLink}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="modal-actions">
								<button
									type="button"
									className="btn-secondary"
									onClick={handleCloseModal}
								>
									{t("cancel")}
								</button>
								<button type="submit" className="btn-primary">
									{t("create")}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
