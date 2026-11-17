# Expense Tracker API Documentation

## Base URL

`http://localhost:8080`

## API Endpoints

### 1. Add an Expense

- **Method:** POST
- **Endpoint:** `/api/expenses`
- **Description:** Adds a new expense to the database.

**Request Body:**

```json
{
  "title": "Lunch",
  "amount": 150,
  "category": "Food",
  "date": "2026-11-17"
}
```

**Success Response:** `201 Created` (or the success status returned by the application).

### 2. Get All Expenses

- **Method:** GET
- **Endpoint:** `/api/expenses`
- **Description:** Retrieves all expenses.

**Success Response:** `200 OK`

### 3. Filter Expenses by Category

- **Method:** GET
- **Endpoint:** `/api/expenses?category=Food`
- **Description:** Retrieves expenses belonging to the selected category.

**Success Response:** `200 OK`

### 4. Update an Expense

- **Method:** PUT
- **Endpoint:** `/api/expenses/{id}`
- **Description:** Updates an existing expense using its ID.

**Request Body:**

```json
{
  "title": "Dinner",
  "amount": 200,
  "category": "Food",
  "date": "2026-11-17"
}
```

**Success Response:** `200 OK`

### 5. Delete an Expense

- **Method:** DELETE
- **Endpoint:** `/api/expenses/{id}`
- **Description:** Deletes an expense using its ID.

**Success Response:** `204 No Content` (or the success status returned by the application).

## HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 204 | Resource deleted |
| 400 | Invalid input |
| 404 | Expense not found |

## Technologies Used

- React
- Java
- Spring Boot
- Spring Data JPA
- MySQL