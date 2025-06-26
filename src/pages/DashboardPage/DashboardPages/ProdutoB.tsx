import { useTranslation } from "react-i18next";

const ProdutoB = () => {
	const { t } = useTranslation();

	return (
		<div className="section-content">
			<h3>{t("Produto B")}</h3>
			{/* Adicione aqui o conteúdo específico do Produto B */}
		</div>
	);
};

export default ProdutoB;
