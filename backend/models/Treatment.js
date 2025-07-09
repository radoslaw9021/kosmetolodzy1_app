class Treatment {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.clientId = data.clientId;
    this.name = data.name || '';
    this.description = data.description || '';
    this.date = data.date || new Date().toISOString();
    this.duration = data.duration || 0; // in minutes
    this.price = data.price || 0;
    this.notes = data.notes || '';
    this.beforePhotos = data.beforePhotos || [];
    this.afterPhotos = data.afterPhotos || [];
    this.consentSigned = data.consentSigned || false;
    this.consentSignatureId = data.consentSignatureId || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  generateId() {
    return 'treatment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  toJSON() {
    return {
      id: this.id,
      clientId: this.clientId,
      name: this.name,
      description: this.description,
      date: this.date,
      duration: this.duration,
      price: this.price,
      notes: this.notes,
      beforePhotos: this.beforePhotos,
      afterPhotos: this.afterPhotos,
      consentSigned: this.consentSigned,
      consentSignatureId: this.consentSignatureId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  update(data) {
    Object.assign(this, data);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  addPhoto(type, photoUrl) {
    if (type === 'before') {
      this.beforePhotos.push(photoUrl);
    } else if (type === 'after') {
      this.afterPhotos.push(photoUrl);
    }
    this.updatedAt = new Date().toISOString();
    return this;
  }
}

module.exports = Treatment; 