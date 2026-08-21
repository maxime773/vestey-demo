// Fonction serveur — extraction des lignes d'une facture logistique (Conhexa).
// Reçoit le texte de la facture, demande à Claude d'en extraire les lignes
// structurées, et renvoie du JSON. La comparaison au barème se fait ensuite
// dans le navigateur (déterministe, donc vérifiable).
// La clé API n'est jamais dans ce fichier : variable d'environnement Netlify.

exports.handler = async (event) => {
  const H = { "Content-Type": "application/json" };

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: H, body: JSON.stringify({ error: "Méthode non autorisée." }) };
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return { statusCode: 500, headers: H, body: JSON.stringify({
      error: "Clé API absente. Ajoutez ANTHROPIC_API_KEY dans les variables d'environnement Netlify." }) };
  }

  let text = "";
  try { text = (JSON.parse(event.body || "{}").text || "").toString(); } catch (e) {}
  text = text.slice(0, 14000).trim();
  if (!text) {
    return { statusCode: 400, headers: H, body: JSON.stringify({ error: "Aucun texte reçu à analyser." }) };
  }

  const system =
    "Tu extrais les lignes d'une facture de prestation logistique (entreposage, manutention, transport). " +
    "Réponds UNIQUEMENT avec un objet JSON valide, sans texte ni balise Markdown autour. " +
    "Schéma exact : {\"fournisseur\": string, \"numero\": string, \"periode\": string, " +
    "\"lignes\": [{\"libelle\": string, \"quantite\": number, \"unite\": string, " +
    "\"prix_unitaire\": number, \"montant\": number}], \"total_ht\": number} . " +
    "N'invente jamais un chiffre : si une valeur est absente ou illisible, mets null. " +
    "Les montants sont en euros, en nombre (pas de symbole, point décimal). " +
    "Reprends le libellé exactement tel qu'il apparaît sur la facture.";

  const payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    system: system,
    messages: [{ role: "user", content: "Voici le texte de la facture :\n\n" + text }]
  };

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const detail = await r.text();
      return { statusCode: 502, headers: H, body: JSON.stringify({
        error: "Erreur de l'API Claude (" + r.status + ").", detail: detail.slice(0, 300) }) };
    }
    const data = await r.json();
    let out = "";
    if (Array.isArray(data.content)) {
      out = data.content.filter(b => b.type === "text").map(b => b.text).join("");
    }
    out = out.replace(/```json/gi, "").replace(/```/g, "").trim();

    let parsed;
    try { parsed = JSON.parse(out); }
    catch (e) {
      return { statusCode: 200, headers: H, body: JSON.stringify({
        error: "Le modèle n'a pas renvoyé de données exploitables.", raw: out.slice(0, 400) }) };
    }
    return { statusCode: 200, headers: H, body: JSON.stringify(parsed) };
  } catch (err) {
    return { statusCode: 500, headers: H, body: JSON.stringify({
      error: "Échec de l'appel à l'API : " + (err.message || String(err)) }) };
  }
};
