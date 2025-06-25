import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../../firebaseconfig";
import {
	collection,
	query,
	onSnapshot,
	where,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

interface Profile {
	id: string;
	name: string;
	groupId?: string;
	creatorId: string;
	allowedUsers?: string[];
}

interface Group {
	id: string;
	name: string;
	creatorId: string;
	creatorEmail: string;
	profileCount: number;
	createdAt: any;
	allowedUsers: string[];
	emails: string[];
}

interface MockGroup {
	group: string;
	included: number;
	observation: string;
	created: string;
	creator: string;
	emails: string[];
	warning?: boolean;
}

interface UnifiedGroupData {
	id?: string;
	name?: string;
	group?: string;
	creatorId?: string;
	creatorEmail?: string;
	creator?: string;
	profileCount?: number;
	included?: number;
	createdAt?: any;
	created?: string;
	allowedUsers?: string[];
	emails?: string[];
	observation?: string;
	warning?: boolean;
}

const mockData = [
	{
		group: "No agrupado",
		included: 0,
		observation: "-",
		created: "-",
		creator: "Geração predeterminada",
		emails: [],
	},
	{
		group: "Elevenlabs",
		included: 6,
		observation: "-",
		created: "2025-02-18 21:23:10",
		creator: "admin@gmail.com",
		emails: ["admin@gmail.com"],
	},
	{
		group: "ChatGPT pro",
		included: 0,
		observation: "-",
		created: "2025-01-23 19:33:57",
		creator: "admin@gmail.com",
		emails: ["admin@gmail.com"],
	},
	{
		group: "test 1",
		included: 0,
		observation: "-",
		created: "2025-01-23 19:30:10",
		creator: "admin@gmail.com",
		emails: ["admin@gmail.com"],
		warning: true,
	},
	{
		group: "Espacio ViralNetwork Pro",
		included: 0,
		observation: "-",
		created: "2025-01-15 16:06:04",
		creator: "admin@gmail.com",
		emails: ["admin@gmail.com"],
	},
	{
		group: "manutencion herramientas",
		included: 45,
		observation: "-",
		created: "2025-01-14 17:20:57",
		creator: "admin@gmail.com",
		emails: ["admin@gmail.com"],
	},
	{
		group: "grupo herramientas",
		included: 47,
		observation: "-",
		created: "2025-01-14 14:56:39",
		creator: "admin@gmail.com",
		emails: ["admin@gmail.com"],
	},
];

const Groups = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<any>(null);
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [groups, setGroups] = useState<Group[]>([]);
	const [isCreatingGroups, setIsCreatingGroups] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
			setCurrentUser(user);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		// Buscar dados do usuário do localStorage
		const storedUserData = localStorage.getItem("userData");
		if (storedUserData) {
			setUserData(JSON.parse(storedUserData));
		}
	}, []);

	useEffect(() => {
		if (!currentUser) {
			setProfiles([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const profilesRef = collection(db, "profiles");

		// Buscar perfis baseado no role do usuário
		let q;
		if (userData?.role === "client") {
			q = query(
				profilesRef,
				where("allowedUsers", "array-contains", currentUser.uid)
			);
		} else if (userData?.role === "admin") {
			q = query(profilesRef, where("creatorId", "==", currentUser.uid));
		} else {
			q = query(profilesRef);
		}

		const unsubscribe = onSnapshot(
			q,
			(querySnapshot) => {
				const profilesData: Profile[] = [];
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					profilesData.push({
						id: doc.id,
						name: data.name || "Sem nome",
						groupId: data.groupId,
						creatorId: data.creatorId,
						allowedUsers: data.allowedUsers || [],
					});
				});
				setProfiles(profilesData);
				setLoading(false);
			},
			(error) => {
				console.error("Erro ao buscar perfis:", error);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, [currentUser, userData]);

	// Função para buscar grupos existentes
	const fetchExistingGroups = async () => {
		if (!currentUser) return;

		try {
			const groupsRef = collection(db, "groups");
			const q = query(groupsRef, where("creatorId", "==", currentUser.uid));

			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const groupsData: Group[] = [];
				querySnapshot.forEach((doc) => {
					const data = doc.data();
					groupsData.push({
						id: doc.id,
						name: data.name || "",
						creatorId: data.creatorId,
						creatorEmail: data.creatorEmail || "admin@gmail.com", // Usar admin@gmail.com como padrão
						profileCount: data.profileCount || 0,
						createdAt: data.createdAt,
						allowedUsers: data.allowedUsers || [],
						emails: data.emails || ["admin@gmail.com"], // Usar admin@gmail.com como padrão
					});
				});
				setGroups(groupsData);
			});

			return unsubscribe;
		} catch (error) {
			console.error("Erro ao buscar grupos:", error);
		}
	};

	// Carregar grupos existentes quando o usuário estiver autenticado
	useEffect(() => {
		if (currentUser) {
			fetchExistingGroups();
		}
	}, [currentUser]);

	// Recalcular contagens quando perfis mudarem
	useEffect(() => {
		if (profiles.length > 0 && groups.length > 0) {
			recalculateGroupCounts();
		}
	}, [profiles]);

	// Função para recalcular contagens de perfis em grupos
	const recalculateGroupCounts = () => {
		const groupCounts = new Map<string, number>();

		// Contar perfis por grupo
		profiles.forEach((profile) => {
			const groupName = profile.groupId || "Sem grupo";
			groupCounts.set(groupName, (groupCounts.get(groupName) || 0) + 1);
		});

		// Atualizar grupos existentes com as contagens corretas
		const updatedGroups = groups.map((group) => ({
			...group,
			profileCount: groupCounts.get(group.name) || 0,
		}));

		setGroups(updatedGroups);
		return groupCounts;
	};

	const createGroupsFromProfiles = async () => {
		if (!currentUser) {
			alert("Usuário não autenticado");
			return;
		}

		setIsCreatingGroups(true);
		try {
			// Recalcular contagens de perfis por grupo
			const groupCounts = recalculateGroupCounts();

			// Agrupar perfis por grupo para coletar usuários autorizados
			const groupMap = new Map<string, Profile[]>();

			profiles.forEach((profile) => {
				const groupName = profile.groupId || "Sem grupo";
				if (!groupMap.has(groupName)) {
					groupMap.set(groupName, []);
				}
				groupMap.get(groupName)!.push(profile);
			});

			// Criar grupos no Firestore
			const groupsRef = collection(db, "groups");
			const createdGroups: Group[] = [];
			let newGroupsCount = 0;

			for (const [groupName, groupProfiles] of groupMap) {
				// Verificar se o grupo já existe
				const existingGroup = groups.find((g) => g.name === groupName);
				const profileCount = groupCounts.get(groupName) || 0;

				if (existingGroup) {
					// Atualizar contagem de perfis se necessário
					if (existingGroup.profileCount !== profileCount) {
						createdGroups.push({
							...existingGroup,
							profileCount: profileCount,
						});
					} else {
						createdGroups.push(existingGroup);
					}
					continue;
				}

				// Coletar todos os usuários autorizados dos perfis do grupo
				const allAllowedUsers = new Set<string>();
				groupProfiles.forEach((profile) => {
					if (profile.allowedUsers) {
						profile.allowedUsers.forEach((userId) =>
							allAllowedUsers.add(userId)
						);
					}
				});

				// Criar novo grupo com admin@gmail.com como criador
				const newGroup = {
					name: groupName,
					creatorId: currentUser.uid,
					creatorEmail: "admin@gmail.com", // Usar admin@gmail.com como criador
					profileCount: profileCount, // Número de perfis com groupId igual ao nome do grupo
					createdAt: serverTimestamp(),
					allowedUsers: Array.from(allAllowedUsers),
					emails: ["admin@gmail.com"], // Adicionar campo emails
				};

				const docRef = await addDoc(groupsRef, newGroup);
				createdGroups.push({
					id: docRef.id,
					...newGroup,
				});
				newGroupsCount++;
			}

			setGroups(createdGroups);
			alert(
				`Grupos processados com sucesso! ${newGroupsCount} novos grupos criados.`
			);
		} catch (error) {
			console.error("Erro ao criar grupos:", error);
			alert("Erro ao criar grupos: " + error);
		} finally {
			setIsCreatingGroups(false);
		}
	};

	const handleGroupClick = (groupName: string) => {
		// Redirecionar para a página de Profiles com filtro por grupo
		const url = `/dashboard?section=profiles&group=${encodeURIComponent(
			groupName
		)}`;
		navigate(url, { replace: true });
	};

	return (
		<div className="section-content" style={{ borderRadius: 12, padding: 24 }}>
			{/* Header com botão de criação */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 16,
					marginBottom: 16,
					flexWrap: "wrap",
				}}
			>
				<h2 style={{ color: "#fff", margin: 0, fontSize: 20, fontWeight: 600 }}>
					Grupos de Perfis
				</h2>
				{userData?.role === "admin" && (
					<button
						className="btn-primary"
						onClick={createGroupsFromProfiles}
						disabled={isCreatingGroups || profiles.length === 0}
						style={{
							background: "#2563eb",
							color: "#fff",
							border: "none",
							borderRadius: 8,
							padding: "10px 20px",
							fontWeight: 600,
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: 8,
						}}
					>
						{isCreatingGroups ? (
							<>
								<div className="loader" style={{ width: 16, height: 16 }} />
								Criando Grupos...
							</>
						) : (
							<>
								<svg
									width="16"
									height="16"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path d="M12 5v14M5 12h14" />
								</svg>
								Criar Grupos dos Perfis
							</>
						)}
					</button>
				)}
			</div>

			{loading ? (
				<div style={{ textAlign: "center", color: "#fff", padding: "50px" }}>
					Carregando grupos...
				</div>
			) : (
				<div style={{ overflowX: "auto" }}>
					<table
						style={{
							width: "100%",
							borderCollapse: "separate",
							borderSpacing: 0,
							color: "#fff",
						}}
					>
						<thead style={{ background: "#23262F" }}>
							<tr>
								<th
									style={{
										padding: "12px 8px",
										textAlign: "left",
										borderTopLeftRadius: 12,
									}}
								>
									{t("groupsPage.group")}
								</th>
								<th style={{ padding: "12px 8px", textAlign: "left" }}>
									{t("groupsPage.includedProfiles")}
								</th>
								<th style={{ padding: "12px 8px", textAlign: "left" }}>
									{t("groupsPage.observation")}
								</th>
								<th style={{ padding: "12px 8px", textAlign: "left" }}>
									{t("groupsPage.creationTime")}
								</th>
								<th style={{ padding: "12px 8px", textAlign: "left" }}>
									{t("groupsPage.creator")}
								</th>
								<th
									style={{
										padding: "12px 8px",
										textAlign: "left",
										borderTopRightRadius: 12,
									}}
								>
									{t("groupsPage.operation")}
								</th>
							</tr>
						</thead>
						<tbody>
							{/* Usar dados reais dos grupos se disponíveis, senão usar mockData */}
							{(groups.length > 0 ? groups : mockData).map(
								(row: UnifiedGroupData, idx) => {
									// Para dados reais, adaptar a estrutura
									const groupName = row.name || row.group || "";
									const profileCount = row.profileCount || row.included || 0;
									// Sempre usar admin@gmail.com como creator para grupos reais
									const creator =
										groups.length > 0
											? "admin@gmail.com"
											: row.creatorEmail || row.creator || "";
									const createdAt = row.createdAt
										? new Date(row.createdAt.toDate()).toLocaleString("pt-BR")
										: row.created || "";
									// Para grupos reais, usar admin@gmail.com como email
									const emails =
										groups.length > 0 ? ["admin@gmail.com"] : row.emails || [];

									return (
										<tr
											key={idx}
											style={{
												background: "#23262F",
												borderRadius: 12,
												marginBottom: 8,
											}}
										>
											<td
												style={{
													padding: "16px 8px",
													borderBottom: "8px solid #181A20",
													borderTopLeftRadius: idx === 0 ? 12 : 0,
												}}
											>
												<span
													style={{
														display: "flex",
														alignItems: "center",
														gap: 8,
														cursor: profileCount > 0 ? "pointer" : "default",
													}}
													onClick={() => {
														if (profileCount > 0) {
															handleGroupClick(groupName);
														}
													}}
													title={
														profileCount > 0
															? `Ver ${profileCount} perfis deste grupo`
															: "Nenhum perfil neste grupo"
													}
												>
													<input
														type="checkbox"
														style={{ accentColor: "#2563eb" }}
													/>
													<span
														style={{
															color: profileCount > 0 ? "#2563eb" : "#666",
															textDecoration:
																profileCount > 0 ? "underline" : "none",
														}}
													>
														{groupName}
													</span>
													{profileCount > 0 && (
														<span
															style={{
																color: "#059669",
																fontSize: 12,
																background: "#05966920",
																padding: "2px 6px",
																borderRadius: 4,
															}}
														>
															{profileCount} perfis
														</span>
													)}
												</span>
											</td>
											<td
												style={{
													padding: "16px 8px",
													borderBottom: "8px solid #181A20",
												}}
											>
												{profileCount}
											</td>
											<td
												style={{
													padding: "16px 8px",
													borderBottom: "8px solid #181A20",
												}}
											>
												{row.observation || "-"}
											</td>
											<td
												style={{
													padding: "16px 8px",
													borderBottom: "8px solid #181A20",
												}}
											>
												{createdAt}
											</td>
											<td
												style={{
													padding: "16px 8px",
													borderBottom: "8px solid #181A20",
												}}
											>
												<div
													style={{
														display: "flex",
														flexDirection: "column",
														gap: 2,
													}}
												>
													<span>{creator}</span>
													{emails.length > 1 && (
														<span style={{ fontSize: 12, color: "#aaa" }}>
															{emails.join(", ")}
														</span>
													)}
												</div>
											</td>
											<td
												style={{
													padding: "16px 8px",
													borderBottom: "8px solid #181A20",
													borderTopRightRadius: idx === 0 ? 12 : 0,
												}}
											>
												<div style={{ display: "flex", gap: 8 }}>
													<button
														style={{
															background: "#23262F",
															color: "#fff",
															border: "1px solid #393B40",
															borderRadius: 6,
															padding: "6px 18px",
															fontWeight: 600,
															cursor: "pointer",
															display: "flex",
															alignItems: "center",
															gap: 6,
														}}
													>
														<svg
															width="16"
															height="16"
															fill="none"
															stroke="#fff"
															strokeWidth="2"
															viewBox="0 0 24 24"
														>
															<path d="M4 4v5h.582a2 2 0 0 1 1.789 1.106l.618 1.236A2 2 0 0 0 8.778 12.5h6.444a2 2 0 0 0 1.789-1.158l.618-1.236A2 2 0 0 1 19.418 9H20V4" />
															<path d="M12 19v-6" />
														</svg>
														{t("groupsPage.refresh")}
													</button>
													<button
														style={{
															background: "#23262F",
															color: "#fff",
															border: "1px solid #393B40",
															borderRadius: 6,
															padding: "6px 10px",
															fontWeight: 600,
															cursor: "pointer",
														}}
													>
														<svg
															width="18"
															height="18"
															fill="none"
															stroke="#fff"
															strokeWidth="2"
															viewBox="0 0 24 24"
														>
															<circle cx="12" cy="12" r="2" />
															<circle cx="12" cy="12" r="10" />
														</svg>
													</button>
												</div>
											</td>
										</tr>
									);
								}
							)}
						</tbody>
					</table>
				</div>
			)}

			<style>{`
				.loader {
					border: 2px solid #f3f3f3;
					border-top: 2px solid #2563eb;
					border-radius: 50%;
					animation: spin 1s linear infinite;
				}

				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
};

export default Groups;
