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
    name: 'Agrandissez la forme d’onde',
    text: 'Dans la timeline, augmentez la hauteur des clips pour repérer les silences : ce sont les parties plates de la forme d’onde audio.',
  },
  {
    name: 'Coupez au début et à la fin de chaque silence',
    text: 'Lisez le clip et coupez avec la Lame (Cmd+B) au début et à la fin de chaque blanc et de chaque prise ratée.',
  },
  {
    name: 'Supprimez les morceaux silencieux',
    text: 'Sélectionnez chaque segment vide et supprimez-le. Dans le scénario principal, la timeline magnétique referme l’espace toute seule.',
  },
  {
    name: 'Recommencez sur chaque clip',
    text: 'Refaites la même passe sur tous les rushes du tournage, puis remettez les clips nettoyés dans l’ordre.',
  },
];

const AUTO_STEPS = [
  {
    name: 'Déposez tous vos rushes dans AutoTrim',
    text: 'Tous les fichiers du tournage d’un coup, y compris les fichiers audio seuls. En multicam, AutoTrim retrouve les fichiers d’une même prise (plusieurs caméras, un enregistreur audio séparé) et les synchronise.',
  },
  {
    name: 'Choisissez ce qu’il faut retirer',
    text: 'Les silences, et les hésitations (les « euh ») si vous voulez aussi vous en débarrasser : elles sont détectées dans une dizaine de langues, dont le français et l’anglais. Ajustez le seuil de silence si vous préférez laisser respirer.',
  },
  {
    name: 'Écoutez la preview avant d’exporter',
    text: 'Lancez la lecture pour entendre vos rushes sans les blancs, zoomez sur une coupe et écoutez ce qui a été retiré. Le traitement et la preview sont gratuits.',
  },
  {
    name: 'Exportez le FCPXML et importez-le dans Final Cut Pro',
    text: 'Une seule timeline, tous les clips déjà coupés et assemblés dans l’ordre. Chaque coupe reste ajustable : tirez le bord d’un clip pour retrouver une respiration. Le montage fin se fait dans Final Cut Pro, comme d’habitude.',
  },
];

const FAQ = [
  {
    q: 'Final Cut Pro a-t-il une fonction pour supprimer les silences ?',
    a: 'Non. En 2026, Final Cut Pro n’a aucune fonction native qui détecte et supprime les silences. Quelques effets tiers savent détecter les silences dans Final Cut Pro. AutoTrim, lui, travaille avant le montage : il traite tout le tournage d’un coup, retire les hésitations en plus des silences, synchronise les prises multicam et exporte une seule timeline FCPXML assemblée, le tout sur votre machine. Sinon, il reste la coupe à la main avec l’outil Lame.',
  },
  {
    q: 'Peut-on traiter tous les clips d’un tournage d’un coup ?',
    a: 'Pas nativement dans Final Cut Pro. Avec AutoTrim, oui : vous déposez tous vos rushes en une fois, les fichiers sont traités en parallèle et vous récupérez une seule timeline FCPXML, avec chaque clip déjà nettoyé et dans l’ordre.',
  },
  {
    q: 'AutoTrim enlève-t-il aussi les « euh » ?',
    a: 'Oui. AutoTrim retire les hésitations en plus des silences, dans une dizaine de langues dont le français et l’anglais. Vous pouvez écouter tout ce qui a été retiré dans la preview avant d’exporter.',
  },
  {
    q: 'Mes rushes sont-ils envoyés en ligne ?',
    a: 'Non. AutoTrim tourne entièrement sur votre machine, sous macOS ou Windows. Rien n’est envoyé, et après le téléchargement initial des modèles, il fonctionne hors ligne : vos vidéos inédites et vos projets clients restent privés.',
  },
  {
    q: 'Combien coûte AutoTrim ?',
    a: 'L’essai est gratuit, avec des previews illimitées. L’export de la timeline demande une licence : 15 $/mois, 119 $/an, ou 149 $ en une fois pour une licence à vie. La licence est remboursée sous 14 jours si l’outil ne vous convient pas.',
  },
  {
    q: 'Et si j’ai filmé avec plusieurs caméras ou enregistré le son à part ?',
    a: 'Déposez tout. AutoTrim retrouve les fichiers d’une même prise (plusieurs caméras, un enregistreur audio séparé), les synchronise et ne coupe que quand personne ne parle. Les angles et les micros arrivent synchronisés dans la timeline exportée.',
  },
  {
    q: 'Le dérush automatique va-t-il casser mon rythme ?',
    a: 'Vous gardez la main. Vous ajustez le seuil de silence, vous écoutez ce qui a été retiré avant d’exporter, et chaque coupe reste ajustable dans Final Cut Pro : tirez le bord d’un clip pour retrouver une respiration.',
  },
];

function Body({ locale }: { locale: string }) {
  return (
    <>
      <AnswerBox lang="fr">
        <p>
          <strong>Final Cut Pro n’a pas de fonction native pour supprimer les silences.</strong>{' '}
          Vous pouvez couper chaque silence à la main avec l’outil Lame,
          utiliser l’un des quelques effets tiers qui savent détecter les
          silences dans Final Cut Pro, ou passer vos rushes dans une
          application comme{' '}
          <Link href={`/${locale}`} className="text-at-accent hover:underline">
            AutoTrim
          </Link>{' '}
          avant le montage : elle retire les silences et les hésitations de
          tout le tournage d’un coup, sur votre machine, et vous rend une
          seule timeline FCPXML assemblée pour Final Cut Pro.
        </p>
      </AnswerBox>

      <H2 id="why-fcp-cant">Pourquoi Final Cut Pro ne le fait pas tout seul</H2>
      <P>
        Dans Premiere Pro, le montage basé sur le texte permet de supprimer les
        pauses. DaVinci Resolve intègre une détection des silences. Final Cut
        Pro n’a ni l’un ni l’autre. Ses plugins sont des effets FxPlug, pas
        des extensions de workflow : c’est pour ça qu’AutoCut existe pour
        Premiere et Resolve, mais pas pour Final Cut Pro. Quelques effets
        tiers savent tout de même détecter les silences dans Final Cut Pro.
      </P>
      <P>
        Pendant des années, la réponse à « comment supprimer les silences
        dans FCP ? » a été « à la main ». L’autre voie consiste à faire le
        dérush <em>avant</em> que les rushes n’arrivent dans Final Cut Pro :
        AutoTrim prend tout le tournage d’un coup, retire les hésitations en
        plus des silences, synchronise les prises multicam et vous rend une
        seule timeline FCPXML assemblée, le tout sur votre machine.
      </P>

      <H2 id="manual-method">Méthode 1 : couper les silences à la main (gratuit, mais long)</H2>
      <P>La méthode classique, avec Final Cut Pro seul :</P>
      <StepList steps={MANUAL_STEPS} />
      <P>
        Ça fonctionne et ça ne coûte rien, sauf du temps. Sur environ
        2&nbsp;500 heures de rushes traitées par AutoTrim, la part de silence
        médiane est d’<strong>un tiers</strong> : sur un tournage face caméra
        typique, c’est à peu près un tiers de la durée qu’il faut repérer et
        couper à la main, clip après clip. Si vous publiez chaque semaine, ce
        dérush revient chaque semaine.
      </P>

      <H2 id="automatic-method">
        Méthode 2 : supprimer les silences automatiquement avec AutoTrim
      </H2>
      <P>
        AutoTrim est une application de bureau pour macOS et Windows (pas un
        plugin), pensée pour ce workflow : vous déposez tous les rushes d’un
        tournage, elle retire les silences et les hésitations (les « euh »)
        grâce à une IA qui tourne entièrement sur votre machine, et vous rend{' '}
        <strong>une seule timeline FCPXML assemblée</strong>, pas un fichier
        par clip, qui s’ouvre directement dans Final Cut Pro. Elle exporte
        aussi une timeline pour Premiere Pro ou DaVinci Resolve.
      </P>
      <StepList steps={AUTO_STEPS} />

      <H2 id="comparison">À la main ou automatique : le comparatif</H2>
      <DataTable
        headers={['', 'À la main (outil Lame)', 'Avec AutoTrim']}
        rows={[
          ['Ce qui est coupé', 'Chaque silence, repéré à l’œil et à l’oreille', 'Les silences et les hésitations, détectés sur votre machine'],
          ['Tournage en plusieurs clips', 'Un clip à la fois, puis l’assemblage', 'Tous les rushes d’un coup, une seule timeline assemblée'],
          ['Multicam', 'Synchro des angles et du son à faire vous-même', 'Fichiers d’une même prise retrouvés et synchronisés ; coupe seulement quand personne ne parle'],
          ['Hésitations (« euh »)', 'À repérer et couper à l’oreille', 'Détectées dans une dizaine de langues, dont le français et l’anglais'],
          ['Contrôle', 'Total', 'Preview avant export ; chaque coupe reste ajustable dans FCP'],
          ['Prix', 'Gratuit (hors votre temps)', 'Gratuit à l’essai · 15 $/mois · 119 $/an · 149 $ à vie'],
          ['Confidentialité', 'Local', 'Local : rien n’est envoyé en ligne'],
        ]}
      />
      <P>
        Le temps gagné dépend de ce que vous tournez. James, monteur sur Final
        Cut, l’estime à « au moins une à deux heures sur un projet typique ».
      </P>

      <H2 id="tips">Conseils pour des coupes propres</H2>
      <UL
        items={[
          <>Partez des réglages par défaut, puis ajustez le <strong>seuil de silence</strong> si le bruit de fond de la pièce est fort.</>,
          <>Gardez un peu de <strong>marge autour de chaque phrase</strong> : les respirations restent naturelles et aucun mot n’est coupé.</>,
          <>Pour un podcast avec un micro par personne, déposez toutes les pistes : AutoTrim ne coupe que quand personne ne parle, la pause d’un invité n’ampute donc jamais la réponse d’un autre.</>,
          <>Écoutez les hésitations retirées dans la preview avant d’exporter, surtout si vous passez d’une langue à l’autre.</>,
          <>Vos fichiers d’origine restent intacts : le FCPXML pointe vers vos médias, rien n’est réencodé ni modifié.</>,
        ]}
      />

      <CtaBox
        locale={locale}
        lang="fr"
        title="Arrêtez de couper les silences à la main dans Final Cut Pro"
        subtext="Déposez vos rushes, écoutez les coupes, importez une seule timeline FCPXML propre."
      />

      <FaqBlock items={FAQ} lang="fr" />

      <RelatedLinks
        lang="fr"
        links={[
          { href: guideHref(locale, 'best-silence-remover-final-cut-pro'), label: 'Le meilleur logiciel pour couper les silences dans Final Cut Pro (2026)' },
          { href: guideHref(locale, 'remove-filler-words-from-video'), label: 'Supprimer les mots de remplissage d’une vidéo (en anglais)' },
          { href: `/${locale}/compare/final-cut-pro`, label: 'AutoTrim vs les outils intégrés de Final Cut Pro' },
          { href: `/${locale}/compare/timebolt`, label: 'AutoTrim vs TimeBolt' },
          { href: `/${locale}/pricing`, label: 'Les tarifs d’AutoTrim' },
        ]}
      />
    </>
  );
}

const content: HowToGuide = {
  lang: 'fr',
  title: 'Comment supprimer les silences dans Final Cut Pro (à la main ou automatiquement)',
  metaTitle: 'Supprimer les silences dans Final Cut Pro : 2 méthodes (2026)',
  socialTitle: 'Supprimer les silences dans Final Cut Pro (2026)',
  description:
    'Final Cut Pro n’a pas de fonction pour supprimer les silences. Les deux méthodes des monteurs FCP en 2026 : couper à la main avec l’outil Lame, ou faire le dérush automatiquement et importer une seule timeline FCPXML propre.',
  keywords:
    'supprimer les silences final cut pro, couper les silences final cut pro, enlever les blancs final cut pro, dérush automatique final cut pro, supprimer les euh vidéo, fcpxml, jump cut final cut pro',
  ogAlt: 'AutoTrim supprime les silences de rushes pour Final Cut Pro',
  subtitle:
    'En 2026, Final Cut Pro ne sait toujours pas supprimer les silences tout seul. Voici les deux méthodes qu’utilisent vraiment les monteurs FCP, et ce que chacune vous coûte.',
  updated: '22 octobre 2026',
  datePublished: '2026-10-22',
  dateModified: '2026-10-22',
  faq: FAQ,
  howTo: {
    name: 'Comment supprimer les silences dans Final Cut Pro automatiquement',
    description:
      'Retirer les silences et les hésitations de tous vos rushes avant qu’ils n’arrivent dans Final Cut Pro, avec AutoTrim, qui génère une seule timeline FCPXML assemblée.',
    tool: 'AutoTrim (application de bureau pour macOS et Windows)',
    steps: AUTO_STEPS,
  },
  Body,
};

export default content;
