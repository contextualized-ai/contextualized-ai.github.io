# C-AI

Sitio del grupo C-AI. Para actualizarlo, agregar o editar archivos Markdown en `src/content/`. 

Las secciones tienen páginas independientes: `/acerca-de/`, `/noticias/`, `/publicaciones/`, `/datasets/` y `/miembros/`.

## Editar contenido desde GitHub

1. Abrir la carpeta de la sección dentro de `src/content/`.
2. Editar un archivo para cambiar una entrada o crear otro `.md` para agregarla.
3. Completar todos los campos siguiendo el formato de otro archivo de esa carpeta.
4. Guardar los cambios en una rama y abre un pull request. Al integrar los cambios en `main`, GitHub Actions construye y publica el sitio.

Carpetas de contenido:

- `about/`: descripción del grupo. Editar `about.md`.
- `news/`: novedades. Completar `year`, `textEs` y `textEn`.
- `publications/`: publicaciones. Pegar la referencia completa en el campo `bibtex`. El sitio muestra título, autores, año, revista/congreso y crea el enlace al paper desde `eprint` + `archivePrefix`, `url` o `doi`.
- `datasets/`: copiar `dataset-template.md`, cambiar sus campos y poner `published: true` para mostrarlo.
- `members/`: miembros. Completar nombre, cargo y área de trabajo en ambos idiomas. `order` determina el orden de aparición. Usa `alumni: true` para mostrar una persona en Exmiembros. Si se omite, aparece en Miembros.
- `slides/`: fotos del carrusel; completa `order`, `image` y los textos alternativos en español e inglés. Las fotos avanzan automáticamente cada cinco segundos. La animación se desactiva si el navegador tiene activada la opción de movimiento reducido.

Para agregar una foto hay que subirla desde GitHub a `public/images/` y escribir su ruta (por ejemplo, `/images/congreso.jpg`) en el archivo de la diapositiva.

Ejemplo de entrada en `src/content/publications/mi-publicacion.md`:

```yaml
---
bibtex: |
  @article{mi-clave,
    title = {Título del artículo},
    author = {Apellido, Nombre and Apellido, Nombre},
    year = {2025},
    journal = {Nombre de la revista},
    archivePrefix = {arXiv},
    eprint = {2501.01234}
  }
---
```

Los campos BibTeX `title` y `year` son obligatorios. `author`, `journal`, `booktitle`, `publisher`, `archivePrefix`, `eprint`, `url` y `doi` son opcionales. Cuando hay `archivePrefix = {arXiv}` y `eprint`, se genera el enlace `https://arxiv.org/abs/...`. Los nombres de campos del frontmatter son sensibles a mayúsculas; el build comprueba las entradas y muestra un error si el BibTeX no se puede leer.

## Desarrollo local

```sh
npm install
npm run dev
npm run build
npm run preview
```
