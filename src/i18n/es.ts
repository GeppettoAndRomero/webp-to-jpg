import type { ToolContent } from './types';

// Español (pan-regional). WebP → JPG/PNG. Transcreación + QA independiente.

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Convertir WebP a JPG — en tu navegador, sin subir nada | runlocally',
    description:
      'Convierte imágenes WebP a JPG o PNG directamente en tu navegador. Los archivos se procesan en tu dispositivo y nunca se suben. Código abierto, funciona sin conexión.',
    ogTitle: 'Convertir WebP a JPG — en tu navegador, sin subir nada',
    ogDescription:
      'Convierte imágenes WebP a JPG o PNG en tu navegador. No se sube nada. Código abierto, funciona sin conexión.',
  },

  hero: {
    h1: 'WebP a JPG',
    tagline:
      'Convierte imágenes WebP a JPG o PNG — en tu navegador. No se sube nada.',
  },

  intro: {
    h2: 'WebP a JPG, en tu navegador',
    paras: [
      'Esta herramienta convierte imágenes WebP — el formato de imagen que Google creó para la web — a JPG o PNG. Como tantos sitios entregan sus imágenes en WebP, a menudo acabas con un archivo .webp que una aplicación, un programa o un formulario de subida más antiguo no acepta. Convertirlo a JPG (o PNG), compatibles en todas partes, resuelve ese problema.',
      'Tu navegador decodifica el WebP por sí mismo, ya que admite el formato desde hace años. La imagen se dibuja en un lienzo y se vuelve a codificar en tu dispositivo, así que no hay nada que instalar ni nada que se descargue en segundo plano.',
    ],
  },

  privacy: {
    h2: 'Por qué tus archivos no salen de tu dispositivo',
    lead: 'Aquí la privacidad es estructural, no una promesa. No hay paso de subida porque no hay ningún servidor al que subir:',
    points: [
      'La conversión ocurre por completo en tu navegador.',
      'La página se sirve como archivos estáticos y no hace ninguna petición con los datos de tu imagen.',
      'El código es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo que solo es posible porque nada sale del dispositivo.',
    ],
    note: 'Si quieres comprobarlo por tu cuenta, abre el panel de Red de tu navegador mientras conviertes: ninguna petición lleva tu archivo.',
    sourceLinkText: 'Lee el código.',
  },

  howto: {
    h2: 'Cómo usarla',
    steps: [
      {
        h3: 'Elige los archivos',
        p: 'Haz clic para seleccionar archivos WebP, o suéltalos en cualquier parte de la página. Puedes procesar varios a la vez.',
      },
      {
        h3: 'Ajusta las opciones (opcional)',
        p: 'Elige JPG o PNG, fija la calidad del JPG o cambia el tamaño. Los valores por defecto dan buenos resultados.',
      },
      {
        h3: 'Descarga',
        p: 'Cada archivo se descarga al terminar; un lote se puede descargar como ZIP.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Mis imágenes se suben a algún sitio?',
      a: 'No. La conversión ocurre por completo en tu navegador. No hay ningún componente de servidor, así que tus archivos no tienen forma de salir de tu dispositivo. El código es abierto y puedes confirmarlo en el panel de Red de tu navegador.',
    },
    {
      q: '¿Qué es un archivo WebP?',
      a: 'WebP es el formato de imagen que Google creó para la web. Comprime fotos y gráficos a tamaños menores que JPEG o PNG para que las páginas carguen antes, y por eso tantos sitios entregan ahora sus imágenes en .webp. La contrapartida es que algunas aplicaciones, programas y formularios de subida más antiguos no lo aceptan, así que convertir a JPG o PNG suele hacer falta.',
    },
    {
      q: '¿Por qué mi archivo WebP no se abre en algunas aplicaciones?',
      a: 'Todos los navegadores modernos leen WebP, pero la compatibilidad fuera del navegador es desigual. Algunos editores de imágenes, herramientas de documentos y sitios web más antiguos siguen esperando JPG o PNG, así que un .webp descargado puede ser rechazado. Convertirlo a JPG te da un archivo que esas aplicaciones aceptan.',
    },
    {
      q: '¿Qué pasa con la transparencia al convertir a JPG?',
      a: 'El JPG no admite transparencia, así que las zonas transparentes se rellenan de blanco. Si necesitas conservar la transparencia, elige la salida en PNG, que es sin pérdida y mantiene el canal alfa.',
    },
    {
      q: '¿Convertir reduce la calidad?',
      a: 'La salida en JPG usa un ajuste de calidad regulable (92 % por defecto), visualmente cercano al original en la mayoría de las imágenes. La salida en PNG es sin pérdida a partir de la imagen decodificada.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Tras la primera visita queda en caché, así que la conversión funciona sin conexión a la red. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— herramientas pequeñas que funcionan en local, en tu dispositivo.',
    colophon:
      'Creada y mantenida por Geppetto. Parte del código se escribe con ayuda de IA; toda la revisión y las decisiones son del responsable.',
    securityText: 'Seguridad',
  },
};
