package com.expensereport.controller;

import com.expensereport.dto.CreateAllRequest;
import com.expensereport.model.Category;
import com.expensereport.model.Merchant;
import com.expensereport.model.Product;
import com.expensereport.model.Transaction;
import com.expensereport.repository.CategoryRepository;
import com.expensereport.repository.MerchantRepository;
import com.expensereport.repository.ProductRepository;
import com.expensereport.repository.TransactionRepository;
import com.expensereport.service.ExpenseService;
import com.expensereport.util.ResponseMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ExpenseService expenseService;
    private final MerchantRepository merchantRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;

    public ApiController(
            ExpenseService expenseService,
            MerchantRepository merchantRepository,
            CategoryRepository categoryRepository,
            TransactionRepository transactionRepository,
            ProductRepository productRepository) {
        this.expenseService = expenseService;
        this.merchantRepository = merchantRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.productRepository = productRepository;
    }

    @PostMapping("/createAll")
    public Map<String, Object> createAll(@RequestBody CreateAllRequest request) {
        return expenseService.createAll(request);
    }

    @GetMapping("/getTPC")
    public Map<String, Object> getTransactionsPerCategory() {
        return expenseService.getTransactionsPerCategory();
    }

    @GetMapping("/getAll")
    public List<Map<String, Object>> getAll(
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) String toggle) {
        return expenseService.getAll(sortOrder, toggle);
    }

    @PostMapping("/createMerchant")
    public Map<String, Object> createMerchant(@RequestBody CreateAllRequest.MerchantPayload merchant) {
        Merchant saved = expenseService.createMerchantForApi(merchant);
        return ResponseMapper.toMerchantMap(saved, null);
    }

    @GetMapping("/getMerchants")
    public List<Map<String, Object>> getMerchants() {
        return expenseService.getMerchants();
    }

    @PostMapping("/createCategory")
    public Map<String, Object> createCategory(@RequestBody CreateAllRequest.CategoryPayload category) {
        Category saved = expenseService.createCategoryForApi(category);
        return ResponseMapper.toCategoryMap(saved);
    }

    @GetMapping("/getCategories")
    public List<Map<String, Object>> getCategories() {
        return expenseService.getCategories();
    }

    @PostMapping("/createTransactions")
    public Map<String, Object> createTransaction(@RequestBody Map<String, String> body) {
        Transaction transaction = new Transaction();
        transaction.setId(UUID.randomUUID().toString());
        transaction.setAmount(new BigDecimal(body.get("amount")));
        transaction.setDate(body.get("date"));
        transaction.setCategoryId(body.get("category_id"));
        transaction.setMerchantId(body.get("merchant_id"));
        LocalDateTime now = LocalDateTime.now();
        transaction.setCreatedAt(now);
        transaction.setUpdatedAt(now);
        Transaction saved = transactionRepository.save(transaction);
        return ResponseMapper.toTransactionMap(saved, null, null);
    }

    @PostMapping("/getTransactions")
    public List<Map<String, Object>> getTransactions() {
        return transactionRepository.findAll().stream()
                .map(transaction -> ResponseMapper.toTransactionMap(transaction, null, null))
                .toList();
    }

    @PostMapping("/createProduct")
    public Map<String, Object> createProduct(@RequestBody Map<String, String> body) {
        Product product = new Product();
        product.setId(UUID.randomUUID().toString());
        product.setName(body.get("name"));
        product.setTransactionId(body.get("transaction_id"));
        product.setMerchantId(body.get("merchant_id"));
        LocalDateTime now = LocalDateTime.now();
        product.setCreatedAt(now);
        product.setUpdatedAt(now);
        Product saved = productRepository.save(product);
        return ResponseMapper.toProductMap(saved, null);
    }

    @GetMapping("/getProducts")
    public List<Map<String, Object>> getProducts() {
        return expenseService.getProducts();
    }

    @DeleteMapping("/deleteExpense/{id}")
    public Map<String, Object> deleteExpense(@PathVariable String id) {
        return expenseService.deleteExpense(id);
    }
}
