import React from 'react';
import { toTitleCase as tc } from '../lib/utils';

export function resolveOrgaoName(unidadeName?: any, direcaoName?: any): string {
  if (unidadeName && String(unidadeName).trim() && unidadeName !== "Unidade Orgânica") {
    const uUpper = String(unidadeName).toUpperCase().trim();
    if (uUpper.includes("SERVIÇO") || uUpper.includes("SERVICO") || uUpper === "SC") {
      return "Serviços Centrais";
    }
    if (uUpper.includes("DIREÇÃO E GESTÃO") || uUpper.includes("DIRECAO E GESTAO") || uUpper === "ODG") {
      return "Órgão de Direção e Gestão";
    }
    if (uUpper.includes("ORGÂNICA") || uUpper.includes("ORGANICA") || uUpper === "UO") {
      return "Unidade Orgânica";
    }
    return tc(String(unidadeName));
  }

  if (direcaoName) {
    const dUpper = String(direcaoName).toUpperCase().trim();
    if (
      dUpper.includes("DICOSAFA") ||
      dUpper.includes("DICOSSER") ||
      dUpper.includes("SERVIÇO") ||
      dUpper.includes("SERVICO")
    ) {
      return "Serviços Centrais";
    }
    if (
      dUpper.includes("GABINETE") ||
      dUpper.includes("DIRETOR-GERAL") ||
      dUpper.includes("DIREÇÃO E GESTÃO") ||
      dUpper.includes("DIRECAO E GESTAO") ||
      dUpper.includes("CONSELHO") ||
      dUpper.includes("GDG")
    ) {
      return "Órgão de Direção e Gestão";
    }
    if (
      dUpper.includes("ENGENHARIA") ||
      dUpper.includes("DIVISÃO") ||
      dUpper.includes("DIVISAO") ||
      dUpper.includes("INCUBACAO") ||
      dUpper.includes("CIE") ||
      dUpper.includes("CENTRO")
    ) {
      return "Unidade Orgânica";
    }
  }

  return tc(String(unidadeName || "Unidade Orgânica"));
}

export const InstitutionalHeader = ({
  direcaoName,
  departamentoName,
  reparticaoName,
  sectorName,
  year,
  isOwner,
  isPlanificacaoHeader,
  unidadeName,
  title = "Plano de Actividade",
}: {
  direcaoName?: string;
  departamentoName?: string;
  reparticaoName?: string;
  sectorName?: string;
  year: number;
  isOwner?: boolean;
  isPlanificacaoHeader?: boolean;
  unidadeName?: string;
  title?: string;
}) => {
  const selectedYear = year || 2025;
  const isPESOEHeader = String(title || "").toUpperCase().includes("PESOE");

  // Resolver instituição personalizada do utilizador autenticado
  let instName = "Instituto Superior Politécnico de Songo";
  let instLogo = "https://lh3.googleusercontent.com/d/11zvvpOpZARM1yk_irEDpjJ-qBKlTlhad";
  try {
    const stored = localStorage.getItem("sigep_logged_in_user") || localStorage.getItem("sigep_user");
    if (stored) {
      const u = JSON.parse(stored);
      if (u.instituicaoNome) instName = u.instituicaoNome;
      else if (u.instituicao && typeof u.instituicao === "string" && !u.instituicao.startsWith("inst-")) instName = u.instituicao;
      else if (u.tenantName) instName = u.tenantName;

      if (u.instituicaoLogo) instLogo = u.instituicaoLogo;
    }
  } catch (e) {}

  if (unidadeName && unidadeName !== "Instituto Superior Politécnico de Songo" && unidadeName !== "ISPS") {
    instName = unidadeName;
  }

  // Garantir que os nomes estão formatados corretamente e resolver o Órgão correto para Plano de Atividade
  const displayUnidade = resolveOrgaoName(unidadeName || instName, direcaoName);
  const displayDirecao = tc(String(direcaoName || "").trim());
  const displayDepartamento = tc(String(departamentoName || "").trim());
  const displayReparticao = tc(String(reparticaoName || "").trim());
  const displaySector = tc(String(sectorName || "").trim());

  let lowestLevelName = "";
  if (displaySector) {
    lowestLevelName = displaySector.toLowerCase().startsWith("setor") ? displaySector : `Setor de ${displaySector}`;
  } else if (displayReparticao) {
    lowestLevelName = displayReparticao.toLowerCase().startsWith("repartição") || displayReparticao.toLowerCase().startsWith("reparticao")
      ? displayReparticao
      : `Repartição de ${displayReparticao}`;
  } else if (displayDepartamento) {
    lowestLevelName = displayDepartamento;
  } else if (displayDirecao) {
    lowestLevelName = displayDirecao;
  } else {
    lowestLevelName = displayUnidade;
  }

  let displayTitle = tc(String(title || "Plano de Actividade").trim());
  if (displayTitle.toLowerCase() === "plano de actividade" || displayTitle.toLowerCase() === "plano de actividades") {
    if (lowestLevelName) {
      displayTitle = `Plano de Actividade de ${lowestLevelName}`;
    }
  }

  // CABEÇALHO DO PESOE (OFICIAL GOVERNAMENTAL)
  if (isPESOEHeader) {
    return (
      <div className="text-center mb-6 flex flex-col items-center justify-center w-full bg-slate-50/50 p-8 rounded-t-[2.5rem] print:p-4 print:mb-4 print:w-full print:items-center print:text-center">
        {/* 1. Emblema da República de Moçambique */}
        <div className="mb-4 flex justify-center items-center w-full text-center print:mb-3 print:flex print:justify-center print:items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUZVTEsRFhrjEogw8WJJ1Z-ofxr7pQ81TcwMtaHh8Plw&s=10"
            alt="Emblema da República de Moçambique"
            className="w-28 h-auto object-contain mx-auto print:mx-auto print:block"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 2. Cabeçalho Oficial do Estado / Ministério */}
        <div className="flex flex-col items-center gap-1 mb-5">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-[0.15em] uppercase">
            República de Moçambique
          </h3>
          <h4 className="text-sm font-bold text-slate-700 tracking-[0.1em] uppercase">
            Ministério da Educação e Cultura
          </h4>
          <h4 className="text-sm font-bold text-slate-700 tracking-[0.1em] uppercase">
            Direcção Nacional de Ensino Superior
          </h4>
        </div>

        {/* 3. Instituto Superior Politécnico de Songo */}
        <h2 className="text-[1.8rem] font-black text-slate-900 tracking-tight mb-2 uppercase">
          {instName}
        </h2>

        {/* 4. Província e Distrito */}
        <div className="flex flex-col items-center gap-0.5 mb-6">
          <h3 className="text-xs font-bold text-slate-600 tracking-[0.12em] uppercase">
            {instName.toLowerCase().includes("songo") ? "Província de Tete" : "Moçambique"}
          </h3>
          <h3 className="text-xs font-bold text-slate-600 tracking-[0.12em] uppercase">
            {instName.toLowerCase().includes("songo") ? "Distrito de Cahora-Bassa" : "Sede Principal"}
          </h3>
        </div>
        
        {/* 5. Título Principal em Destaque */}
        <h5 className="text-[1.25rem] font-black text-red-600 mt-2 tracking-tight uppercase">
          {`PROPOSTA DE ATIVIDADES PARA O PESO ${selectedYear}`}
        </h5>

        {/* 6. Linha Divisória */}
        <div className="w-full max-w-4xl h-[2px] bg-slate-800 mt-5 mb-5"></div>

        {/* 7. Exercício Económico */}
        <div className="mt-1">
          <span className="text-xs font-black text-slate-800 tracking-wider bg-slate-200/60 px-6 py-2 rounded-xl border border-slate-300">
            Exercício Económico: {selectedYear}
          </span>
        </div>
      </div>
    );
  }

  // CABEÇALHO DO PLANO DE ATIVIDADE (FORMATO EXATO DA IMAGEM)
  return (
    <div className="text-center mb-6 flex flex-col items-center justify-center w-full bg-slate-50/50 p-8 rounded-t-[2.5rem] print:p-4 print:mb-4 print:w-full print:items-center print:text-center">
      {/* 1. Logotipo do ISPS Centrado */}
      <div className="mb-6 flex justify-center items-center w-full text-center print:mb-4 print:flex print:justify-center print:items-center">
        <img
          src={instLogo}
          alt={`Logotipo ${instName}`}
          className="w-36 h-auto max-h-36 object-contain mx-auto print:mx-auto print:block rounded-xl"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 2. Nome do Instituto */}
      <h2 className="text-[2.2rem] font-black text-slate-900 tracking-tight mb-3 uppercase">
        {instName}
      </h2>

      {/* 3. Província / Distrito / Localidade */}
      <div className="flex flex-col items-center gap-1 mb-5">
        <h3 className="text-base font-bold text-slate-700 tracking-[0.1em]">
          {instName.toLowerCase().includes("songo") ? "Província de Tete" : "Moçambique"}
        </h3>
        <h3 className="text-base font-bold text-slate-700 tracking-[0.1em]">
          {instName.toLowerCase().includes("songo") ? "Distrito de Cahora-Bassa" : "Sede Principal"}
        </h3>
        <h3 className="text-base font-bold text-slate-700 tracking-[0.1em]">
          Songo
        </h3>
      </div>
      
      {/* 4. Hierarquia Organizacional Dinâmica */}
      <div className="flex flex-col items-center gap-1.5 mb-6">
        <h4 className="text-lg font-bold text-slate-900 tracking-tight">
          Gabinete do Diretor-geral
        </h4>
        <h4 className="text-lg font-bold text-slate-900 tracking-tight">
          Unidade Gestora e Executora de Aquisições
        </h4>
        <h4 className="text-lg font-bold text-slate-900 tracking-tight">
          Chefe do Departamento
        </h4>
        {displayDepartamento && (
          <h4 className="text-lg font-bold text-slate-900 tracking-tight">
            {displayDepartamento.toLowerCase().includes("departamento") ? displayDepartamento : `Departamento de ${displayDepartamento}`}
          </h4>
        )}
      </div>

      {/* 5. Título Dinâmico do Plano de Atividade */}
      <h5 className="text-[1.3rem] font-black text-red-600 mt-2 tracking-tight uppercase">
        {displayTitle.toUpperCase()}
      </h5>

      {/* 6. Linha Divisória */}
      <div className="w-full max-w-5xl h-[3px] bg-slate-900 mt-6 mb-6"></div>

      {/* 7. Exercício Económico */}
      <div className="mt-2">
        <span className="text-[1.3rem] font-black text-slate-900 tracking-tight bg-[#f1f5f9] px-10 py-3 rounded-[1.2rem] border border-slate-200 shadow-sm">
          Exercício Económico: {selectedYear}
        </span>
      </div>
    </div>
  );
};
