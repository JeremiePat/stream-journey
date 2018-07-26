La plus part du temps, quand on veut utiliser des streams, les streams de
type `Readable` et `Writable` sont créés via des fonctions natives de Node.js
et ce qu'on veut vraiment, c'est appliquer des transformations au flux de
données. Voyons donc comment implémenter des streams de type `Transform`.

Node.js fournis fort à propos le module _stream_ afin de nous laisser
construire nos propre streams. Chaque type de stream est fabriqué via un
constructeur dédié. Par exemple, si on veut créer un simple stream de
transformation, on s'y prendra de la façon suivante:

```
const { Transform } = require('stream')

const myTransform = new Transform({
  transform (chunk, encoding, callback) {
    var str

    str = chunk.toString()
    str = str.replace('.', '.\n')

    callback(null, str)
  }
})
```

Rentrons un peu dans le détail de cet exemple.

Premièrement, on récupère le constructeur `Transform` du module _stream_.

```
const { Transform } = require('stream')
```

Ensuite on instancie un nouveau stream `Transform` avec un objet de
configuration fournissant une fonction `transform` qui sera appelée sur
chaque morceau de données du stream.

```
const myTransform = new Transform({
  transform (chunk, encoding, callback) {
    /* ... */
  }
})
```

Cette fonction de transformation est au cœur des streams de
transformation et elle prends trois paramètres:

  1. `chunk` qui peut être un objet de type `Buffer`, un chaine, ou un objet ordinaire (par défaut il s'agit d'un `Buffer`)
  2. `encoding` qui représente l'encodage de `chunk` (Si `chunk` est une chaine, sinon il a la valeur générique `buffer`)
  3. `callback` qui est une fonction de rappel a appeler obligatoirement une foi que toutes les opération de transformation sont terminées.

Dans notre exemple :

```
// Cette fonction de transformation
transform (chunk, encoding, callback) {
  var str

  // convertie chaque morceau de données en une chaine de caractère
  str = chunk.toString()

  // puis ajoute un caractère de nouvelle ligne après chaque point
  str = str.replace('.', '.\n')

  // pour enfin renvoyer cette nouvelle chaine dans le stream
  callback(null, str)
}
```

Une fois que cela est fait, il ne s'agira plus que de brancher un stream
_readable_ dans notre stream de transformation et de le brancher lui-même
dans un stream _writable_.

Un enchainement de stream simple ressemble le plus souvent à ça:

READABLE ----> TRANSFORM ----> WRITABLE

Et parce que les stream de type `Transform` sont à la foi `Readable` et
`Writable` c'est très facile d'enchainer plusieurs transformations les unes
derrière les autres.

Ceci étant dit, c'est à vous !


------------------------------------------------------------------------------
## EXERCICE

Écrivez un programme qui lit un fichier, transforme son contenu en
majuscules et envoie le résultat vers la sortie standard, uniquement en
utilisant des streams.

Le chemin vers le fichier à lire vous sera fournis comme premier argument de la ligne de commande (i.e., `process.argv[2]`). Vous n'avez donc pas à créer ce fichier vous-même.

------------------------------------------------------------------------------
## ASTUCES

Pour compléter cet exercice, vous aurez besoin d'informations disponibles dans la documentation de Node.js (en anglais). En particulier:

- https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
- https://nodejs.org/api/stream.html#stream_implementing_a_transform_stream
- https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end
- https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_string_encoding
- https://nodejs.org/api/process.html#process_process_stdout

Et n'hésitez pas a vous rafraichir le mémoire à propos de JavaScript:

- https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
- https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase
