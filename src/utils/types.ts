export interface IReceiver {
  name: string;
  document: string;
  email: string;
  pixKeyType: "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "CHAVE_ALEATORIA";
  pixKey: string;
}

export interface IReceiverUpdate {
  id?: string;
  name?: string;
  document?: string;
  email?: string;
  pixKeyType?: "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "CHAVE_ALEATORIA";
  pixKey?: string;
}

export interface ILimitFilters {
  limite: string;
  pagina: string;
}

export interface IListFilters {
  limite?: string;
  pagina?: string;
  input?: string;
}

export interface IAccountBankData {
  pixKey: string;
  bankName: string;
  bankImageUrl: string;
  agency: string;
  cc: string;
}

export interface IPixData {
  pixKey: string;
  pixKeyType: string;
  bankName: string;
  bankImageUrl: string;
  agency: string;
  cc: string;
}
