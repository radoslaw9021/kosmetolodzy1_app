# API Documentation - Kosmetolodzy App Backend

## Base URL
```
http://localhost:4000/api
```

## Authentication
Currently, the API uses basic authentication. In production, implement JWT tokens or session-based authentication.

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Returns 429 status code when exceeded

## Endpoints

### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "message": "Backend działa!"
}
```

## Clients API

### Get All Clients
```
GET /clients?archived=false&search=anna
```
**Query Parameters:**
- `archived` (optional): Filter by archive status (true/false)
- `search` (optional): Search in name, email, or phone

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "client_1234567890_abc123",
      "personalData": {
        "firstName": "Anna",
        "lastName": "Kowalska",
        "email": "anna.kowalska@email.com",
        "phone": "+48 123 456 789",
        "dateOfBirth": "1985-03-15",
        "address": "ul. Kwiatowa 12",
        "city": "Warszawa",
        "postalCode": "00-001"
      },
      "consents": {
        "marketing": true,
        "medical": true,
        "photo": false,
        "dataProcessing": true,
        "consentDate": "2024-01-10T10:00:00.000Z",
        "consentVersion": "1.0"
      },
      "medicalData": {
        "allergies": ["Latex"],
        "medications": ["Witamina D"],
        "conditions": ["Skóra wrażliwa"],
        "notes": "Klientka z wrażliwą skórą"
      },
      "treatments": [],
      "signatures": [],
      "isArchived": false,
      "archivedAt": null,
      "createdAt": "2024-01-10T10:00:00.000Z",
      "updatedAt": "2024-01-10T10:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Get Client by ID
```
GET /clients/:id
```

### Create New Client
```
POST /clients
```
**Request Body:**
```json
{
  "firstName": "Jan",
  "lastName": "Nowak",
  "email": "jan.nowak@email.com",
  "phone": "+48 987 654 321",
  "dateOfBirth": "1990-07-22",
  "address": "ul. Dębowa 45",
  "city": "Kraków",
  "postalCode": "30-001",
  "marketingConsent": false,
  "medicalConsent": true,
  "photoConsent": true,
  "dataProcessingConsent": true,
  "allergies": [],
  "medications": [],
  "conditions": ["Trądzik"],
  "medicalNotes": "Leczenie trądziku młodzieńczego"
}
```

### Update Client
```
PUT /clients/:id
```

### Archive Client
```
POST /clients/:id/archive
```

### Unarchive Client
```
POST /clients/:id/unarchive
```

### Get Client Activity Logs
```
GET /clients/:id/activity
```

## Signatures API

### Create New Signature
```
POST /signatures
```
**Request Body:**
```json
{
  "clientId": "client_1234567890_abc123",
  "type": "consent",
  "signatureData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

### Get Client Signatures
```
GET /signatures/client/:clientId?type=consent
```
**Query Parameters:**
- `type` (optional): Filter by signature type (consent, treatment, medical)

### Get Signature by ID
```
GET /signatures/:id
```

### Validate Signature
```
GET /signatures/:id/validate
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sig_1234567890_abc123",
    "isValid": true,
    "isExpired": false,
    "signedAt": "2024-01-10T10:00:00.000Z",
    "expiresAt": null,
    "type": "consent",
    "clientId": "client_1234567890_abc123"
  }
}
```

### Invalidate Signature
```
POST /signatures/:id/invalidate
```

### Get Signature Statistics
```
GET /signatures/client/:clientId/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "total": 3,
    "valid": 2,
    "expired": 0,
    "invalid": 1,
    "byType": {
      "consent": 2,
      "treatment": 1,
      "medical": 0
    }
  }
}
```

## Export API

### Export Client to PDF
```
GET /export/client/:clientId/pdf?includeTreatments=true&includeSignatures=true
```
**Query Parameters:**
- `includeTreatments` (optional): Include treatment history (true/false)
- `includeSignatures` (optional): Include signatures (true/false)

**Response:** PDF file download

### Bulk Export
```
POST /export/bulk
```
**Request Body:**
```json
{
  "clientIds": ["client_1", "client_2", "client_3"],
  "format": "zip",
  "includeTreatments": true,
  "includeSignatures": true
}
```

### Export Consent Template
```
GET /export/consent/:type/template
```
**Path Parameters:**
- `type`: consent, medical, or photo

### Export Treatment History
```
GET /export/client/:clientId/treatments?dateFrom=2024-01-01&dateTo=2024-12-31
```

### Get Export Statistics
```
GET /export/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalExports": 25,
    "exportsThisMonth": 8,
    "mostExportedFormat": "pdf",
    "averageFileSize": 2048,
    "exportsByType": {
      "client": 15,
      "treatment": 7,
      "consent": 3
    }
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "details": ["Validation error 1", "Validation error 2"]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Data Models

### Client
```javascript
{
  id: String,
  personalData: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateOfBirth: String,
    address: String,
    city: String,
    postalCode: String
  },
  consents: {
    marketing: Boolean,
    medical: Boolean,
    photo: Boolean,
    dataProcessing: Boolean,
    consentDate: String,
    consentVersion: String
  },
  medicalData: {
    allergies: Array<String>,
    medications: Array<String>,
    conditions: Array<String>,
    notes: String
  },
  treatments: Array<Treatment>,
  signatures: Array<Signature>,
  isArchived: Boolean,
  archivedAt: String|null,
  createdAt: String,
  updatedAt: String
}
```

### Signature
```javascript
{
  id: String,
  clientId: String,
  type: String, // 'consent', 'treatment', 'medical'
  signatureData: String, // Base64 encoded
  ipAddress: String,
  userAgent: String,
  signedAt: String,
  expiresAt: String|null,
  isValid: Boolean,
  createdAt: String
}
```

### Activity Log
```javascript
{
  id: String,
  userId: String,
  action: String, // 'ACCESS', 'MODIFY', 'DELETE', 'EXPORT'
  resourceType: String,
  resourceId: String,
  details: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: String,
  success: Boolean,
  errorMessage: String|null
}
```

## RODO Compliance Features

1. **Data Minimization**: Only required fields are collected
2. **Consent Management**: Explicit consent tracking with versions
3. **Right to be Forgotten**: Soft delete (archiving) with audit trail
4. **Data Portability**: Export functionality for client data
5. **Audit Trail**: Complete activity logging
6. **Data Retention**: Configurable retention policies
7. **Access Control**: IP tracking and user agent logging
8. **Data Encryption**: Sensitive data should be encrypted in production

## Security Considerations

1. **Input Validation**: All inputs are validated and sanitized
2. **Rate Limiting**: Prevents abuse and DoS attacks
3. **CORS**: Configured for cross-origin requests
4. **Error Handling**: No sensitive information in error messages
5. **Logging**: All actions are logged for audit purposes

## Production Deployment

For production deployment, consider:

1. **Database**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Authentication**: Implement JWT or session-based auth
3. **HTTPS**: Use SSL/TLS certificates
4. **Environment Variables**: Store sensitive configuration
5. **Monitoring**: Add health checks and metrics
6. **Backup**: Implement automated backups
7. **PDF Generation**: Use proper PDF libraries (puppeteer, jsPDF)
8. **File Storage**: Use cloud storage for files
9. **Email Service**: Integrate with email providers
10. **Redis**: Use Redis for rate limiting and caching 