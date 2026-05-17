/**
 * IEnrollmentRepository — Contrato del repositorio de inscripciones
 * Define los métodos que cualquier implementación debe cumplir.
 */
export class IEnrollmentRepository {
  async findAll(filters) { throw new Error('Not implemented'); }
  async findById(id) { throw new Error('Not implemented'); }
  async findByCourse(courseId) { throw new Error('Not implemented'); }
  async findByStudent(studentId) { throw new Error('Not implemented'); }
  async create(data) { throw new Error('Not implemented'); }
  async updateStatus(id, status, extra) { throw new Error('Not implemented'); }
  async countByStatus(status) { throw new Error('Not implemented'); }
}
