import { useTranslation } from "react-i18next";

const Testimonials = () => {
	const { t } = useTranslation();

	const testimonialsList = [
		{
			id: 1,
			text: t("testimonials.testimonial1.text"),
			name: t("testimonials.testimonial1.name"),
			role: t("testimonials.testimonial1.role"),
			avatar: "/testimonial-1.png",
		},
		{
			id: 2,
			text: t("testimonials.testimonial2.text"),
			name: t("testimonials.testimonial2.name"),
			role: t("testimonials.testimonial2.role"),
			avatar: "/testimonial-2.png",
		},
		{
			id: 3,
			text: t("testimonials.testimonial3.text"),
			name: t("testimonials.testimonial3.name"),
			role: t("testimonials.testimonial3.role"),
			avatar: "/testimonial-3.png",
		},
	];

	return (
		<section className="testimonials section" id="testimonials">
			<div className="container">
				<h2 className="section-title">{t("testimonials.sectionTitle")}</h2>
				<p className="section-subtitle">{t("testimonials.sectionSubtitle")}</p>

				<div className="testimonials-grid">
					{testimonialsList.map((testimonial) => (
						<div className="testimonial-card" key={testimonial.id}>
							<p className="testimonial-text">{testimonial.text}</p>
							<div className="testimonial-author">
								<img
									src={testimonial.avatar}
									alt={testimonial.name}
									className="testimonial-avatar"
								/>
								<div className="testimonial-info">
									<h4>{testimonial.name}</h4>
									<p>{testimonial.role}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
