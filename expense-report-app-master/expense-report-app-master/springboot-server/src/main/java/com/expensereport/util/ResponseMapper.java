package com.expensereport.util;

import com.expensereport.model.Category;
import com.expensereport.model.Location;
import com.expensereport.model.Merchant;
import com.expensereport.model.Product;
import com.expensereport.model.Transaction;
import java.util.LinkedHashMap;
import java.util.Map;

public final class ResponseMapper {

    private ResponseMapper() {
    }

    public static Map<String, Object> toLocationMap(Location location) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("zipcode", location.getZipcode());
        map.put("city", location.getCity());
        map.put("state", location.getState());
        map.put("createdAt", location.getCreatedAt());
        map.put("updatedAt", location.getUpdatedAt());
        return map;
    }

    public static Map<String, Object> toMerchantMap(Merchant merchant, Location location) {
        if (merchant == null) {
            return null;
        }
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", merchant.getId());
        map.put("store_name", merchant.getStoreName());
        map.put("store_address", merchant.getStoreAddress());
        map.put("store_phone", merchant.getStorePhone());
        map.put("zipcode", merchant.getZipcode());
        map.put("createdAt", merchant.getCreatedAt());
        map.put("updatedAt", merchant.getUpdatedAt());
        map.put("merchantLocation", location != null ? toLocationMap(location) : null);
        return map;
    }

    public static Map<String, Object> toCategoryMap(Category category) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", category.getId());
        map.put("name", category.getName());
        map.put("createdAt", category.getCreatedAt());
        map.put("updatedAt", category.getUpdatedAt());
        return map;
    }

    public static Map<String, Object> toTransactionMap(
            Transaction transaction,
            Category category,
            Map<String, Object> merchantMap) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", transaction.getId());
        map.put("amount", transaction.getAmount());
        map.put("date", transaction.getDate());
        map.put("category_id", transaction.getCategoryId());
        map.put("merchant_id", transaction.getMerchantId());
        map.put("createdAt", transaction.getCreatedAt());
        map.put("updatedAt", transaction.getUpdatedAt());
        map.put("transactionCategory", category != null ? toCategoryMap(category) : null);
        map.put("transactionMerchant", merchantMap);
        return map;
    }

    public static Map<String, Object> toProductMap(Product product, Map<String, Object> transactionMap) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", product.getId());
        map.put("name", product.getName());
        map.put("transaction_id", product.getTransactionId());
        map.put("merchant_id", product.getMerchantId());
        map.put("createdAt", product.getCreatedAt());
        map.put("updatedAt", product.getUpdatedAt());
        map.put("productTransaction", transactionMap);
        return map;
    }
}
