import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../../../../firebaseconfig";
import {
	collection,
	query,
	onSnapshot,
	orderBy,
	addDoc,
	serverTimestamp,
	where,
	doc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { FaRocket } from "react-icons/fa";
import {
	FiMoreVertical,
	FiEdit,
	FiTrash,
	FiExternalLink,
} from "react-icons/fi";
import { FaChrome } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

interface Profile {
	id: string;
	name: string;
	tag: string;
	status: string;
	created: string;
	action: string;
	userAgent?: string;
	proxy?: {
		type: string;
		ip: string;
		port: number;
		username: string;
		password: string;
	};
	fingerprint?: {
		timezone: string;
		language: string;
		webRTC: string;
		canvas: string;
		audio: string;
	};
	allowedUsers?: string[];
	tags?: { [key: string]: string[] };
	cookies?: Array<{
		name: string;
		value: string;
		domain: string;
		path: string;
		expires: Date;
	}>;
	lastSessionAt?: any;
	createdAt?: any;
	groupId?: string; // Adicionando campo de grupo
}

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
	role: string;
}

const Profiles = () => {
	const { t } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const groupFilter = searchParams.get("group"); // Pegar o parâmetro de grupo da URL

	const [search, setSearch] = useState("");
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
	const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editName, setEditName] = useState("");
	const [editUserAgent, setEditUserAgent] = useState("");
	const [editProxy, setEditProxy] = useState({
		type: "",
		ip: "",
		port: 0,
		username: "",
		password: "",
	});
	const [editFingerprint, setEditFingerprint] = useState({
		timezone: "",
		language: "",
		webRTC: "",
		canvas: "",
		audio: "",
	});
	const [editAllowedUsers, setEditAllowedUsers] = useState<string[]>([]);
	const [editTags, setEditTags] = useState<{ [key: string]: string[] }>({});
	const [newTag, setNewTag] = useState("");
	const [newAllowedUser, setNewAllowedUser] = useState("");
	const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
	const [allUsers, setAllUsers] = useState<any[]>([]);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [isBrowserModalOpen, setIsBrowserModalOpen] = useState(false);
	const [selectedProfileForBrowser, setSelectedProfileForBrowser] =
		useState<Profile | null>(null);
	const [browserStatus, setBrowserStatus] = useState<
		"idle" | "connecting" | "connected" | "error"
	>("idle");
	const [editingTagId, setEditingTagId] = useState<string | null>(null);
	const [editingTagValue, setEditingTagValue] = useState("");
	const [editGroupId, setEditGroupId] = useState("");

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

		// Construir query baseada no role do usuário e filtro de grupo
		let q;
		const constraints = [];

		// Filtro por grupo se especificado
		if (groupFilter) {
			constraints.push(where("groupId", "==", groupFilter));
		}

		// Filtro por permissões do usuário
		if (userData?.role === "client") {
			constraints.push(
				where("allowedUsers", "array-contains", currentUser.uid)
			);
		} else if (userData?.role === "admin") {
			constraints.push(where("creatorId", "==", currentUser.uid));
		}

		// Ordenação
		constraints.push(orderBy("createdAt", "desc"));

		q = query(profilesRef, ...constraints);

		const unsubscribe = onSnapshot(
			q,
			(querySnapshot) => {
				const profilesData: Profile[] = [];
				querySnapshot.forEach((doc) => {
					const data = doc.data();

					// Para clientes e admins, já filtramos pela query, então todos os perfis retornados são acessíveis
					// Para outros tipos, verificamos se tem acesso (criador ou autorizado)
					let hasAccess = true;
					if (userData?.role !== "client" && userData?.role !== "admin") {
						const allowedUsers = data.allowedUsers || [];
						const isCreator = data.creatorId === currentUser.uid;
						hasAccess = allowedUsers.includes(currentUser.uid) || isCreator;
					}

					if (hasAccess) {
						// Busca as tags do usuário atual
						const userTags = data.tags?.[currentUser.uid] || [];
						const tagDisplay =
							userTags.length > 0
								? userTags.join(", ")
								: data.proxy?.type || "-";

						profilesData.push({
							id: doc.id,
							name: data.name || "Sem nome",
							tag: tagDisplay,
							status: data.status || "offline",
							created: data.createdAt
								? new Date(data.createdAt.toDate()).toLocaleString("pt-BR", {
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
								  })
								: "-",
							action: "Open",
							userAgent: data.userAgent,
							proxy: data.proxy,
							fingerprint: data.fingerprint,
							cookies: data.cookies,
							lastSessionAt: data.lastSessionAt,
							createdAt: data.createdAt,
							allowedUsers: data.allowedUsers,
							tags: data.tags,
							groupId: data.groupId, // Adicionar campo de grupo
						});
					}
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
	}, [currentUser, userData, groupFilter]); // Adicionar groupFilter como dependência

	// Filtro extra para garantir que só aparecem perfis do grupo selecionado
	const filteredData = profiles.filter((row) => {
		const matchSearch = row.name.toLowerCase().includes(search.toLowerCase());
		const matchGroup = !groupFilter || row.groupId === groupFilter;
		return matchSearch && matchGroup;
	});

	const createGlobalProfiles = async () => {
		if (!currentUser) {
			alert("Usuário não autenticado");
			return;
		}

		setIsCreating(true);
		try {
			const profilesRef = collection(db, "profiles");

			const sampleProfiles = [
				{
					name: "Perfil Google ADS 01",
					creatorId: currentUser.uid,
					allowedUsers: ["uid_cliente1", "uid_cliente2"],
					groupId: "Elevenlabs",
					userAgent:
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
					proxy: {
						type: "socks5",
						ip: "192.168.1.100",
						port: 1080,
						username: "proxyuser1",
						password: "proxypass1",
					},
					fingerprint: {
						timezone: "America/Sao_Paulo",
						language: "pt-BR",
						webRTC: "disabled",
						canvas: "spoofed",
						audio: "spoofed",
					},
					cookies: [],
					status: "offline",
					lastSessionAt: null,
					createdAt: serverTimestamp(),
					tags: {
						uid_cliente1: ["google", "ads", "conta1"],
						uid_cliente2: ["projetoX", "teste", "backup"],
					},
				},
				{
					name: "Perfil Facebook Ads 02",
					creatorId: currentUser.uid,
					allowedUsers: ["uid_cliente1", "uid_cliente3"],
					groupId: "Elevenlabs",
					userAgent:
						"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
					proxy: {
						type: "http",
						ip: "192.168.1.101",
						port: 8080,
						username: "proxyuser2",
						password: "proxypass2",
					},
					fingerprint: {
						timezone: "America/New_York",
						language: "en-US",
						webRTC: "disabled",
						canvas: "spoofed",
						audio: "spoofed",
					},
					cookies: [],
					status: "online",
					lastSessionAt: serverTimestamp(),
					createdAt: serverTimestamp(),
					tags: {
						uid_cliente1: ["facebook", "ads", "conta2"],
						uid_cliente3: ["projetoY", "marketing"],
					},
				},
				{
					name: "Perfil Instagram 03",
					creatorId: currentUser.uid,
					allowedUsers: ["uid_cliente2", "uid_cliente4"],
					groupId: "ChatGPT pro",
					userAgent:
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
					proxy: {
						type: "socks5",
						ip: "192.168.1.102",
						port: 1080,
						username: "proxyuser3",
						password: "proxypass3",
					},
					fingerprint: {
						timezone: "Europe/London",
						language: "en-GB",
						webRTC: "disabled",
						canvas: "spoofed",
						audio: "spoofed",
					},
					cookies: [],
					status: "running",
					lastSessionAt: serverTimestamp(),
					createdAt: serverTimestamp(),
					tags: {
						uid_cliente2: ["instagram", "social", "conta3"],
						uid_cliente4: ["projetoZ", "influencer"],
					},
				},
				{
					name: "Perfil LinkedIn 04",
					creatorId: currentUser.uid,
					allowedUsers: ["uid_cliente1", "uid_cliente5"],
					groupId: "manutencion herramientas",
					userAgent:
						"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
					proxy: {
						type: "http",
						ip: "192.168.1.103",
						port: 3128,
						username: "proxyuser4",
						password: "proxypass4",
					},
					fingerprint: {
						timezone: "America/Los_Angeles",
						language: "en-US",
						webRTC: "disabled",
						canvas: "spoofed",
						audio: "spoofed",
					},
					cookies: [],
					status: "offline",
					lastSessionAt: null,
					createdAt: serverTimestamp(),
					tags: {
						uid_cliente1: ["linkedin", "b2b", "conta4"],
						uid_cliente5: ["projetoA", "recrutamento"],
					},
				},
				{
					name: "Perfil Twitter 05",
					creatorId: currentUser.uid,
					allowedUsers: ["uid_cliente2", "uid_cliente6"],
					groupId: "grupo herramientas",
					userAgent:
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
					proxy: {
						type: "socks5",
						ip: "192.168.1.104",
						port: 1080,
						username: "proxyuser5",
						password: "proxypass5",
					},
					fingerprint: {
						timezone: "Asia/Tokyo",
						language: "ja-JP",
						webRTC: "disabled",
						canvas: "spoofed",
						audio: "spoofed",
					},
					cookies: [],
					status: "online",
					lastSessionAt: serverTimestamp(),
					createdAt: serverTimestamp(),
					tags: {
						uid_cliente2: ["twitter", "social", "conta5"],
						uid_cliente6: ["projetoB", "noticias"],
					},
				},
				{
					name: "Perfil TikTok 06",
					creatorId: currentUser.uid,
					allowedUsers: ["uid_cliente3", "uid_cliente7"],
					groupId: "Espacio ViralNetwork Pro",
					userAgent:
						"Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1",
					proxy: {
						type: "http",
						ip: "192.168.1.105",
						port: 8080,
						username: "proxyuser6",
						password: "proxypass6",
					},
					fingerprint: {
						timezone: "Europe/Paris",
						language: "fr-FR",
						webRTC: "disabled",
						canvas: "spoofed",
						audio: "spoofed",
					},
					cookies: [],
					status: "running",
					lastSessionAt: serverTimestamp(),
					createdAt: serverTimestamp(),
					tags: {
						uid_cliente3: ["tiktok", "video", "conta6"],
						uid_cliente7: ["projetoC", "entretenimento"],
					},
				},
				{
					name: "Perfil YouTube 07",
					creatorId: currentUser.uid,
					allowedUsers: ["uid_cliente4", "uid_cliente8"],
					groupId: "manutencion herramientas",
					userAgent:
						"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
					proxy: {
						type: "socks5",
						ip: "192.168.1.106",
						port: 1080,
						username: "proxyuser7",
						password: "proxypass7",
					},
					fingerprint: {
						timezone: "Australia/Sydney",
						language: "en-AU",
						webRTC: "disabled",
						canvas: "spoofed",
						audio: "spoofed",
					},
					cookies: [],
					status: "offline",
					lastSessionAt: null,
					createdAt: serverTimestamp(),
					tags: {
						uid_cliente4: ["youtube", "video", "conta7"],
						uid_cliente8: ["projetoD", "educacao"],
					},
				},
				{
					name: "Perfil Amazon 08",
					creatorId: currentUser.uid,
					allowedUsers: ["uid_cliente5", "uid_cliente9"],
					groupId: "grupo herramientas",
					userAgent:
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
					proxy: {
						type: "http",
						ip: "192.168.1.107",
						port: 3128,
						username: "proxyuser8",
						password: "proxypass8",
					},
					fingerprint: {
						timezone: "America/Chicago",
						language: "en-US",
						webRTC: "disabled",
						canvas: "spoofed",
						audio: "spoofed",
					},
					cookies: [],
					status: "online",
					lastSessionAt: serverTimestamp(),
					createdAt: serverTimestamp(),
					tags: {
						uid_cliente5: ["amazon", "ecommerce", "conta8"],
						uid_cliente9: ["projetoE", "vendas"],
					},
				},
			];

			for (const profile of sampleProfiles) {
				await addDoc(profilesRef, profile);
			}

			alert("8 perfis globais criados com sucesso!");
		} catch (error) {
			console.error("Erro ao criar perfis globais:", error);
			alert("Erro ao criar perfis globais: " + error);
		} finally {
			setIsCreating(false);
		}
	};

	// Função para selecionar/desmarcar todos
	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectedProfiles(filteredData.map((row) => row.id));
		} else {
			setSelectedProfiles([]);
		}
	};

	// Função para selecionar/desmarcar individual
	const handleSelectProfile = (id: string) => {
		setSelectedProfiles((prev) =>
			prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
		);
	};

	// Função para abrir modal de edição
	const handleEditProfile = (profile: Profile) => {
		setEditingProfile(profile);
		setEditName(profile.name || "");
		setEditUserAgent(profile.userAgent || "");
		setEditProxy(
			profile.proxy || {
				type: "",
				ip: "",
				port: 0,
				username: "",
				password: "",
			}
		);
		setEditFingerprint(
			profile.fingerprint || {
				timezone: "",
				language: "",
				webRTC: "",
				canvas: "",
				audio: "",
			}
		);
		setEditAllowedUsers(profile.allowedUsers || []);
		setEditTags(profile.tags || {});
		setEditGroupId(profile.groupId || "");
		setIsEditModalOpen(true);
	};

	// Função para salvar edições
	const handleSaveEdit = async () => {
		if (!editingProfile) return;
		try {
			const profileRef = doc(db, "profiles", editingProfile.id);
			await updateDoc(profileRef, {
				name: editName,
				userAgent: editUserAgent,
				proxy: editProxy,
				fingerprint: editFingerprint,
				allowedUsers: editAllowedUsers,
				tags: editTags,
				groupId: editGroupId || null, // Salvar grupo ou null se vazio
			});
			setIsEditModalOpen(false);
			setEditingProfile(null);
		} catch (error) {
			alert("Erro ao editar perfil: " + error);
		}
	};

	// Funções auxiliares para edição
	const addTag = (userId: string) => {
		if (!newTag.trim()) return;
		setEditTags((prev) => ({
			...prev,
			[userId]: [...(prev[userId] || []), newTag.trim()],
		}));
		setNewTag("");
	};

	const removeTag = (userId: string, tagIndex: number) => {
		setEditTags((prev) => ({
			...prev,
			[userId]: prev[userId]?.filter((_, index) => index !== tagIndex) || [],
		}));
	};

	const addAllowedUser = () => {
		if (!newAllowedUser.trim()) return;
		setEditAllowedUsers((prev) => [...prev, newAllowedUser.trim()]);
		setNewAllowedUser("");
	};

	const removeAllowedUser = (userIndex: number) => {
		setEditAllowedUsers((prev) =>
			prev.filter((_, index) => index !== userIndex)
		);
	};

	// Função para excluir perfil individual
	const handleDeleteProfile = async (profileId: string) => {
		if (window.confirm("Tem certeza que deseja excluir este perfil?")) {
			try {
				await deleteDoc(doc(db, "profiles", profileId));
			} catch (error) {
				alert("Erro ao excluir perfil: " + error);
			}
		}
	};

	// Função para excluir múltiplos perfis
	const handleDeleteSelected = async () => {
		if (selectedProfiles.length === 0) return;
		if (
			window.confirm(
				`Tem certeza que deseja excluir ${selectedProfiles.length} perfis?`
			)
		) {
			try {
				for (const id of selectedProfiles) {
					await deleteDoc(doc(db, "profiles", id));
				}
				setSelectedProfiles([]);
			} catch (error) {
				alert("Erro ao excluir perfis: " + error);
			}
		}
	};

	// Funções para ações de mover (apenas para client)
	const handleMoveProfiles = () => {
		if (selectedProfiles.length === 0) return;
		alert(`Mover perfis: ${selectedProfiles.join(", ")}`);
	};

	// Função para buscar todos os usuários (simulada)
	const fetchAllUsers = async () => {
		// Simulação de dados de usuários - em produção, você buscaria do Firestore
		const mockUsers = [
			{
				id: "uid_cliente1",
				name: "João Silva",
				email: "joao@email.com",
				role: "client",
			},
			{
				id: "uid_cliente2",
				name: "Maria Santos",
				email: "maria@email.com",
				role: "client",
			},
			{
				id: "uid_cliente3",
				name: "Pedro Costa",
				email: "pedro@email.com",
				role: "client",
			},
			{
				id: "uid_cliente4",
				name: "Ana Oliveira",
				email: "ana@email.com",
				role: "client",
			},
			{
				id: "uid_cliente5",
				name: "Carlos Lima",
				email: "carlos@email.com",
				role: "client",
			},
			{
				id: "uid_cliente6",
				name: "Lucia Ferreira",
				email: "lucia@email.com",
				role: "client",
			},
			{
				id: "uid_cliente7",
				name: "Roberto Alves",
				email: "roberto@email.com",
				role: "client",
			},
			{
				id: "uid_cliente8",
				name: "Fernanda Rocha",
				email: "fernanda@email.com",
				role: "client",
			},
			{
				id: "uid_cliente9",
				name: "Marcos Pereira",
				email: "marcos@email.com",
				role: "client",
			},
		];
		setAllUsers(mockUsers);
	};

	// Função para abrir modal de usuários
	const handleOpenUsersModal = () => {
		fetchAllUsers();
		setIsUsersModalOpen(true);
	};

	// Função para fechar modal de usuários
	const handleCloseUsersModal = () => {
		setIsUsersModalOpen(false);
	};

	const handleOpenBrowser = (profile: Profile) => {
		setSelectedProfileForBrowser(profile);
		setIsBrowserModalOpen(true);
	};

	const handleCloseBrowser = () => {
		setIsBrowserModalOpen(false);
		setSelectedProfileForBrowser(null);
		setBrowserStatus("idle");
	};

	useEffect(() => {
		if (!isBrowserModalOpen || !selectedProfileForBrowser) return;

		setBrowserStatus("connecting");

		// TODO: Implementar a chamada ao backend aqui.
		// Esta é uma simulação da chamada da API para o backend que iniciaria o Puppeteer.
		const launchBrowserOnBackend = async () => {
			try {
				/*
        // Exemplo de como a chamada de API real se pareceria:
        const response = await fetch(`http://localhost:3001/api/launch-browser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId: selectedProfileForBrowser.id,
            proxy: selectedProfileForBrowser.proxy,
            userAgent: selectedProfileForBrowser.userAgent,
            fingerprint: selectedProfileForBrowser.fingerprint,
          }),
        });

        if (!response.ok) {
          throw new Error('Falha ao iniciar o navegador no backend.');
        }

        const data = await response.json();
        console.log('Sessão do navegador iniciada:', data.sessionId);
        */

				// Simulação de sucesso após 2 segundos
				await new Promise((resolve) => setTimeout(resolve, 2000));
				setBrowserStatus("connected");
			} catch (error) {
				console.error("Erro ao tentar iniciar o navegador:", error);
				setBrowserStatus("error");
			}
		};

		launchBrowserOnBackend();
	}, [isBrowserModalOpen, selectedProfileForBrowser]);

	useEffect(() => {
		if (!currentUser) {
			setProfiles([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const profilesRef = collection(db, "profiles");

		// Se o usuário é um cliente, buscar apenas perfis onde ele está em allowedUsers
		// Se é admin, buscar apenas perfis onde ele é o criador
		let q;
		if (userData?.role === "client") {
			q = query(
				profilesRef,
				where("allowedUsers", "array-contains", currentUser.uid),
				orderBy("createdAt", "desc")
			);
		} else if (userData?.role === "admin") {
			q = query(
				profilesRef,
				where("creatorId", "==", currentUser.uid),
				orderBy("createdAt", "desc")
			);
		} else {
			// Outros tipos podem ver todos os perfis
			q = query(profilesRef, orderBy("createdAt", "desc"));
		}

		const unsubscribe = onSnapshot(
			q,
			(querySnapshot) => {
				const profilesData: Profile[] = [];
				querySnapshot.forEach((doc) => {
					const data = doc.data();

					// Para clientes e admins, já filtramos pela query, então todos os perfis retornados são acessíveis
					// Para outros tipos, verificamos se tem acesso (criador ou autorizado)
					let hasAccess = true;
					if (userData?.role !== "client" && userData?.role !== "admin") {
						const allowedUsers = data.allowedUsers || [];
						const isCreator = data.creatorId === currentUser.uid;
						hasAccess = allowedUsers.includes(currentUser.uid) || isCreator;
					}

					if (hasAccess) {
						// Busca as tags do usuário atual
						const userTags = data.tags?.[currentUser.uid] || [];
						const tagDisplay =
							userTags.length > 0
								? userTags.join(", ")
								: data.proxy?.type || "-";

						profilesData.push({
							id: doc.id,
							name: data.name || "Sem nome",
							tag: tagDisplay,
							status: data.status || "offline",
							created: data.createdAt
								? new Date(data.createdAt.toDate()).toLocaleString("pt-BR", {
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
								  })
								: "-",
							action: "Open",
							userAgent: data.userAgent,
							proxy: data.proxy,
							fingerprint: data.fingerprint,
							cookies: data.cookies,
							lastSessionAt: data.lastSessionAt,
							createdAt: data.createdAt,
							allowedUsers: data.allowedUsers,
							tags: data.tags,
							groupId: data.groupId, // Adicionar campo de grupo
						});
					}
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

	const handleTagUpdate = async (profileId: string) => {
		if (!currentUser) {
			setEditingTagId(null);
			return;
		}

		// Otimização: não fazer update se o valor não mudou
		const originalProfile = profiles.find((p) => p.id === profileId);
		if (originalProfile?.tag === editingTagValue) {
			setEditingTagId(null);
			return;
		}

		const newTagsArray = editingTagValue
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);

		try {
			const profileRef = doc(db, "profiles", profileId);
			const fieldPath = `tags.${currentUser.uid}`;
			await updateDoc(profileRef, { [fieldPath]: newTagsArray });
		} catch (error) {
			console.error("Erro ao atualizar a tag:", error);
			alert("Falha ao atualizar a tag.");
		} finally {
			setEditingTagId(null);
		}
	};

	if (loading) {
		return (
			<div
				className="section-content"
				style={{ borderRadius: 12, padding: 24 }}
			>
				<div style={{ textAlign: "center", color: "#fff", padding: "50px" }}>
					Carregando perfis...
				</div>
			</div>
		);
	}

	return (
		<div className="section-content" style={{ borderRadius: 12, padding: 24 }}>
			{/* Header de botões + searchbar */}
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
				<div
					style={{
						display: "flex",
						gap: 8,
						flexWrap: "wrap",
						alignItems: "center",
					}}
				>
					{/* Indicador de filtro por grupo */}
					{groupFilter && (
						<div
							style={{
								background: "#2563eb",
								color: "#fff",
								padding: "6px 12px",
								borderRadius: 6,
								fontSize: 13,
								fontWeight: 600,
								display: "flex",
								alignItems: "center",
								gap: 8,
							}}
						>
							<span>Filtrando por grupo: {groupFilter}</span>
							<button
								onClick={() => {
									setSearchParams({ group: "" });
								}}
								style={{
									background: "none",
									border: "none",
									color: "#fff",
									cursor: "pointer",
									fontSize: 16,
									padding: 0,
									display: "flex",
									alignItems: "center",
								}}
							>
								×
							</button>
						</div>
					)}

					<input
						type="text"
						placeholder={t("profilesPage.search")}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{
							width: 650,
							padding: "8px 14px",
							borderRadius: 8,
							border: "1px solid #23262F",
							color: "#fff",
							fontSize: 16,
							outline: "none",
						}}
					/>
					<button className="btn-primary">{t("profilesPage.open")}</button>
					{userData?.role === "client" && (
						<>
							<button
								className="btn-secondary"
								disabled={selectedProfiles.length === 0}
								onClick={handleMoveProfiles}
							>
								{t("profilesPage.move")}
							</button>
						</>
					)}
					{userData?.role === "admin" && (
						<>
							<button
								className="btn-secondary"
								onClick={createGlobalProfiles}
								disabled={isCreating}
							>
								{isCreating ? "Criando..." : "Criar Perfis"}
							</button>
							<button
								className="btn-secondary"
								disabled={selectedProfiles.length === 0}
								onClick={handleDeleteSelected}
							>
								{t("profilesPage.delete")}
							</button>
						</>
					)}
				</div>
			</div>
			{/* Tabela */}
			<div style={{ overflowX: "auto" }}>
				<table
					style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}
				>
					<thead style={{ background: "#23262F" }}>
						<tr>
							<th style={{ padding: "12px 8px" }}>
								<input
									type="checkbox"
									checked={
										filteredData.length > 0 &&
										selectedProfiles.length === filteredData.length
									}
									onChange={handleSelectAll}
									style={{ cursor: "pointer" }}
								/>
							</th>
							<th style={{ padding: "12px 8px", textAlign: "left" }}>
								{t("profilesPage.name")}
							</th>
							<th style={{ padding: "12px 8px", textAlign: "left" }}>
								{t("profilesPage.tags")}
							</th>
							<th style={{ padding: "12px 8px", textAlign: "left" }}>Grupo</th>
							<th style={{ padding: "12px 8px", textAlign: "left" }}>
								{t("profilesPage.status")}
							</th>
							<th style={{ padding: "12px 8px", textAlign: "left" }}>
								{t("profilesPage.creationDate")}
							</th>
							<th style={{ padding: "12px 8px", textAlign: "center" }}>
								Abrir
							</th>
							<th style={{ width: 40 }}></th>
						</tr>
					</thead>
					<tbody>
						{filteredData.length === 0 ? (
							<tr>
								<td
									colSpan={8}
									style={{
										padding: "20px",
										textAlign: "center",
										color: "#666",
									}}
								>
									{profiles.length === 0
										? "Nenhum perfil encontrado"
										: "Nenhum perfil corresponde à busca"}
								</td>
							</tr>
						) : (
							filteredData.map((row) => (
								<tr key={row.id} style={{ borderBottom: "1px solid #23262F" }}>
									<td style={{ padding: "10px 8px", textAlign: "center" }}>
										<input
											type="checkbox"
											checked={selectedProfiles.includes(row.id)}
											onChange={() => handleSelectProfile(row.id)}
											style={{ cursor: "pointer" }}
										/>
									</td>
									<td style={{ padding: "10px 8px" }}>{row.name}</td>
									<td style={{ padding: "10px 8px" }}>
										{editingTagId === row.id ? (
											<input
												type="text"
												value={editingTagValue}
												onChange={(e) => setEditingTagValue(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleTagUpdate(row.id);
													} else if (e.key === "Escape") {
														setEditingTagId(null);
													}
												}}
												onBlur={() => handleTagUpdate(row.id)}
												autoFocus
												style={{
													width: "20%",
													padding: "6px 8px",
													borderRadius: 6,
													border: "1.5px solid #2563eb",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
												}}
											/>
										) : (
											<span
												onClick={() => {
													setEditingTagId(row.id);
													// Evita exibir o placeholder "-" no campo de edição
													setEditingTagValue(
														row.tag.includes("http") ||
															row.tag.includes("socks")
															? ""
															: row.tag
													);
												}}
												style={{
													cursor: "pointer",
													display: "block",
													width: "100%",
													minHeight: "20px",
													padding: "6px 8px",
												}}
											>
												{row.tag}
											</span>
										)}
									</td>
									<td style={{ padding: "10px 8px" }}>
										{row.groupId ? (
											<span
												style={{
													background: "#2563eb",
													color: "#fff",
													padding: "4px 8px",
													borderRadius: 4,
													fontSize: 12,
													fontWeight: 500,
												}}
											>
												{row.groupId}
											</span>
										) : (
											<span style={{ color: "#666", fontSize: "13px" }}>-</span>
										)}
									</td>
									<td style={{ padding: "10px 8px" }}>
										{row.status === "online" ? (
											<span
												style={{
													background: "#232",
													color: "#0f0",
													borderRadius: 8,
													padding: "2px 10px",
													fontSize: 12,
												}}
											>
												● {t("profilesPage.active")}
											</span>
										) : row.status === "running" ? (
											<span
												style={{
													background: "#232",
													color: "#ff0",
													borderRadius: 8,
													padding: "2px 10px",
													fontSize: 12,
												}}
											>
												● Executando
											</span>
										) : row.status === "offline" ? (
											<span
												style={{
													background: "#232",
													color: "#f00",
													borderRadius: 8,
													padding: "2px 10px",
													fontSize: 12,
												}}
											>
												● Offline
											</span>
										) : (
											<span style={{ color: "#666", fontSize: "13px" }}>-</span>
										)}
									</td>
									<td style={{ padding: "10px 8px" }}>{row.created}</td>
									<td style={{ padding: "10px 8px", textAlign: "center" }}>
										<button
											style={{
												background: "#059669",
												color: "#fff",
												border: "none",
												borderRadius: 6,
												padding: "8px 12px",
												fontWeight: 600,
												cursor: "pointer",
												display: "inline-flex",
												alignItems: "center",
												gap: "6px",
												fontSize: "13px",
											}}
											onClick={() => handleOpenBrowser(row)}
										>
											<FaChrome size={14} />
											Abrir
										</button>
									</td>
									<td style={{ textAlign: "center" }}>
										<div
											style={{
												position: "relative",
												display: "inline-flex",
												alignItems: "center",
											}}
											onMouseEnter={() => setOpenMenuId(row.id)}
											onMouseLeave={() => setOpenMenuId(null)}
										>
											<button
												className="menu-trigger"
												style={{
													background: "none",
													border: "none",
													cursor: "pointer",
													padding: 0,
													margin: 0,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													width: 32,
													height: 32,
												}}
												title="Mais opções"
											>
												<FiMoreVertical size={22} color="#bdbdbd" />
											</button>

											{/* Menu Dropdown */}
											{openMenuId === row.id && (
												<div
													className="menu-dropdown"
													style={{
														position: "absolute",
														top: "100%",
														right: 0,
														background: "#23262F",
														border: "1px solid #31344b",
														borderRadius: 8,
														boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
														zIndex: 1000,
														minWidth: 120,
														padding: "4px 0",
													}}
												>
													{userData?.role === "admin" ? (
														<>
															<button
																style={{
																	width: "100%",
																	padding: "8px 12px",
																	background: "none",
																	border: "none",
																	color: "#fff",
																	cursor: "pointer",
																	textAlign: "left",
																	fontSize: "13px",
																	display: "flex",
																	alignItems: "center",
																	gap: "8px",
																}}
																onClick={() => {
																	handleEditProfile(row);
																	setOpenMenuId(null);
																}}
																onMouseOver={(e) =>
																	(e.currentTarget.style.background = "#31344b")
																}
																onMouseOut={(e) =>
																	(e.currentTarget.style.background = "none")
																}
															>
																<FiEdit color="#2563eb" size={14} />
																Editar
															</button>
															<button
																style={{
																	width: "100%",
																	padding: "8px 12px",
																	background: "none",
																	border: "none",
																	color: "#fff",
																	cursor: "pointer",
																	textAlign: "left",
																	fontSize: "13px",
																	display: "flex",
																	alignItems: "center",
																	gap: "8px",
																}}
																onClick={() => {
																	handleDeleteProfile(row.id);
																	setOpenMenuId(null);
																}}
																onMouseOver={(e) =>
																	(e.currentTarget.style.background = "#31344b")
																}
																onMouseOut={(e) =>
																	(e.currentTarget.style.background = "none")
																}
															>
																<FiTrash color="#e11d48" size={14} />
																Excluir
															</button>
														</>
													) : (
														<button
															style={{
																width: "100%",
																padding: "8px 12px",
																background: "none",
																border: "none",
																color: "#fff",
																cursor: "pointer",
																textAlign: "left",
																fontSize: "13px",
																display: "flex",
																alignItems: "center",
																gap: "8px",
															}}
															onClick={() => {
																handleOpenBrowser(row);
																setOpenMenuId(null);
															}}
															onMouseOver={(e) =>
																(e.currentTarget.style.background = "#31344b")
															}
															onMouseOut={(e) =>
																(e.currentTarget.style.background = "none")
															}
														>
															<FiExternalLink color="#059669" size={14} />
															Abrir
														</button>
													)}
												</div>
											)}
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
			{/* Botão flutuante no canto inferior direito */}
			{selectedProfiles.length > 0 && (
				<div
					style={{
						position: "fixed",
						bottom: 32,
						right: 32,
						zIndex: 1000,
						background: "#2563eb",
						borderRadius: "50%",
						width: 64,
						height: 64,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
						cursor: "pointer",
					}}
					title="Ação rápida"
					onClick={() => alert(`Selecionados: ${selectedProfiles.length}`)}
				>
					<FaRocket size={28} color="#fff" />
				</div>
			)}
			{/* Modal de edição completo */}
			{isEditModalOpen && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						background: "rgba(0,0,0,0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 2000,
						padding: "10px",
					}}
					onClick={() => setIsEditModalOpen(false)}
				>
					<div
						style={{
							background: "#23262F",
							padding: 24,
							borderRadius: 16,
							width: 900,
							color: "#fff",
							boxShadow: "0 8px 32px 0 rgba(0,0,0,0.45)",
							border: "1.5px solid #31344b",
							position: "relative",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<h2
							style={{
								marginBottom: 20,
								fontWeight: 800,
								fontSize: 22,
								letterSpacing: 1,
								color: "#fff",
							}}
						>
							Editar Perfil:{" "}
							<span style={{ color: "#2563eb" }}>{editingProfile?.name}</span>
						</h2>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 24,
							}}
						>
							{/* Coluna 1 */}
							<div
								style={{ display: "flex", flexDirection: "column", gap: 18 }}
							>
								{/* Informações Básicas */}
								<div>
									<h4
										style={{
											marginBottom: 10,
											fontWeight: 700,
											textTransform: "uppercase",
											color: "#2563eb",
											letterSpacing: 1,
											fontSize: 13,
										}}
									>
										Informações Básicas
									</h4>
									<div
										style={{ display: "flex", flexDirection: "column", gap: 8 }}
									>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Nome:
											</label>
											<input
												type="text"
												value={editName}
												onChange={(e) => setEditName(e.target.value)}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											/>
										</div>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												User Agent:
											</label>
											<input
												type="text"
												value={editUserAgent}
												onChange={(e) => setEditUserAgent(e.target.value)}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											/>
										</div>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Grupo:
											</label>
											<select
												value={editGroupId}
												onChange={(e) => setEditGroupId(e.target.value)}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											>
												<option value="">Sem grupo</option>
												<option value="Elevenlabs">Elevenlabs</option>
												<option value="ChatGPT pro">ChatGPT pro</option>
												<option value="test 1">test 1</option>
												<option value="Espacio ViralNetwork Pro">
													Espacio ViralNetwork Pro
												</option>
												<option value="manutencion herramientas">
													manutencion herramientas
												</option>
												<option value="grupo herramientas">
													grupo herramientas
												</option>
											</select>
										</div>
									</div>
								</div>
								<div
									style={{ borderTop: "1px solid #31344b", margin: "10px 0" }}
								/>
								{/* Usuários Permitidos */}
								<div>
									<h4
										style={{
											marginBottom: 10,
											fontWeight: 700,
											textTransform: "uppercase",
											color: "#2563eb",
											letterSpacing: 1,
											fontSize: 13,
										}}
									>
										Usuários Permitidos
									</h4>
									<div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
										<input
											type="text"
											placeholder="ID do usuário"
											value={newAllowedUser}
											onChange={(e) => setNewAllowedUser(e.target.value)}
											style={{
												flex: 1,
												padding: "8px 12px",
												borderRadius: 8,
												border: "1.5px solid #31344b",
												background: "#181A20",
												color: "#fff",
												fontSize: 14,
												outline: "none",
												transition: "border 0.2s",
											}}
											onFocus={(e) =>
												(e.currentTarget.style.border = "1.5px solid #2563eb")
											}
											onBlur={(e) =>
												(e.currentTarget.style.border = "1.5px solid #31344b")
											}
										/>
										<button
											onClick={addAllowedUser}
											style={{
												padding: "8px 18px",
												background: "#2563eb",
												color: "#fff",
												border: "none",
												borderRadius: 8,
												cursor: "pointer",
												fontWeight: 700,
												fontSize: 14,
												transition: "background 0.2s",
											}}
											onMouseOver={(e) =>
												(e.currentTarget.style.background = "#1746a2")
											}
											onMouseOut={(e) =>
												(e.currentTarget.style.background = "#2563eb")
											}
										>
											Adicionar
										</button>
										{userData?.role === "admin" && (
											<button
												onClick={handleOpenUsersModal}
												style={{
													padding: "8px 18px",
													background: "#059669",
													color: "#fff",
													border: "none",
													borderRadius: 8,
													cursor: "pointer",
													fontWeight: 700,
													fontSize: 14,
													transition: "background 0.2s",
												}}
												onMouseOver={(e) =>
													(e.currentTarget.style.background = "#047857")
												}
												onMouseOut={(e) =>
													(e.currentTarget.style.background = "#059669")
												}
											>
												Ver lista
											</button>
										)}
									</div>
								</div>
								<div
									style={{ borderTop: "1px solid #31344b", margin: "10px 0" }}
								/>
								{/* Tags */}
								<div>
									<h4
										style={{
											marginBottom: 10,
											fontWeight: 700,
											textTransform: "uppercase",
											color: "#2563eb",
											letterSpacing: 1,
											fontSize: 13,
										}}
									>
										Tags
									</h4>
									{userData?.role === "admin" ? (
										// Para admin, mostrar apenas suas próprias tags
										<div style={{ marginBottom: 10 }}>
											<h5
												style={{
													marginBottom: 6,
													fontWeight: 600,
													color: "#fff",
													fontSize: 13,
												}}
											>
												Minhas Tags
											</h5>
											<div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
												<input
													type="text"
													placeholder="Nova tag"
													value={newTag}
													onChange={(e) => setNewTag(e.target.value)}
													style={{
														flex: 1,
														padding: "7px 10px",
														borderRadius: 6,
														border: "1.5px solid #31344b",
														background: "#181A20",
														color: "#fff",
														fontSize: 13,
														outline: "none",
														transition: "border 0.2s",
													}}
													onFocus={(e) =>
														(e.currentTarget.style.border =
															"1.5px solid #2563eb")
													}
													onBlur={(e) =>
														(e.currentTarget.style.border =
															"1.5px solid #31344b")
													}
												/>
												<button
													onClick={() => addTag(currentUser?.uid || "")}
													style={{
														padding: "7px 14px",
														background: "#2563eb",
														color: "#fff",
														border: "none",
														borderRadius: 6,
														cursor: "pointer",
														fontWeight: 700,
														fontSize: 13,
														transition: "background 0.2s",
													}}
													onMouseOver={(e) =>
														(e.currentTarget.style.background = "#1746a2")
													}
													onMouseOut={(e) =>
														(e.currentTarget.style.background = "#2563eb")
													}
												>
													+
												</button>
											</div>
											<div
												style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
											>
												{(editTags[currentUser?.uid || ""] || []).map(
													(tag, index) => (
														<div
															key={index}
															style={{
																background: "#31344b",
																padding: "3px 8px",
																borderRadius: 5,
																display: "flex",
																alignItems: "center",
																gap: 4,
																fontSize: 12,
															}}
														>
															<span>{tag}</span>
															<button
																onClick={() =>
																	removeTag(currentUser?.uid || "", index)
																}
																style={{
																	background: "#e11d48",
																	color: "#fff",
																	border: "none",
																	borderRadius: 2,
																	width: 13,
																	height: 13,
																	cursor: "pointer",
																	fontSize: 9,
																	fontWeight: 700,
																}}
															>
																×
															</button>
														</div>
													)
												)}
											</div>
										</div>
									) : (
										// Para outros usuários, mostrar todas as tags como antes
										Object.entries(editTags).map(([userId, tags]) => (
											<div key={userId} style={{ marginBottom: 10 }}>
												<h5
													style={{
														marginBottom: 6,
														fontWeight: 600,
														color: "#fff",
														fontSize: 13,
													}}
												>
													Usuário: {userId}
												</h5>
												<div
													style={{ display: "flex", gap: 8, marginBottom: 8 }}
												>
													<input
														type="text"
														placeholder="Nova tag"
														value={newTag}
														onChange={(e) => setNewTag(e.target.value)}
														style={{
															flex: 1,
															padding: "7px 10px",
															borderRadius: 6,
															border: "1.5px solid #31344b",
															background: "#181A20",
															color: "#fff",
															fontSize: 13,
															outline: "none",
															transition: "border 0.2s",
														}}
														onFocus={(e) =>
															(e.currentTarget.style.border =
																"1.5px solid #2563eb")
														}
														onBlur={(e) =>
															(e.currentTarget.style.border =
																"1.5px solid #31344b")
														}
													/>
													<button
														onClick={() => addTag(userId)}
														style={{
															padding: "7px 14px",
															background: "#2563eb",
															color: "#fff",
															border: "none",
															borderRadius: 6,
															cursor: "pointer",
															fontWeight: 700,
															fontSize: 13,
															transition: "background 0.2s",
														}}
														onMouseOver={(e) =>
															(e.currentTarget.style.background = "#1746a2")
														}
														onMouseOut={(e) =>
															(e.currentTarget.style.background = "#2563eb")
														}
													>
														+
													</button>
												</div>
												<div
													style={{ display: "flex", flexWrap: "wrap", gap: 6 }}
												>
													{tags.map((tag, index) => (
														<div
															key={index}
															style={{
																background: "#31344b",
																padding: "3px 8px",
																borderRadius: 5,
																display: "flex",
																alignItems: "center",
																gap: 4,
																fontSize: 12,
															}}
														>
															<span>{tag}</span>
															<button
																onClick={() => removeTag(userId, index)}
																style={{
																	background: "#e11d48",
																	color: "#fff",
																	border: "none",
																	borderRadius: 2,
																	width: 13,
																	height: 13,
																	cursor: "pointer",
																	fontSize: 9,
																	fontWeight: 700,
																}}
															>
																×
															</button>
														</div>
													))}
												</div>
											</div>
										))
									)}
								</div>
							</div>
							{/* Coluna 2 */}
							<div
								style={{ display: "flex", flexDirection: "column", gap: 18 }}
							>
								{/* Proxy */}
								<div>
									<h4
										style={{
											marginBottom: 10,
											fontWeight: 700,
											textTransform: "uppercase",
											color: "#2563eb",
											letterSpacing: 1,
											fontSize: 13,
										}}
									>
										Proxy
									</h4>
									<div
										style={{
											display: "grid",
											gridTemplateColumns: "1fr 1fr",
											gap: 8,
										}}
									>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Tipo:
											</label>
											<select
												value={editProxy.type}
												onChange={(e) =>
													setEditProxy((prev) => ({
														...prev,
														type: e.target.value,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											>
												<option value="">Selecione</option>
												<option value="http">HTTP</option>
												<option value="https">HTTPS</option>
												<option value="socks4">SOCKS4</option>
												<option value="socks5">SOCKS5</option>
											</select>
										</div>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												IP:
											</label>
											<input
												type="text"
												value={editProxy.ip}
												onChange={(e) =>
													setEditProxy((prev) => ({
														...prev,
														ip: e.target.value,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											/>
										</div>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Porta:
											</label>
											<input
												type="number"
												value={editProxy.port}
												onChange={(e) =>
													setEditProxy((prev) => ({
														...prev,
														port: parseInt(e.target.value) || 0,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											/>
										</div>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Usuário:
											</label>
											<input
												type="text"
												value={editProxy.username}
												onChange={(e) =>
													setEditProxy((prev) => ({
														...prev,
														username: e.target.value,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											/>
										</div>
										<div style={{ gridColumn: "1 / -1" }}>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Senha:
											</label>
											<input
												type="password"
												value={editProxy.password}
												onChange={(e) =>
													setEditProxy((prev) => ({
														...prev,
														password: e.target.value,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											/>
										</div>
									</div>
								</div>
								<div
									style={{ borderTop: "1px solid #31344b", margin: "10px 0" }}
								/>
								{/* Fingerprint */}
								<div>
									<h4
										style={{
											marginBottom: 10,
											fontWeight: 700,
											textTransform: "uppercase",
											color: "#2563eb",
											letterSpacing: 1,
											fontSize: 13,
										}}
									>
										Fingerprint
									</h4>
									<div
										style={{
											display: "grid",
											gridTemplateColumns: "1fr 1fr",
											gap: 8,
										}}
									>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Timezone:
											</label>
											<select
												value={editFingerprint.timezone}
												onChange={(e) =>
													setEditFingerprint((prev) => ({
														...prev,
														timezone: e.target.value,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											>
												<option value="">Selecione</option>
												<option value="America/New_York">
													America/New_York
												</option>
												<option value="America/Sao_Paulo">
													America/Sao_Paulo
												</option>
												<option value="Europe/London">Europe/London</option>
												<option value="Asia/Tokyo">Asia/Tokyo</option>
											</select>
										</div>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Idioma:
											</label>
											<select
												value={editFingerprint.language}
												onChange={(e) =>
													setEditFingerprint((prev) => ({
														...prev,
														language: e.target.value,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											>
												<option value="">Selecione</option>
												<option value="en-US">en-US</option>
												<option value="pt-BR">pt-BR</option>
												<option value="es-ES">es-ES</option>
												<option value="fr-FR">fr-FR</option>
											</select>
										</div>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												WebRTC:
											</label>
											<select
												value={editFingerprint.webRTC}
												onChange={(e) =>
													setEditFingerprint((prev) => ({
														...prev,
														webRTC: e.target.value,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											>
												<option value="">Selecione</option>
												<option value="public">Public</option>
												<option value="private">Private</option>
												<option value="disabled">Disabled</option>
											</select>
										</div>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Canvas:
											</label>
											<select
												value={editFingerprint.canvas}
												onChange={(e) =>
													setEditFingerprint((prev) => ({
														...prev,
														canvas: e.target.value,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											>
												<option value="">Selecione</option>
												<option value="noise">Noise</option>
												<option value="block">Block</option>
												<option value="real">Real</option>
											</select>
										</div>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: 4,
													fontWeight: 500,
													fontSize: 13,
												}}
											>
												Audio:
											</label>
											<select
												value={editFingerprint.audio}
												onChange={(e) =>
													setEditFingerprint((prev) => ({
														...prev,
														audio: e.target.value,
													}))
												}
												style={{
													width: "100%",
													padding: "8px 12px",
													borderRadius: 8,
													border: "1.5px solid #31344b",
													background: "#181A20",
													color: "#fff",
													fontSize: 14,
													outline: "none",
													transition: "border 0.2s",
												}}
												onFocus={(e) =>
													(e.currentTarget.style.border = "1.5px solid #2563eb")
												}
												onBlur={(e) =>
													(e.currentTarget.style.border = "1.5px solid #31344b")
												}
											>
												<option value="">Selecione</option>
												<option value="noise">Noise</option>
												<option value="block">Block</option>
												<option value="real">Real</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* Botões */}
						<div
							style={{
								display: "flex",
								gap: 12,
								justifyContent: "flex-end",
								marginTop: 20,
							}}
						>
							<button
								style={{
									background: "#e11d48",
									color: "#fff",
									border: "none",
									borderRadius: 8,
									padding: "10px 24px",
									fontWeight: 700,
									fontSize: 15,
									cursor: "pointer",
									transition: "background 0.2s",
								}}
								onClick={() => setIsEditModalOpen(false)}
								onMouseOver={(e) =>
									(e.currentTarget.style.background = "#a30d2d")
								}
								onMouseOut={(e) =>
									(e.currentTarget.style.background = "#e11d48")
								}
							>
								Cancelar
							</button>
							<button
								style={{
									background: "#2563eb",
									color: "#fff",
									border: "none",
									borderRadius: 8,
									padding: "10px 24px",
									fontWeight: 700,
									fontSize: 15,
									cursor: "pointer",
									transition: "background 0.2s",
								}}
								onClick={handleSaveEdit}
								onMouseOver={(e) =>
									(e.currentTarget.style.background = "#1746a2")
								}
								onMouseOut={(e) =>
									(e.currentTarget.style.background = "#2563eb")
								}
							>
								Salvar
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Modal de usuários */}
			{isUsersModalOpen && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						background: "rgba(0,0,0,0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 2000,
						padding: "10px",
					}}
					onClick={handleCloseUsersModal}
				>
					<div
						style={{
							background: "#23262F",
							padding: 24,
							borderRadius: 16,
							width: 900,
							maxHeight: "80vh",
							color: "#fff",
							border: "1.5px solid #31344b",
							position: "relative",
							overflow: "hidden",
							display: "flex",
							flexDirection: "column",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<h2
							style={{
								marginBottom: 20,
								fontWeight: 800,
								fontSize: 22,
								letterSpacing: 1,
								color: "#fff",
							}}
						>
							Lista de Usuários
						</h2>
						<div
							style={{
								flex: 1,
								overflowY: "auto",
								border: "1px solid #31344b",
								borderRadius: 8,
								background: "#181A20",
							}}
						>
							<table
								style={{
									width: "100%",
									borderCollapse: "collapse",
									color: "#fff",
								}}
							>
								<thead
									style={{ background: "#31344b", position: "sticky", top: 0 }}
								>
									<tr>
										<th
											style={{
												padding: "12px 16px",
												textAlign: "left",
												fontWeight: 700,
												fontSize: 14,
											}}
										>
											ID do Usuário
										</th>
										<th
											style={{
												padding: "12px 16px",
												textAlign: "left",
												fontWeight: 700,
												fontSize: 14,
											}}
										>
											Nome
										</th>
										<th
											style={{
												padding: "12px 16px",
												textAlign: "left",
												fontWeight: 700,
												fontSize: 14,
											}}
										>
											Email
										</th>
										<th
											style={{
												padding: "12px 16px",
												textAlign: "left",
												fontWeight: 700,
												fontSize: 14,
											}}
										>
											Função
										</th>
										<th
											style={{
												padding: "12px 16px",
												textAlign: "center",
												fontWeight: 700,
												fontSize: 14,
											}}
										>
											Ação
										</th>
									</tr>
								</thead>
								<tbody>
									{allUsers.map((user) => (
										<tr
											key={user.id}
											style={{
												borderBottom: "1px solid #31344b",
												background: editAllowedUsers.includes(user.id)
													? "#1e3a8a"
													: "transparent",
											}}
										>
											<td
												style={{
													padding: "12px 16px",
													fontSize: 13,
													fontFamily: "monospace",
												}}
											>
												{user.id}
											</td>
											<td
												style={{
													padding: "12px 16px",
													fontSize: 14,
													fontWeight: 500,
												}}
											>
												{user.name}
											</td>
											<td
												style={{
													padding: "12px 16px",
													fontSize: 14,
												}}
											>
												{user.email}
											</td>
											<td
												style={{
													padding: "12px 16px",
													fontSize: 14,
												}}
											>
												<span
													style={{
														background:
															user.role === "admin" ? "#dc2626" : "#059669",
														color: "#fff",
														padding: "2px 8px",
														borderRadius: 4,
														fontSize: 12,
														fontWeight: 600,
														textTransform: "uppercase",
													}}
												>
													{user.role}
												</span>
											</td>
											<td
												style={{
													padding: "12px 16px",
													textAlign: "center",
												}}
											>
												{editAllowedUsers.includes(user.id) ? (
													<button
														onClick={() => {
															const index = editAllowedUsers.indexOf(user.id);
															if (index > -1) {
																removeAllowedUser(index);
															}
														}}
														style={{
															background: "#e11d48",
															color: "#fff",
															border: "none",
															borderRadius: 6,
															padding: "6px 12px",
															fontWeight: 600,
															cursor: "pointer",
															fontSize: 12,
															transition: "background 0.2s",
														}}
														onMouseOver={(e) =>
															(e.currentTarget.style.background = "#a30d2d")
														}
														onMouseOut={(e) =>
															(e.currentTarget.style.background = "#e11d48")
														}
													>
														Remover
													</button>
												) : (
													<button
														onClick={() => {
															if (!editAllowedUsers.includes(user.id)) {
																setEditAllowedUsers((prev) => [
																	...prev,
																	user.id,
																]);
															}
														}}
														style={{
															background: "#059669",
															color: "#fff",
															border: "none",
															borderRadius: 6,
															padding: "6px 12px",
															fontWeight: 600,
															cursor: "pointer",
															fontSize: 12,
															transition: "background 0.2s",
														}}
														onMouseOver={(e) =>
															(e.currentTarget.style.background = "#047857")
														}
														onMouseOut={(e) =>
															(e.currentTarget.style.background = "#059669")
														}
													>
														Adicionar
													</button>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								marginTop: 20,
								paddingTop: 20,
								borderTop: "1px solid #31344b",
							}}
						>
							<button
								style={{
									background: "#2563eb",
									color: "#fff",
									border: "none",
									borderRadius: 8,
									padding: "10px 24px",
									fontWeight: 700,
									fontSize: 15,
									cursor: "pointer",
									transition: "background 0.2s",
								}}
								onClick={handleCloseUsersModal}
								onMouseOver={(e) =>
									(e.currentTarget.style.background = "#1746a2")
								}
								onMouseOut={(e) =>
									(e.currentTarget.style.background = "#2563eb")
								}
							>
								Fechar
							</button>
						</div>
					</div>
				</div>
			)}
			{isBrowserModalOpen && selectedProfileForBrowser && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						background: "rgba(0,0,0,0.6)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 3000,
						backdropFilter: "blur(5px)",
					}}
					onClick={handleCloseBrowser}
				>
					<div
						style={{
							background: "#181A20",
							width: "clamp(400px, 60vw, 800px)",
							height: "70vh",
							borderRadius: 12,
							boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
							border: "1.5px solid #31344b",
							display: "flex",
							flexDirection: "column",
							overflow: "hidden",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Barra de título do navegador */}
						<div
							style={{
								background: "#23262F",
								padding: "8px 12px",
								display: "flex",
								alignItems: "center",
								gap: 8,
								borderBottom: "1.5px solid #31344b",
							}}
						>
							<div
								style={{
									width: 12,
									height: 12,
									borderRadius: "50%",
									background: "#e11d48",
								}}
							/>
							<div
								style={{
									width: 12,
									height: 12,
									borderRadius: "50%",
									background: "#f59e0b",
								}}
							/>
							<div
								style={{
									width: 12,
									height: 12,
									borderRadius: "50%",
									background: "#059669",
								}}
							/>
							<div
								style={{
									flex: 1,
									textAlign: "center",
									color: "#e5e7eb",
									fontSize: 13,
									fontWeight: 500,
								}}
							>
								Perfil: {selectedProfileForBrowser.name}
							</div>
						</div>

						{/* Conteúdo do "navegador" */}
						<div
							style={{
								padding: "24px 32px",
								color: "#d1d5db",
								overflowY: "auto",
								flex: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								textAlign: "center",
							}}
						>
							{browserStatus === "connecting" && (
								<div>
									<div className="loader" />
									<h3 style={{ color: "#38bdf8", marginTop: 20 }}>
										Conectando ao navegador seguro...
									</h3>
									<p style={{ color: "#6b7280", marginTop: 8 }}>
										Aguarde, estamos preparando sua sessão.
									</p>
								</div>
							)}

							{browserStatus === "connected" && (
								<div style={{ textAlign: "left" }}>
									<h3
										style={{
											color: "#10b981",
											marginBottom: 16,
											borderBottom: "1px solid #31344b",
											paddingBottom: 8,
										}}
									>
										<FaRocket
											style={{ marginRight: 8, verticalAlign: "middle" }}
										/>
										Conexão estabelecida!
									</h3>
									<p style={{ lineHeight: 1.7, marginBottom: 16 }}>
										Uma instância isolada de navegador foi iniciada no backend.
									</p>
									<p style={{ marginBottom: 16 }}>
										A sessão atual está sendo executada com:
									</p>
									<ul style={{ listStyleType: "disc", paddingLeft: 20 }}>
										<li style={{ marginBottom: 8 }}>
											User Agent:{" "}
											<code>{selectedProfileForBrowser.userAgent}</code>
										</li>
										<li style={{ marginBottom: 8 }}>
											Proxy:{" "}
											<code>
												{selectedProfileForBrowser.proxy?.type}://
												{selectedProfileForBrowser.proxy?.ip}:
												{selectedProfileForBrowser.proxy?.port}
											</code>
										</li>
										<li style={{ marginBottom: 8 }}>
											Fingerprint customizada para evitar rastreamento.
										</li>
									</ul>
								</div>
							)}

							{browserStatus === "error" && (
								<div>
									<h3
										style={{
											color: "#ef4444",
											marginBottom: 16,
										}}
									>
										Falha na Conexão
									</h3>
									<p style={{ color: "#9ca3af", marginBottom: 20 }}>
										Não foi possível iniciar a sessão do navegador. Verifique o
										console ou tente novamente.
									</p>
									<button
										onClick={
											() =>
												setBrowserStatus(
													"connecting"
												) /* Reinicia a tentativa de conexão */
										}
										style={{
											background: "#3b82f6",
											color: "#fff",
											border: "none",
											borderRadius: 8,
											padding: "10px 22px",
											fontWeight: 600,
											cursor: "pointer",
										}}
									>
										Tentar Novamente
									</button>
								</div>
							)}
						</div>
						<div
							style={{
								borderTop: "1.5px solid #31344b",
								padding: "12px",
								textAlign: "right",
								background: "#23262F",
							}}
						>
							<button
								onClick={handleCloseBrowser}
								style={{
									background: "#2563eb",
									color: "#fff",
									border: "none",
									borderRadius: 8,
									padding: "8px 20px",
									fontWeight: 600,
									cursor: "pointer",
								}}
							>
								{browserStatus === "connected"
									? "Fechar Navegador"
									: "Cancelar"}
							</button>
						</div>
					</div>
				</div>
			)}
			<style>{`
        .loader {
          border: 4px solid #31344b;
          border-top: 4px solid #38bdf8;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
		</div>
	);
};

export default Profiles;
