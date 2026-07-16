package com.expensereport.service;

import com.expensereport.dto.CreateAllRequest;
import com.expensereport.model.Category;
import com.expensereport.model.Location;
import com.expensereport.model.Merchant;
import com.expensereport.model.Product;
import com.expensereport.model.Transaction;
import com.expensereport.repository.CategoryRepository;
import com.expensereport.repository.LocationRepository;
import com.expensereport.repository.MerchantRepository;
import com.expensereport.repository.ProductRepository;
import com.expensereport.repository.TransactionRepository;
import com.expensereport.util.DateParser;
import com.expensereport.util.ResponseMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ExpenseService {

    private final LocationRepository locationRepository;
    private final MerchantRepository merchantRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final Random random = new Random();

    public ExpenseService(
            LocationRepository locationRepository,
            MerchantRepository merchantRepository,
            CategoryRepository categoryRepository,
            TransactionRepository transactionRepository,
            ProductRepository productRepository) {
        this.locationRepository = locationRepository;
        this.merchantRepository = merchantRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.productRepository = productRepository;
    }

    public Merchant createMerchantForApi(CreateAllRequest.MerchantPayload payload) {
        return createMerchantAndLocation(payload);
    }

    public Category createCategoryForApi(CreateAllRequest.CategoryPayload payload) {
        return createCategory(payload);
    }

    @Transactional
    public Map<String, Object> createAll(CreateAllRequest request) {
        validateCreateAllRequest(request);

        Location location = createLocation(request.getLocation());
        Merchant merchant = createMerchantAndLocation(request.getMerchant());
        Category category = createCategory(request.getCategory());
        Transaction transaction = createTransaction(request.getTransaction(), category.getId(), merchant.getId());
        Product product = createProduct(request.getProduct(), transaction.getId(), merchant.getId());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("location", ResponseMapper.toLocationMap(location));
        response.put("merchant", ResponseMapper.toMerchantMap(merchant, null));
        response.put("category", ResponseMapper.toCategoryMap(category));
        response.put("transaction", ResponseMapper.toTransactionMap(transaction, null, null));
        response.put("product", ResponseMapper.toProductMap(product, null));
        return response;
    }

    public List<Map<String, Object>> getAll(String sortOrder, String toggle) {
        List<Product> products = productRepository.findAll();
        Comparator<Product> comparator = buildComparator(sortOrder, toggle);
        if (comparator != null) {
            products.sort(comparator);
        }
        return products.stream().map(this::toExpenseRow).toList();
    }

    public Map<String, Object> getTransactionsPerCategory() {
        List<Transaction> transactions = transactionRepository.findAll();
        Map<String, Long> counts = new LinkedHashMap<>();

        for (Transaction transaction : transactions) {
            Category category = categoryRepository.findById(transaction.getCategoryId()).orElse(null);
            String label = category != null ? category.getName() : "Unknown";
            counts.merge(label, 1L, Long::sum);
        }

        List<String> labels = new ArrayList<>();
        List<Number> data = new ArrayList<>();
        List<String> colors = new ArrayList<>();

        for (Map.Entry<String, Long> entry : counts.entrySet()) {
            labels.add(entry.getKey());
            data.add(entry.getValue());
            colors.add(randomColor());
        }

        Map<String, Object> dataset = new LinkedHashMap<>();
        dataset.put("data", data);
        dataset.put("backgroundColor", colors);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("labels", labels);
        response.put("datasets", List.of(dataset));
        return response;
    }

    public List<Map<String, Object>> getMerchants() {
        return merchantRepository.findAll().stream()
                .map(merchant -> {
                    Location location = locationRepository.findById(merchant.getZipcode()).orElse(null);
                    return ResponseMapper.toMerchantMap(merchant, location);
                })
                .toList();
    }

    public List<Map<String, Object>> getCategories() {
        return categoryRepository.findAll().stream()
                .map(ResponseMapper::toCategoryMap)
                .toList();
    }

    public List<Map<String, Object>> getProducts() {
        return productRepository.findAll().stream()
                .map(product -> {
                    Transaction transaction = transactionRepository.findById(product.getTransactionId()).orElse(null);
                    Merchant merchant = merchantRepository.findById(product.getMerchantId()).orElse(null);
                    Location location = merchant != null
                            ? locationRepository.findById(merchant.getZipcode()).orElse(null)
                            : null;
                    Category category = transaction != null
                            ? categoryRepository.findById(transaction.getCategoryId()).orElse(null)
                            : null;
                    Merchant transactionMerchant = transaction != null
                            ? merchantRepository.findById(transaction.getMerchantId()).orElse(null)
                            : null;
                    Location transactionLocation = transactionMerchant != null
                            ? locationRepository.findById(transactionMerchant.getZipcode()).orElse(null)
                            : null;

                    Map<String, Object> row = ResponseMapper.toProductMap(product, buildTransactionMap(transaction, category, transactionMerchant, transactionLocation));
                    row.put("productMerchant", ResponseMapper.toMerchantMap(merchant, location));
                    return row;
                })
                .toList();
    }

    @Transactional
    public Map<String, Object> deleteExpense(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        String transactionId = product.getTransactionId();
        String merchantId = product.getMerchantId();
        Transaction transaction = transactionRepository.findById(transactionId).orElse(null);
        String categoryId = transaction != null ? transaction.getCategoryId() : null;

        productRepository.delete(product);

        if (productRepository.countByTransactionId(transactionId) == 0 && transaction != null) {
            transactionRepository.delete(transaction);
        }

        if (categoryId != null && transactionRepository.countByCategoryId(categoryId) == 0) {
            categoryRepository.deleteById(categoryId);
        }

        if (productRepository.countByMerchantId(merchantId) == 0
                && transactionRepository.countByMerchantId(merchantId) == 0) {
            merchantRepository.findById(merchantId).ifPresent(merchant -> {
                String zipcode = merchant.getZipcode();
                merchantRepository.delete(merchant);
                if (merchantRepository.countByZipcode(zipcode) == 0) {
                    locationRepository.deleteById(zipcode);
                }
            });
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return response;
    }

    private Location createLocation(CreateAllRequest.LocationPayload payload) {
        return locationRepository.findById(payload.getZipcode())
                .orElseGet(() -> {
                    Location location = new Location();
                    location.setZipcode(payload.getZipcode());
                    location.setCity(payload.getCity());
                    location.setState(payload.getState());
                    stamp(location);
                    return locationRepository.save(location);
                });
    }

    private Merchant createMerchantAndLocation(CreateAllRequest.MerchantPayload payload) {
        Location location = locationRepository.findById(payload.getZipcode())
                .orElseGet(() -> {
                    Location created = new Location();
                    created.setZipcode(payload.getZipcode());
                    created.setCity(payload.getCity());
                    created.setState(payload.getState());
                    stamp(created);
                    return locationRepository.save(created);
                });

        Optional<Merchant> existing = merchantRepository.findByStoreNameAndZipcode(payload.getStoreName(), location.getZipcode());
        if (existing.isPresent()) {
            return existing.get();
        }

        Merchant merchant = new Merchant();
        merchant.setId(UUID.randomUUID().toString());
        merchant.setStoreName(payload.getStoreName());
        merchant.setStoreAddress(payload.getStoreAddress());
        merchant.setStorePhone(payload.getStorePhone());
        merchant.setZipcode(location.getZipcode());
        stamp(merchant);
        return merchantRepository.save(merchant);
    }

    private Category createCategory(CreateAllRequest.CategoryPayload payload) {
        return categoryRepository.findByName(payload.getName())
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setId(UUID.randomUUID().toString());
                    category.setName(payload.getName());
                    stamp(category);
                    return categoryRepository.save(category);
                });
    }

    private Transaction createTransaction(CreateAllRequest.TransactionPayload payload, String categoryId, String merchantId) {
        if (payload.getAmount() == null || payload.getAmount().trim().isEmpty()) {
            throw new IllegalArgumentException("Amount is required.");
        }

        Transaction transaction = new Transaction();
        transaction.setId(UUID.randomUUID().toString());
        transaction.setAmount(new BigDecimal(payload.getAmount().trim()));
        transaction.setDate(DateParser.parseRequired(payload.getDate(), "Date").toString());
        transaction.setCategoryId(categoryId);
        transaction.setMerchantId(merchantId);
        stamp(transaction);
        return transactionRepository.save(transaction);
    }

    private Product createProduct(CreateAllRequest.ProductPayload payload, String transactionId, String merchantId) {
        Product product = new Product();
        product.setId(UUID.randomUUID().toString());
        product.setName(payload.getName());
        product.setTransactionId(transactionId);
        product.setMerchantId(merchantId);
        stamp(product);
        return productRepository.save(product);
    }

    private Map<String, Object> toExpenseRow(Product product) {
        Transaction transaction = transactionRepository.findById(product.getTransactionId()).orElse(null);
        Category category = transaction != null
                ? categoryRepository.findById(transaction.getCategoryId()).orElse(null)
                : null;
        Merchant merchant = transaction != null
                ? merchantRepository.findById(transaction.getMerchantId()).orElse(null)
                : null;
        Location location = merchant != null
                ? locationRepository.findById(merchant.getZipcode()).orElse(null)
                : null;

        return ResponseMapper.toProductMap(product, buildTransactionMap(transaction, category, merchant, location));
    }

    private Map<String, Object> buildTransactionMap(
            Transaction transaction,
            Category category,
            Merchant merchant,
            Location location) {
        if (transaction == null) {
            return null;
        }
        return ResponseMapper.toTransactionMap(transaction, category, ResponseMapper.toMerchantMap(merchant, location));
    }

    private Comparator<Product> buildComparator(String sortOrder, String toggle) {
        if (sortOrder == null || sortOrder.isBlank()) {
            return null;
        }

        boolean ascending = !"DESC".equalsIgnoreCase(toggle);
        Comparator<Product> comparator = switch (sortOrder) {
            case "merchant.store_name" -> Comparator.comparing(product -> merchantName(product), String.CASE_INSENSITIVE_ORDER);
            case "transaction.amount" -> Comparator.comparing(product -> transactionAmount(product));
            case "transaction.date" -> Comparator.comparing(product -> transactionDate(product));
            case "product.name" -> Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER);
            case "category.name" -> Comparator.comparing(product -> categoryName(product), String.CASE_INSENSITIVE_ORDER);
            default -> null;
        };

        if (comparator == null) {
            return null;
        }
        return ascending ? comparator : comparator.reversed();
    }

    private String merchantName(Product product) {
        return transactionRepository.findById(product.getTransactionId())
                .flatMap(transaction -> merchantRepository.findById(transaction.getMerchantId()))
                .map(Merchant::getStoreName)
                .orElse("");
    }

    private BigDecimal transactionAmount(Product product) {
        return transactionRepository.findById(product.getTransactionId())
                .map(Transaction::getAmount)
                .orElse(BigDecimal.ZERO);
    }

    private LocalDate transactionDate(Product product) {
        return transactionRepository.findById(product.getTransactionId())
                .map(Transaction::getDate)
                .map(LocalDate::parse)
                .orElse(LocalDate.MIN);
    }

    private String categoryName(Product product) {
        return transactionRepository.findById(product.getTransactionId())
                .flatMap(transaction -> categoryRepository.findById(transaction.getCategoryId()))
                .map(Category::getName)
                .orElse("");
    }

    private String randomColor() {
        StringBuilder color = new StringBuilder("#");
        String chars = "0123456789abcdef";
        for (int i = 0; i < 6; i++) {
            color.append(chars.charAt(random.nextInt(chars.length())));
        }
        return color.toString();
    }

    private void stamp(Location location) {
        LocalDateTime now = LocalDateTime.now();
        location.setCreatedAt(now);
        location.setUpdatedAt(now);
    }

    private void stamp(Merchant merchant) {
        LocalDateTime now = LocalDateTime.now();
        merchant.setCreatedAt(now);
        merchant.setUpdatedAt(now);
    }

    private void stamp(Category category) {
        LocalDateTime now = LocalDateTime.now();
        category.setCreatedAt(now);
        category.setUpdatedAt(now);
    }

    private void stamp(Transaction transaction) {
        LocalDateTime now = LocalDateTime.now();
        transaction.setCreatedAt(now);
        transaction.setUpdatedAt(now);
    }

    private void stamp(Product product) {
        LocalDateTime now = LocalDateTime.now();
        product.setCreatedAt(now);
        product.setUpdatedAt(now);
    }

    private void validateCreateAllRequest(CreateAllRequest request) {
        if (request == null || request.getMerchant() == null || request.getLocation() == null
                || request.getCategory() == null || request.getTransaction() == null || request.getProduct() == null) {
            throw new IllegalArgumentException("All form sections are required.");
        }

        requireText(request.getMerchant().getStoreName(), "Store name");
        requireText(request.getMerchant().getZipcode(), "Zip code");
        requireText(request.getCategory().getName(), "Product");
        requireText(request.getProduct().getName(), "Transaction type");
    }

    private void requireText(String value, String label) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(label + " is required.");
        }
    }
}
