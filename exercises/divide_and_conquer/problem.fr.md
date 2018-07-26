Les streams de type `Transform` peuvent radicalement changer la nature d'un stream. Entre autre, ils peuvent changer la longueur des morceaux de données, ajouter de nouvelles données ou carrément en enlever.

On a vu qu'une fonction de transformation peut renvoyer un morceau de données dans le stream via la fonction de rappel:

```
transform (chunk, enc, callback) {
  callback(null, chunk)
}
```

Cependant, il s'agit seulement d'un raccourci pour l'utilisation de la méthode `push` hérité de l'interface `Readable`:

```
transform (chunk, enc, callback) {
  this.push(chunk)
  callback()
}
```

La méthode `push` a deux avantages: Elle peut être appelée autant de foi que nécessaire pour envoyer de nouveaux morceaux de données.

Ceci dit, `push` n'est pas suffisant pour envoyer de nouvelles données spécifiquement à la fin du stream. Cela tiens à ce que la fonction de transformation n'a aucun moyen de savoir si le morceau de données sur lequel elle travail est le dernier ou non.

Pour résoudre ce problème, les stream de type `Transform` utilisent une autre fonction appelée `flush`. Cette fonction sera appelée juste avant de clôturer le stream pour avoir une dernière opportunité d'envoyer des données supplémentaires dans le stream.

Entre autre choses, `flush` est utilisée pour créer des stream d'accumulation qui vont consommer toutes les données d'un stream avant d'envoyer un seul morceau de données à la fin. A titre d'exemple voici comment calculer la longueur total d'un texte lu sous la forme d'un stream:

```
const countLetters = new Transform({
  transform (chunk, enc, callback) {
    this.count = (this.count || 0) + String(chunk).length

    // Appeler callback sans paramètre va permettre de récupérer le
    // prochain morceau de données sans rien envoyer dans le stream.
    callback()
  },

  flush (callback) {
    // On envoie le résultat final de notre calcul dans le stream
    callback(null, String(this.count))
  }
})
```

En sachant tout ça, vous devriez être près pour le prochain exercice !


------------------------------------------------------------------------------
## EXERCICE

Créer un programme qui va lire un fichier, transformer son contenu et envoyer le résultat vers la sortie standard.

Le chemin vers le fichier à lire vous sera fournis comme premier argument de la ligne de commande (i.e., `process.argv[2]`). Vous n'avez donc pas à créer ce fichier vous-même.

Le fichier contiendra des nombres et des mots séparés par des espaces.

Votre stream de transformation doit extraire chaque nombre des données qu'il recevra et les renvoyer dans le stream suivant, chacun suivit d'un retour à la ligne. A la fin, il devra renvoyer la somme de tous les nombres, elle aussi suivit par un retour à la ligne.

------------------------------------------------------------------------------
## ASTUCES

Pour certaines personnes, il peut être plus facile de séparer toutes les opérations de transformation dans des streams dédiés plutôt que d'essayer de tout faire dans un seul stream.

Dans cet exercice, il y a trois opérations de transformation à gérer: extraire les nombres; calculer la somme des nombres; ajouter une nouvelle ligne après chaque nombre.

Pour compléter cet exercice, vous aurez besoin d'informations disponibles dans la documentation de Node.js (en anglais). En particulier:

- https://nodejs.org/api/stream.html#stream_transform_flush_callback
- https://nodejs.org/api/stream.html#stream_readable_push_chunk_encoding
