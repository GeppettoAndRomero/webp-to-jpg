import type { ToolContent } from './types';

// WebP → JPG/PNG. English source content.

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Convert WebP to JPG — in Your Browser, No Upload | runlocally',
    description:
      'Convert WebP images to JPG or PNG directly in your browser. Files are processed on your device and never uploaded. Open source, works offline.',
    ogTitle: 'Convert WebP to JPG — in Your Browser, No Upload',
    ogDescription:
      'Convert WebP images to JPG or PNG in your browser. Nothing is uploaded. Open source, works offline.',
  },

  hero: {
    h1: 'WebP to JPG',
    tagline:
      'Convert WebP images to JPG or PNG — in your browser. Nothing is uploaded.',
  },

  intro: {
    h2: 'WebP to JPG, in your browser',
    paras: [
      'This tool converts WebP images — Google\'s web image format — to JPG or PNG. Because so many sites serve images as WebP, you often end up with a .webp file that an older app, program or upload form simply won\'t accept. Converting to the universally supported JPG (or PNG) fixes that.',
      'WebP is decoded directly by your browser, which has supported the format for years. The image is drawn to a canvas and re-encoded on your device, so there is nothing to install and nothing to download in the background.',
    ],
  },

  privacy: {
    h2: 'Why your files stay on your device',
    lead: 'Privacy here is structural, not a promise. There is no upload step because there is no server to upload to:',
    points: [
      'The conversion runs entirely in your browser.',
      'The page is served as static files and makes no request with your image data.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: 'If you want to check for yourself, open your browser\'s Network panel while converting — no request carries your file.',
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Choose files',
        p: 'Click to select WebP files, or drop them anywhere on the page. Multiple files at once is fine.',
      },
      {
        h3: 'Adjust settings (optional)',
        p: 'Choose JPG or PNG, set JPG quality, or resize. The defaults produce good results.',
      },
      {
        h3: 'Download',
        p: 'Each file downloads when it finishes; a batch can be downloaded as a ZIP.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Are my images uploaded anywhere?',
      a: 'No. The conversion runs entirely in your browser. There is no server component, so your files have no path off your device. The source is open and you can confirm this in your browser\'s Network panel.',
    },
    {
      q: 'What is a WebP file?',
      a: 'WebP is the image format Google created for the web. It compresses photos and graphics to smaller sizes than JPEG or PNG so pages load faster, which is why so many sites now serve images as .webp. The trade-off is that some older apps, programs and upload forms don\'t accept it, so converting to JPG or PNG is often needed.',
    },
    {
      q: 'Why won\'t my WebP file open in some apps?',
      a: 'Every modern browser reads WebP, but support outside the browser is uneven. Some older image editors, document tools and websites still expect JPG or PNG, so a downloaded .webp can be rejected. Converting to JPG gives you a file those apps accept.',
    },
    {
      q: 'What happens to transparency when I convert to JPG?',
      a: 'JPG has no transparency, so any transparent areas are filled with white. If you need to keep transparency, choose PNG output instead, which is lossless and preserves the alpha channel.',
    },
    {
      q: 'Does converting reduce quality?',
      a: 'JPG output uses an adjustable quality setting (default 92%), which is visually close to the original for most images. PNG output is lossless from the decoded image.',
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so conversion works without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      'Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer\'s.',
    securityText: 'Security',
  },
};
