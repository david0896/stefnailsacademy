/**
 * IContentRepository — Contrato del repositorio de contenido
 * Define los métodos que cualquier implementación debe cumplir.
 */
export class IContentRepository {
  async findAll() { throw new Error('Not implemented'); }
  async findByKey(key) { throw new Error('Not implemented'); }
  async upsert(key, data) { throw new Error('Not implemented'); }
}
