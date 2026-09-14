# Sonido Sur - Inscripcion al festival

TP de formulario con validaciones, hecho con React Native + Expo.

## Como correr

npm install
npx expo start

Despues se abre con Expo Go (Android/iOS) o apretando w para verlo en el navegador.

## Validacion elegida

Usamos React Hook Form (useForm + Controller + rules) en vez de hacer un objeto de errores a mano, porque ya viene con todo lo necesario (required, pattern, validate) y no hay que estar escribiendo un validate() aparte para cada campo ni preocuparse por limpiar errores viejos.

## Reglas de validacion

- nombreCompleto: obligatorio, minimo 3 caracteres (con trim para que no pase solo espacios)
- email: obligatorio, tiene que tener formato valido (regex con @ y dominio)
- edad: obligatoria, tiene que estar entre 12 y 99
- tipoEntrada: obligatorio elegir general o vip
- telefono: opcional, pero si se completa solo puede tener numeros

El boton de Confirmar inscripcion queda deshabilitado mientras el formulario tenga algun error.

## Bonus que hicimos

- Guardamos el email de la ultima persona inscripta con AsyncStorage y se precarga solo la proxima vez que se abre la app.
- Antes de confirmar se simula 1 segundo de "envio al servidor" con un loading en el boton.

## Capturas

Estan en la carpeta capturas: formulario con errores, formulario completo y el ticket final.
