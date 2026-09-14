import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

type CampoFormularioProps<T extends FieldValues, N extends FieldPath<T> = FieldPath<T>> = {
  control: Control<T>;
  name: N;
  label: string;
  rules?: RegisterOptions<T, N>;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'>;

// Input de texto controlado + mensaje de error, reutilizado por todos los campos del formulario.
export default function CampoFormulario<T extends FieldValues, N extends FieldPath<T> = FieldPath<T>>({
  control,
  name,
  label,
  rules,
  ...textInputProps
}: CampoFormularioProps<T, N>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.contenedor}>
          <Text style={styles.etiqueta}>{label}</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={(value as string) ?? ''}
            placeholderTextColor="#a698c4"
            {...textInputProps}
          />
          {error?.message ? <Text style={styles.mensajeError}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  contenedor: { marginBottom: 16 },
  etiqueta: { fontSize: 14, fontWeight: '600', color: '#2d1b4e', marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: '#d8cdf0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2d1b4e',
  },
  inputError: { borderColor: '#e0475c' },
  mensajeError: { color: '#e0475c', fontSize: 12, marginTop: 4 },
});
