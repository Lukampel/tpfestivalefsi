import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { InscripcionFormData } from '../types/inscripcion';

type TicketConfirmacionProps = {
  datos: InscripcionFormData;
  onVolver: () => void;
};

// Recibe los datos ya validados por props: no guarda estado propio, solo los muestra.
export default function TicketConfirmacion({ datos, onVolver }: TicketConfirmacionProps) {
  const esVip = datos.tipoEntrada === 'vip';
  const codigo = generarCodigo(datos.email);

  return (
    <View style={styles.contenedor}>
      <View style={[styles.ticket, esVip && styles.ticketVip]}>
        <Text style={styles.sello}>{esVip ? '★ VIP ★' : 'GENERAL'}</Text>
        <Text style={styles.festival}>SONIDO SUR</Text>
        <Text style={styles.subtitulo}>¡Inscripción confirmada!</Text>

        <View style={styles.linea} />

        <Fila etiqueta="Nombre" valor={datos.nombreCompleto.trim()} />
        <Fila etiqueta="Email" valor={datos.email} />
        <Fila etiqueta="Edad" valor={`${datos.edad} años`} />
        <Fila etiqueta="Entrada" valor={esVip ? 'VIP' : 'General'} />
        {datos.telefono ? <Fila etiqueta="Teléfono" valor={datos.telefono} /> : null}

        <View style={styles.linea} />

        <Text style={styles.codigo}>#{codigo}</Text>
        <Text style={styles.pie}>Presentá este código en el ingreso 🎶</Text>
      </View>

      <TouchableOpacity style={styles.boton} onPress={onVolver} activeOpacity={0.85}>
        <Text style={styles.botonTexto}>Volver a inscribir a otra persona</Text>
      </TouchableOpacity>
    </View>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.filaEtiqueta}>{etiqueta}</Text>
      <Text style={styles.filaValor}>{valor}</Text>
    </View>
  );
}

// Código de ticket generado a partir del email, solo para darle onda visual a la confirmación.
function generarCodigo(email: string) {
  const usuario = email.split('@')[0] || 'FEST';
  const numero = Math.abs(hashSimple(email)) % 10000;
  return `${usuario.slice(0, 4).toUpperCase()}-${numero.toString().padStart(4, '0')}`;
}

function hashSimple(texto: string) {
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  ticket: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#bfdbfe',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  ticketVip: { borderColor: '#ec4899', backgroundColor: '#fdf2f8' },
  sello: {
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#3b82f6',
    marginBottom: 6,
  },
  festival: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e3a8a',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitulo: { fontSize: 14, color: '#ec4899', textAlign: 'center', marginTop: 4, marginBottom: 16 },
  linea: { borderBottomWidth: 1, borderColor: '#dbeafe', borderStyle: 'dashed', marginVertical: 12 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  filaEtiqueta: { fontSize: 13, color: '#3b82f6' },
  filaValor: { fontSize: 14, fontWeight: '600', color: '#1e3a8a', maxWidth: '65%', textAlign: 'right' },
  codigo: { textAlign: 'center', fontSize: 20, fontWeight: '800', color: '#ec4899', letterSpacing: 2 },
  pie: { textAlign: 'center', fontSize: 12, color: '#3b82f6', marginTop: 6 },
  boton: {
    marginTop: 24,
    backgroundColor: '#ec4899',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botonTexto: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});
