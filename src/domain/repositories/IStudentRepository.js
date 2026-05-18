/**
 * IStudentRepository — Contrato del repositorio de alumnos
 * Define los métodos que cualquier implementación debe cumplir.
 */
export class IStudentRepository {
  async findAll() { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async create(data) { throw new Error('Not implemented'); }
  async update(id, data) { throw new Error('Not implemented'); }
  async findWithEnrollments(id) { throw new Error('Not implemented'); }
}
