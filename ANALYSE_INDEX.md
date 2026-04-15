# Analyse de `index.html`

## Nature du fichier

`index.html` n'est pas un fichier source métier proprement structuré à la main.
C'est un export HTML généré par une page Paperless Post / Next.js avec :

- beaucoup de CSS inline injecté dans des balises `<style>`
- des classes hashées de type `pp-...`
- un gros bloc de données applicatives dans `__NEXT_DATA__`
- des assets distants chargés depuis des CDN

Conclusion pratique :

- ne pas prendre les classes hashées comme des points d'ancrage stables
- préférer les attributs stables comme `data-block-type`, `data-test`, `data-testid`, `id`
- toute modification importante doit distinguer :
  1. le contenu visible HTML
  2. les données runtime dans `__NEXT_DATA__`

## Carte rapide du fichier

- `1-386` : `<head>` avec SEO, Open Graph, favicon, polices, CSS et scripts distants
- `387-5378` : corps HTML rendu
- `5379-15312` : bloc JSON `__NEXT_DATA__`

## Zones principales

### 1. Tête du document

Repères utiles :

- titre navigateur : lignes `65-67`
- meta Open Graph title : lignes `22-26`
- meta image : lignes `52-64`
- identifiants de page / event : lignes `40-49`

Quand modifier ici :

- nom de la page dans l'onglet
- aperçu réseau social
- image de preview
- URL de partage

### 2. Reset global et CSS générique

Repère utile :

- reset CSS global et règle `button` autour de `548-579`

Correction appliquée :

- ajout de `appearance: none;` après `-webkit-appearance: none;`

### 3. Shell principal de la page

Repère utile :

- début du contenu principal : ligne `735`, `<section id="main">`

### 4. Bloc hero / media principal

Repères utiles :

- bloc media : lignes `900-1062`
- type de bloc : `data-block-type="primary_media"`
- bouton media interne : lignes `1055-1058`, `data-test="editor-media-modify-button"`

Ce bloc pilote surtout :

- la carte / enveloppe
- les dimensions et centrages du hero
- les scènes média du visuel principal

### 5. Bloc infos événement

Repères utiles :

- début : lignes `1189-4507`
- type de bloc : `data-block-type="basic_info"`

Sous-zones importantes :

- titre visible : lignes `4051-4085`
- texte du titre : lignes `4081-4083`
- zone host/contact : lignes `4090-4498`
- libellé `Contact` : lignes `4388-4390`
- fallback `Message host` : ligne `4460`

### 6. Bloc texte / détails

Repères utiles :

- début : lignes `4646-5378`
- type de bloc : `data-block-type="templated_block"`
- conteneur stable : lignes `4784-4799`, `id="details.items"`
- texte riche principal : lignes `4927-...`, `id="details.items.itemWrapper.infoWrapper.textWrapper.itemNoteRichText"`

Ce bloc est le meilleur point d'entrée si tu veux :

- ajouter du texte libre
- mettre des consignes
- injecter une liste ou un lien
- transformer la zone détails en contenu plus personnalisé

### 7. Données applicatives runtime

Repère utile :

- début du JSON : lignes `5379-5380`
- script : `<script id="__NEXT_DATA__" type="application/json">`

Ce bloc contient :

- la structure logique de la page
- les textes de la carte
- les scènes media
- les données d'événement
- les layouts et règles de style utilisés au runtime

## Contenus importants déjà localisés

### Titre visible

- HTML visible : lignes `4081-4083`
- valeur : `joyeux anniversaire la she`

### Titre meta / partage

- meta og:title : lignes `22-26`
- `<title>` navigateur : lignes `65-67`

### Texte de la carte

Dans `__NEXT_DATA__` :

- `HAPPY\nMEOW DAY` : ligne `5908`
- `JEUDI, 16 AVRIL \n2026` : ligne `5982`

Version du même contenu répétée plus bas dans le JSON :

- `HAPPY\nMEOW DAY` : lignes `10041` et `14227`
- `JEUDI, 16 AVRIL \n2026` : lignes `10115` et `14301`

### Placeholder destinataire enveloppe

- `Your recipient’s name here` : ligne `6209`
- répétitions : lignes `10341` et `14507`

### Données événement

Repères utiles :

- nom de l'événement : ligne `6550`
- `inviteSubject` : ligne `6579`
- `inviteFrom` : ligne `6580`
- `rsvpType` : ligne `6576`
- `eventType` : ligne `6589`
- `guestToken` : lignes `15273` et `15297`

## Sélecteurs et ancres stables à privilégier

Pour de futures modifications, privilégier :

- `section#main`
- `[data-block-type="primary_media"]`
- `[data-block-type="basic_info"]`
- `[data-block-type="templated_block"]`
- `[data-test="event-title"]`
- `[data-testid="inline-display-title"]`
- `[data-testid="inline-display-host"]`
- `[data-testid="message-host-button"]`
- `#details.items`
- `#details.items.itemWrapper.infoWrapper.textWrapper.itemNoteRichText`
- `#__NEXT_DATA__`

Éviter comme point d'ancrage principal :

- les classes `pp-...`
- les classes de suffixe type `e56fru00`, `e1mnejau1`

Ces classes sont générées et peu fiables si le HTML est réexporté.

## Anomalies et pièges constatés

Le fichier contient plusieurs indices de génération automatique. Ils ne cassent pas forcément l'affichage, mais ce sont des zones à traiter avec prudence :

- règles dupliquées en grand nombre
- médias dupliqués avec `minwidth` et `min-width`
- sélecteurs dupliqués `nthoftype` et `nth-of-type`
- valeurs suspectes comme `font-size: false`
- expressions suspectes comme `100vh - undefined`
- contenu mélangé avec des balises `<style>` au milieu du flux HTML, par exemple autour de `Message host`

Conséquence :

- pour une modif ciblée, il vaut mieux changer le contenu métier et un petit sous-ensemble de styles, pas "nettoyer" tout le généré d'un coup

## Stratégie recommandée pour les prochaines modifs

### Si tu veux changer un texte visible simple

Chercher d'abord :

- `joyeux anniversaire la she`
- `Message host`
- `Contact`
- `HAPPY`
- `MEOW DAY`
- `JEUDI, 16 AVRIL`

### Si tu veux changer la structure d'un bloc

Cibler d'abord :

- `data-block-type="basic_info"`
- `data-block-type="templated_block"`

### Si tu veux changer une donnée métier globale

Regarder aussi `__NEXT_DATA__`, surtout si la même valeur apparaît à plusieurs endroits.

### Si tu veux changer le style

Chercher une ancre stable proche du contenu voulu, puis modifier uniquement le bloc `<style>` le plus local.

## Commandes utiles pour travailler vite

```bash
rg -n 'data-block-type="basic_info"|data-block-type="templated_block"|data-test="event-title"|__NEXT_DATA__' index.html
rg -n 'joyeux anniversaire la she|Message host|HAPPY|JEUDI, 16 AVRIL|Your recipient' index.html
rg -n 'appearance: none|-webkit-appearance|font-size: false|minwidth|undefined' index.html
```

## Résumé opérationnel

Pour aller vite sur ce projet :

- contenu visible simple : modifier le HTML rendu
- contenu de carte / données profondes : vérifier aussi `__NEXT_DATA__`
- styles : modifier localement autour du bloc concerné
- gros refactor : déconseillé directement sur ce fichier généré

Si tu me demandes une prochaine modification, je peux désormais cibler directement la bonne zone sans refaire toute l'analyse.
