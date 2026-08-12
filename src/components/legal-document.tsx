import styles from "./legal-document.module.css";

type LegalKind = "terms" | "privacy";

const PT_TERMS = [
  ["1. Aceite e versões", "Ao criar uma conta ou utilizar o AUREUM, você declara que leu estes Termos. A versão aceita e a data do aceite poderão ser registradas. Alterações materiais serão apresentadas antes de entrarem em vigor."],
  ["2. Finalidade do serviço", "O AUREUM organiza informações financeiras fornecidas pelo usuário ou recebidas por integrações autorizadas. O serviço não é banco, instituição de pagamento, corretora, consultoria financeira ou garantia de resultado."],
  ["3. Conta e segurança", "Você é responsável por dados corretos, pela proteção de sua senha e por comunicar acessos suspeitos. Não compartilhe credenciais bancárias, CVV, senha de banco ou tokens de autenticação no AUREUM ou pelo WhatsApp."],
  ["4. Núcleos e permissões", "Participantes de um Núcleo acessam informações conforme seu papel. Proprietários e administradores são responsáveis por convites, aprovações e permissões concedidas a outras pessoas."],
  ["5. Importações", "Extratos, faturas e mensagens são fontes sujeitas a erro de formato, leitura ou classificação. O usuário deve revisar os dados antes de aprová-los como transações oficiais."],
  ["6. Uso aceitável", "É proibido utilizar o serviço para fraude, acesso indevido, lavagem de dinheiro, violação de direitos, envio de malware, automação abusiva ou tentativa de contornar limites e controles de segurança."],
  ["7. Disponibilidade", "O serviço pode passar por manutenção, indisponibilidade de provedores ou mudanças técnicas. Backups e recuperação serão tratados conforme a política operacional aplicável ao plano contratado."],
  ["8. Encerramento", "A pessoa usuária poderá solicitar encerramento e exclusão, observadas obrigações legais, prevenção a fraude, segurança, auditoria e prazos de retenção informados na Política de Privacidade."],
  ["9. Contato", "Dúvidas contratuais e solicitações devem ser encaminhadas pelo canal indicado na Central de Ajuda. Os dados formais da operação serão incluídos antes do lançamento comercial."],
];

const PT_PRIVACY = [
  ["1. Escopo e responsáveis", "Esta Política explica como o AUREUM trata dados pessoais. A identificação formal do controlador, do encarregado e dos operadores será publicada antes da abertura comercial."],
  ["2. Dados tratados", "Podemos tratar dados de conta, perfil, contato, endereço, CPF/CNPJ, participação em Núcleos, dados financeiros, documentos enviados, identificadores do WhatsApp e registros técnicos de segurança."],
  ["3. Finalidades", "Os dados são usados para autenticar, manter o perfil, organizar Núcleos, processar transações e documentos, sincronizar cotações, prevenir fraude, prestar suporte e cumprir obrigações legais."],
  ["4. Bases legais", "Cada tratamento deve ser associado à base legal adequada, que pode incluir execução de contrato, cumprimento de obrigação legal, legítimo interesse com avaliação, proteção ao crédito ou consentimento quando necessário."],
  ["5. Compartilhamento", "Dados podem ser processados por fornecedores de hospedagem, banco de dados, armazenamento, mensagens, identidade e suporte. O compartilhamento deve ser limitado à finalidade e protegido por contrato e controles técnicos."],
  ["6. Segurança", "Aplicamos autenticação, segregação por Núcleo, RLS, armazenamento privado, URLs temporárias, assinatura de webhooks, hash, idempotência, limites de uso e acesso administrativo restrito."],
  ["7. Retenção e descarte", "Os prazos variam conforme finalidade, contrato, obrigação legal, prevenção a fraude e solicitação do titular. Documentos financeiros não devem ser mantidos além do necessário e serão descartados por processo controlado."],
  ["8. Direitos do titular", "Você poderá solicitar confirmação, acesso, correção, informação sobre compartilhamento, portabilidade quando aplicável, revisão, oposição, anonimização ou exclusão, observadas as hipóteses legais."],
  ["9. Transferência internacional", "Alguns fornecedores podem processar dados fora do Brasil. Antes da produção comercial serão registrados países, garantias contratuais e mecanismos aplicáveis à transferência."],
  ["10. Incidentes e contato", "Incidentes relevantes serão avaliados e comunicados conforme a LGPD e orientações da ANPD. O canal oficial de privacidade será publicado na Central de Ajuda."],
];

const EN_TERMS = [
  ["1. Acceptance and versions", "By creating an account or using AUREUM, you confirm that you have read these Terms. The accepted version and date may be recorded. Material changes will be presented before they take effect."],
  ["2. Service purpose", "AUREUM organises financial information supplied by users or received through authorised integrations. It is not a bank, payment institution, broker, financial adviser or guarantee of returns."],
  ["3. Account security", "You are responsible for accurate information, protecting your password and reporting suspicious access. Never provide bank passwords, CVVs or authentication tokens to AUREUM or through WhatsApp."],
  ["4. Nuclei and permissions", "Nucleus participants access information according to their role. Owners and administrators are responsible for invitations, approvals and permissions granted to others."],
  ["5. Imports", "Statements, bills and messages may contain formatting, extraction or classification errors. Users must review information before approving official transactions."],
  ["6. Acceptable use", "The service may not be used for fraud, unauthorised access, money laundering, rights violations, malware, abusive automation or attempts to bypass security controls."],
  ["7. Availability and closure", "The service may undergo maintenance or provider outages. Users may request account closure subject to legal, fraud-prevention, security and retention requirements."],
  ["8. Contact", "Contract questions should be submitted through the Help Centre. Formal operator details will be added before commercial launch."],
];

const EN_PRIVACY = [
  ["1. Scope", "This Policy explains how AUREUM processes personal data. Formal controller, data protection contact and processor details will be published before commercial launch."],
  ["2. Data processed", "Data may include account, profile, contact, address, identification, Nucleus participation, financial information, uploaded documents, WhatsApp identifiers and technical security records."],
  ["3. Purposes", "Data is used to authenticate users, operate profiles and Nuclei, process financial information, synchronise exchange rates, prevent abuse, provide support and meet legal obligations."],
  ["4. Legal grounds", "Each activity must have an appropriate legal ground, such as contract performance, legal obligation, assessed legitimate interest or consent where required."],
  ["5. Sharing and transfers", "Hosting, database, storage, messaging, identity and support providers may process limited data. International transfers will be documented with applicable safeguards."],
  ["6. Security", "Controls include authentication, Nucleus isolation, RLS, private storage, temporary URLs, signed webhooks, hashing, idempotency, rate limits and restricted administrative access."],
  ["7. Retention and rights", "Information is retained only as necessary for its purpose and applicable obligations. Users may request access, correction, information, portability, objection or deletion where applicable."],
  ["8. Incidents and contact", "Relevant incidents will be assessed and communicated under applicable law. The official privacy channel will be published in the Help Centre."],
];

export function LegalDocument({ kind, english = false }: { kind: LegalKind; english?: boolean }) {
  const sections = english
    ? kind === "terms" ? EN_TERMS : EN_PRIVACY
    : kind === "terms" ? PT_TERMS : PT_PRIVACY;

  return (
    <article className={styles.document}>
      <div className={styles.notice}>
        <strong>{english ? "Draft for product validation" : "Minuta para validação do produto"}</strong>
        <p>
          {english
            ? "This document requires legal review and formal operator details before commercial launch."
            : "Este documento precisa de revisão jurídica e dos dados formais da operação antes do lançamento comercial."}
        </p>
      </div>
      <p className={styles.updated}>{english ? "Updated on 12 August 2026" : "Atualizado em 12 de agosto de 2026"}</p>
      {sections.map(([title, body]) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>{body}</p>
        </section>
      ))}
    </article>
  );
}
