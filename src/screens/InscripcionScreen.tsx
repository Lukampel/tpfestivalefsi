import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CampoFormulario from '../components/CampoFormulario';
import SelectorTipoEntrada from '../components/SelectorTipoEntrada';
import TicketConfirmacion from '../components/TicketConfirmacion';
import { InscripcionFormData } from '../types/inscripcion';
import { REGEX_EMAIL, REGEX_SOLO_NUMEROS } from '../utils/validaciones';

const CLAVE_ULTIMO_EMAIL = '@sonido-sur/ultimo-email';

const VALORES_INICIALES: InscripcionFormData = {
  nombreCompleto: '',
  email: '',
  edad: '',
  tipoEntrada: null,
  telefono: '',
};

// Pantalla dueña del estado real del flujo (lifting state up): decide si se ve el
// formulario o el ticket, y le pasa los datos confirmados al ticket por props.
export default function InscripcionScreen() {
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [datosConfirmados, setDatosConfirmados] = useState<InscripcionFormData | null>(null);
  const escalaBoton = useRef(new Animated.Value(1)).current;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<InscripcionFormData>({
    mode: 'onChange',
    defaultValues: VALORES_INICIALES,
  });

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_ULTIMO_EMAIL).then((emailGuardado) => {
      if (emailGuardado) {
        setValue('email', emailGuardado, { shouldValidate: true });
      }
    });
  }, [setValue]);

  useEffect(() => {
    if (!enviando) {
      escalaBoton.setValue(1);
      return;
    }
    const pulso = Animated.loop(
      Animated.sequence([
        Animated.timing(escalaBoton, { toValue: 1.06, duration: 250, useNativeDriver: true }),
        Animated.timing(escalaBoton, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]),
    );
    pulso.start();
    return () => pulso.stop();
  }, [enviando, escalaBoton]);

  const onSubmit = (data: InscripcionFormData) => {
    setEnviando(true);
    // Simula 1 segundo de envío a un servidor antes de confirmar la inscripción.
    setTimeout(async () => {
      await AsyncStorage.setItem(CLAVE_ULTIMO_EMAIL, data.email);
      setDatosConfirmados(data);
      setEnviando(false);
      setEnviado(true);
    }, 1000);
  };

  const handleVolver = () => {
    reset(VALORES_INICIALES);
    setDatosConfirmados(null);
    setEnviado(false);
  };

  if (enviado && datosConfirmados) {
    return (
      <View style={styles.pantalla}>
        <TicketConfirmacion datos={datosConfirmados} onVolver={handleVolver} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Sonido Sur</Text>
        <Text style={styles.subtitulo}>Inscripción al festival</Text>

        <CampoFormulario
          control={control}
          name="nombreCompleto"
          label="Nombre completo"
          placeholder="Ej: Juana Pérez"
          autoCapitalize="words"
          rules={{
            required: 'Ingresá tu nombre completo',
            validate: (valor: string) => valor.trim().length >= 3 || 'Ingresá tu nombre completo',
          }}
        />

        <CampoFormulario
          control={control}
          name="email"
          label="Email"
          placeholder="Ej: juana@mail.com"
          autoCapitalize="none"
          keyboardType="email-address"
          rules={{
            required: 'Ingresá un email válido',
            pattern: { value: REGEX_EMAIL, message: 'Ingresá un email válido' },
          }}
        />

        <CampoFormulario
          control={control}
          name="edad"
          label="Edad"
          placeholder="Ej: 25"
          keyboardType="numeric"
          maxLength={3}
          rules={{
            required: 'La edad tiene que ser mayor a 12',
            validate: (valor: string) => {
              const numero = Number(valor);
              if (numero < 12) return 'La edad tiene que ser mayor a 12';
              if (numero > 99) return 'La edad no puede ser mayor a 99';
              return true;
            },
          }}
        />

        <SelectorTipoEntrada
          control={control}
          name="tipoEntrada"
          rules={{ required: 'Elegí un tipo de entrada' }}
        />

        <CampoFormulario
          control={control}
          name="telefono"
          label="Teléfono (opcional)"
          placeholder="Ej: 1122334455"
          keyboardType="phone-pad"
          maxLength={20}
          rules={{
            validate: (valor: string) => !valor || REGEX_SOLO_NUMEROS.test(valor) || 'Solo se permiten números',
          }}
        />

        <Animated.View style={{ transform: [{ scale: escalaBoton }] }}>
          <TouchableOpacity
            style={[styles.boton, (!isValid || enviando) && styles.botonDeshabilitado]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || enviando}
            activeOpacity={0.85}
          >
            {enviando ? (
              <View style={styles.botonEnviando}>
                <ActivityIndicator color="#ffffff" />
                <Text style={styles.botonTexto}>Enviando...</Text>
              </View>
            ) : (
              <Text style={styles.botonTexto}>Confirmar inscripción</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#f4f0fb' },
  contenido: { padding: 24, paddingBottom: 48 },
  titulo: { fontSize: 30, fontWeight: '800', color: '#2d1b4e', textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#7a6f96', textAlign: 'center', marginBottom: 24 },
  boton: {
    marginTop: 8,
    backgroundColor: '#6c3ce0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botonDeshabilitado: { backgroundColor: '#c3b7de' },
  botonTexto: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  botonEnviando: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
