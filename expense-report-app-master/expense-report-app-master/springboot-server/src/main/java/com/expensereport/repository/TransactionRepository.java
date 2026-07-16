package com.expensereport.repository;

import com.expensereport.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, String> {

    long countByCategoryId(String categoryId);

    long countByMerchantId(String merchantId);
}
