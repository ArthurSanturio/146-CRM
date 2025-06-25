import { useTranslation } from "react-i18next";

const Features = () => {
	const { t } = useTranslation();

	const featuresList = [
		{
			id: 1,
			icon: "🛡️",
			title: t("featuresSection.antiDetection.title"),
			description: t("featuresSection.antiDetection.description"),
		},
		{
			id: 2,
			icon: "🚀",
			title: t("featuresSection.teamCollaboration.title"),
			description: t("featuresSection.teamCollaboration.description"),
		},
		{
			id: 3,
			icon: "🔄",
			title: t("featuresSection.automation.title"),
			description: t("featuresSection.automation.description"),
		},
		{
			id: 4,
			icon: "🌐",
			title: t("featuresSection.proxyIntegration.title"),
			description: t("featuresSection.proxyIntegration.description"),
		},
		{
			id: 5,
			icon: "📱",
			title: t("featuresSection.mobileSimulation.title"),
			description: t("featuresSection.mobileSimulation.description"),
		},
		{
			id: 6,
			icon: "🔒",
			title: t("featuresSection.cookies.title"),
			description: t("featuresSection.cookies.description"),
		},
	];

	return (
		<section className="features section" id="features">
			<div className="container">
				<h2 className="section-title">{t("featuresSection.sectionTitle")}</h2>
				<p className="section-subtitle">
					{t("featuresSection.sectionSubtitle")}
				</p>

				<div className="features-grid">
					{featuresList.map((feature) => (
						<div className="feature-card" key={feature.id}>
							<div className="feature-icon">{feature.icon}</div>
							<h3 className="feature-title">{feature.title}</h3>
							<p className="feature-description">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
