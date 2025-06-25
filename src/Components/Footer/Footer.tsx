import { useTranslation } from "react-i18next";
import "../../App.css";

function Footer() {
	const { t } = useTranslation();

	return (
		<footer className="footer">
			<div className="footer-content">
				<p>
					&copy; {new Date().getFullYear()} {t("companyName")}.{" "}
					{t("allRightsReserved")}
				</p>
				<nav className="footer-nav">
					<a href="#hero">{t("home")}</a>
					<a href="#features">{t("features")}</a>
					<a href="#testimonials">{t("testimonials")}</a>
					<a href="#pricing">{t("pricing")}</a>
				</nav>
			</div>
		</footer>
	);
}

export default Footer;
