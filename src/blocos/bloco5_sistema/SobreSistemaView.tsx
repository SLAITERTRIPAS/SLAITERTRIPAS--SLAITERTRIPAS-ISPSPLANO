import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Printer, ChevronLeft, ChevronRight, BookOpen, Layers, FileText } from "lucide-react";
import { cn } from "../../lib/utils";

const pages = [
  {
    id: 1,
    title: "Página 1: Enquadramento & Objetivos",
    subtitle: "Visão Geral, Objetivo Geral e Objetivos Específicos",
    content: `## 1. Enquadramento

O **SIGEP – Sistema Integrado de Gestão de Processos** é uma plataforma digital concebida para apoiar a **modernização, integração e transformação dos processos institucionais**, disponibilizando um ambiente único para gerir, acompanhar e controlar as principais atividades e procedimentos de uma instituição.

A plataforma foi concebida para ser **flexível, modular, segura e adaptável**, podendo ser implementada em diferentes instituições em Moçambique, independentemente da sua dimensão, estrutura ou área de atuação.

O SIGEP procura substituir processos fragmentados, baseados em documentos físicos, comunicações dispersas e procedimentos manuais, por **processos digitais estruturados, rastreáveis, transparentes e orientados para resultados**.

Mais do que informatizar tarefas, o SIGEP pretende **melhorar a forma como as instituições planeiam, executam, comunicam, controlam, avaliam e tomam decisões**.

---

## 2. Objetivo Geral

O objetivo geral do SIGEP é **disponibilizar uma plataforma integrada para a gestão, tramitação, planificação, execução, monitoria, documentação, comunicação e controlo dos processos institucionais**, garantindo maior eficiência, transparência, segurança, responsabilização e qualidade na prestação dos serviços.

O sistema procura assegurar que a informação institucional esteja **centralizada, organizada, disponível, atualizada e protegida**, permitindo que os responsáveis tenham acesso à informação necessária para acompanhar as operações e tomar decisões fundamentadas.

---

## 3. Objetivos Específicos

O SIGEP tem como principais objetivos:

1. **Digitalizar os processos institucionais**, reduzindo a dependência de procedimentos manuais e documentos físicos.

2. **Integrar diferentes áreas da instituição** numa plataforma única, evitando a dispersão da informação.

3. **Automatizar fluxos de trabalho**, reduzindo etapas desnecessárias e melhorando a velocidade de tramitação.

4. **Garantir a rastreabilidade dos processos**, permitindo identificar responsáveis, ações, datas, movimentações e decisões.

5. **Melhorar a transparência institucional**, proporcionando mecanismos de acompanhamento e controlo de acordo com os níveis de acesso definidos.

6. **Apoiar a planificação institucional**, permitindo transformar objetivos e planos em atividades concretas, responsáveis, metas e indicadores.

7. **Controlar a execução das atividades**, permitindo comparar o que foi planificado com aquilo que foi efetivamente realizado.

8. **Fortalecer a monitoria e avaliação**, disponibilizando indicadores e informações atualizadas sobre o desempenho institucional.

9. **Automatizar a produção de relatórios**, utilizando os dados efetivamente registados no sistema.

10. **Digitalizar e organizar processos individuais**, garantindo maior segurança, disponibilidade e controlo da informação.

11. **Modernizar a gestão patrimonial**, permitindo identificar, localizar, movimentar e acompanhar os bens institucionais durante o seu ciclo de vida.

12. **Facilitar a comunicação interna**, através de um sistema integrado de mensagens e partilha de informação.

13. **Reforçar a segurança da informação**, através de perfis, permissões, controlo de acesso e auditoria.

14. **Apoiar a tomada de decisão**, disponibilizando informação estruturada, indicadores, dashboards e relatórios.`
  },
  {
    id: 2,
    title: "Página 2: Principais Áreas Funcionais",
    subtitle: "Módulos Operacionais da Plataforma (4.1 a 4.12)",
    content: `## 4. Principais Áreas Funcionais

O SIGEP integra um conjunto de áreas funcionais interligadas, permitindo que a instituição tenha uma visão global dos seus processos.

### 4.1. Gestão de Processos
Permite gerir todo o ciclo de vida dos processos, desde a criação ou receção até à tramitação, análise, encaminhamento, despacho, aprovação, conclusão e arquivo. Cada processo mantém o seu histórico, permitindo acompanhar o seu estado, responsáveis, documentos, decisões e movimentações.

### 4.2. Gestão de Planificação
Permite elaborar e acompanhar planos estratégicos, planos anuais, planos operacionais, planos setoriais, planos de atividades, planos individuais e programas ou projetos institucionais. Cada plano pode conter objetivos, atividades, responsáveis, metas, indicadores, prazos e resultados esperados.

### 4.3. Gestão e Controlo de Atividades
O SIGEP permite acompanhar o ciclo completo das atividades:
**Planificação → Programação → Execução → Monitoria → Avaliação → Relatório.**
Cada atividade pode possuir responsável, prazo, estado, meta, indicador, resultado esperado e evidências da execução. O sistema permite identificar atividades concluídas, em execução, atrasadas, suspensas, canceladas ou não iniciadas.

### 4.4. Monitoria e Avaliação
A plataforma permite comparar continuamente o **planeado com o executado**, fornecendo indicadores sobre o nível de realização dos planos e atividades. Os gestores podem acompanhar o desempenho por instituição, unidade, departamento, setor, responsável ou período.

### 4.5. Relatórios e Informação de Gestão
O SIGEP gera relatórios com base nos dados existentes na plataforma. Isso permite produzir informação sobre execução de planos e atividades, cumprimento de metas, processos concluídos e pendentes, desempenho institucional e situação patrimonial. Os relatórios deixam de depender exclusivamente de consolidações manuais e passam a refletir os **dados efetivamente registados no sistema**.

### 4.6. Gestão Documental
Permite digitalizar, classificar, armazenar, consultar, encaminhar e arquivar documentos. Os documentos podem ser associados a processos, atividades, planos, pessoas ou outras entidades institucionais.

### 4.7. Gestão de Processos Individuais Digitalizados
Permite criar **dossiês digitais individuais**, organizando documentos e informações relacionados com cada pessoa abrangida pela instituição. O sistema mantém o histórico e controla o acesso às informações de acordo com as permissões atribuídas.

### 4.8. Gestão Patrimonial
Permite gerir o património institucional através de cadastro de bens, inventário, localização, responsável, estado de conservação, movimentação, transferência, manutenção, conferência física e abate. O SIGEP permite acompanhar o **ciclo de vida dos bens institucionais**.

### 4.9. Comunicação Interna
O sistema possui um ambiente interno de comunicação que permite enviar e receber mensagens, criar conversas, partilhar documentos e associar mensagens a processos ou atividades.

### 4.10. Tramitação e Aprovação
O SIGEP permite configurar fluxos de tramitação de acordo com a estrutura da instituição. Um processo pode ser encaminhado sucessivamente aos responsáveis competentes, mantendo o histórico de cada etapa.

### 4.11. Notificações e Alertas
A plataforma pode emitir alertas relacionados com novos processos, tarefas atribuídas, prazos, processos pendentes, atividades atrasadas e solicitações de aprovação.

### 4.12. Gestão de Utilizadores e Permissões
O SIGEP permite administrar utilizadores, funções, cargos, unidades e níveis de acesso. Cada utilizador possui permissões específicas para consultar, criar, alterar, encaminhar, aprovar ou administrar informações.`
  },
  {
    id: 3,
    title: "Página 3: Transparência, Segurança & Gestão",
    subtitle: "Rastreabilidade, Controlo de Acesso e Tomada de Decisão",
    content: `## 5. Transparência e Rastreabilidade

A **transparência é um dos princípios estruturantes do SIGEP**.

A plataforma permite acompanhar o percurso dos processos e das atividades, respeitando sempre os níveis de confidencialidade e acesso definidos pela instituição.

O sistema pode registar:
* Utilizador responsável;
* Data e hora da operação;
* Movimentação do processo;
* Alterações efetuadas;
* Documentos associados;
* Encaminhamentos, despachos e aprovações;
* Decisões e estado do processo;
* Histórico da atividade.

Assim, cada operação relevante pode ser **rastreada e auditada**.

> **Toda operação relevante deve deixar um registo verificável no sistema.**

---

## 6. Segurança e Controlo

O SIGEP incorpora mecanismos destinados a proteger a informação institucional através de:
* Autenticação de utilizadores e perfis de acesso;
* Permissões por função e controlo de acesso à informação;
* Registo de atividades, auditoria e histórico de alterações;
* Proteção dos documentos e gestão de sessões;
* Mecanismos de recuperação e continuidade, conforme a infraestrutura adotada.

A segurança é applied de forma integrada, garantindo que a transparência não comprometa a **confidencialidade das informações institucionais**.

---

## 7. Dashboards e Tomada de Decisão

O SIGEP disponibiliza **dashboards de gestão**, permitindo transformar dados operacionais em informação útil para os gestores.

Os responsáveis podem acompanhar indicadores como:
**Planificado | Programado | Em execução | Executado | Atrasado | Não executado**

Esta informação permite identificar rapidamente problemas, desvios e áreas que necessitam de intervenção. O gestor passa a dispor de uma **visão estruturada da situação institucional** em tempo real.`
  },
  {
    id: 4,
    title: "Página 4: Qualidade & Benefícios",
    subtitle: "Ganhos Institucionais proporcionados pelo SIGEP (8.1 a 8.10)",
    content: `## 8. Qualidade que o SIGEP proporciona às instituições

A implementação do SIGEP contribui diretamente para elevar a **qualidade da gestão institucional**.

### 8.1. Maior eficiência
A digitalização e automatização reduzem tarefas repetitivas, circulação física de documentos e tempo gasto na localização de informações.

### 8.2. Maior transparência
Os processos passam a possuir histórico, responsáveis, movimentações e registos verificáveis.

### 8.3. Maior responsabilização
Cada utilizador atua dentro das suas competências e as operações relevantes podem ser associadas ao respetivo responsável.

### 8.4. Maior controlo
A instituição consegue acompanhar processos, atividades, prazos, planos, património e resultados de forma estruturada.

### 8.5. Melhor comunicação
A comunicação interna passa a estar integrada com os processos e atividades, reduzindo a dispersão da informação.

### 8.6. Melhor organização
Documentos, processos, atividades, planos e informações individuais passam a estar estruturados num ambiente centralizado.

### 8.7. Redução de perdas de informação
A digitalização e o arquivo estruturado reduzem os riscos associados à perda, extravio ou deterioração de documentos físicos.

### 8.8. Melhor capacidade de decisão
Os gestores passam a dispor de **indicadores, dashboards e relatórios baseados nos dados registados no sistema**.

### 8.9. Maior capacidade de monitoria
A instituição pode acompanhar continuamente aquilo que foi planeado, executado, atrasado ou não realizado.

### 8.10. Melhoria contínua
A informação produzida pelo SIGEP permite identificar problemas, analisar resultados e implementar medidas corretivas.`
  },
  {
    id: 5,
    title: "Página 5: Impacto, Visão & Conclusão",
    subtitle: "Transformação Digital e Princípio Fundamental",
    content: `## 9. Impacto Institucional

O SIGEP contribui para uma mudança significativa na forma de funcionamento das instituições.

Em vez de:
**Documentos dispersos → processos manuais → informação fragmentada → comunicação informal → relatórios manuais → decisões tardias**

A instituição passa a trabalhar com:
**Processos digitais → informação centralizada → fluxos controlados → comunicação integrada → monitoria contínua → relatórios baseados em dados → decisões fundamentadas.**

---

## 10. Visão do SIGEP

O SIGEP pretende constituir-se como um **ecossistema digital de gestão institucional**, capaz de integrar pessoas, processos, atividades, documentos, património, comunicação, informação e resultados num único ambiente.

O ciclo de gestão promovido pelo sistema pode ser representado por:

**PLANIFICAR → PROGRAMAR → EXECUTAR → DOCUMENTAR → COMUNICAR → MONITORAR → AVALIAR → REPORTAR → CORRIGIR → MELHORAR**

---

## 11. Conclusão

O **SIGEP – Sistema Integrado de Gestão de Processos** representa uma solução tecnológica destinada a apoiar a modernização das instituições em Moçambique, promovendo uma gestão mais **eficiente, transparente, organizada, segura, rastreável e orientada para resultados**.

Em síntese, o SIGEP procura criar instituições mais:
**EFICIENTES • TRANSPARENTES • ORGANIZADAS • RESPONSÁVEIS • SEGURAS • RASTREÁVEIS • ORIENTADAS PARA RESULTADOS**

### Princípio fundamental

> **“Planificar com clareza, executar com controlo, comunicar com segurança, acompanhar com transparência, comprovar com evidências e decidir com base em informação.”**`
  }
];

function convertMarkdownToHtml(md: string): string {
  let html = md;
  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 style="color:#b91c1c; font-size:16px; font-weight:800; border-left:3px solid #fca5a5; padding-left:10px; margin-top:20px; margin-bottom:10px; text-align:left;">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="color:#dc2626; font-size:20px; font-weight:900; border-left:4px solid #dc2626; padding-left:12px; margin-top:24px; margin-bottom:14px; text-align:left;">$1</h2>');
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left:4px solid #dc2626; background:#fef2f2; margin:16px 0; padding:12px 16px; font-style:italic; border-radius:0 8px 8px 0; text-align:justify;">$1</blockquote>');
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;" />');
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li style="margin-bottom:6px; text-align:justify;">$1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li style="margin-bottom:6px; text-align:justify;">$1</li>');
  // Paragraphs
  const paragraphs = html.split('\n\n');
  html = paragraphs.map(p => {
    if (p.startsWith('<h') || p.startsWith('<blockquote') || p.startsWith('<hr') || p.startsWith('<li')) {
      return p;
    }
    return `<p style="text-align:justify; margin:10px 0; line-height:1.6; color:#334155;">${p.trim()}</p>`;
  }).join('');

  return html;
}

export default function SobreSistemaView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllPages, setShowAllPages] = useState(false);

  const totalPages = pages.length;
  const activePageData = pages.find((p) => p.id === currentPage) || pages[0];

  const handlePrint = () => {
    // Abrir o documento formatado em PDF numa nova janela direcionada para impressão
    try {
      const printWin = window.open("", "_blank");
      if (printWin) {
        const fullHtml = `
          <!DOCTYPE html>
          <html lang="pt">
          <head>
            <meta charset="UTF-8">
            <title>SIGEP - Manual do Sistema (PDF)</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
              body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 40px;
                color: #0f172a;
                background-color: #fff;
                line-height: 1.6;
                text-align: justify;
              }
              .header {
                border-bottom: 3px solid #dc2626;
                padding-bottom: 16px;
                margin-bottom: 32px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .header h1 {
                margin: 0;
                color: #dc2626;
                font-size: 24px;
                font-weight: 900;
              }
              .header p {
                margin: 4px 0 0 0;
                color: #64748b;
                font-size: 13px;
                font-weight: 600;
              }
              .page {
                page-break-after: always;
                break-after: page;
                margin-bottom: 40px;
                padding-bottom: 24px;
                border-bottom: 1px dashed #cbd5e1;
              }
              .page:last-child {
                page-break-after: auto;
                break-after: auto;
                border-bottom: none;
              }
              .page-header {
                font-size: 11px;
                font-weight: 800;
                color: #dc2626;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #f1f5f9;
                padding-bottom: 8px;
              }
              p, li {
                text-align: justify;
                font-size: 13px;
                color: #334155;
              }
              .footer {
                margin-top: 40px;
                font-size: 11px;
                color: #94a3b8;
                text-align: center;
                border-top: 1px solid #e2e8f0;
                padding-top: 16px;
              }
              @media print {
                body { padding: 20px; }
                .no-print-btn { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div class="no-print-btn" style="text-align: right; margin-bottom: 24px;">
              <button onclick="window.print()" style="background:#dc2626; color:#fff; border:none; padding:12px 24px; border-radius:10px; font-weight:800; font-size:14px; cursor:pointer; box-shadow:0 4px 12px rgba(220,38,38,0.3);">
                🖨️ Imprimir / Guardar em PDF
              </button>
            </div>

            <div class="header">
              <div>
                <h1>SIGEP – Sistema Integrado de Gestão de Processos</h1>
                <p>Manual do Sistema & Documentação Institucional Oficial</p>
              </div>
              <div style="text-align: right; font-size: 11px; color: #64748b;">
                <strong>Data de Emissão:</strong> ${new Date().toLocaleDateString("pt-PT")}
              </div>
            </div>

            ${pages
              .map(
                (p) => `
                <div class="page">
                  <div class="page-header">
                    <span>${p.title}</span>
                    <span>Página ${p.id} de ${pages.length}</span>
                  </div>
                  <div>
                    ${convertMarkdownToHtml(p.content)}
                  </div>
                </div>
              `
              )
              .join("")}

            <div class="footer">
              SIGEP - Sistema Integrado de Gestão de Processos • Documento Oficial de Manual de Utilização
            </div>

            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 400);
              };
            </script>
          </body>
          </html>
        `;
        printWin.document.open();
        printWin.document.write(fullHtml);
        printWin.document.close();
      } else {
        window.print();
      }
    } catch (e) {
      window.print();
    }
  };

  return (
    <div className="space-y-6 text-justify font-sans">
      {/* Estilos CSS para Impressão com Quebra de Página */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-container, .print-container * {
            visibility: visible !important;
          }
          .print-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: #fff !important;
          }
          .print-page-break {
            page-break-after: always !important;
            break-after: page !important;
            padding-bottom: 2rem !important;
            margin-bottom: 2rem !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight text-left flex items-center gap-2">
            <BookOpen className="text-red-600 shrink-0" size={28} />
            <span>SIGEP – Manual do Sistema</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium text-left mt-0.5">
            Documentação Institucional separada em {totalPages} páginas interativas
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setShowAllPages(!showAllPages)}
            className={cn(
              "px-3.5 py-2 font-bold rounded-xl text-xs transition-all border flex items-center gap-1.5 cursor-pointer shadow-sm",
              showAllPages
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
            )}
            title="Alternar entre navegação por páginas ou visualização contínua"
          >
            <Layers size={15} />
            <span>{showAllPages ? "Ver por Páginas" : "Ver Todas as Páginas"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl text-xs transition-all shadow-md hover:shadow-lg cursor-pointer hover:scale-105"
            title="Abrir o Manual completo em formato PDF e acionar a impressão"
          >
            <Printer size={16} />
            <span>Abrir & Imprimir PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs Selector for Pages (Navegação Rápida) */}
      {!showAllPages && (
        <div className="no-print space-y-3">
          <div className="flex flex-wrap items-center gap-2 bg-gray-50/80 p-2 rounded-2xl border border-gray-100">
            {pages.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setCurrentPage(p.id)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left flex items-center gap-2 border",
                  currentPage === p.id
                    ? "bg-red-600 text-white border-red-600 shadow-md scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-gray-300"
                )}
              >
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                  currentPage === p.id ? "bg-white text-red-600" : "bg-gray-100 text-gray-700"
                )}>
                  {p.id}
                </span>
                <span className="truncate max-w-[140px] sm:max-w-none">{p.title.split(":")[1] || p.title}</span>
              </button>
            ))}
          </div>

          {/* Subtitle Indicator */}
          <div className="flex items-center justify-between px-2 text-xs text-gray-500 font-medium">
            <span className="text-red-700 font-bold">{activePageData.title}</span>
            <span>Página {currentPage} de {totalPages}</span>
          </div>
        </div>
      )}

      {/* UI & Print Content Area */}
      <div className="print-container space-y-8">
        {/* Dynamic Display (Page-by-Page OR All Pages in Screen Mode) */}
        {!showAllPages ? (
          /* Single Active Page View */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 min-h-[450px] flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-red-600 uppercase tracking-wider">
                    {activePageData.title}
                  </span>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {activePageData.subtitle}
                  </p>
                </div>
                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100 no-print">
                  Pág. {currentPage} / {totalPages}
                </span>
              </div>

              <div className="markdown-body text-justify leading-relaxed text-gray-800">
                <ReactMarkdown
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2
                        {...props}
                        className="text-xl sm:text-2xl font-black text-red-600 border-l-4 border-red-500 pl-4 py-2 my-5 text-left"
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        {...props}
                        className="text-lg sm:text-xl font-bold text-red-600 border-l-4 border-red-300 pl-3 py-1 my-3 text-left"
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        {...props}
                        className="my-3 text-justify leading-relaxed text-gray-800"
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        {...props}
                        className="text-justify my-1.5 leading-relaxed text-gray-800"
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        {...props}
                        className="text-justify italic border-l-4 border-red-500 pl-4 py-3 my-4 bg-red-50/60 rounded-r-xl text-gray-800 shadow-sm"
                      />
                    ),
                  }}
                >
                  {activePageData.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Bottom Pagination Bar */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between no-print">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Página Anterior</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                {pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentPage(p.id)}
                    className={cn(
                      "w-7 h-7 rounded-lg transition-all cursor-pointer flex items-center justify-center",
                      currentPage === p.id
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    )}
                  >
                    {p.id}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm hover:scale-105"
              >
                <span>Próxima Página</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Continuous Scroll view / Multi-page Stacked View */
          <div className="space-y-8">
            {pages.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 print-page-break"
              >
                <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-red-600 uppercase tracking-wider">
                      {p.title}
                    </span>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {p.subtitle}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100">
                    Página {p.id} de {totalPages}
                  </span>
                </div>

                <div className="markdown-body text-justify leading-relaxed text-gray-800">
                  <ReactMarkdown
                    components={{
                      h2: ({ node, ...props }) => (
                        <h2
                          {...props}
                          className="text-xl sm:text-2xl font-black text-red-600 border-l-4 border-red-500 pl-4 py-2 my-5 text-left"
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          {...props}
                          className="text-lg sm:text-xl font-bold text-red-600 border-l-4 border-red-300 pl-3 py-1 my-3 text-left"
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          {...props}
                          className="my-3 text-justify leading-relaxed text-gray-800"
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li
                          {...props}
                          className="text-justify my-1.5 leading-relaxed text-gray-800"
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          {...props}
                          className="text-justify italic border-l-4 border-red-500 pl-4 py-3 my-4 bg-red-50/60 rounded-r-xl text-gray-800 shadow-sm"
                        />
                      ),
                    }}
                  >
                    {p.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer text */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500 no-print">
        <span>SIGEP – Documentação Oficial do Sistema Integrado de Gestão de Processos</span>
        <button
          type="button"
          onClick={handlePrint}
          className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 cursor-pointer mt-2 sm:mt-0 hover:underline"
        >
          <FileText size={14} />
          <span>Abrir & Imprimir Documento PDF</span>
        </button>
      </div>
    </div>
  );
}
