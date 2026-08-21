/* ============================================================
   CATALOGUE DE LA PLATEFORME — Vestey Foods France
   ------------------------------------------------------------
   Chaque carte de la page d'accueil est construite AUTOMATIQUEMENT
   à partir de l'en-tête <!-- OUTIL ... --> présent dans le fichier
   de l'outil. Vous n'avez donc pas à recopier titre / description.

   POUR AJOUTER UN OUTIL (procédure complète : README-plateforme.md)
     1. Déposez le fichier .html (avec son en-tête OUTIL) dans /outils
     2. Ajoutez SON NOM DE FICHIER dans la liste "tools" ci-dessous
     3. Redéployez (glisser le zip/dossier sur Netlify)

   Deux formes possibles dans "tools" :
     • une chaîne  -> nom d'un fichier réel dans /outils (carte auto)
         "renommeur-factures.html"
     • un objet    -> un outil "à venir", sans fichier encore
         { soon: true, category: "XLS", title: "...", description: "..." }
   ============================================================ */

window.ATELIER = {

  brand: {
    mark: "VF",
    name: "Vestey Foods France",
    tagline: "// boîte à outils interne",
    place: "Since 1897",
    heroEyebrow: "Prototypes ADV · LOG · Qualité",
    heroTitle: "Vos tâches répétitives, transformées en outils que vous <em>cliquez</em>.",
    heroLead: "Chaque outil fait une chose, bien. Vous déposez un fichier, vous récupérez le résultat — sans quitter votre navigateur.",
    heroAssurance: "Traitement 100 % local. Vos documents ne quittent pas votre poste."
  },

  tools: [
    "commandes-non-sorties.html",
    "stocks-conhexa.html",
    "facture-conhexa.html",
    "cartographie-flux.html",
    "lecture-sscc.html",
    "packing-list.html"
  ]
};
