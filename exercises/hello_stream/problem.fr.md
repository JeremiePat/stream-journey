Conceptuellement, un stream n'est rien de plus qu'un flux de données. Une foi qu'on a compris ça, il ne s'agit plus que de jouer les plombiers en branchant stream dans un autre pour manipuler ce flux de données de manière a obtenir le résultat attendu.

Les streams sont une des fonctionnalités clé de Node.js et il vous arrive sans doute de les utiliser sans même vous en rendre compte. De nombreux modules natif de Node.js utilisent largement les streams: Système de fichier, réseau, process, chiffrement, etc.


Node.js fournis de nombreuses fonctions utilitaires qui créent ou consomment des streams. Par exemple, on peut lire un fichier avec la fonction `createReadStream` du module _File System_ et on peut écrire dans un fichier avec la fonction `createWriteStream` de ce même module. Ainsi, on peut copier un fichier de la manière suivante:

```
const fs = require('fs')
const readable = fs.createReadStream('file.txt')
const writable = fs.createWriteStream('copy.txt')

readable.pipe(writable)
```

Ce petit exemple de code nous permet de mettre en évidence certain concepts liés au stream Node.js:

1. Les streams existent sous différentes formes: `Readable` (pour emmètre des données), `Writable` (pour consommer des données) et `Duplex` (pour faire les deux).
2. Les streams sont branchés les uns au autre via la fonction `pipe()`.

Dans les prochains exercices, on verra en détail comment créer chaque type de stream mais pour l'instant, il est temps de mettre les mains dans le cambouis !

------------------------------------------------------------------------------
## EXERCICE

Écrivez un programme qui va créer un stream en lecture (readable) depuis un fichier et affichez le contenu du fichier dans la console (qu'on appelle également _sortie standard_)

Le chemin vers le fichier à lire vous sera fournis comme premier argument de la ligne de commande(i.e., `process.argv[2]`).

------------------------------------------------------------------------------
## ASTUCES

Pour compléter cet exercice, vous aurez besoin d'informations disponible dans la documentation de Node.js (en anglais). En particulier:

- https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
- https://nodejs.org/api/process.html#process_process_stdout
