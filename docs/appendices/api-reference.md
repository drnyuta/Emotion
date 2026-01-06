# API Reference

## Overview

Base URL: `http://localhost:5000` or `https://emotion-production.up.railway.app`

Authentication: `Bearer Token (JWT)`

## Authentication

Use the JWT token obtained from the login endpoint in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Endpoints

### Authentication

#### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2025-01-06T10:30:00Z"
  }
}
```

| Status Code | Description |
|-------------|-------------|
| 201 | User registered successfully |
| 400 | Validation error |

---

### AI

#### POST /ai/chat

Send a message to the AI emotional support assistant and receive an empathetic response.

**Request Body:**
```json
{
  "message": "I feel sad today."
}
```

**Response:**
```json
{
  "success": true,
  "result": "I understand that you're feeling sad. Can you tell me more?"
}
```

Alternative response (crisis detected):
```json
{
  "success": true,
  "result": {
    "crisis": true,
    "message": "It seems like you're in distress. Please contact support immediately."
  }
}
```

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Validation error |
| 401 | Unauthorized |

---

### Diary

#### POST /diary/entry

Create a new diary entry.

**Request Body:**
```json
{
  "entryDate": "2025-01-04",
  "content": "Today was a good day...",
  "questionId": 1,
  "emotions": ["happy", "grateful"]
}
```

**Response:**
```json
{
  "success": true,
  "entry": {
    "id": 123,
    "userId": 1,
    "entryDate": "2025-01-04",
    "content": "Today was a good day...",
    "questionId": 1,
    "emotions": ["happy", "grateful"],
    "createdAt": "2025-01-06T10:30:00Z"
  }
}
```

| Status Code | Description |
|-------------|-------------|
| 200 | Entry created |
| 400 | Validation error |
| 401 | Unauthorized |

---

### Emotions

#### GET /emotions/categories

Get all emotion categories with their associated emotions.

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Positive",
      "emotions": [
        {
          "id": 1,
          "name": "happy"
        },
        {
          "id": 2,
          "name": "grateful"
        }
      ]
    },
    {
      "id": 2,
      "name": "Negative",
      "emotions": [
        {
          "id": 3,
          "name": "sad"
        },
        {
          "id": 4,
          "name": "anxious"
        }
      ]
    }
  ]
}
```

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Error |

---

### Questions

#### GET /questions

Get all available journal prompts for diary entries.

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "text": "What made you smile today?"
    },
    {
      "id": 2,
      "text": "What challenged you today?"
    },
    {
      "id": 3,
      "text": "What are you grateful for?"
    }
  ]
}
```

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Error |

---

### Insights

#### GET /insights

Retrieve all user insights.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "insightText": "I noticed I'm happier when I spend time outdoors",
      "insightDate": "2025-01-04",
      "createdAt": "2025-01-06T10:30:00Z"
    }
  ]
}
```

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Error |
| 401 | Unauthorized |

---

### Analytics

#### GET /analytics/monthly

Get monthly emotion statistics for a specific month.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| year | integer | Yes | Year (e.g., 2025) |
| month | integer | Yes | Month number (1-12) |

**Example Request:**
```
GET /analytics/monthly?year=2025&month=1
Authorization: Bearer [token]
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "month": 1,
    "year": 2025,
    "totalEntries": 25,
    "dominantEmotion": "happy",
    "emotionBreakdown": {
      "happy": 10,
      "grateful": 8,
      "stressed": 5,
      "anxious": 2
    },
    "averageMood": 7.5
  }
}
```

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Validation error |
| 401 | Unauthorized |

---

### Streak

#### GET /streak/current

Get the user's current consecutive diary entry streak.

**Response:**
```json
{
  "success": true,
  "streak": {
    "currentStreak": 5,
    "startDate": "2025-01-02",
    "lastEntryDate": "2025-01-06"
  },
  "message": "Great job! Keep up the streak!"
}
```

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Error |
| 401 | Unauthorized |


## Error Responses

| Error Code | Message | Description |
|------------|---------|-------------|
| 400 | Bad Request | Invalid input parameters or missing required fields |
| 401 | Unauthorized | Invalid or missing authentication token |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

## Crisis Detection

All text processing endpoints include automatic crisis detection. If concerning language is detected, the response will include a `crisis: true` flag with an immediate support message. Users should be directed to contact support services immediately in these cases.

## Swagger/OpenAPI

Full API documentation available at: `localhost:5000/api-docs`
