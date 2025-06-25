import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const TABS = [
	{ key: "general", label: "General" },
	{ key: "apoderado", label: "Apoderado" },
	{ key: "plataforma", label: "Plataforma" },
	{ key: "huella", label: "Huella dactilar" },
	{ key: "avanzado", label: "Avanzado" },
];

const browserKernels = [
	{ key: "sun", label: "SunBrowser" },
	{ key: "flower", label: "FlowerBrowser" },
];

const osOptions = [
	{ key: "windows", label: "Windows" },
	{ key: "mac", label: "Mac" },
	{ key: "linux", label: "Linux" },
	{ key: "android", label: "Android" },
	{ key: "ios", label: "iOS" },
];

const groupOptions = [
	{ key: "none", label: "No agrupado" },
	{ key: "group1", label: "Grupo 1" },
	{ key: "group2", label: "Grupo 2" },
];

const NewProfile = () => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("general");
	const [formData, setFormData] = useState({
		name: "",
		browserKernel: "sun",
		os: "windows",
		userAgent: "",
		group: "none",
		tag: "",
		cookie: "",
		observation: "",
	});

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleTabClick = (key: string) => setActiveTab(key);

	const handleKernelSelect = (key: string) =>
		setFormData((prev) => ({ ...prev, browserKernel: key }));

	const handleOsSelect = (key: string) =>
		setFormData((prev) => ({ ...prev, os: key }));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement profile creation logic
		console.log("Form submitted:", formData);
	};

	return (
		<div className="section-content" style={{ borderRadius: 12, padding: 24 }}>
			<div style={{ margin: "0 auto" }}>
				{/* Tabs */}
				<div
					style={{
						display: "flex",
						borderBottom: "1px solid #23262F",
						marginBottom: 32,
					}}
				>
					{TABS.map((tab) => (
						<button
							key={tab.key}
							onClick={() => handleTabClick(tab.key)}
							style={{
								background: "none",
								border: "none",
								color: activeTab === tab.key ? "#fff" : "#888",
								fontWeight: 600,
								fontSize: 18,
								padding: "12px 32px 10px 0",
								borderBottom:
									activeTab === tab.key
										? "3px solid #2563eb"
										: "3px solid transparent",
								cursor: "pointer",
								outline: "none",
								marginRight: 24,
							}}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab Content */}
				{activeTab === "general" && (
					<form
						onSubmit={handleSubmit}
						style={{ display: "flex", flexDirection: "column", gap: 24 }}
					>
						{/* Nome */}
						<div>
							<label style={{ color: "#aaa", fontWeight: 500 }}>
								{t("profilesPage.name")}
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								placeholder="Opcional: nombre del perfil"
								maxLength={100}
								style={{
									width: "100%",
									padding: "12px 16px",
									borderRadius: 8,
									border: "1px solid #23262F",
									background: "#181A20",
									color: "#fff",
									fontSize: 16,
									outline: "none",
									marginTop: 6,
								}}
							/>
						</div>

						{/* Browser Kernel */}
						<div>
							<label
								style={{
									color: "#aaa",
									fontWeight: 500,
									marginBottom: 8,
									display: "block",
								}}
							>
								Browser Kernel
							</label>
							<div style={{ display: "flex", gap: 16 }}>
								{browserKernels.map((kernel) => (
									<button
										key={kernel.key}
										type="button"
										onClick={() => handleKernelSelect(kernel.key)}
										style={{
											background:
												formData.browserKernel === kernel.key
													? "#2563eb"
													: "#23262F",
											color:
												formData.browserKernel === kernel.key ? "#fff" : "#aaa",
											border: "none",
											borderRadius: 8,
											padding: "10px 24px",
											fontWeight: 600,
											fontSize: 16,
											cursor: "pointer",
										}}
									>
										{kernel.label}
									</button>
								))}
							</div>
						</div>

						{/* Sistema Operativo */}
						<div>
							<label
								style={{
									color: "#aaa",
									fontWeight: 500,
									marginBottom: 8,
									display: "block",
								}}
							>
								Sistema operativo
							</label>
							<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
								{osOptions.map((os) => (
									<button
										key={os.key}
										type="button"
										onClick={() => handleOsSelect(os.key)}
										style={{
											background:
												formData.os === os.key ? "#2563eb" : "#23262F",
											color: formData.os === os.key ? "#fff" : "#aaa",
											border: "none",
											borderRadius: 8,
											padding: "10px 18px",
											fontWeight: 600,
											fontSize: 15,
											cursor: "pointer",
										}}
									>
										{os.label}
									</button>
								))}
							</div>
						</div>

						{/* User-Agent */}
						<div>
							<label style={{ color: "#aaa", fontWeight: 500 }}>
								{"User-Agent"}
							</label>
							<input
								type="text"
								name="userAgent"
								value={formData.userAgent}
								onChange={handleInputChange}
								placeholder="User-Agent"
								style={{
									width: "100%",
									padding: "12px 16px",
									borderRadius: 8,
									border: "1px solid #23262F",
									background: "#181A20",
									color: "#fff",
									fontSize: 16,
									outline: "none",
									marginTop: 6,
								}}
							/>
						</div>

						{/* Grupo e Tags */}
						<div style={{ display: "flex", gap: 16 }}>
							<div style={{ flex: 1 }}>
								<label style={{ color: "#aaa", fontWeight: 500 }}>
									{"Grupo"}
								</label>
								<select
									name="group"
									value={formData.group}
									onChange={handleInputChange}
									style={{
										width: "100%",
										padding: "12px 16px",
										borderRadius: 8,
										border: "1px solid #23262F",
										background: "#181A20",
										color: "#fff",
										fontSize: 16,
										outline: "none",
										marginTop: 6,
									}}
								>
									{groupOptions.map((g) => (
										<option key={g.key} value={g.key}>
											{g.label}
										</option>
									))}
								</select>
							</div>
							<div style={{ flex: 1 }}>
								<label style={{ color: "#aaa", fontWeight: 500 }}>
									{"Tags"}
								</label>
								<input
									type="text"
									name="tag"
									value={formData.tag}
									onChange={handleInputChange}
									placeholder="Tags"
									style={{
										width: "100%",
										padding: "12px 16px",
										borderRadius: 8,
										border: "1px solid #23262F",
										background: "#181A20",
										color: "#fff",
										fontSize: 16,
										outline: "none",
										marginTop: 6,
									}}
								/>
							</div>
						</div>

						{/* Cookie */}
						<div>
							<label style={{ color: "#aaa", fontWeight: 500 }}>
								{"Cookie"}
							</label>
							<input
								type="text"
								name="cookie"
								value={formData.cookie}
								onChange={handleInputChange}
								placeholder="Formatos: JSON, Netscape, Nombre=Valor"
								style={{
									width: "100%",
									padding: "12px 16px",
									borderRadius: 8,
									border: "1px solid #23262F",
									background: "#181A20",
									color: "#fff",
									fontSize: 16,
									outline: "none",
									marginTop: 6,
								}}
							/>
						</div>

						{/* Observação */}
						<div>
							<label style={{ color: "#aaa", fontWeight: 500 }}>
								{t("profilesPage.observation")}
							</label>
							<textarea
								name="observation"
								value={formData.observation}
								onChange={handleInputChange}
								rows={3}
								placeholder="Introducir notas"
								style={{
									width: "100%",
									padding: "12px 16px",
									borderRadius: 8,
									border: "1px solid #23262F",
									background: "#181A20",
									color: "#fff",
									fontSize: 16,
									outline: "none",
									marginTop: 6,
									resize: "vertical",
								}}
							/>
						</div>

						{/* Actions */}
						<div style={{ display: "flex", gap: 16, marginTop: 24 }}>
							<button
								type="submit"
								className="btn-primary"
								style={{
									padding: "12px 32px",
									borderRadius: 8,
									border: "none",
									background: "#2563eb",
									color: "#fff",
									fontSize: 16,
									fontWeight: 600,
									cursor: "pointer",
								}}
							>
								{t("create")}
							</button>
							<button
								type="button"
								className="btn-secondary"
								style={{
									padding: "12px 32px",
									borderRadius: 8,
									border: "1px solid #23262F",
									background: "transparent",
									color: "#fff",
									fontSize: 16,
									fontWeight: 600,
									cursor: "pointer",
								}}
							>
								{t("cancel")}
							</button>
						</div>
					</form>
				)}
				{/* Outras abas (placeholder) */}
				{activeTab !== "general" && (
					<div style={{ color: "#888", padding: 48, textAlign: "center" }}>
						{TABS.find((t) => t.key === activeTab)?.label} (em breve)
					</div>
				)}
			</div>
		</div>
	);
};

export default NewProfile;
