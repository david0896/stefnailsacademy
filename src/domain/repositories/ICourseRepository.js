/**
 * ICourseRepository — Contrato del repositorio de cursos
 * Define los métodos que cualquier implementación debe cumplir.
 * La capa de aplicación solo conoce esta interfaz, nunca Prisma directamente.
 */
export class ICourseRepository {
  async findAll() { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findActive() { throw new Error('Not implemented'); }
  async create(data) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async delete(id) { throw new Error('Not implemented'); }
  async countConfirmedEnrollments(courseId) { throw new Error('Not implemented'); }
}
