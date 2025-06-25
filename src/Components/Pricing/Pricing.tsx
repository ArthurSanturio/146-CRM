import { useState } from "react";
import { useTranslation } from "react-i18next";

const Pricing = () => {
	const { t } = useTranslation();
	const [billingCycle, setBillingCycle] = useState("monthly");

	const plans = [
		{
			id: 1,
			name: t("pricingSection.plans.individual.name"),
			monthlyPrice: 19,
			yearlyPrice: 190,
			popular: false,
			features: [
				t("pricingSection.plans.individual.features.profiles"),
				t("pricingSection.plans.individual.features.basicProtection"),
				t("pricingSection.plans.individual.features.cookieManagement"),
				t("pricingSection.plans.individual.features.basicProxy"),
				t("pricingSection.plans.individual.features.emailSupport"),
			],
		},
		{
			id: 2,
			name: t("pricingSection.plans.team.name"),
			monthlyPrice: 49,
			yearlyPrice: 490,
			popular: true,
			features: [
				t("pricingSection.plans.team.features.profiles"),
				t("pricingSection.plans.team.features.advancedProtection"),
				t("pricingSection.plans.team.features.teamCollaboration"),
				t("pricingSection.plans.team.features.apiAccess"),
				t("pricingSection.plans.team.features.customProxy"),
				t("pricingSection.plans.team.features.priorityEmail"),
				t("pricingSection.plans.team.features.automationTools"),
			],
		},
		{
			id: 3,
			name: t("pricingSection.plans.enterprise.name"),
			monthlyPrice: 99,
			yearlyPrice: 990,
			popular: false,
			features: [
				t("pricingSection.plans.enterprise.features.profiles"),
				t("pricingSection.plans.enterprise.features.premiumProtection"),
				t("pricingSection.plans.enterprise.features.advancedTeam"),
				t("pricingSection.plans.enterprise.features.fullApi"),
				t("pricingSection.plans.enterprise.features.advancedAutomation"),
				t("pricingSection.plans.enterprise.features.customIntegrations"),
				t("pricingSection.plans.enterprise.features.priority247"),
				t("pricingSection.plans.enterprise.features.dedicatedManager"),
			],
		},
	];

	return (
		<section className="pricing section" id="pricing">
			<div className="container">
				<h2 className="section-title section-title2">
					{t("pricingSection.sectionTitle")}
				</h2>
				<p className="section-subtitle2">
					{t("pricingSection.sectionSubtitle")}
				</p>

				<div className="pricing-toggle">
					<span
						className={`toggle-option ${
							billingCycle === "monthly" ? "active" : ""
						}`}
						onClick={() => setBillingCycle("monthly")}
					>
						{t("pricingSection.billing.monthly")}
					</span>
					<span className="toggle-label">|</span>
					<span
						className={`toggle-option ${
							billingCycle === "yearly" ? "active" : ""
						}`}
						onClick={() => setBillingCycle("yearly")}
					>
						{t("pricingSection.billing.yearly")}
					</span>
				</div>

				<div className="pricing-plans">
					{plans.map((plan) => (
						<div
							className={`pricing-plan ${plan.popular ? "popular" : ""}`}
							key={plan.id}
						>
							{plan.popular && (
								<div className="popular-badge">
									{t("pricingSection.popularBadge")}
								</div>
							)}
							<h3 className="plan-name">{plan.name}</h3>
							<div className="plan-price">
								R$
								{billingCycle === "monthly"
									? plan.monthlyPrice
									: plan.yearlyPrice}
								<span>
									/
									{billingCycle === "monthly"
										? t("pricingSection.billing.perMonth")
										: t("pricingSection.billing.perYear")}
								</span>
							</div>
							<ul className="plan-features">
								{plan.features.map((feature, index) => (
									<li key={index}>{feature}</li>
								))}
							</ul>
							<a
								href="/"
								className={`btn ${
									plan.popular ? "btn-primary" : "btn-secondary"
								} plan-cta`}
							>
								{t("pricingSection.startNow")}
							</a>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Pricing;
