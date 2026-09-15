# Exercice : Jeu de Zombies en JavaScript

## 🎮 Brief  
Dans un monde infesté de zombies, vous incarnez un survivant déterminé à éradiquer un maximum de morts-vivants.  
Votre mission : coder un mini-jeu où les zombies apparaissent, le joueur les combat et progresse en **expérience** et en **or**.  

---

## 🧑 Le joueur  
Créez un objet `player` contenant les propriétés suivantes :  
- **pseudo** (nom du joueur)  
- **xp** (points d’expérience)  
- **gold** (monnaie)  

---

## 🧟 Les zombies  
Créez un tableau `zombies` contenant plusieurs zombies.  
Chaque zombie doit avoir :  
- un **type** (exemple : coureur, tank, rampant)  
- une **image**  
- un nombre de **points de vie (hp)**  

---

## 📊 Affichage des infos du joueur  
Affichez sur la page les informations du joueur (**pseudo, xp, gold**).  

---

## 🧟 Affichage d’un zombie  
En dessous, affichez un zombie chargé **aléatoirement**.  
Ajoutez une **barre de vie** correspondant à ses points de vie.  

---

## ⚔️ Combat au clic  
Quand on clique sur le zombie :  
- il perd **1 point de vie**  

---

## 💀 Mort du zombie  
Quand les points de vie d’un zombie tombent à `0` :  
- un **nouveau zombie** aléatoire apparaît  
- le joueur gagne **+1 xp**  
- le joueur gagne un montant **aléatoire d’or** (entre 1 et 5)  

---

## 💾 Sauvegarde automatique  
- Sauvegardez les infos du joueur dans le **localStorage** toutes les **10 secondes**  ou en cliquant sur un bouton
- Au rafraîchissement de la page, chargez ces informations si elles existent  
- L’état du zombie **n’est pas sauvegardé** : un nouveau zombie apparaîtra après refresh



---

# 🏹 Partie 2 : Les Armes

Les armes permettent d'infliger des dégâts automatiques.

## Étape 1 : Affichage des armes du joueur  
Sous le zombie, affichez les armes du joueur.  
- Si elles **ne sont pas possédées** → elles apparaissent **grisées**  
- Si elles **sont possédées** → elles apparaissent **en couleur**  

Dans l’objet `player`, ajoutez :  

- **weapons** : un tableau d’armes (possédées ou non)  

Une arme est définie par un objet :  
```js
{
  name: "Pistolet",
  image: "images/weapons/gun.png",
  cooldown: 5,   // temps en secondes entre chaque tir auto
  damages: 1,    // dégâts infligés
  cost: 10,      // prix en gold
  owned: false   // si le joueur la possède ou non
}
```

## Étape 2 : Achat d’armes

Le joueur peut acheter des armes avec ses golds, selon le coût défini par la propriété `cost`. L'achat se fait en cliquant sur un bouton situé sous l'arme en question.
Une fois possédée, une arme inflige automatiquement ses dégâts toutes les X secondes (X défini par `cooldown`).