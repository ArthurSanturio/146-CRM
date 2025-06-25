import { useTranslation } from "react-i18next";

const Hero = () => {
	const { t } = useTranslation();

	return (
		<section className="hero" id="hero">
			<div className="container hero-container">
				<div className="hero-content">
					<h1 className="hero-title">{t("hero.title")}</h1>
					<p className="hero-subtitle">{t("hero.subtitle")}</p>
					<div className="hero-buttons">
						<a href="/" className="btn btn-accent">
							{t("hero.downloadNow")}
						</a>
						<a href="/" className="btn btn-secondary">
							{t("hero.learnMore")}
						</a>
					</div>
					<div className="hero-users">
						<p>{t("hero.trustedBy")}</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
