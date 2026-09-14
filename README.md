# Sonido Sur — Inscripción al festival

TP de formularios con validaciones y estados complejos. React Native + Expo + React Hook Form.

## Cómo correr el proyecto

```bash
npm install
npx expo start
```

Desde ahí se puede abrir en Android, iOS (Expo Go) o Web (`w` en la terminal, o `npx expo start --web`).

## Validación elegida: React Hook Form (`useForm` + `Controller` + `rules`)

Se optó por React Hook Form en vez de un objeto de errores manual porque:

- Evita re-renderizar todo el formulario en cada tecla — cada `Controller` solo re-renderiza su propio campo.
- Las reglas (`required`, `pattern`, `validate`) quedan declaradas junto a cada campo, sin tener que mantener un objeto de errores en paralelo ni sincronizarlo a mano.
- `formState.isValid` (con `mode: 'onChange'`) resuelve solo el deshabilitado del botón "Confirmar inscripción", sin lógica extra.

## Estructura

```
App.tsx                          -> monta InscripcionScreen
src/
  types/inscripcion.ts           -> tipos del formulario (InscripcionFormData, TipoEntrada)
  utils/validaciones.ts          -> regex de email y de "solo números"
  components/
    CampoFormulario.tsx          -> input de texto reutilizable (Controller + label + error)
    SelectorTipoEntrada.tsx      -> selector General/VIP (dos botones excluyentes)
    TicketConfirmacion.tsx       -> ticket de confirmación, recibe los datos por props
  screens/
    InscripcionScreen.tsx        -> pantalla dueña del estado (lifting state up), decide
                                     si se muestra el formulario o el ticket
```

`InscripcionScreen` es la única con estado real: arma el `useForm`, y decide con
renderizado condicional si muestra el formulario o el `TicketConfirmacion` (que
recibe los datos ya validados solo por props, sin estado propio).

## Reglas de validación implementadas

| Campo | Regla | Mensaje |
|---|---|---|
| nombreCompleto | obligatorio, mínimo 3 caracteres (con `.trim()`) | "Ingresá tu nombre completo" |
| email | obligatorio, formato válido (regex con `@` y dominio) | "Ingresá un email válido" |
| edad | obligatorio, número entre 12 y 99 | "La edad tiene que ser mayor a 12" |
| tipoEntrada | obligatorio | "Elegí un tipo de entrada" |
| telefono | opcional, si se completa solo números | "Solo se permiten números" |

El botón "Confirmar inscripción" queda deshabilitado mientras `formState.isValid` sea `false`
o mientras se esté simulando el envío.

## Bonus resueltos

- **AsyncStorage**: se guarda el email de la última persona inscripta
  (`@sonido-sur/ultimo-email`) al confirmar la inscripción, y se precarga
  automáticamente en el campo Email la próxima vez que se abre la app.
- **Loading simulado**: al tocar "Confirmar inscripción" se simula 1 segundo de
  envío a un servidor (`ActivityIndicator` dentro del botón) antes de mostrar el ticket.

## Capturas

- [`capturas/formulario-con-errores.png`](capturas/formulario-con-errores.png) — formulario con errores visibles debajo de cada campo.
- [`capturas/formulario-valido.png`](capturas/formulario-valido.png) — formulario completo y válido, botón habilitado.
- [`capturas/ticket-confirmacion.png`](capturas/ticket-confirmacion.png) — ticket de confirmación tras enviar.
