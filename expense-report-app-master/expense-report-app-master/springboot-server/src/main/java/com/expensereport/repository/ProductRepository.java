package com.expensereport.repository;

import com.expensereport.model.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, String> {

    long countByTransactionId(String transactionId);

    long countByMerchantId(String merchantId);

    List<Product> findAllByOrderByNameAsc();

    List<Product> findAllByOrderByNameDesc();
}
