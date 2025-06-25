import React from "react";
import { useTranslation } from "react-i18next";

const ProdutoC = () => {
	const { t } = useTranslation();

	return (
		<div className="section-content">
			<h3>{t("Produto C")}</h3>
			{/* Adicione aqui o conteúdo específico do Produto C */}
		</div>
	);
};

export default ProdutoC;
