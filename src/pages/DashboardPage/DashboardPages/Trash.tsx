import { useTranslation } from "react-i18next";

const Trash = () => {
	const { t } = useTranslation();

	return (
		<div className="section-content">
			<h3>{t("trash")}</h3>
			{/* Adicione aqui o conteúdo específico da seção de lixeira */}
		</div>
	);
};

export default Trash;
