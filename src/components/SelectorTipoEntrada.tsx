import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { TipoEntrada } from '../types/inscripcion';

type SelectorTipoEntradaProps<T extends FieldValues, N extends FieldPath<T> = FieldPath<T>> = {
  control: Control<T>;
  name: N;
  rules?: RegisterOptions<T, N>;
};

const OPCIONES: { valor: TipoEntrada; etiqueta: string; descripcion: string }[] = [
  { valor: 'general', etiqueta: 'General', descripcion: 'Acceso al predio' },
  { valor: 'vip', etiqueta: 'VIP', descripcion: 'Zona exclusiva + merch' },
];

// Dos botones excluyentes que resuelven la elección general/VIP sin depender de un Picker nativo.
export default function SelectorTipoEntrada<T extends FieldValues, N extends FieldPath<T> = FieldPath<T>>({
  control,
  name,
  rules,
}: SelectorTipoEntradaProps<T, N>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.contenedor}>
          <Text style={styles.etiqueta}>Tipo de entrada</Text>
          <View style={styles.opciones}>
            {OPCIONES.map((opcion) => {
              const seleccionada = value === opcion.valor;
              return (
                <TouchableOpacity
                  key={opcion.valor}
                  style={[styles.opcion, seleccionada && styles.opcionSeleccionada]}
                  onPress={() => onChange(opcion.valor)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.opcionTitulo, seleccionada && styles.textoSeleccionado]}>
                    {opcion.etiqueta}
                  </Text>
                  <Text style={[styles.opcionDescripcion, seleccionada && styles.textoSeleccionado]}>
                    {opcion.descripcion}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {error?.message ? <Text style={styles.mensajeError}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  contenedor: { marginBottom: 16 },
  etiqueta: { fontSize: 14, fontWeight: '600', color: '#2d1b4e', marginBottom: 6 },
  opciones: { flexDirection: 'row', gap: 12 },
  opcion: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#d8cdf0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  opcionSeleccionada: { backgroundColor: '#6c3ce0', borderColor: '#6c3ce0' },
  opcionTitulo: { fontSize: 16, fontWeight: '700', color: '#2d1b4e' },
  opcionDescripcion: { fontSize: 11, color: '#7a6f96', marginTop: 2, textAlign: 'center' },
  textoSeleccionado: { color: '#ffffff' },
  mensajeError: { color: '#e0475c', fontSize: 12, marginTop: 4 },
});
