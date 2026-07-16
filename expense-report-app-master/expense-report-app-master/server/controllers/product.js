const Product = require('../models/products')
const Transaction = require('../models/transactions')
const Merchant = require('../models/merchants')
const Category = require('../models/categories')
const Location = require('../models/locations')

var createProduct = (product) =>{
    let prom = new Promise((resolve,reject)=>{
        Product.create(product).then(result=>{
            resolve(result)
        }).catch(err=>{
            reject(err)
        })
    })
    return prom
}

const cleanupCategory = (categoryId) => {
    return Transaction.count({ where: { category_id: categoryId } }).then(count => {
        if (count === 0) {
            return Category.destroy({ where: { id: categoryId } })
        }
    })
}

const cleanupMerchantAndLocation = (merchantId) => {
    return Promise.all([
        Product.count({ where: { merchant_id: merchantId } }),
        Transaction.count({ where: { merchant_id: merchantId } })
    ]).then(([productCount, transactionCount]) => {
        if (productCount === 0 && transactionCount === 0) {
            return Merchant.findByPk(merchantId).then(merchant => {
                if (!merchant) return
                const zipcode = merchant.zipcode
                return merchant.destroy().then(() => {
                    return Merchant.count({ where: { zipcode } }).then(merchantCount => {
                        if (merchantCount === 0) {
                            return Location.destroy({ where: { zipcode } })
                        }
                    })
                })
            })
        }
    })
}

var deleteProductWithRelations = (productId) => {
    return new Promise((resolve, reject) => {
        Product.findByPk(productId).then(product => {
            if (!product) {
                return reject({ message: 'Product not found' })
            }

            const transactionId = product.transaction_id
            const merchantId = product.merchant_id

            Transaction.findByPk(transactionId).then(transaction => {
                const categoryId = transaction ? transaction.category_id : null

                product.destroy().then(() => {
                    Product.count({ where: { transaction_id: transactionId } }).then(remainingProducts => {
                        const deleteTransaction = remainingProducts === 0 && transaction
                            ? transaction.destroy()
                            : Promise.resolve()

                        deleteTransaction.then(() => {
                            const cleanupCat = categoryId ? cleanupCategory(categoryId) : Promise.resolve()
                            cleanupCat.then(() => {
                                cleanupMerchantAndLocation(merchantId).then(() => {
                                    resolve({ success: true })
                                }).catch(reject)
                            }).catch(reject)
                        }).catch(reject)
                    }).catch(reject)
                }).catch(reject)
            }).catch(reject)
        }).catch(reject)
    })
}

module.exports = {
    createProduct,
    deleteProductWithRelations
}