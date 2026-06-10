export interface Cadeiras {
  A: number;
  B: number;
  C: number;
  D: number;
}

export interface Contagem {
  pulpito: number;
  cadeiras: Cadeiras;
  galeria: number;
  salas: number;
  externo: number;
  online: number;
  total: number;
}

export interface Cores {
  primaria: string;
  fundo: string;
  texto: string;
  subtexto: string;
  hint: string;
  borda: string;
  cartao: string;
  inputFundo: string;
  inputTexto: string;
  botaoInativoFundo: string;
  botaoInativoTexto: string;
  chipFundo: string;
  chipTexto: string;
}

export interface Culto {
  id: string;
  data: string;
  horario: string;
  lider_recepcao: string;
  grupo: string;
  contagens: Contagem;
}

export interface FormState {
  data: string;
  turno: number;
  liderRecepcao: string;
  quantidadePulpito: number;
  quantidadeCadeirasA: number;
  quantidadeCadeirasB: number;
  quantidadeCadeirasC: number;
  quantidadeCadeirasD: number;
  quantidadeGaleria: number;
  quantidadeSalas: number;
  quantidadeExterno: number;
  quantidadeOnline: number;
}