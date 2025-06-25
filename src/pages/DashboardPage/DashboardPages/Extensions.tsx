import React from "react";
import { useTranslation } from "react-i18next";

const Extensions = () => {
	const { t } = useTranslation();

	return (
		<div className="section-content">
			<h3>{t("extensions")}</h3>
			{/* Adicione aqui o conteúdo específico da seção de extensões */}
		</div>
	);
};

export default Extensions;
