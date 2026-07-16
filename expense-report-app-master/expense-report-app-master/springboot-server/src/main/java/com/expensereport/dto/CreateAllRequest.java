package com.expensereport.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateAllRequest {

    private LocationPayload location;
    private MerchantPayload merchant;
    private CategoryPayload category;
    private TransactionPayload transaction;
    private ProductPayload product;

    public LocationPayload getLocation() {
        return location;
    }

    public void setLocation(LocationPayload location) {
        this.location = location;
    }

    public MerchantPayload getMerchant() {
        return merchant;
    }

    public void setMerchant(MerchantPayload merchant) {
        this.merchant = merchant;
    }

    public CategoryPayload getCategory() {
        return category;
    }

    public void setCategory(CategoryPayload category) {
        this.category = category;
    }

    public TransactionPayload getTransaction() {
        return transaction;
    }

    public void setTransaction(TransactionPayload transaction) {
        this.transaction = transaction;
    }

    public ProductPayload getProduct() {
        return product;
    }

    public void setProduct(ProductPayload product) {
        this.product = product;
    }

    public static class LocationPayload {
        private String zipcode;
        private String city;
        private String state;

        public String getZipcode() {
            return zipcode;
        }

        public void setZipcode(String zipcode) {
            this.zipcode = zipcode;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }
    }

    public static class MerchantPayload {
        @JsonProperty("store_name")
        private String storeName;

        @JsonProperty("store_address")
        private String storeAddress;

        @JsonProperty("store_phone")
        private String storePhone;

        private String zipcode;
        private String city;
        private String state;

        public String getStoreName() {
            return storeName;
        }

        public void setStoreName(String storeName) {
            this.storeName = storeName;
        }

        public String getStoreAddress() {
            return storeAddress;
        }

        public void setStoreAddress(String storeAddress) {
            this.storeAddress = storeAddress;
        }

        public String getStorePhone() {
            return storePhone;
        }

        public void setStorePhone(String storePhone) {
            this.storePhone = storePhone;
        }

        public String getZipcode() {
            return zipcode;
        }

        public void setZipcode(String zipcode) {
            this.zipcode = zipcode;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }
    }

    public static class CategoryPayload {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static class TransactionPayload {
        private String amount;
        private String date;

        public String getAmount() {
            return amount;
        }

        public void setAmount(String amount) {
            this.amount = amount;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }
    }

    public static class ProductPayload {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
