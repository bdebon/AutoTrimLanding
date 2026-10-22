import Link from 'next/link';
import {
  AnswerBox,
  H2,
  P,
  UL,
  StepList,
  DataTable,
  FaqBlock,
  CtaBox,
  RelatedLinks,
} from '@/components/guides/GuideShell';
import { guideHref } from '@/lib/guides';
import type { HowToGuide } from './types';

const MANUAL_STEPS = [
  {
    name: 'Agranda la forma de onda',
    text: 'En la línea de tiempo, aumenta la altura de los clips para ver los silencios: son las partes planas de la forma de onda del audio.',
  },
  {
    name: 'Corta al inicio y al final de cada silencio',
    text: 'Reproduce el clip y corta con la Cuchilla (Cmd+B) al principio y al final de cada pausa y de cada toma fallida.',
  },
  {
    name: 'Borra los fragmentos en silencio',
    text: 'Selecciona cada fragmento vacío y bórralo. En el argumento principal, la línea de tiempo magnética cierra el hueco sola.',
  },
  {
    name: 'Repite con cada clip',
    text: 'Haz la misma pasada en todos los clips de la grabación y luego pon en orden los clips limpios.',
  },
];

const AUTO_STEPS = [
  {
    name: 'Suelta todo tu material en AutoTrim',
    text: 'Todos los archivos de la grabación a la vez, incluidos los de solo audio. En una grabación multicámara, AutoTrim encuentra los archivos de una misma toma (varias cámaras, una grabadora de audio aparte) y los sincroniza.',
  },
  {
    name: 'Elige qué eliminar',
    text: 'Los silencios y, si quieres, también las muletillas (los «eh», los «em»): se detectan en unos diez idiomas, entre ellos el español, el inglés y el francés. Ajusta el umbral de silencio si prefieres dejar más aire.',
  },
  {
    name: 'Escucha la vista previa antes de exportar',
    text: 'Dale a reproducir para oír tu material sin las pausas, haz zoom en un corte y escucha lo eliminado. Procesar y previsualizar es gratis.',
  },
  {
    name: 'Exporta el FCPXML e impórtalo en Final Cut Pro',
    text: 'Una sola línea de tiempo, con todos los clips ya cortados y ensamblados en orden. Cada corte sigue siendo ajustable: arrastra el borde de un clip para recuperar una respiración. La edición fina la haces en Final Cut Pro, como siempre.',
  },
];

const FAQ = [
  {
    q: '¿Final Cut Pro tiene una función para eliminar silencios?',
    a: 'No. En 2026, Final Cut Pro no tiene ninguna función nativa que detecte y elimine silencios. Algunos efectos de terceros detectan silencios dentro de Final Cut Pro. AutoTrim, en cambio, trabaja antes de la edición: procesa toda la grabación a la vez, elimina las muletillas además de los silencios, sincroniza las tomas multicámara y exporta una sola línea de tiempo FCPXML ensamblada, todo en tu equipo. Si no, queda cortar a mano con la herramienta Cuchilla.',
  },
  {
    q: '¿Puedo procesar todos los clips de una grabación a la vez?',
    a: 'Final Cut Pro no lo hace de forma nativa. Con AutoTrim, sí: sueltas todo tu material de una vez, los archivos se procesan en paralelo y recibes una sola línea de tiempo FCPXML con cada clip ya limpio y en orden.',
  },
  {
    q: '¿AutoTrim también quita los «eh» y los «em»?',
    a: 'Sí. AutoTrim elimina las muletillas además de los silencios, en unos diez idiomas, entre ellos el español, el inglés y el francés. En la vista previa puedes escuchar todo lo eliminado antes de exportar.',
  },
  {
    q: '¿Mi material se sube a algún servidor?',
    a: 'No. AutoTrim funciona por completo en tu equipo, con macOS o Windows. No se sube nada y, después de la descarga inicial de los modelos, funciona sin conexión: tus videos inéditos y los proyectos de tus clientes no salen de tu equipo.',
  },
  {
    q: '¿Cuánto cuesta AutoTrim?',
    a: 'Puedes probarlo gratis, con vistas previas ilimitadas. Exportar la línea de tiempo requiere una licencia: 15 USD al mes, 119 USD al año o 149 USD en un solo pago, de por vida. Tienes 14 días de garantía de devolución.',
  },
  {
    q: '¿Y si grabo con varias cámaras o grabo el audio por separado?',
    a: 'Suéltalo todo. AutoTrim encuentra los archivos de una misma toma (varias cámaras, una grabadora de audio aparte), los sincroniza y solo corta cuando nadie habla. Los ángulos y los micrófonos llegan sincronizados a la línea de tiempo exportada.',
  },
  {
    q: '¿El corte automático va a arruinar mi ritmo?',
    a: 'Tú tienes el control. Ajustas el umbral de silencio, escuchas lo eliminado antes de exportar y cada corte sigue siendo ajustable en Final Cut Pro: arrastra el borde de un clip para recuperar una respiración.',
  },
];

function Body({ locale }: { locale: string }) {
  return (
    <>
      <AnswerBox lang="es">
        <p>
          <strong>Final Cut Pro no tiene una función nativa para eliminar silencios.</strong>{' '}
          Puedes cortar cada silencio a mano con la herramienta Cuchilla, usar
          alguno de los efectos de terceros que detectan silencios dentro de
          Final Cut Pro o pasar tu material por una app de escritorio como{' '}
          <Link href={`/${locale}`} className="text-at-accent hover:underline">
            AutoTrim
          </Link>{' '}
          antes de editar: elimina los silencios y las muletillas de toda la
          grabación a la vez, en tu equipo, y te devuelve una sola línea de
          tiempo FCPXML ensamblada para Final Cut Pro.
        </p>
      </AnswerBox>

      <H2 id="why-fcp-cant">Por qué Final Cut Pro no lo hace por sí solo</H2>
      <P>
        En Premiere Pro, la edición basada en texto permite eliminar pausas.
        DaVinci Resolve tiene detección de silencios integrada. Final Cut Pro
        no tiene ninguna de las dos cosas. Sus plugins son efectos FxPlug, no
        extensiones de flujo de trabajo; por eso AutoCut existe para Premiere
        y Resolve, pero no para Final Cut Pro. Aun así, algunos efectos de
        terceros detectan silencios dentro de Final Cut Pro.
      </P>
      <P>
        Durante años, la respuesta a «¿cómo elimino los silencios en FCP?» ha
        sido «a mano». La otra vía es quitar los silencios <em>antes</em> de
        que el material llegue a Final Cut Pro: AutoTrim procesa toda la
        grabación a la vez, elimina las muletillas además de los silencios,
        sincroniza las tomas multicámara y te devuelve una sola línea de
        tiempo FCPXML ensamblada, todo en tu equipo.
      </P>

      <H2 id="manual-method">Método 1: cortar los silencios a mano (gratis, pero lento)</H2>
      <P>El flujo de siempre, solo con Final Cut Pro:</P>
      <StepList steps={MANUAL_STEPS} />
      <P>
        Funciona y no cuesta nada, salvo tiempo. En unas 2500 horas de
        material procesadas por AutoTrim, la proporción mediana de silencio es
        de <strong>un tercio</strong>: en una grabación típica a cámara, más o
        menos un tercio de la duración es silencio que tienes que encontrar y
        cortar a mano, clip por clip. Si publicas cada semana, ese trabajo
        vuelve cada semana.
      </P>

      <H2 id="automatic-method">
        Método 2: eliminar silencios automáticamente con AutoTrim
      </H2>
      <P>
        AutoTrim es una app de escritorio para macOS y Windows (no un plugin)
        pensada justo para este flujo: sueltas todo el material de una
        grabación, elimina los silencios y las muletillas con una IA que
        funciona por completo en tu equipo y te devuelve{' '}
        <strong>una sola línea de tiempo FCPXML ensamblada</strong>, no un
        archivo por clip, que se abre directamente en Final Cut Pro. También
        exporta una línea de tiempo para Premiere Pro o DaVinci Resolve.
      </P>
      <StepList steps={AUTO_STEPS} />

      <H2 id="comparison">A mano o automático: la comparación</H2>
      <DataTable
        headers={['', 'A mano (herramienta Cuchilla)', 'Con AutoTrim']}
        rows={[
          ['Qué se corta', 'Cada silencio, buscado a ojo y a oído', 'Silencios y muletillas, detectados en tu equipo'],
          ['Grabaciones de varios clips', 'Un clip a la vez y luego ensamblar', 'Todo el material a la vez, una sola línea de tiempo ensamblada'],
          ['Multicámara', 'Sincronizas tú los ángulos y el audio', 'Archivos de una misma toma encontrados y sincronizados; solo corta cuando nadie habla'],
          ['Muletillas («eh», «em»)', 'Buscarlas y cortarlas a oído', 'Detectadas en unos diez idiomas, entre ellos el español'],
          ['Control', 'Total', 'Vista previa antes de exportar; cada corte sigue siendo ajustable en FCP'],
          ['Precio', 'Gratis (salvo tu tiempo)', 'Prueba gratis · 15 USD/mes · 119 USD/año · 149 USD de por vida'],
          ['Privacidad', 'Local', 'Local: no se sube nada'],
        ]}
      />
      <P>
        Cuánto tiempo ahorras depende de cuánto grabas. James, editor de Final
        Cut, lo calcula en «al menos una o dos horas en un proyecto típico».
      </P>

      <H2 id="tips">Consejos para cortes limpios</H2>
      <UL
        items={[
          <>Empieza con los ajustes por defecto y luego ajusta el <strong>umbral de silencio</strong> si el ruido de fondo de la sala es alto.</>,
          <>Deja un poco de <strong>margen alrededor de cada frase</strong>: las respiraciones suenan naturales y ninguna palabra queda cortada.</>,
          <>En un podcast con un micrófono por persona, suelta todas las pistas: AutoTrim solo corta cuando nadie habla, así que la pausa de un invitado nunca corta la respuesta de otro.</>,
          <>Escucha en la vista previa las muletillas eliminadas antes de exportar, sobre todo si cambias de idioma.</>,
          <>Tus archivos originales quedan intactos: el FCPXML apunta a tus medios, no se recodifica ni se modifica nada.</>,
        ]}
      />

      <CtaBox
        locale={locale}
        lang="es"
        title="Deja de cortar silencios a mano en Final Cut Pro"
        subtext="Suelta tus clips, escucha los cortes e importa una sola línea de tiempo FCPXML limpia."
      />

      <FaqBlock items={FAQ} lang="es" />

      <RelatedLinks
        lang="es"
        links={[
          { href: guideHref(locale, 'best-silence-remover-final-cut-pro'), label: 'El mejor programa para eliminar silencios en Final Cut Pro (2026)' },
          { href: guideHref(locale, 'remove-filler-words-from-video'), label: 'Cómo quitar muletillas de un video (en inglés)' },
          { href: `/${locale}/compare/final-cut-pro`, label: 'AutoTrim vs las herramientas de Final Cut Pro' },
          { href: `/${locale}/compare/timebolt`, label: 'AutoTrim vs TimeBolt' },
          { href: `/${locale}/pricing`, label: 'Precios de AutoTrim' },
        ]}
      />
    </>
  );
}

const content: HowToGuide = {
  lang: 'es',
  title: 'Cómo eliminar silencios en Final Cut Pro (a mano o automáticamente)',
  metaTitle: 'Cómo eliminar silencios en Final Cut Pro: 2 métodos (2026)',
  socialTitle: 'Cómo eliminar silencios en Final Cut Pro (2026)',
  description:
    'Final Cut Pro no tiene una función para eliminar silencios. Los dos métodos que usan los editores de FCP en 2026: cortar a mano con la Cuchilla o hacerlo automático e importar una sola línea de tiempo FCPXML limpia.',
  keywords:
    'eliminar silencios final cut pro, quitar silencios final cut pro, cortar silencios final cut, eliminar pausas video, quitar muletillas video, eliminador de silencios, fcpxml, jump cut final cut pro',
  ogAlt: 'AutoTrim elimina los silencios de un material para Final Cut Pro',
  subtitle:
    'En 2026, Final Cut Pro sigue sin poder eliminar silencios por sí solo. Estos son los dos métodos que de verdad usan los editores de FCP, y lo que te cuesta cada uno.',
  updated: '22 de octubre de 2026',
  datePublished: '2026-10-22',
  dateModified: '2026-10-22',
  faq: FAQ,
  howTo: {
    name: 'Cómo eliminar silencios en Final Cut Pro automáticamente',
    description:
      'Eliminar los silencios y las muletillas de todo tu material antes de que llegue a Final Cut Pro, con AutoTrim, que genera una sola línea de tiempo FCPXML ensamblada.',
    tool: 'AutoTrim (app de escritorio para macOS y Windows)',
    steps: AUTO_STEPS,
  },
  Body,
};

export default content;
