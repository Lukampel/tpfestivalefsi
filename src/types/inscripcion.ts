export type TipoEntrada = 'general' | 'vip';

export interface InscripcionFormData {
  nombreCompleto: string;
  email: string;
  edad: string;
  tipoEntrada: TipoEntrada | null;
  telefono: string;
}
