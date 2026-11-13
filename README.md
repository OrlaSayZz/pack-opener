# Pack Opener — application de bureau

Le jeu Pack Opener (1re collection : Lys de Minuit) en application Windows (.exe), avec mises à jour automatiques depuis GitHub.

## Ce qu'il te faut (une seule fois)

1. Un compte sur [github.com](https://github.com).
2. [Git](https://git-scm.com/download/win) installé sur ton PC (garde les options par défaut).
3. Facultatif, pour tester le jeu sur ton PC avant de publier : [Node.js LTS](https://nodejs.org).

## 1. Créer le dépôt GitHub

1. Sur GitHub, clique sur **New repository**.
2. Nom : `pack-opener`. Visibilité : **Public**. Ne coche rien d'autre.
3. Clique sur **Create repository**.

Le dépôt doit être public : c'est ce qui permet à l'application de tes amis de télécharger les mises à jour sans mot de passe.

## 2. Mettre ton pseudo dans le projet

Ouvre `package.json` avec le Bloc-notes et remplace `OrlaSayZz` par ton pseudo GitHub. Enregistre.

## 3. Envoyer le projet sur GitHub

Dans le dossier du projet, fais clic droit → **Ouvrir dans le terminal** (ou « Git Bash Here »), puis tape ces lignes une par une (remplace `OrlaSayZz`) :

```
git init
git add .
git commit -m "Première version"
git branch -M main
git remote add origin https://github.com/OrlaSayZz/pack-opener.git
git push -u origin main
```

La première fois, Git te demandera de te connecter à GitHub : une fenêtre s'ouvre, connecte-toi.

## 4. Publier la première version

```
git tag v1.0.0
git push origin v1.0.0
```

GitHub construit alors le .exe tout seul (onglet **Actions** du dépôt, environ 5 à 10 minutes). Quand c'est fini, l'installateur `Pack-Opener-Setup-1.0.0.exe` apparaît dans l'onglet **Releases**. Envoie ce lien à tes amis.

Au premier lancement, Windows peut afficher « Windows a protégé votre ordinateur » parce que l'application n'est pas signée. Clique sur **Informations complémentaires** puis **Exécuter quand même**.

## 5. Publier une nouvelle version (nouvelle série, corrections…)

1. Remplace le contenu du dossier `app` par la nouvelle version (celle que je te prépare).
2. Dans `package.json`, augmente le numéro : `"version": "1.1.0"`.
3. Envoie tout et crée le tag correspondant :

```
git add .
git commit -m "Nouvelle série"
git push
git tag v1.1.0
git push origin v1.1.0
```

Le numéro du tag doit être le même que dans `package.json`, avec un `v` devant.

Chez toi et tes amis, l'application vérifie les mises à jour au lancement puis toutes les heures. Elle télécharge la nouvelle version, affiche « Version 1.1.0 prête » avec un bouton **Redémarrer**, et l'installe. Si on ne clique pas, elle s'installe toute seule à la fermeture du jeu.

## Bon à savoir

- **Sauvegarde** : chaque PC garde sa propre collection, et les mises à jour ne l'effacent pas. Pour changer de PC, utilise le code de sauvegarde dans **Réglages**.
- **Tester sur ton PC sans publier** : avec Node.js installé, tape `npm install` une fois, puis `npm start`.
- **Construire le .exe sur ton PC** (facultatif) : `npm run dist`, l'installateur arrive dans le dossier `dist`.
- Projet perso de fan, non commercial.
