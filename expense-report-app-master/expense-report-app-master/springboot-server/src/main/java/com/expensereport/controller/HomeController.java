package com.expensereport.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Expense Report Spring Boot API");
        response.put("port", 3001);
        response.put("dashboard", "http://localhost:3001/dashboard.html");
        response.put("endpoints", List.of(
                "GET  /api/getAll",
                "GET  /api/getTPC",
                "GET  /api/getMerchants",
                "GET  /api/getCategories",
                "GET  /api/getProducts",
                "POST /api/createAll",
                "POST /api/createMerchant",
                "POST /api/createCategory",
                "POST /api/createTransactions",
                "POST /api/createProduct",
                "POST /api/getTransactions",
                "DELETE /api/deleteExpense/{id}"
        ));
        return response;
    }
}
