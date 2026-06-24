import type { ToolContent } from './types';

// Deutsch. WebP → JPG/PNG. Transkreation + unabhängige QA.

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'WebP in JPG umwandeln — im Browser, ohne Upload | runlocally',
    description:
      'Wandle WebP-Bilder direkt im Browser in JPG oder PNG um. Die Dateien werden auf deinem Gerät verarbeitet und nie hochgeladen. Open Source, läuft offline.',
    ogTitle: 'WebP in JPG umwandeln — im Browser, ohne Upload',
    ogDescription:
      'Wandle WebP-Bilder im Browser in JPG oder PNG um. Es wird nichts hochgeladen. Open Source, läuft offline.',
  },

  hero: {
    h1: 'WebP in JPG',
    tagline:
      'Wandle WebP-Bilder in JPG oder PNG um — im Browser. Es wird nichts hochgeladen.',
  },

  intro: {
    h2: 'WebP in JPG, direkt im Browser',
    paras: [
      'Dieses Tool wandelt WebP-Bilder — Googles Bildformat fürs Web — in JPG oder PNG um. Weil viele Seiten ihre Bilder als WebP ausliefern, landest du oft mit einer .webp-Datei da, die eine ältere App, ein Programm oder ein Upload-Formular schlicht nicht annimmt. Die Umwandlung in das überall unterstützte JPG (oder PNG) behebt das.',
      'WebP wird direkt von deinem Browser dekodiert, der das Format seit Jahren beherrscht. Das Bild wird auf ein Canvas gezeichnet und auf deinem Gerät neu kodiert. Es gibt also nichts zu installieren und nichts, was im Hintergrund nachgeladen wird.',
    ],
  },

  privacy: {
    h2: 'Warum deine Dateien auf deinem Gerät bleiben',
    lead: 'Datenschutz ist hier strukturell, kein Versprechen. Es gibt keinen Upload-Schritt, weil es keinen Server gibt, auf den hochgeladen werden könnte:',
    points: [
      'Die Umwandlung läuft vollständig in deinem Browser.',
      'Die Seite wird als statische Dateien ausgeliefert und stellt keine Anfrage mit deinen Bilddaten.',
      'Der Quellcode ist offen, und jeder kann ihn lesen (MIT).',
      'Die Seite läuft offline, was nur möglich ist, weil nichts das Gerät verlässt.',
    ],
    note: 'Wenn du es selbst prüfen willst, öffne das Netzwerk-Panel deines Browsers während der Umwandlung — keine Anfrage trägt deine Datei nach außen.',
    sourceLinkText: 'Lies den Quellcode.',
  },

  howto: {
    h2: 'So gehst du vor',
    steps: [
      {
        h3: 'Dateien auswählen',
        p: 'Klicke, um WebP-Dateien auszuwählen, oder zieh sie irgendwo auf die Seite. Mehrere Dateien auf einmal sind kein Problem.',
      },
      {
        h3: 'Einstellungen anpassen (optional)',
        p: 'Wähle JPG oder PNG, stell die JPG-Qualität ein oder ändere die Größe. Mit den Voreinstellungen bekommst du gute Ergebnisse.',
      },
      {
        h3: 'Herunterladen',
        p: 'Jede Datei wird heruntergeladen, sobald sie fertig ist; ein ganzer Stapel lässt sich als ZIP herunterladen.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Werden meine Bilder irgendwohin hochgeladen?',
      a: 'Nein. Die Umwandlung läuft vollständig in deinem Browser. Es gibt keine Server-Komponente, also haben deine Dateien keinen Weg von deinem Gerät weg. Der Quellcode ist offen, und du kannst das im Netzwerk-Panel deines Browsers nachprüfen.',
    },
    {
      q: 'Was ist eine WebP-Datei?',
      a: 'WebP ist das Bildformat, das Google fürs Web entwickelt hat. Es komprimiert Fotos und Grafiken auf kleinere Größen als JPEG oder PNG, damit Seiten zügiger laden — deshalb liefern heute so viele Seiten ihre Bilder als .webp aus. Der Haken: Manche älteren Apps, Programme und Upload-Formulare nehmen das Format nicht an, sodass eine Umwandlung in JPG oder PNG oft nötig ist.',
    },
    {
      q: 'Warum lässt sich meine WebP-Datei in manchen Apps nicht öffnen?',
      a: 'Jeder moderne Browser liest WebP, aber außerhalb des Browsers ist die Unterstützung uneinheitlich. Manche älteren Bildbearbeitungsprogramme, Office-Programme und Websites erwarten weiterhin JPG oder PNG, also kann eine heruntergeladene .webp abgewiesen werden. Die Umwandlung in JPG liefert dir eine Datei, die diese Apps annehmen.',
    },
    {
      q: 'Was passiert mit der Transparenz, wenn ich in JPG umwandle?',
      a: 'JPG kennt keine Transparenz, daher werden transparente Bereiche mit Weiß gefüllt. Wenn du die Transparenz behalten willst, wähle stattdessen PNG als Ausgabe — das ist verlustfrei und erhält den Alphakanal.',
    },
    {
      q: 'Verschlechtert die Umwandlung die Qualität?',
      a: 'Die JPG-Ausgabe nutzt eine einstellbare Qualität (Voreinstellung 92 %), die bei den meisten Bildern optisch nah am Original liegt. Die PNG-Ausgabe ist verlustfrei aus dem dekodierten Bild.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja, das Tool ist eine PWA (Progressive Web App). Nach dem ersten Besuch liegt es im Cache, sodass die Umwandlung ohne Netzverbindung läuft. Du kannst es auch auf deinem Startbildschirm installieren.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Gebaut und gepflegt von Geppetto. Ein Teil des Codes entsteht mit KI-Unterstützung; Prüfung und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },
};
