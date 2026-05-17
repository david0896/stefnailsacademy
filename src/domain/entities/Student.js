/**
 * Student Entity — Dominio puro, sin dependencias externas
 * Representa un alumno registrado en la academia
 */
export class Student {
  constructor({ id, firstName, lastName, email, phone, idNumber, city, state, country, experienceLevel, createdAt, updatedAt }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.idNumber = idNumber;       // Cédula
    this.city = city;
    this.state = state;
    this.country = country ?? 'Venezuela';
    this.experienceLevel = experienceLevel; // BEGINNER | INTERMEDIATE | ADVANCED
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
