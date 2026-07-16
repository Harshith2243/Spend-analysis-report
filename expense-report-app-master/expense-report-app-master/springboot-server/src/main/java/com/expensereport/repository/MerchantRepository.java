package com.expensereport.repository;

import com.expensereport.model.Merchant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MerchantRepository extends JpaRepository<Merchant, String> {

    Optional<Merchant> findByStoreNameAndZipcode(String storeName, String zipcode);

    long countByZipcode(String zipcode);
}
