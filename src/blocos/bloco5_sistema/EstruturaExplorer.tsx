import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Building, 
  Network, 
  ChevronRight, 
  Plus, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  Briefcase,
  Edit,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Palette,
  Sparkles,
  ListTree,
  Wand2,
  RefreshCw,
  HelpCircle,
  Check,
  ExternalLink,
} from "lucide-react";
import { firestoreService, fetchCollection } from "../../lib/firestoreService";
import { isSuperBossUser } from "../../lib/auth";
import { PROVINCIAS } from "../../constants/formOptions";
import { extractDominantColorsFromImage } from "../../lib/utils";
import { 
  notifyEstruturaUpdated,
  MODELOS_ORGANOGRAMA,
  parseOrganogramaToEstrutura,
  persistEstruturaFromOrganograma,
  getActiveInstituicaoId,
  setActiveInstituicaoId,
} from "../../lib/instituicaoEstruturaService";
import { TIPOS_INSTITUICAO_CONFIG, getTipoInstituicaoConfig } from "../../lib/instituicaoTiposConfig";

const ispsDefault = {
  id: "isps",
  nome: "Instituto Superior Politécnico de Songo (ISPS)",
  logo: "",
  tipoActividades: "Ensino Superior e Investigação Científica",
  composicao: "Faculdades, Departamentos e Repartições Autónomas",
  organograma: "Direcção Geral -> Departamentos -> Secções",
  provincia: "Tete",
  distrito: "Cahora Bassa (Songo)",
  createdAt: "2026-09-06T00:00:00Z"
};

export const EstruturaExplorer = ({ 
  onRegistarAdmin,
  initialTab,
  loggedUser: propLoggedUser,
  onNavigateToWorkspace,
}: { 
  onRegistarAdmin: (instId: string) => void;
  initialTab?: "instituicoes" | "estrutura";
  loggedUser?: any;
  onNavigateToWorkspace?: (workspaceTitle: string, instituicaoId?: string) => void;
}) => {
  // 1. Obter utilizador autenticado e verificar permissões
  let loggedUser: any = propLoggedUser || null;
  if (!loggedUser) {
    try {
      const stored = localStorage.getItem("sigep_logged_in_user") || localStorage.getItem("sigep_user");
      if (stored) {
        loggedUser = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Erro ao carregar utilizador:", e);
    }
  }

  const isGlobalAdmin = 
    isSuperBossUser(loggedUser) ||
    loggedUser?.isOwner === true ||
    loggedUser?.isProgrammer === true ||
    String(loggedUser?.email || "").toLowerCase() === "slaitertripas@gmail.com" ||
    loggedUser?.role === "Administrador" ||
    loggedUser?.role === "Administrador do Sistema" ||
    (String(loggedUser?.role || "").toLowerCase().includes("admin") && !loggedUser?.instituicaoId) ||
    loggedUser?.cargoChefia === "Proprietário do sistema" ||
    loggedUser?.cargoChefia === "Administrador de sistema";

  const isInstitutionalAdmin =
    !isGlobalAdmin && (
      loggedUser?.isInstitutionalAdmin === true ||
      loggedUser?.role === "Administrador da Instituição" ||
      String(loggedUser?.cargoChefia || "").toLowerCase().includes("administrador da instituição") ||
      Boolean(loggedUser?.instituicaoId && String(loggedUser?.role || "").toLowerCase().includes("admin"))
    );

  // 2. Seleção de aba ativa (Permite ao Administrador Geral navegar diretamente pela Estrutura Geral da Instituição)
  const [activeTab, setActiveTab] = useState<"instituicoes" | "estrutura">(
    initialTab || (isGlobalAdmin ? "instituicoes" : "estrutura")
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // 3. Gestão de Instituições
  const [instituicoes, setInstituicoes] = useState<any[]>([]);
  const [showInstForm, setShowInstForm] = useState(false);
  const [isSavingInst, setIsSavingInst] = useState(false);
  
  // Estados para Modal de Confirmação de Exclusão da Instituição
  const [instToDelete, setInstToDelete] = useState<any | null>(null);
  const [isDeletingInst, setIsDeletingInst] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Campos do formulário de instituição
  const [instNome, setInstNome] = useState("");
  const [instLogo, setInstLogo] = useState("");
  const [instPrimaryColor, setInstPrimaryColor] = useState("#050b38");
  const [instSecondaryColor, setInstSecondaryColor] = useState("#0d1b54");
  const [instAccentColor, setInstAccentColor] = useState("#FFB800");
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [instTipoActividades, setInstTipoActividades] = useState("");
  const [instOrganograma, setInstOrganograma] = useState("");
  const [instComposicao, setInstComposicao] = useState("");
  const [instProvincia, setInstProvincia] = useState("");
  const [instDistrito, setInstDistrito] = useState("");
  const [editingInstId, setEditingInstId] = useState<string | null>(null);

  // Estados para geração, sincronização e pré-visualização de organograma
  const [autoGenerateEstrutura, setAutoGenerateEstrutura] = useState(true);
  const [showOrganogramaPreview, setShowOrganogramaPreview] = useState(false);
  const [isSyncingOrganograma, setIsSyncingOrganograma] = useState(false);

  // 4. Scoping / Filtragem por inquilino (Tenant)
  const [selectedInstId, setSelectedInstId] = useState<string>(loggedUser?.instituicaoId || "isps");

  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [customDirecoes, setCustomDirecoes] = useState<any[]>([]);
  const [adicionais, setAdicionais] = useState<any[]>([]);
  const [customOrgaos, setCustomOrgaos] = useState<any[]>([]);
  const [deletedDirections, setDeletedDirections] = useState<any[]>([]);
  const [showRegistoForm, setShowRegistoForm] = useState(false);
  const [showOrganForm, setShowOrganForm] = useState(false);
  
  // Custom organ form states
  const [newOrganTitle, setNewOrganTitle] = useState("");
  const [newOrganType, setNewOrganType] = useState("");
  const [isSavingOrgan, setIsSavingOrgan] = useState(false);

  // Inline add states
  const [newDeptName, setNewDeptName] = useState<Record<string, string>>({});
  const [newRepName, setNewRepName] = useState<Record<string, string>>({});

  // Form State
  const [titulo, setTitulo] = useState("");
  const [sigla, setSigla] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [departamentosRaw, setDepartamentosRaw] = useState("");
  const [missao, setMissao] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Subscrição a direções, adicionais, órgãos customizados, direções excluídas e instituições
  useEffect(() => {
    const unsubInst = firestoreService.instituicoes.subscribe((data) => {
      let deletedIds: string[] = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem("sigep_deleted_instituicoes") || "[]");
      } catch (_) {}

      const list = (data || []).filter((inst: any) => !deletedIds.includes(inst.id));
      const hasISPS = list.some((inst: any) => inst.id === "isps");
      const completeList = (!hasISPS && !deletedIds.includes("isps")) ? [ispsDefault, ...list] : list;
      setInstituicoes(completeList);

      // Se a instituição selecionada foi excluída ou não existe, seleciona a primeira restante
      if (selectedInstId && deletedIds.includes(selectedInstId)) {
        setSelectedInstId(completeList[0]?.id || "");
      } else if (!selectedInstId && completeList.length > 0) {
        setSelectedInstId(completeList[0].id);
      }
    });

    const unsub = firestoreService.direcoes_organicas.subscribe((data) => {
      setCustomDirecoes(data || []);
    });
    const unsubAdd = firestoreService.estrutura_adicionais.subscribe((data) => {
      setAdicionais(data || []);
    });
    const unsubOrgaos = firestoreService.orgaos_custom.subscribe((data) => {
      setCustomOrgaos(data || []);
    });
    const unsubDeleted = firestoreService.direcoes_excluidas.subscribe((data) => {
      setDeletedDirections(data || []);
    });

    return () => {
      unsubInst();
      unsub();
      unsubAdd();
      unsubOrgaos();
      unsubDeleted();
    };
  }, [selectedInstId]);

  const estrutura = [
    {
      title: "Órgão de Direção e Gestão",
      type: "Unidade Estrutural Principal",
      direcoes: [
        {
          title: "Conselho de Representantes",
          departamentos: [],
        },
        {
          title: "Gabinete do Diretor-Geral",
          departamentos: [
            {
              title: "Diretor-Geral",
              reparticoes: ["Chefe do GDG", "Secretaria Executiva"],
            },
            {
              title: "Departamento de Planificação Estudos e Projetos",
              reparticoes: [
                "Chefe do Departamento de Planificação Estudos e Projetos",
                "Repartição de Planificação",
                "Repartição de Estatística",
                "Setor de Relatório",
                "Setor de Monitoria",
              ],
            },
            {
              title: "Unidade Gestora e Executora de Aquisições",
              reparticoes: ["Chefe da UGEA"],
            },
            {
              title: "Departamento de Cooperação e Relações Exteriores",
              reparticoes: [
                "Chefe do DCRE",
                "Setor de Imagem Institucional",
              ],
            },
            {
              title: "Departamento de Controlo Técnico e de Qualidade",
              reparticoes: [
                "Chefe do DCTQ",
                "Setor de Controlo Técnico",
              ],
            },
            {
              title: "Departamento Jurídico",
              reparticoes: [
                "Chefe do DJ",
                "Setor de Pareceres",
              ],
            },
          ],
        },
        {
          title: "Conselho Administrativo e de Gestão",
          departamentos: [],
        },
        {
          title: "Conselho Técnico e de Qualidade",
          departamentos: [],
        },
      ],
    },
    {
      title: "Unidade Orgânica",
      type: "Unidade Estrutural",
      direcoes: [
        {
          title: "Divisão de Engenharia",
          departamentos: [
            {
              title: "Direção da Divisão de Engenharia",
              reparticoes: [
                "Diretor da Divisão de Engenharia",
                "Diretor Adjunto Pedagógico",
              ],
            },
            {
              title: "Departamento de Pesquisa e Extensão",
              reparticoes: ["Repartição de Pesquisa", "Repartição de Extensão"],
            },
            {
              title: "Departamento de Engenharia Eletrotécnica",
              reparticoes: [
                "Chefe do DEE",
                "Diretor do Curso de Engenharia Elétrica",
                "Diretor do Curso de Engenharia Eletrónica e de Telecomunicações",
                "Diretor do Curso de Engenharia de Energias Renováveis",
              ],
            },
            {
              title: "Departamento de Engenharia de Construção Civil",
              reparticoes: [
                "Chefe do DECC",
                "Diretor do Curso de Engenharia de Construção Civil",
                "Diretor do Curso de Engenharia Hidráulica",
              ],
            },
            {
              title: "Departamento de Engenharia de Construção Mecânica",
              reparticoes: [
                "Chefe do DECM",
                "Diretor do Curso de Engenharia de Construção Mecânica",
                "Diretor do Curso de Engenharia Termotécnica",
              ],
            },
            {
              title: "Departamento de Disciplinas Gerais",
              reparticoes: ["Chefe do DDG"],
            },
            {
              title: "Departamento Técnico e de Apoio",
              reparticoes: ["Chefe do DTA"],
            },
          ],
        },
        {
          title: "Centro de Incubação de Empresas",
          departamentos: [
            {
              title: "Departamento de práticas de geração de negócio e desenvolvimento empresarial (DPGNDE)",
              reparticoes: [],
            },
            {
              title: "Departamento de consultoria, estudos, projetos e angariação de fundos (DCPAF)",
              reparticoes: [],
            },
            {
              title: "Departamento de prospecção de oportunidade de negócio (DPONE)",
              reparticoes: [],
            },
          ],
        },
      ],
    },
    {
      title: "Serviços Centrais",
      type: "Unidade Estrutural",
      direcoes: [
        {
          title: "DICOSAFA",
          departamentos: [
            {
              title: "Direção da DICOSAFA",
              reparticoes: ["Diretor da DICOSAFA"],
            },
            {
              title: "Departamento de Recursos Humanos",
              reparticoes: ["Chefe do RH", "Repartição de Pessoal", "Repartição de Formação", "Repartição de Apoio Social"],
            },
            {
              title: "Departamento de Finanças",
              reparticoes: ["Chefe de Finanças", "Repartição de Plano e Orçamento", "Repartição de Tesouraria", "Setor de Estatística"],
            },
            {
              title: "Departamento de Património",
              reparticoes: ["Chefe de DP", "Repartição de E-Património", "Repartição de Infraestrutura e Manutenção", "Repartição de Transporte"],
            },
            {
              title: "Secretaria Geral",
              reparticoes: ["Chefe da SG", "Secretaria", "SIC"],
            },
            {
              title: "Departamento TIC",
              reparticoes: ["Chefe de DTIC", "Setor de Rede de Computadores", "Setor de Manutenção", "Reprografia", "Oficina de TIC"],
            },
            {
              title: "Departamento Lar de Estudantes",
              reparticoes: ["Chefe de DLE", "Repartição de Alojamento", "Repartição de Eventos", "Economato"],
            },
            {
              title: "Departamento de Produção Alimentar",
              reparticoes: ["Chefe de DPA", "Repartição de Production Animal", "Repartição de Production Vegetal", "Armazém de Thaka"],
            },
          ],
        },
        {
          title: "DICOSSER",
          departamentos: [
            {
              title: "Direção da DICOSSER",
              reparticoes: ["Diretor da DICOSSER"],
            },
            {
              title: "Departamento de Registo Académico",
              reparticoes: ["Chefe do DRA", "Atendimento Estudantil", "Repartição de Certificação", "Repartição de Exames de Admissão", "Repartição de Matrículas"],
            },
            {
              title: "Departamento de Assuntos Estudantis",
              reparticoes: ["Chefe do DAE", "Repartição de Bolsa de Estudos", "Repartição de Desporto e Recreação"],
            },
            {
              title: "Departamento de Biblioteca",
              reparticoes: ["Chefe de DBA", "Biblioteca", "Repartição de Documentos", "Repartição de Arquivo"],
            },
          ],
        },
      ],
    },
  ];

  // Filtragem com base na instituição selecionada (Tenant Isolation)
  // Preserva os dados legados que não têm de forma explícita o campo instituicaoId, tratando-os como parte do ISPS
  const filteredCustomOrgaos = customOrgaos.filter((co) => (co.instituicaoId || "isps") === selectedInstId);
  const filteredCustomDirecoes = customDirecoes.filter((cd) => (cd.instituicaoId || "isps") === selectedInstId);
  const filteredAdicionais = adicionais.filter((a) => (a.instituicaoId || "isps") === selectedInstId);
  const filteredDeletedDirections = deletedDirections.filter((d) => (d.instituicaoId || "isps") === selectedInstId);

  // Se não houver instituição selecionada ou for a original, mostramos estrutura estática.
  // Caso contrário (instituição customizada), a estrutura é baseada no seu organograma.
  const isDefaultInst = !selectedInstId || selectedInstId === "original" || selectedInstId === "isps";
  const baseOrgans = isDefaultInst ? estrutura : [];

  // Para novas instituições que ainda não tenham nós persistidos individualmente, derivar do seu organograma
  let organogramaDerivedOrgaos: any[] = [];
  const currentActiveInst = instituicoes.find((i) => i.id === selectedInstId);
  if (!isDefaultInst && filteredCustomOrgaos.length === 0 && currentActiveInst && (currentActiveInst.organograma || currentActiveInst.composicao)) {
    const parsed = parseOrganogramaToEstrutura(currentActiveInst.organograma, currentActiveInst.composicao);
    organogramaDerivedOrgaos = parsed.map((po, idx) => ({
      id: `derived_org_${idx}`,
      title: po.nome,
      type: po.tipo || "Unidade Estrutural do Organograma",
      isCustom: true,
      direcoes: po.direcoes.map((pd, dIdx) => ({
        id: `derived_dir_${idx}_${dIdx}`,
        title: pd.nome,
        rawTitle: pd.rawTitle || pd.nome,
        departamentos: pd.departamentos.map((pdep, depIdx) => ({
          id: `derived_dep_${idx}_${dIdx}_${depIdx}`,
          title: pdep.nome,
          reparticoes: pdep.reparticoes,
          isCustom: true
        })),
        isCustom: true
      }))
    }));
  }

  // Merge static organs, custom ones and organograma-derived ones
  const mergedOrgaos = [
    ...baseOrgans,
    ...filteredCustomOrgaos.map((co) => ({
      id: co.id,
      title: co.title,
      type: co.type || "Unidade Estrutural Adicional",
      isCustom: true,
      direcoes: co.direcoes || []
    })),
    ...organogramaDerivedOrgaos
  ];

  // Merge static directions and dynamic custom directions for the active unit
  const activeUnitFromState = selectedUnit 
    ? mergedOrgaos.find(u => u.title === selectedUnit.title)
    : null;

  const excludedTitles = new Set(filteredDeletedDirections.map(d => String(d.title || "").toUpperCase()));

  const activeUnitDirecoesFiltered = activeUnitFromState 
    ? activeUnitFromState.direcoes.filter((dir: any) => !excludedTitles.has(String(dir.title).toUpperCase()))
    : [];

  const mergedDirecoes = selectedUnit && activeUnitFromState ? [
    ...activeUnitDirecoesFiltered,
    ...filteredCustomDirecoes
      .filter((cd) => cd.unitType === selectedUnit.title && !excludedTitles.has(String(cd.title).toUpperCase()))
      .map((cd) => ({
        id: cd.id,
        title: cd.title + (cd.sigla ? ` (${cd.sigla})` : ""),
        rawTitle: cd.title,
        responsavel: cd.responsavel,
        email: cd.email,
        telefone: cd.telefone,
        dataInicio: cd.dataInicio,
        missao: cd.missao,
        departamentos: cd.departamentos || [],
        isCustom: true
      }))
  ] : [];

  const fullyEnrichedDirecoes = mergedDirecoes.map((dir: any) => {
    const dirTitle = dir.rawTitle || dir.title.split(" (")[0] || dir.title;
    
    // Append custom departments added to this specific direction
    const customDeptsForDir = filteredAdicionais
      .filter(a => a.directionTitle === dirTitle && a.type === "departamento")
      .map(a => ({
        id: a.id,
        title: a.name,
        reparticoes: [],
        isCustom: true
      }));

    const allDepts = [...(dir.departamentos || []), ...customDeptsForDir];

    // Append custom repartições to each department
    const enrichedDepts = allDepts.map((dept: any) => {
      const customRepsForDept = filteredAdicionais
        .filter(a => a.directionTitle === dirTitle && a.parentDepartmentTitle === dept.title && a.type === "reparticao")
        .map(a => ({
          id: a.id,
          name: a.name,
          isCustom: true
        }));

      // Map static repartições to objects so we can distinguish them
      const staticReps = (dept.reparticoes || []).map((r: any) => (typeof r === "string" ? { name: r, isCustom: false } : r));

      return {
        ...dept,
        reparticoes: [...staticReps, ...customRepsForDept]
      };
    });

    return {
      ...dir,
      departamentos: enrichedDepts
    };
  });

  const handleAddDept = async (directionTitle: string) => {
    const name = newDeptName[directionTitle];
    if (!name || !name.trim()) {
      alert("Por favor, insira o nome do departamento.");
      return;
    }
    try {
      await firestoreService.estrutura_adicionais.add({
        directionTitle,
        type: "departamento",
        name: name.trim(),
        instituicaoId: selectedInstId || "",
        createdAt: new Date().toISOString()
      });
      setNewDeptName(prev => ({ ...prev, [directionTitle]: "" }));
      notifyEstruturaUpdated();
      alert("Departamento adicionado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar departamento.");
    }
  };

  const handleAddRep = async (directionTitle: string, departmentTitle: string) => {
    const key = `${directionTitle}-${departmentTitle}`;
    const name = newRepName[key];
    if (!name || !name.trim()) {
      alert("Por favor, insira o nome da repartição/setor.");
      return;
    }
    try {
      await firestoreService.estrutura_adicionais.add({
        directionTitle,
        parentDepartmentTitle: departmentTitle,
        type: "reparticao",
        name: name.trim(),
        instituicaoId: selectedInstId || "",
        createdAt: new Date().toISOString()
      });
      setNewRepName(prev => ({ ...prev, [key]: "" }));
      notifyEstruturaUpdated();
      alert("Repartição/Setor adicionado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar repartição/setor.");
    }
  };

  const handleDeleteAdicional = async (id: string) => {
    if (window.confirm("Tem a certeza que pretende excluir?")) {
      try {
        await firestoreService.estrutura_adicionais.delete(id);
        notifyEstruturaUpdated();
        alert("Eliminado com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao eliminar o elemento.");
      }
    }
  };

  const handleAddOrgan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrganTitle.trim()) {
      alert("Por favor, insira o nome do órgão.");
      return;
    }
    setIsSavingOrgan(true);
    try {
      await firestoreService.orgaos_custom.add({
        title: newOrganTitle.trim(),
        type: newOrganType.trim() || "Unidade Estrutural Adicional",
        direcoes: [],
        instituicaoId: selectedInstId || "",
        createdAt: new Date().toISOString()
      });
      setNewOrganTitle("");
      setNewOrganType("");
      setShowOrganForm(false);
      notifyEstruturaUpdated();
      alert("Órgão registado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao registar o novo órgão.");
    } finally {
      setIsSavingOrgan(false);
    }
  };

  const handleDeleteOrgan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering click to open the organ
    if (window.confirm("Tem a certeza que pretende excluir?")) {
      try {
        await firestoreService.orgaos_custom.delete(id);
        notifyEstruturaUpdated();
        alert("Órgão eliminado com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao eliminar o órgão.");
      }
    }
  };

  const handleSaveDirecao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !responsavel.trim()) {
      alert("Por favor, preencha o título da direção e o nome do responsável.");
      return;
    }

    setIsSaving(true);
    try {
      // Parse comma-separated departments
      const depts = departamentosRaw
        .split(",")
        .map(d => d.trim())
        .filter(d => d.length > 0)
        .map(d => ({
          title: d,
          reparticoes: ["Secretaria / Apoio"]
        }));

      await firestoreService.direcoes_organicas.add({
        title: titulo,
        sigla: sigla,
        responsavel: responsavel,
        email: email,
        telefone: telefone,
        dataInicio: dataInicio,
        missao: missao,
        departamentos: depts,
        unitType: selectedUnit.title,
        instituicaoId: selectedInstId || "",
        createdAt: new Date().toISOString()
      });

      // Clear Form Fields
      setTitulo("");
      setSigla("");
      setResponsavel("");
      setEmail("");
      setTelefone("");
      setDataInicio("");
      setDepartamentosRaw("");
      setMissao("");
      
      setShowRegistoForm(false);
      notifyEstruturaUpdated();
      alert("Direção registada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao registar a nova direção.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustom = async (dir: any) => {
    const isCustom = !!dir.isCustom;
    const dirTitle = dir.rawTitle || dir.title.split(" (")[0] || dir.title;
    
    if (window.confirm("Tem a certeza que pretende excluir?")) {
      try {
        const res = await firestoreService.deleteDirectionAndCascade(dirTitle, isCustom, dir.id);
        if (res.success) {
          notifyEstruturaUpdated();
          alert(`Direção "${dirTitle}" e todos os dados associados foram eliminados com sucesso! Registos afetados/limpos: ${res.deletedCount}`);
        } else {
          alert(`Erro ao eliminar a direção: ${res.error}`);
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao eliminar a direção.");
      }
    }
  };

  // Handlers para Instituição
  const processLogoColors = async (logoDataUrl: string) => {
    setInstLogo(logoDataUrl);
    if (logoDataUrl) {
      setIsExtractingColors(true);
      try {
        const colors = await extractDominantColorsFromImage(logoDataUrl);
        setInstPrimaryColor(colors.primaryColor);
        setInstSecondaryColor(colors.secondaryColor);
        setInstAccentColor(colors.accentColor);
      } catch (err) {
        console.warn("Erro ao extrair cores do logotipo:", err);
      } finally {
        setIsExtractingColors(false);
      }
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        processLogoColors(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        processLogoColors(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInst = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instNome.trim()) {
      alert("Por favor, insira o nome da instituição.");
      return;
    }
    setIsSavingInst(true);
    try {
      const payload = {
        nome: instNome.trim(),
        logo: instLogo,
        primaryColor: instPrimaryColor || "#050b38",
        secondaryColor: instSecondaryColor || "#0d1b54",
        accentColor: instAccentColor || "#FFB800",
        tipoInstituicao: selectedTipoInstituicao,
        documentosNormativosConfigurados: getTipoInstituicaoConfig(selectedTipoInstituicao).documentosNormativosPadrao,
        tipoActividades: instTipoActividades.trim(),
        organograma: instOrganograma.trim(),
        composicao: instComposicao.trim(),
        provincia: instProvincia.trim(),
        distrito: instDistrito.trim(),
        updatedAt: new Date().toISOString()
      };
      
      let targetInstDocId = editingInstId;
      let generatedStats: { orgaosCount: number; direcoesCount: number; deptsCount: number; repsCount: number } | null = null;

      if (editingInstId) {
        await firestoreService.instituicoes.update(editingInstId, payload);
      } else {
        const docId = "inst_" + Date.now();
        targetInstDocId = docId;
        await firestoreService.instituicoes.set(docId, {
          ...payload,
          id: docId,
          createdAt: new Date().toISOString()
        });
      }

      // Se a opção de gerar estrutura automaticamente com base no organograma estiver ativa
      if (targetInstDocId && autoGenerateEstrutura && (instOrganograma.trim() || instComposicao.trim())) {
        try {
          generatedStats = await persistEstruturaFromOrganograma(
            targetInstDocId,
            instOrganograma.trim(),
            instComposicao.trim()
          );
        } catch (errGen) {
          console.warn("Aviso ao persistir estrutura baseada no organograma:", errGen);
        }
      }

      // Mensagem detalhada de sucesso
      if (editingInstId) {
        alert("Instituição atualizada com sucesso!");
      } else {
        if (generatedStats && generatedStats.orgaosCount > 0) {
          alert(
            `Instituição registada com sucesso!\n\n` +
            `A estrutura organizacional foi gerada com base no seu organograma:\n` +
            `• ${generatedStats.orgaosCount} Órgãos\n` +
            `• ${generatedStats.direcoesCount} Direções\n` +
            `• ${generatedStats.deptsCount} Departamentos\n` +
            `• ${generatedStats.repsCount} Repartições\n\n` +
            `Todos os nós foram vinculados à nova instituição e já estão disponíveis em todo o sistema!`
          );
        } else {
          alert("Instituição registada com sucesso!");
        }
      }

      // Notificar o sistema caso a instituição ativa tenha sido editada
      window.dispatchEvent(new CustomEvent("instituicao_updated", { detail: { id: targetInstDocId, payload } }));
      notifyEstruturaUpdated();
      
      // Clear fields
      setInstNome("");
      setInstLogo("");
      setInstPrimaryColor("#050b38");
      setInstSecondaryColor("#0d1b54");
      setInstAccentColor("#FFB800");
      setInstTipoActividades("");
      setInstOrganograma("");
      setInstComposicao("");
      setInstProvincia("");
      setInstDistrito("");
      setEditingInstId(null);
      setShowInstForm(false);
      setShowOrganogramaPreview(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao gravar a instituição.");
    } finally {
      setIsSavingInst(false);
    }
  };

  // Sincronização manual de organograma para instituições já existentes ou novas
  const handleSyncOrganogramaToEstrutura = async (inst: any) => {
    if (!inst) return;
    const orgText = (inst.organograma || "").trim();
    const compText = (inst.composicao || "").trim();

    if (!orgText && !compText) {
      alert("Esta instituição não possui texto de organograma ou composição definido.");
      return;
    }

    const conf = window.confirm(
      `Deseja sincronizar a estrutura organizacional de "${inst.nome}" com base no seu organograma?\n\n` +
      `Isto gerará os nós de Órgãos, Direções, Departamentos e Repartições na base de dados para esta instituição.`
    );
    if (!conf) return;

    setIsSyncingOrganograma(true);
    try {
      const stats = await persistEstruturaFromOrganograma(inst.id, orgText, compText);
      alert(
        `Estrutura organizacional gerada com sucesso para "${inst.nome}"!\n\n` +
        `• Órgãos criados: ${stats.orgaosCount}\n` +
        `• Direções criadas: ${stats.direcoesCount}\n` +
        `• Departamentos criados: ${stats.deptsCount}\n` +
        `• Repartições criadas: ${stats.repsCount}\n\n` +
        `A estrutura já está acessível no módulo de Gestão de Instituições e em todos os formulários.`
      );
      notifyEstruturaUpdated();
    } catch (err) {
      console.error(err);
      alert("Erro ao sincronizar a estrutura a partir do organograma.");
    } finally {
      setIsSyncingOrganograma(false);
    }
  };

  // Abertura do Modal de Confirmação In-App para exclusão da Instituição
  const handleOpenDeleteModal = (inst: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    console.log("Abrindo modal de exclusão para instituição:", inst.id, inst.nome);
    setInstToDelete(inst);
  };

  // Execução da Exclusão Completa da Instituição na Base de Dados e no Sistema
  const handleExecuteCompleteDelete = async () => {
    if (!instToDelete) return;
    const id = instToDelete.id;
    const nome = instToDelete.nome;

    setIsDeletingInst(true);
    try {
      console.log("Iniciando exclusão completa da instituição:", id, nome);

      // 1. Registar na lista de excluídos para evitar ressurgimento pelo fallback
      let deletedIds: string[] = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem("sigep_deleted_instituicoes") || "[]");
      } catch (_) {}
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem("sigep_deleted_instituicoes", JSON.stringify(deletedIds));
      }

      // 2. Apagar Utilizadores vinculados
      try {
        const allUsers = await fetchCollection<any>("users", 1000, null);
        const usersToDelete = allUsers.filter((u: any) => u.instituicaoId === id || u.tenantId === id);
        for (const user of usersToDelete) {
          await firestoreService.users.delete(user.id);
        }
      } catch (errUsers) {
        console.warn("Aviso ao eliminar utilizadores associados:", errUsers);
      }

      // 3. Apagar Direções Orgânicas vinculadas
      try {
        const allDirs = await fetchCollection<any>("direcoes_organicas", 1000, null);
        const dirsToDelete = allDirs.filter((d: any) => d.instituicaoId === id || d.tenantId === id);
        for (const dir of dirsToDelete) {
          await firestoreService.direcoes_organicas.delete(dir.id);
        }
      } catch (errDirs) {
        console.warn("Aviso ao eliminar direções vinculadas:", errDirs);
      }

      // 4. Apagar Órgãos Customizados vinculados
      try {
        const allOrgs = await fetchCollection<any>("orgaos_custom", 1000, null);
        const orgsToDelete = allOrgs.filter((o: any) => o.instituicaoId === id || o.tenantId === id);
        for (const org of orgsToDelete) {
          await firestoreService.orgaos_custom.delete(org.id);
        }
      } catch (errOrgs) {
        console.warn("Aviso ao eliminar órgãos vinculados:", errOrgs);
      }

      // 5. Apagar Adicionais de Estrutura vinculados
      try {
        const allAdds = await fetchCollection<any>("estrutura_adicionais", 1000, null);
        const addsToDelete = allAdds.filter((a: any) => a.instituicaoId === id || a.tenantId === id);
        for (const add of addsToDelete) {
          await firestoreService.estrutura_adicionais.delete(add.id);
        }
      } catch (errAdds) {
        console.warn("Aviso ao eliminar adicionais vinculados:", errAdds);
      }

      // 6. Eliminar o registo da instituição no Firestore
      await firestoreService.instituicoes.delete(id);

      // 7. Atualizar estado local imediatamente
      setInstituicoes((prev) => {
        const filtered = prev.filter((item) => item.id !== id);
        if (selectedInstId === id) {
          setSelectedInstId(filtered[0]?.id || "");
        }
        return filtered;
      });

      setNotificationMsg({
        type: "success",
        text: `A instituição "${nome}" e todos os seus dados foram excluídos com sucesso da base de dados e do sistema!`
      });

      // Fechar modal
      setInstToDelete(null);
    } catch (err: any) {
      console.error("Erro na exclusão completa da instituição:", err);
      setNotificationMsg({
        type: "error",
        text: `Erro ao excluir a instituição: ${err?.message || "Ocorreu uma falha durante o processo."}`
      });
    } finally {
      setIsDeletingInst(false);
    }
  };

  const triggerEditCurrentInst = () => {
    const currentInst = instituicoes.find((i) => i.id === selectedInstId);
    if (currentInst) {
      setEditingInstId(currentInst.id);
      setInstNome(currentInst.nome);
      setInstLogo(currentInst.logo || "");
      setInstPrimaryColor(currentInst.primaryColor || "#050b38");
      setInstSecondaryColor(currentInst.secondaryColor || "#0d1b54");
      setInstAccentColor(currentInst.accentColor || "#FFB800");
      setInstTipoActividades(currentInst.tipoActividades || "");
      setInstComposicao(currentInst.composicao || "");
      setInstOrganograma(currentInst.organograma || "");
      setInstProvincia(currentInst.provincia || "");
      setInstDistrito(currentInst.distrito || "");
      setShowInstForm(true);
      if (isGlobalAdmin && activeTab === "instituicoes") {
        setActiveTab("instituicoes");
      }
    }
  };

  const [selectedTipoInstituicao, setSelectedTipoInstituicao] = useState<string>("");

  const renderInstitutionForm = () => {
    if (!showInstForm) return null;
    return (
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-inner animate-fade-in space-y-4 my-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h4 className="font-black text-blue-900 text-base flex items-center gap-2">
            <Building size={18} className="text-blue-600" />
            {editingInstId ? "Editar Dados da Instituição" : "Registar Nova Instituição"}
          </h4>
          <button
            type="button"
            onClick={() => setShowInstForm(false)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
          >
            Cancelar
          </button>
        </div>

        <form onSubmit={handleSaveInst} className="space-y-4">
          {/* Seletor de Tipo */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
              Tipo de Instituição *
            </label>
            <select
              required
              value={selectedTipoInstituicao}
              onChange={(e) => setSelectedTipoInstituicao(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
            >
              <option value="">-- Selecione o tipo de instituição --</option>
              {Object.values(TIPOS_INSTITUICAO_CONFIG).map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.titulo}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                Nome da Instituição *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Instituto Superior Politécnico"
                value={instNome}
                onChange={(e) => setInstNome(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
              />
            </div>
            {/* ... restante do formulário ... */}

            {/* Tipo de Atividades */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                Tipo de Atividades
              </label>
              <input
                type="text"
                placeholder="Ex: Ensino Superior, Investigação, etc."
                value={instTipoActividades}
                onChange={(e) => setInstTipoActividades(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Província */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-blue-600 shrink-0" /> Província
              </label>
              <select
                value={instProvincia}
                onChange={(e) => {
                  const newProv = e.target.value;
                  setInstProvincia(newProv);
                  const distList = PROVINCIAS[newProv as keyof typeof PROVINCIAS] || [];
                  if (distList.length > 0 && !distList.includes(instDistrito)) {
                    setInstDistrito(distList[0]);
                  }
                }}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
              >
                <option value="">-- Selecione a Província --</option>
                {Object.keys(PROVINCIAS).map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Distrito */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-blue-600 shrink-0" /> Distrito
              </label>
              {instProvincia && PROVINCIAS[instProvincia as keyof typeof PROVINCIAS] ? (
                <select
                  value={instDistrito}
                  onChange={(e) => setInstDistrito(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                >
                  <option value="">-- Selecione o Distrito --</option>
                  {PROVINCIAS[instProvincia as keyof typeof PROVINCIAS].map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Selecione a província ou digite o distrito..."
                  value={instDistrito}
                  onChange={(e) => setInstDistrito(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Composição */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                Composição da Instituição (Faculdades, Departamentos...)
              </label>
              <textarea
                placeholder="Descreva a composição estrutural da instituição..."
                value={instComposicao}
                onChange={(e) => setInstComposicao(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none font-bold text-slate-800"
              />
            </div>

            {/* Organograma descritivo & Modelos Estruturais */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-4 rounded-xl border border-blue-100/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-[11px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ListTree size={14} className="text-blue-600" />
                    Organograma / Estrutura Hierárquica da Nova Instituição
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    A estrutura de Órgãos, Direções, Departamentos e Repartições será construída com base neste organograma.
                  </p>
                </div>

                {/* Modelos Rápidos */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Wand2 size={12} className="text-indigo-600" /> Modelos:
                  </span>
                  {MODELOS_ORGANOGRAMA.map((modelo) => (
                    <button
                      key={modelo.id}
                      type="button"
                      onClick={() => {
                        setInstOrganograma(modelo.texto);
                        if (!instComposicao.trim()) {
                          setInstComposicao(modelo.descricao);
                        }
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-md border border-slate-200 shadow-2xs transition"
                      title={modelo.descricao}
                    >
                      {modelo.titulo.split("/")[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder={`Defina a hierarquia por ramos, usando a convenção:\nÓrgão -> Direção -> Departamento -> Repartição\n\nExemplo:\nÓrgão de Direção Máxima -> Reitoria -> Gabinete do Reitor -> Secretaria Geral\nServiços Centrais -> Direção de Administração -> Departamento de Recursos Humanos -> Repartição de Pessoal`}
                value={instOrganograma}
                onChange={(e) => setInstOrganograma(e.target.value)}
                rows={5}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-800 leading-relaxed"
              />

              {/* Opções de Geração e Pré-visualização */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-blue-100/60">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoGenerateEstrutura}
                    onChange={(e) => setAutoGenerateEstrutura(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-xs font-bold text-blue-950">
                    Gerar automaticamente Órgãos, Direções e Departamentos na base de dados com base neste organograma
                  </span>
                </label>

                {instOrganograma.trim() && (
                  <button
                    type="button"
                    onClick={() => setShowOrganogramaPreview(!showOrganogramaPreview)}
                    className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-indigo-100 shadow-2xs transition ml-auto"
                  >
                    <ListTree size={13} />
                    {showOrganogramaPreview ? "Ocultar Pré-visualização" : "Pré-visualizar Nós Identificados"}
                  </button>
                )}
              </div>

              {/* Pré-visualização dos nós detectados pelo parser */}
              {showOrganogramaPreview && instOrganograma.trim() && (() => {
                const parsed = parseOrganogramaToEstrutura(instOrganograma, instComposicao);
                const totalOrgaos = parsed.length;
                let totalDirecoes = 0;
                let totalDepts = 0;
                let totalReps = 0;

                parsed.forEach((org) => {
                  totalDirecoes += org.direcoes.length;
                  org.direcoes.forEach((dir) => {
                    totalDepts += dir.departamentos.length;
                    dir.departamentos.forEach((dept) => {
                      totalReps += dept.reparticoes.length;
                    });
                  });
                });

                return (
                  <div className="bg-white p-3.5 rounded-lg border border-indigo-100 space-y-3 mt-2 shadow-2xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-extrabold text-slate-700">Resumo da Estrutura a Gerar:</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-black border border-blue-200">
                        {totalOrgaos} Órgãos
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-black border border-indigo-200">
                        {totalDirecoes} Direções
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-black border border-emerald-200">
                        {totalDepts} Departamentos
                      </span>
                      {totalReps > 0 && (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-black border border-purple-200">
                          {totalReps} Repartições
                        </span>
                      )}
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1 text-xs">
                      {parsed.map((org, oIdx) => (
                        <div key={oIdx} className="bg-slate-50 p-2 rounded border border-slate-100">
                          <div className="font-extrabold text-blue-900 flex items-center gap-1.5">
                            <Building size={12} className="text-blue-600" /> {org.nome}
                          </div>
                          <div className="pl-4 mt-1 space-y-1 text-slate-600 text-[11px]">
                            {org.direcoes.map((dir, dIdx) => (
                              <div key={dIdx}>
                                <span className="font-bold text-slate-800">• {dir.nome}</span>
                                {dir.departamentos.length > 0 && (
                                  <span className="text-slate-500 text-[10px] ml-1.5">
                                    ({dir.departamentos.map((dp) => dp.nome).join(", ")})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Logotipo drag and drop */}
          <div>
            <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
              Logotipo da Instituição
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleLogoDrop}
              className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50/50"
            >
              {instLogo ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  <img
                    src={instLogo}
                    alt="Previsão do Logotipo"
                    referrerPolicy="no-referrer"
                    className="h-16 object-contain rounded bg-white p-1 border border-slate-200"
                  />

                  {/* Cores Extraídas Automaticamente do Logótipo */}
                  <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-sm w-full max-w-sm">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Palette size={14} className="text-blue-600" />
                      <span>Cores da Área de Trabalho (Extraídas do Logotipo)</span>
                      {isExtractingColors && <Loader2 size={12} className="animate-spin text-blue-500 ml-1" />}
                    </div>
                    <div className="flex items-center justify-center gap-3 w-full">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-7 h-7 rounded-lg border border-slate-300 shadow-sm"
                          style={{ backgroundColor: instPrimaryColor }}
                          title={`Cor Primária: ${instPrimaryColor}`}
                        />
                        <span className="text-[9px] font-semibold text-slate-500 mt-1">Primária</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-7 h-7 rounded-lg border border-slate-300 shadow-sm"
                          style={{ backgroundColor: instSecondaryColor }}
                          title={`Cor Secundária: ${instSecondaryColor}`}
                        />
                        <span className="text-[9px] font-semibold text-slate-500 mt-1">Secundária</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-7 h-7 rounded-lg border border-slate-300 shadow-sm"
                          style={{ backgroundColor: instAccentColor }}
                          title={`Cor de Destaque: ${instAccentColor}`}
                        />
                        <span className="text-[9px] font-semibold text-slate-500 mt-1">Destaque</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">
                      Esta paleta será aplicada automaticamente ao cabeçalho e ambiente desta instituição.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setInstLogo("");
                      setInstPrimaryColor("#050b38");
                      setInstSecondaryColor("#0d1b54");
                      setInstAccentColor("#FFB800");
                    }}
                    className="text-[10px] text-red-500 hover:text-red-700 font-bold"
                  >
                    Remover Logotipo
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Arraste e solte o logotipo aqui</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">ou selecione um arquivo de imagem do computador</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-input-file"
                  />
                  <label
                    htmlFor="logo-input-file"
                    className="bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Procurar Ficheiro
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Submissão */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowInstForm(false)}
              className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSavingInst}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition shadow cursor-pointer disabled:opacity-50"
            >
              {isSavingInst ? "A Gravar..." : "Gravar Instituição"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Barra de Navegação Superior (Tabs) se for Admin Global */}
      {isGlobalAdmin && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white p-2.5 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("instituicoes");
                setSelectedUnit(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "instituicoes"
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400/30"
                  : "text-slate-600 hover:text-blue-700 hover:bg-slate-100/70"
              }`}
            >
              <Building size={16} />
              <span>Gestão de Instituições</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("estrutura");
                setSelectedUnit(null);
              }}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "estrutura"
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400/30"
                  : "text-slate-600 hover:text-blue-700 hover:bg-slate-100/70"
              }`}
            >
              <Network size={16} />
              <span>Estrutura Geral da Instituição</span>
              <span className="ml-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-white/20 text-white truncate max-w-[180px]">
                {instituicoes.find((i) => i.id === selectedInstId)?.nome || "ISPS"}
              </span>
              <span 
                className="ml-0.5 p-1 hover:bg-white/30 rounded transition" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  triggerEditCurrentInst(); 
                }}
                title="Editar dados da instituição"
              >
                <Edit size={12} />
              </span>
            </button>
          </div>

          {/* Seletor rápido para alternar e explorar qualquer instituição */}
          {activeTab === "estrutura" && instituicoes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-slate-700 ml-auto">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider font-extrabold hidden sm:inline">Explorar Instituição:</span>
              <select
                value={selectedInstId}
                onChange={(e) => {
                  setSelectedInstId(e.target.value);
                  setSelectedUnit(null);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
              >
                {instituicoes.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.nome}
                  </option>
                ))}
              </select>

              {/* Indicador e Ativador da Instituição Ativa no Sistema */}
              {selectedInstId === getActiveInstituicaoId() ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl text-[11px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ativa no Menu Principal
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveInstituicaoId(selectedInstId);
                    notifyEstruturaUpdated();
                  }}
                  className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 px-3 py-1 rounded-xl text-[11px] font-bold transition shadow-xs cursor-pointer"
                  title="Definir esta instituição como a ativa para visualização de menus e operações no sistema"
                >
                  <Check size={13} />
                  <span>Ativar no Menu do Sistema</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Conteúdo da aba GESTÃO DE INSTITUIÇÕES */}
      {activeTab === "instituicoes" && isGlobalAdmin && (
        <div className="space-y-6">
          {/* Header com botão de registo */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-blue-900">Instituições Registadas</h2>
              <p className="text-xs text-gray-500">Registe e faça a gestão das instituições que utilizam o sistema.</p>
            </div>
            {!showInstForm && (
              <button
                onClick={() => {
                  setEditingInstId(null);
                  setInstNome("");
                  setInstLogo("");
                  setInstTipoActividades("");
                  setInstOrganograma("");
                  setInstComposicao("");
                  setInstProvincia("");
                  setInstDistrito("");
                  setShowInstForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm ml-auto cursor-pointer"
              >
                <Plus size={16} /> Registar Instituição
              </button>
            )}
          </div>

          {/* Formulário de Registo/Edição de Instituição */}
          {renderInstitutionForm()}

          {/* Mensagem de Notificação de Operações */}
          {notificationMsg && (
            <div
              className={`p-4 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                notificationMsg.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              <div className="flex items-center gap-3">
                {notificationMsg.type === "success" ? (
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle size={20} className="text-red-600 shrink-0" />
                )}
                <p className="text-xs font-bold leading-relaxed">{notificationMsg.text}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationMsg(null)}
                className="p-1.5 hover:bg-black/5 rounded-lg text-slate-500 hover:text-slate-800 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Lista de Instituições Registadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instituicoes.length === 0 ? (
              <div className="col-span-full text-center bg-white border border-gray-100 p-12 rounded-3xl text-gray-500 text-sm">
                Nenhuma instituição registada até ao momento. Clique em "Registar Instituição" para começar!
              </div>
            ) : (
              instituicoes.map((inst) => (
                <div
                  key={inst.id}
                  onClick={() => {
                    setSelectedInstId(inst.id);
                    setActiveTab("estrutura");
                    setSelectedUnit(null);
                  }}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-300 hover:bg-blue-50/20 transition cursor-pointer group"
                >
                  <div className="space-y-4">
                    {/* Logotipo e Nome */}
                    <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                      <div className="flex items-center gap-4">
                        {inst.logo ? (
                          <img
                            src={inst.logo}
                            alt={inst.nome}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1 shrink-0 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Building size={20} />
                          </div>
                        )}
                        <div>
                          <h3 className="font-extrabold text-blue-900 text-base leading-tight group-hover:text-blue-700 transition-colors">{inst.nome}</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                            {inst.tipoActividades || "Sem tipo de atividade"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Badge com a Paleta de Cores Extraída do Logotipo */}
                      <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100" title="Cores extraídas do logotipo">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-xs"
                          style={{ backgroundColor: inst.primaryColor || "#050b38" }}
                          title={`Primária: ${inst.primaryColor || "#050b38"}`}
                        />
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-xs"
                          style={{ backgroundColor: inst.secondaryColor || "#0d1b54" }}
                          title={`Secundária: ${inst.secondaryColor || "#0d1b54"}`}
                        />
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-200 shadow-xs"
                          style={{ backgroundColor: inst.accentColor || "#FFB800" }}
                          title={`Destaque: ${inst.accentColor || "#FFB800"}`}
                        />
                      </div>
                    </div>

                    {/* Detalhes */}
                    <div className="space-y-3">
                      {(inst.provincia || inst.distrito) && (
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-bold bg-slate-50 border border-slate-100/80 p-2.5 rounded-xl">
                          <MapPin size={14} className="text-blue-600 shrink-0" />
                          <span className="truncate">
                            {inst.distrito ? `${inst.distrito}, ` : ""}
                            {inst.provincia || ""}
                          </span>
                        </div>
                      )}
                      {inst.composicao && (
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Composição</p>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 font-bold">{inst.composicao}</p>
                        </div>
                      )}
                      {inst.organograma && (
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Organograma Geral</p>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 font-bold">{inst.organograma}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInstId(inst.id);
                        setActiveTab("estrutura");
                        setSelectedUnit(null);
                      }}
                      className="text-xs text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 font-black flex items-center gap-1.5 py-2 px-3 rounded-xl transition-all shadow-sm cursor-pointer"
                      title="Navegar pela Estrutura Geral da Instituição"
                    >
                      <Network size={14} /> Estrutura Geral
                    </button>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onRegistarAdmin(inst.id)}
                        className="text-xs text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-xl transition font-bold cursor-pointer"
                        title="Registar Administrador da Instituição"
                      >
                        Registar Admin
                      </button>
                      {(inst.organograma || inst.composicao) && (
                        <button
                          type="button"
                          onClick={() => handleSyncOrganogramaToEstrutura(inst)}
                          disabled={isSyncingOrganograma}
                          className="text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-xl transition font-bold cursor-pointer flex items-center gap-1"
                          title="Gerar / Sincronizar Estrutura a partir do Organograma"
                        >
                          <ListTree size={14} className={isSyncingOrganograma ? "animate-spin" : "text-indigo-600"} />
                          <span className="hidden sm:inline">Gerar Estrutura</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingInstId(inst.id);
                          setInstNome(inst.nome);
                          setInstLogo(inst.logo || "");
                          setInstPrimaryColor(inst.primaryColor || "#050b38");
                          setInstSecondaryColor(inst.secondaryColor || "#0d1b54");
                          setInstAccentColor(inst.accentColor || "#FFB800");
                          setInstTipoActividades(inst.tipoActividades || "");
                          setInstComposicao(inst.composicao || "");
                          setInstOrganograma(inst.organograma || "");
                          setInstProvincia(inst.provincia || "");
                          setInstDistrito(inst.distrito || "");
                          setShowInstForm(true);
                        }}
                        className="text-xs text-gray-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 p-2 rounded-xl transition cursor-pointer"
                        title="Editar Instituição"
                      >
                        <Briefcase size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleOpenDeleteModal(inst, e)}
                        className="text-red-500 hover:text-white bg-red-50 hover:bg-red-600 active:bg-red-700 border border-red-200 hover:border-red-600 p-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center group"
                        title={`Eliminar Instituição: ${inst.nome}`}
                      >
                        <Trash2 size={15} className="transition-transform duration-200 group-hover:scale-110 pointer-events-none" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. Conteúdo da aba ESTRUTURA ORGÂNICA */}
      {activeTab === "estrutura" && (
        <div className="space-y-6">
          {/* Seletor de Instituição para Administrador Global ou Banner para Administrador da Instituição */}
          {isGlobalAdmin ? (
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Network size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-blue-900 text-sm">Estrutura Geral da Instituição</h3>
                  <p className="text-xs text-gray-400">Navegue e explore a estrutura orgânica, órgãos, direções, departamentos e setores.</p>
                </div>
              </div>
              <div className="relative w-full sm:w-[320px]">
                <select
                  value={selectedInstId}
                  onChange={(e) => {
                    setSelectedInstId(e.target.value);
                    setSelectedUnit(null);
                  }}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-xs focus:border-blue-500 focus:outline-none transition-all w-full pr-10 font-black cursor-pointer"
                >
                  <option value="isps">Instituto Superior Politécnico de Songo (Padrão)</option>
                  {instituicoes.filter((inst) => inst.id !== "isps").map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : isInstitutionalAdmin ? (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                  <Building size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-200">Painel do Administrador da Instituição</div>
                  <h3 className="font-black text-lg text-white">Gestão da Sua Instituição</h3>
                  <p className="text-xs text-blue-100 opacity-90">Faça a gestão da estrutura orgânica, órgãos, direções, departamentos, repartições e setores da sua instituição.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={triggerEditCurrentInst}
                className="bg-white text-blue-950 hover:bg-blue-50 px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition shadow cursor-pointer"
              >
                <Edit size={16} className="text-blue-600" />
                Editar Dados da Instituição
              </button>
            </div>
          ) : null}

          {/* Formulário de Edição da Instituição (quando acionado na aba estrutura) */}
          {renderInstitutionForm()}

          {/* Informações Básicas da Instituição Ativa */}
          {(() => {
            const currentInst = instituicoes.find((i) => i.id === selectedInstId);
            if (!currentInst) return null;
            return (
              <div 
                onClick={triggerEditCurrentInst}
                className="bg-slate-50 border border-slate-200/60 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer p-6 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-fade-in transition group relative"
                title="Clique aqui para atualizar os dados desta instituição"
              >
                <div className="md:col-span-2 flex justify-center">
                  {currentInst.logo ? (
                    <img
                      src={currentInst.logo}
                      alt={currentInst.nome}
                      referrerPolicy="no-referrer"
                      className="h-20 object-contain rounded-2xl bg-white p-2 shadow-sm border border-slate-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-sm border border-slate-100">
                      <Building size={32} />
                    </div>
                  )}
                </div>
                <div className="md:col-span-10 space-y-2 text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h2 className="text-2xl font-black text-blue-900 group-hover:text-blue-700 transition flex items-center gap-2">
                      {currentInst.nome}
                      <Edit size={16} className="text-blue-500 opacity-60 group-hover:opacity-100 transition" />
                    </h2>
                    <span className="bg-blue-100 text-blue-800 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full w-max">
                      {currentInst.tipoActividades || "Atividade Geral"}
                    </span>
                  </div>
                  {(currentInst.provincia || currentInst.distrito) && (
                    <p className="text-xs text-slate-600 leading-relaxed flex items-center gap-1.5 font-semibold">
                      <MapPin size={14} className="text-blue-600 shrink-0" />
                      <span className="font-extrabold text-slate-700">Localização: </span>
                      <span>
                        {currentInst.distrito ? `${currentInst.distrito}, ` : ""}
                        {currentInst.provincia || ""}
                      </span>
                    </p>
                  )}
                  {currentInst.composicao && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-extrabold text-slate-700">Composição: </span> {currentInst.composicao}
                    </p>
                  )}
                  {currentInst.organograma && (
                    <div className="bg-white/90 p-3 rounded-xl border border-slate-200/80 space-y-2 mt-2 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                          <ListTree size={14} className="text-blue-600" />
                          Organograma Hierárquico Base:
                        </span>
                        {currentInst.id !== "isps" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSyncOrganogramaToEstrutura(currentInst);
                            }}
                            disabled={isSyncingOrganograma}
                            className="text-[11px] font-bold text-blue-700 hover:text-white hover:bg-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw size={12} className={isSyncingOrganograma ? "animate-spin" : ""} />
                            {isSyncingOrganograma ? "A Sincronizar..." : "Sincronizar Nós na Base de Dados"}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-mono whitespace-pre-line bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-h-32 overflow-y-auto leading-relaxed">
                        {currentInst.organograma}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Orgãos e Direções Subordinadas */}
          {!selectedUnit ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-blue-900">Órgãos & Unidades Estruturais</h2>
              <p className="text-xs text-gray-500">Navegue ou registe novos órgãos e as suas respetivas direções subordinadas.</p>
            </div>
            {!showOrganForm && (
              <button
                onClick={() => setShowOrganForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm ml-auto"
              >
                <Plus size={16} /> Registar Novo Órgão
              </button>
            )}
          </div>

          {showOrganForm && (
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-inner animate-fade-in space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h4 className="font-black text-blue-900 text-base flex items-center gap-2">
                  <Building size={18} className="text-blue-600" />
                  Registar Novo Órgão / Unidade Estrutural
                </h4>
                <button
                  type="button"
                  onClick={() => setShowOrganForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleAddOrgan} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Nome do Órgão / Unidade *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Órgão de Apoio Social"
                      value={newOrganTitle}
                      onChange={(e) => setNewOrganTitle(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Tipo de Unidade Estrutural
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Unidade de Gestão e Apoio"
                      value={newOrganType}
                      onChange={(e) => setNewOrganType(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOrganForm(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingOrgan}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition shadow"
                  >
                    {isSavingOrgan ? "A Gravar..." : "Gravar Órgão"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {mergedOrgaos.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-4 max-w-xl mx-auto my-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <ListTree size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-blue-900">
                  Nenhum Órgão Registado Ainda
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {(() => {
                    const currentInst = instituicoes.find((i) => i.id === selectedInstId);
                    if (currentInst && (currentInst.organograma || currentInst.composicao)) {
                      return "Esta instituição possui um organograma definido. Pode gerar toda a estrutura de órgãos, direções e departamentos automaticamente com um clique.";
                    }
                    return "Pode registar novos órgãos manualmente ou definir o organograma nas informações da instituição.";
                  })()}
                </p>
              </div>

              {(() => {
                const currentInst = instituicoes.find((i) => i.id === selectedInstId);
                if (currentInst && (currentInst.organograma || currentInst.composicao)) {
                  return (
                    <button
                      type="button"
                      onClick={() => handleSyncOrganogramaToEstrutura(currentInst)}
                      disabled={isSyncingOrganograma}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 mx-auto transition shadow-sm cursor-pointer"
                    >
                      <Wand2 size={15} className={isSyncingOrganograma ? "animate-spin" : ""} />
                      {isSyncingOrganograma ? "A Gerar Estrutura..." : "Gerar Estrutura a partir do Organograma"}
                    </button>
                  );
                }
                return null;
              })()}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mergedOrgaos.map((dir: any, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedUnit(dir);
                    setShowRegistoForm(false);
                  }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 text-center transition-all flex flex-col items-center justify-between cursor-pointer relative group min-h-[180px]"
                >
                  {dir.isCustom && (
                    <button
                      onClick={(e) => handleDeleteOrgan(dir.id, e)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200"
                      title="Eliminar Órgão"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                      <Building size={24} />
                    </div>
                    <h3 className="font-bold text-blue-900 text-lg leading-tight">
                      {dir.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 font-medium tracking-widest mt-4">
                    {dir.type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => setSelectedUnit(null)}
              className="text-blue-600 font-bold flex items-center gap-2 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft size={16} /> Voltar à Estrutura
            </button>

            {!showRegistoForm && (
              <button
                onClick={() => setShowRegistoForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm"
              >
                <Plus size={16} /> Registar Nova Direção
              </button>
            )}
          </div>

          <div>
            <h3 className="text-3xl font-black text-blue-900">
              {selectedUnit.title}
            </h3>
            <p className="text-sm font-bold text-blue-400 tracking-widest mt-1">
              {selectedUnit.type}
            </p>
          </div>

          {showRegistoForm ? (
            <div className="bg-slate-50/70 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-inner animate-fade-in">
              <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                <h4 className="font-black text-blue-900 text-lg flex items-center gap-2">
                  <Briefcase size={20} className="text-blue-600" />
                  Registar Nova Direção / Gabinete em: {selectedUnit.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowRegistoForm(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleSaveDirecao} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Nome / Título da Direção *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Gabinete de Inovação Pedagógica"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Sigla / Abreviação
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: GIP"
                      value={sigla}
                      onChange={(e) => setSigla(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Responsável / Diretor *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Prof. Dr. Armando Sampaio"
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Data de Início de Funções
                    </label>
                    <input
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Email de Contacto
                    </label>
                    <input
                      type="email"
                      placeholder="Ex: direcao.gip@instituto.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Telefone de Contacto
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: +244 923 456 789"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Departamentos / Órgãos Subordinados (Separados por vírgula)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Departamento de Apoio ao Estudante, Repartição de Projetos Sociais"
                      value={departamentosRaw}
                      onChange={(e) => setDepartamentosRaw(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Insira os nomes separados por vírgula para cadastrar múltiplos departamentos subordinados.</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">
                      Missão / Descrição da Direção
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Supervisionar e formular as estratégias de modernização e inovação pedagógica dos planos curriculares..."
                      value={missao}
                      onChange={(e) => setMissao(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowRegistoForm(false)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition shadow"
                  >
                    {isSaving ? "A Gravar..." : "Gravar Direção"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6 mt-8">
              <h4 className="font-black text-gray-800 text-lg border-b border-gray-100 pb-2">
                Estrutura Interna (Direções / Comissões)
              </h4>

              {fullyEnrichedDirecoes.length === 0 ? (
                <p className="text-gray-400 italic">
                  Nenhuma direção cadastrada neste órgão.
                </p>
              ) : (
                fullyEnrichedDirecoes.map((dir: any, idx: number) => {
                  const dirTitle = dir.rawTitle || dir.title.split(" (")[0] || dir.title;
                  return (
                    <div
                      key={idx}
                      className="bg-gray-50/50 border border-gray-100 p-6 rounded-[1.5rem] relative hover:border-slate-300 transition"
                    >
                      <button
                        onClick={() => handleDeleteCustom(dir)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition"
                        title="Eliminar Direção e todos os dados associados"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pr-12">
                        <h5 className="font-black text-blue-900 text-xl flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm shadow-md">
                            {idx + 1}
                          </div>
                          {dir.title}
                        </h5>

                        {/* Botão de Acesso Operacional à Direção */}
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedInstId) setActiveInstituicaoId(selectedInstId);
                            onNavigateToWorkspace?.(dirTitle, selectedInstId);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                          title={`Aceder e operar a área de trabalho da direção: ${dirTitle}`}
                        >
                          <ExternalLink size={13} />
                          <span>Operar Direção</span>
                        </button>
                      </div>

                      {/* Diretor e Contactos */}
                      {(dir.responsavel || dir.email || dir.telefone || dir.missao) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-100 mb-4 text-xs text-slate-600 md:ml-14">
                          {dir.responsavel && (
                            <div className="flex items-center gap-2">
                              <User size={14} className="text-blue-500" />
                              <span className="font-semibold text-slate-800">{dir.responsavel}</span>
                            </div>
                          )}
                          {dir.email && (
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-blue-500" />
                              <span className="truncate">{dir.email}</span>
                            </div>
                          )}
                          {dir.telefone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-blue-500" />
                              <span>{dir.telefone}</span>
                            </div>
                          )}
                          {dir.dataInicio && (
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-blue-500" />
                              <span>Início: {dir.dataInicio}</span>
                            </div>
                          )}
                          {dir.missao && (
                            <div className="col-span-1 md:col-span-2 lg:col-span-4 border-t border-slate-50 pt-2 flex gap-1.5 items-start text-[11px] italic">
                              <FileText size={12} className="text-slate-400 mt-0.5" />
                              <span><strong>Missão:</strong> {dir.missao}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-4 md:pl-14">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-2">
                          <h6 className="font-bold text-gray-500 text-xs tracking-widest flex items-center gap-2">
                            <Network size={14} />
                            Departamentos / Órgãos Subordinados ({dir.departamentos?.length || 0})
                          </h6>
                          
                          {/* Inline Add Department */}
                          <div className="flex items-center gap-1.5 w-full sm:w-auto">
                            <input
                              type="text"
                              placeholder="Novo Departamento"
                              value={newDeptName[dirTitle] || ""}
                              onChange={(e) => setNewDeptName(prev => ({ ...prev, [dirTitle]: e.target.value }))}
                              className="p-1.5 px-3 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-blue-500 outline-none w-44"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddDept(dirTitle)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                            >
                              <Plus size={14} /> Add
                            </button>
                          </div>
                        </div>
                        
                        {(!dir.departamentos || dir.departamentos.length === 0) ? (
                          <p className="text-gray-400 italic text-sm">
                            Nenhum departamento cadastrado neste órgão.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {dir.departamentos.map((dept: any, deptIdx: number) => {
                              const repKey = `${dirTitle}-${dept.title}`;
                              return (
                                <div
                                  key={deptIdx}
                                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex justify-between items-start gap-2 border-b border-gray-50 pb-2 mb-4">
                                      <div className="space-y-1">
                                        <p className="font-bold text-gray-800 text-base leading-tight">
                                          {dept.title}
                                        </p>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (selectedInstId) setActiveInstituicaoId(selectedInstId);
                                            onNavigateToWorkspace?.(dept.title, selectedInstId);
                                          }}
                                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                                          title={`Aceder à área de trabalho do departamento: ${dept.title}`}
                                        >
                                          <ExternalLink size={11} />
                                          <span>Operar Departamento</span>
                                        </button>
                                      </div>
                                      {dept.isCustom && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteAdicional(dept.id)}
                                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                                          title="Eliminar Departamento"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      )}
                                    </div>
                                    <div className="space-y-3">
                                      <p className="text-[10px] text-blue-400 font-bold tracking-widest flex items-center gap-1.5">
                                        <ChevronRight size={12} />
                                        Repartições / Setores ({dept.reparticoes?.length || 0})
                                      </p>
                                      {dept.reparticoes && dept.reparticoes.length > 0 ? (
                                        <ul className="space-y-2">
                                          {dept.reparticoes.map(
                                            (rep: any, repIdx: number) => (
                                              <li
                                                key={repIdx}
                                                className="text-sm text-gray-600 flex items-center justify-between gap-2.5"
                                              >
                                                <div className="flex items-start gap-2.5">
                                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0"></div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      if (selectedInstId) setActiveInstituicaoId(selectedInstId);
                                                      onNavigateToWorkspace?.(rep.name || rep, selectedInstId);
                                                    }}
                                                    className="leading-tight text-left hover:text-blue-700 hover:underline cursor-pointer inline-flex items-center gap-1 font-medium"
                                                    title={`Aceder à área de trabalho do setor: ${rep.name || rep}`}
                                                  >
                                                    <span>{rep.name || rep}</span>
                                                    <ExternalLink size={10} className="text-blue-500 opacity-60 shrink-0" />
                                                  </button>
                                                </div>
                                                {rep.isCustom && (
                                                  <button
                                                    type="button"
                                                    onClick={() => handleDeleteAdicional(rep.id)}
                                                    className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition shrink-0"
                                                    title="Eliminar Repartição"
                                                  >
                                                    <Trash2 size={12} />
                                                  </button>
                                                )}
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      ) : (
                                        <p className="text-xs text-gray-400 italic">Sem repartições específicas.</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Inline Add Repartição */}
                                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      placeholder="Nova Repartição / Setor"
                                      value={newRepName[repKey] || ""}
                                      onChange={(e) => setNewRepName(prev => ({ ...prev, [repKey]: e.target.value }))}
                                      className="w-full p-1.5 px-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleAddRep(dirTitle, dept.title)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                                    >
                                      <Plus size={13} /> Add
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
        </div>
      )}

      {/* MODAL IN-APP DE CONFIRMAÇÃO DE EXCLUSÃO DA INSTITUIÇÃO */}
      {instToDelete && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => !isDeletingInst && setInstToDelete(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => !isDeletingInst && setInstToDelete(null)}
              disabled={isDeletingInst}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition disabled:opacity-50 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 ring-8 ring-red-50">
                <Trash2 size={28} />
              </div>

              <h3 className="text-lg font-black text-slate-900">
                Excluir Instituição Definitivamente?
              </h3>

              <div className="my-4 p-3.5 bg-red-50/70 border border-red-100 rounded-2xl w-full text-left flex items-center gap-3">
                {instToDelete.logo ? (
                  <img
                    src={instToDelete.logo}
                    alt={instToDelete.nome}
                    className="w-11 h-11 object-contain rounded-xl bg-white p-1 shrink-0 border border-red-100"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-red-200 text-red-700 flex items-center justify-center shrink-0">
                    <Building size={22} />
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-slate-900 truncate">{instToDelete.nome}</p>
                  <p className="text-[10px] text-red-700 font-bold uppercase tracking-wider mt-0.5">
                    {instToDelete.tipoActividades || "Ensino Superior e Investigação"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Esta ação é <span className="font-bold text-red-600">permanente e irreversível</span>. A instituição, todos os utilizadores associados e toda a sua estrutura orgânica serão excluídos completamente da base de dados e do sistema.
              </p>

              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setInstToDelete(null)}
                  disabled={isDeletingInst}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteCompleteDelete}
                  disabled={isDeletingInst}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-xs transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isDeletingInst ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      A excluir...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Sim, Excluir
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
