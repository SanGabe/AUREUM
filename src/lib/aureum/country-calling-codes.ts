export type CallingCodeOption = {
  iso: string;
  flag: string;
  namePt: string;
  nameEn: string;
  dialCode: string;
};

export const CALLING_CODES: CallingCodeOption[] = [
  { iso: "BR", flag: "🇧🇷", namePt: "Brasil", nameEn: "Brazil", dialCode: "+55" },
  { iso: "PT", flag: "🇵🇹", namePt: "Portugal", nameEn: "Portugal", dialCode: "+351" },
  { iso: "US", flag: "🇺🇸", namePt: "Estados Unidos", nameEn: "United States", dialCode: "+1" },
  { iso: "CA", flag: "🇨🇦", namePt: "Canadá", nameEn: "Canada", dialCode: "+1" },
  { iso: "GB", flag: "🇬🇧", namePt: "Reino Unido", nameEn: "United Kingdom", dialCode: "+44" },
  { iso: "IE", flag: "🇮🇪", namePt: "Irlanda", nameEn: "Ireland", dialCode: "+353" },
  { iso: "ES", flag: "🇪🇸", namePt: "Espanha", nameEn: "Spain", dialCode: "+34" },
  { iso: "FR", flag: "🇫🇷", namePt: "França", nameEn: "France", dialCode: "+33" },
  { iso: "DE", flag: "🇩🇪", namePt: "Alemanha", nameEn: "Germany", dialCode: "+49" },
  { iso: "IT", flag: "🇮🇹", namePt: "Itália", nameEn: "Italy", dialCode: "+39" },
  { iso: "NL", flag: "🇳🇱", namePt: "Países Baixos", nameEn: "Netherlands", dialCode: "+31" },
  { iso: "BE", flag: "🇧🇪", namePt: "Bélgica", nameEn: "Belgium", dialCode: "+32" },
  { iso: "LU", flag: "🇱🇺", namePt: "Luxemburgo", nameEn: "Luxembourg", dialCode: "+352" },
  { iso: "CH", flag: "🇨🇭", namePt: "Suíça", nameEn: "Switzerland", dialCode: "+41" },
  { iso: "AT", flag: "🇦🇹", namePt: "Áustria", nameEn: "Austria", dialCode: "+43" },
  { iso: "DK", flag: "🇩🇰", namePt: "Dinamarca", nameEn: "Denmark", dialCode: "+45" },
  { iso: "SE", flag: "🇸🇪", namePt: "Suécia", nameEn: "Sweden", dialCode: "+46" },
  { iso: "NO", flag: "🇳🇴", namePt: "Noruega", nameEn: "Norway", dialCode: "+47" },
  { iso: "FI", flag: "🇫🇮", namePt: "Finlândia", nameEn: "Finland", dialCode: "+358" },
  { iso: "PL", flag: "🇵🇱", namePt: "Polônia", nameEn: "Poland", dialCode: "+48" },
  { iso: "CZ", flag: "🇨🇿", namePt: "Tchéquia", nameEn: "Czechia", dialCode: "+420" },
  { iso: "RO", flag: "🇷🇴", namePt: "Romênia", nameEn: "Romania", dialCode: "+40" },
  { iso: "GR", flag: "🇬🇷", namePt: "Grécia", nameEn: "Greece", dialCode: "+30" },
  { iso: "TR", flag: "🇹🇷", namePt: "Turquia", nameEn: "Türkiye", dialCode: "+90" },
  { iso: "UA", flag: "🇺🇦", namePt: "Ucrânia", nameEn: "Ukraine", dialCode: "+380" },
  { iso: "AR", flag: "🇦🇷", namePt: "Argentina", nameEn: "Argentina", dialCode: "+54" },
  { iso: "UY", flag: "🇺🇾", namePt: "Uruguai", nameEn: "Uruguay", dialCode: "+598" },
  { iso: "PY", flag: "🇵🇾", namePt: "Paraguai", nameEn: "Paraguay", dialCode: "+595" },
  { iso: "CL", flag: "🇨🇱", namePt: "Chile", nameEn: "Chile", dialCode: "+56" },
  { iso: "PE", flag: "🇵🇪", namePt: "Peru", nameEn: "Peru", dialCode: "+51" },
  { iso: "CO", flag: "🇨🇴", namePt: "Colômbia", nameEn: "Colombia", dialCode: "+57" },
  { iso: "MX", flag: "🇲🇽", namePt: "México", nameEn: "Mexico", dialCode: "+52" },
  { iso: "CN", flag: "🇨🇳", namePt: "China", nameEn: "China", dialCode: "+86" },
  { iso: "JP", flag: "🇯🇵", namePt: "Japão", nameEn: "Japan", dialCode: "+81" },
  { iso: "KR", flag: "🇰🇷", namePt: "Coreia do Sul", nameEn: "South Korea", dialCode: "+82" },
  { iso: "IN", flag: "🇮🇳", namePt: "Índia", nameEn: "India", dialCode: "+91" },
  { iso: "SG", flag: "🇸🇬", namePt: "Singapura", nameEn: "Singapore", dialCode: "+65" },
  { iso: "HK", flag: "🇭🇰", namePt: "Hong Kong", nameEn: "Hong Kong", dialCode: "+852" },
  { iso: "AU", flag: "🇦🇺", namePt: "Austrália", nameEn: "Australia", dialCode: "+61" },
  { iso: "NZ", flag: "🇳🇿", namePt: "Nova Zelândia", nameEn: "New Zealand", dialCode: "+64" },
  { iso: "AE", flag: "🇦🇪", namePt: "Emirados Árabes Unidos", nameEn: "United Arab Emirates", dialCode: "+971" },
  { iso: "SA", flag: "🇸🇦", namePt: "Arábia Saudita", nameEn: "Saudi Arabia", dialCode: "+966" },
  { iso: "IL", flag: "🇮🇱", namePt: "Israel", nameEn: "Israel", dialCode: "+972" },
  { iso: "ZA", flag: "🇿🇦", namePt: "África do Sul", nameEn: "South Africa", dialCode: "+27" },
];

export function callingCodeByIso(iso: string) {
  return CALLING_CODES.find(
    (option) => option.iso === iso.toUpperCase(),
  ) ?? CALLING_CODES[0];
}
