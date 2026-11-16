package com.expensetracker.controller;

import com.expensetracker.entity.Expense;
import com.expensetracker.service.ExpenseService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // Add a new expense
    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) {
        if (expense.getTitle() == null || expense.getTitle().isBlank()
                || expense.getAmount() == null || expense.getAmount() <= 0
                || expense.getCategory() == null || expense.getCategory().isBlank()
                || expense.getDate() == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(expenseService.addExpense(expense));
    }

    // Get all expenses or filter by category
    @GetMapping
    public List<Expense> getExpenses(
            @RequestParam(required = false) String category) {

        if (category != null && !category.isBlank()) {
            return expenseService.getExpensesByCategory(category);
        }

        return expenseService.getAllExpenses();
    }

    // Update an expense
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long id,
            @RequestBody Expense expense) {

        if (expense.getTitle() == null || expense.getTitle().isBlank()
                || expense.getAmount() == null || expense.getAmount() <= 0
                || expense.getCategory() == null || expense.getCategory().isBlank()
                || expense.getDate() == null) {
            return ResponseEntity.badRequest().build();
        }

        return expenseService.getExpenseById(id)
                .map(existingExpense -> {
                    expense.setId(id);
                    return ResponseEntity.ok(
                            expenseService.updateExpense(id, expense));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete an expense
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {

        if (expenseService.getExpenseById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
    
}
