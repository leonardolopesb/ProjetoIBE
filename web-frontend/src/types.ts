export interface Contagem {
  quantidadePulpito: number;
  quantidadeCadeirasA: number;
  quantidadeCadeirasB: number;
  quantidadeCadeirasC: number;
  quantidadeCadeirasD: number;
  quantidadeGaleria: number;
  quantidadeSalas: number;
  quantidadeExterno: number;
  quantidadeOnline: number;
  total?: number;
}

export interface Culto {
  id: string;
  data: string;
  turno: number;
  liderRecepcao: string;
  grupoRecepcao: number;
  contagens: Contagem[];
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