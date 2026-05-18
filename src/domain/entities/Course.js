/**
 * Course Entity — Dominio puro, sin dependencias externas
 * Representa un curso de la academia con sus reglas de negocio
 */
export class Course {
  constructor({ id, title, description, type, status, priceEUR, duration, maxSpots, date, imageUrl, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;         // PRESENCIAL | ONLINE
    this.status = status;     // DRAFT | ACTIVE | INACTIVE
    this.priceEUR = priceEUR;
    this.duration = duration;
    this.maxSpots = maxSpots ?? null;   // null si es ONLINE
    this.date = date ?? null;           // null si es ONLINE
    this.imageUrl = imageUrl ?? null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isPresencial() {
    return this.type === 'PRESENCIAL';
  }

  isOnline() {
    return this.type === 'ONLINE';
  }

  isActive() {
    return this.status === 'ACTIVE';
  }

  hasAvailableSpots(confirmedEnrollments) {
    if (this.isOnline()) return true;
    return confirmedEnrollments < this.maxSpots;
  }
}
