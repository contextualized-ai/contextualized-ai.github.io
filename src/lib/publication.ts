interface BibTeXEntry {
  citationKey: string;
  entryType: string;
  fields: Map<string, string>;
}

export interface Publication {
  citationKey: string;
  title: string;
  year: string;
  authors: string;
  venue: string;
  paperUrl?: string;
}

function splitEntries(bibtex: string): string[] {
  const entries: string[] = [];
  let index = 0;

  while (index < bibtex.length) {
    while (index < bibtex.length && /[\s,]/.test(bibtex[index])) index += 1;
    if (index >= bibtex.length) break;

    const opening = bibtex.slice(index).match(/^@\s*[a-z]+\s*([({])/i);
    if (!opening) {
      throw new Error(`Expected a BibTeX entry near "${bibtex.slice(index, index + 20)}".`);
    }

    const start = index;
    const openDelimiter = opening[1];
    const closeDelimiter = openDelimiter === '{' ? '}' : ')';
    index += opening[0].length;
    let depth = 1;
    let inQuotes = false;

    while (index < bibtex.length && depth > 0) {
      const character = bibtex[index];
      if (character === '\\') {
        index += 2;
        continue;
      }
      if (character === '"') inQuotes = !inQuotes;
      if (!inQuotes) {
        if (character === openDelimiter) depth += 1;
        if (character === closeDelimiter) depth -= 1;
      }
      index += 1;
    }

    if (depth !== 0) throw new Error('A BibTeX entry is missing its closing delimiter.');
    entries.push(bibtex.slice(start, index));
  }

  return entries;
}

function parseEntry(bibtex: string): BibTeXEntry {
  const opening = bibtex.match(/^\s*@\s*([a-z]+)\s*([({])/i);
  if (!opening) throw new Error('Expected a BibTeX entry starting with @type{...}.');

  const entryType = opening[1].toLowerCase();
  const closing = opening[2] === '{' ? '}' : ')';
  let index = opening[0].length;
  const entryEnd = bibtex.lastIndexOf(closing);
  if (entryEnd < index) throw new Error('The BibTeX entry is missing its closing brace or parenthesis.');

  const keyStart = index;
  while (index < entryEnd && bibtex[index] !== ',') index += 1;
  const citationKey = bibtex.slice(keyStart, index).trim();
  if (!citationKey) throw new Error('The BibTeX entry is missing its citation key.');
  if (bibtex[index] !== ',') throw new Error(`The BibTeX entry "${citationKey}" has no fields.`);
  index += 1;

  const fields = new Map<string, string>();
  while (index < entryEnd) {
    while (index < entryEnd && /[\s,]/.test(bibtex[index])) index += 1;
    if (index >= entryEnd) break;

    const fieldStart = index;
    while (index < entryEnd && /[a-z0-9_-]/i.test(bibtex[index])) index += 1;
    const fieldName = bibtex.slice(fieldStart, index).toLowerCase();
    if (!fieldName) throw new Error(`Unexpected content in BibTeX entry "${citationKey}" near "${bibtex.slice(index, index + 20)}".`);

    while (index < entryEnd && /\s/.test(bibtex[index])) index += 1;
    if (bibtex[index] !== '=') throw new Error(`Expected "=" after "${fieldName}" in BibTeX entry "${citationKey}".`);
    index += 1;

    const values: string[] = [];
    let hasValue = true;
    while (hasValue) {
      while (index < entryEnd && /\s/.test(bibtex[index])) index += 1;
      const delimiter = bibtex[index];

      if (delimiter === '{') {
        index += 1;
        const valueStart = index;
        let depth = 1;
        while (index < entryEnd && depth > 0) {
          if (bibtex[index] === '\\') {
            index += 2;
            continue;
          }
          if (bibtex[index] === '{') depth += 1;
          if (bibtex[index] === '}') depth -= 1;
          index += 1;
        }
        if (depth !== 0) throw new Error(`Unclosed braced value for "${fieldName}" in BibTeX entry "${citationKey}".`);
        values.push(bibtex.slice(valueStart, index - 1));
      } else if (delimiter === '"') {
        index += 1;
        const valueStart = index;
        while (index < entryEnd) {
          if (bibtex[index] === '\\') {
            index += 2;
            continue;
          }
          if (bibtex[index] === '"') break;
          index += 1;
        }
        if (bibtex[index] !== '"') throw new Error(`Unclosed quoted value for "${fieldName}" in BibTeX entry "${citationKey}".`);
        values.push(bibtex.slice(valueStart, index));
        index += 1;
      } else {
        const valueStart = index;
        while (index < entryEnd && !/[,\s#]/.test(bibtex[index])) index += 1;
        if (valueStart === index) throw new Error(`Missing value for "${fieldName}" in BibTeX entry "${citationKey}".`);
        values.push(bibtex.slice(valueStart, index));
      }

      while (index < entryEnd && /\s/.test(bibtex[index])) index += 1;
      if (bibtex[index] === '#') {
        index += 1;
      } else {
        hasValue = false;
      }
    }

    fields.set(fieldName, values.join(' ').trim());
    while (index < entryEnd && /\s/.test(bibtex[index])) index += 1;
    if (index < entryEnd && bibtex[index] !== ',') {
      throw new Error(`Expected a comma after "${fieldName}" in BibTeX entry "${citationKey}".`);
    }
    if (bibtex[index] === ',') index += 1;
  }

  return { citationKey, entryType, fields };
}

function cleanField(value: string | undefined): string {
  return (value ?? '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
}

export function parsePublication(bibtex: string): Publication {
  const entry = parseEntry(bibtex);
  const title = cleanField(entry.fields.get('title'));
  const year = cleanField(entry.fields.get('year'));
  if (!title) throw new Error(`BibTeX entry "${entry.citationKey}" is missing a title.`);
  if (!year) throw new Error(`BibTeX entry "${entry.citationKey}" is missing a year.`);

  const archivePrefix = cleanField(entry.fields.get('archiveprefix')).toLowerCase();
  const eprint = cleanField(entry.fields.get('eprint')).replace(/^arxiv:/i, '');
  const url = cleanField(entry.fields.get('url'));
  const doi = cleanField(entry.fields.get('doi'));
  const arxivUrl = url.match(/^https?:\/\/arxiv\.org\/(?:abs|pdf)\/\S+/i)?.[0]
    ?? (eprint && (archivePrefix === 'arxiv' || /^arxiv:/i.test(entry.fields.get('eprint') ?? ''))
      ? `https://arxiv.org/abs/${eprint}`
      : undefined);
  const paperUrl = arxivUrl ?? (url || (doi ? `https://doi.org/${doi}` : undefined));
  const venue = cleanField(entry.fields.get('journal') ?? entry.fields.get('booktitle') ?? entry.fields.get('publisher'));

  return {
    citationKey: entry.citationKey,
    title,
    year,
    authors: cleanField(entry.fields.get('author')).replace(/\s+and\s+/gi, ', '),
    venue,
    ...(paperUrl ? { paperUrl } : {}),
  };
}

export function parsePublications(bibtex: string): Publication[] {
  return splitEntries(bibtex).map(parsePublication);
}
