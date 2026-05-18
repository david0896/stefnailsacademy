/**
 * Content Entity — Dominio puro, sin dependencias externas
 * Representa un bloque de contenido editable del sitio público
 */
export class Content {
  constructor({ id, key, value, type, updatedAt }) {
    this.id = id;
    this.key = key;     // Identificador único del bloque (ej: 'hero.title')
    this.value = value; // Texto, URL de imagen, o JSON serializado
    this.type = type;   // TEXT | IMAGE | JSON
    this.updatedAt = updatedAt;
  }

  isJson() {
    return this.type === 'JSON';
  }

  parsedValue() {
    if (this.isJson()) {
      return JSON.parse(this.value);
    }
    return this.value;
  }
}
