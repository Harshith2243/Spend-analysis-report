const express = require('express')

const Location= require('../models/locations')
const Merchant = require('../models/merchants')
const Category = require('../models/categories')
const Transaction = require('../models/transactions')
const Product = require('../models/products')

const config = require('../models/config')
const sequelize = config.connection
const Sequelize = require('sequelize')
const { QueryTypes } = Sequelize
sequelize.sync().then(()=>{
    console.log('Synced DB')
}).catch(err=>{
    console.log(err)
});

const router = express.Router()

const LocationController = require('../controllers/location')
const MerchantController = require('../controllers/merchant')
const CategoryController = require('../controllers/category')
const TransactionController = require('../controllers/transaction')
const ProductController = require('../controllers/product')

router.post('/createAll', (req, res)=>{
    LocationController.createLocation(req.body.location).then(location_result=>{
        MerchantController.createMerchantAndLocation(req.body.merchant).then(merchant_result=>{
            CategoryController.createCategory(req.body.category).then(category_result=>{
                            let transaction_body = {
                    category_id: category_result.id,
                    merchant_id: merchant_result.id,
                    amount: req.body.transaction.amount,
                    date: req.body.transaction.date ? String(req.body.transaction.date) : ''
                }
                TransactionController.createTransaction(transaction_body).then(transaction_result=>{
                    let product_body = {
                        merchant_id: merchant_result.id,
                        transaction_id: transaction_result.id,
                        name: req.body.product.name,
                        no_of_units: req.body.product.no_of_units
                    }
                    ProductController.createProduct(product_body).then(product_result=>{
                        let retVal = {
                            location: location_result,
                            merchant: merchant_result,
                            category: category_result,
                            transaction: transaction_result,
                            product: product_result,
                        }
                        res.send(retVal)
                    }).catch(err=>{
                        res.send(err)
                    })
                }).catch(err=>{
                    res.send(err)
                })
            }).catch(err=>{
                res.send(err)
            })
        }).catch(err=>{
            res.send(err)
        })
    }).catch(err=>{
        res.send(err)
    })
})


// GET # Merchants per category
router.get('/getTPC', (req,res)=>{
    let dataS = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: []
            }
        ]
    }
    Transaction.findAll({
        attributes: [
            [
                Sequelize.fn('COUNT', Sequelize.col('transaction.id')), 
                'transaction_count'
            ],
            
        ],
        include: [
            {
                model: Category,
                as: 'transactionCategory',
                attributes: ['name'],
            }
        ],
        group: ['category_id', 'transactionCategory.id']
    }).then(transactions_found=>{
        let rows = transactions_found
        for(var i=0; i<rows.length; i++){
            dataS.labels[i] = rows[i].dataValues.transactionCategory.dataValues.name
            dataS.datasets[0].backgroundColor[i] = '#' + (function co(lor){   return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) && (lor.length == 6) ?  lor : co(lor); })('');
            dataS.datasets[0].data[i] = rows[i].dataValues.transaction_count;
        }
        res.send(dataS)
    }).catch(err=>{
        res.send(err)
    })
})

router.get('/getAll', (req,res)=>{
    const sortOrder = req.query.sortOrder || 'createdAt'
    const toggle = req.query.toggle === 'DESC' ? 'DESC' : 'ASC'

    const sortMap = {
        'merchant.store_name': 'm.store_name',
        'transaction.amount': 't.amount',
        'transaction.date': 't.date',
        'product.name': 'p.name',
        'category.name': 'c.name',
        'createdAt': 'p.createdAt'
    }

    const orderColumn = sortMap[sortOrder] || 'p.createdAt'
    const sql = `
        SELECT
            p.id,
            p.name,
            p.no_of_units,
            t.amount,
            t.date,
            c.name AS category_name,
            m.store_name,
            m.shopkeeper_name,
            m.store_phone,
            l.zipcode,
            l.city,
            l.state,
            l.street
        FROM products AS p
        LEFT JOIN transactions AS t ON t.id = p.transaction_id
        LEFT JOIN categories AS c ON c.id = t.category_id
        LEFT JOIN merchants AS m ON m.id = t.merchant_id
        LEFT JOIN locations AS l ON l.zipcode = m.zipcode
        ORDER BY ${orderColumn} ${toggle}
    `

    sequelize.query(sql, { type: QueryTypes.SELECT })
        .then(results => res.send(results))
        .catch(err => {
            console.error(err)
            res.status(500).send({ message: 'Could not load expense report.' })
        })
})

/*
    {
        store_name
        store_address
        store_phone
        zip
        city
        state
    }
*/
router.post('/createMerchant', (req,res)=>{
    MerchantController.createMerchantAndLocation(req.body).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send(err)
    })
})
router.get('/getMerchants', (req,res)=>{
    Merchant.findAll({
        include: [
            {model: Location, as:'merchantLocation'}
        ]
    }).then(results=>{
        res.send(results)
    }).catch(err=>{
        res.send(err)
    })
})

/*
    {
        name:
    }
*/
router.post('/createCategory', (req,res)=>{
    CategoryController.createCategory(req.body).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send(err)
    })
})
router.get('/getCategories', (req,res)=>{
    Category.findAll({
    }).then(results=>{
        res.send(results)
    }).catch(err=>{
        res.send(err)
    })
})

/*
    {
        amount
        date
        category_id
        merchant_id
    }
*/
router.post('/createTransactions', (req,res)=>{
    Transaction.create(req.body).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send(err)
    })
})
router.post('/getTransactions', (req,res)=>{
    Transaction.findAll({
        include: [
            {model: Category, as: 'transactionCategory'},
            {model: Merchant, as: 'transactionMerchant'}
        ]
    }).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send(err)
    })
})

/*
    name
    merchant_id
    transaction_id
*/
router.post('/createProduct', (req,res)=>{
    Product.create(req.body).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.send(err)
    })
})
router.get('/getProducts', (req,res)=>{
    Product.findAll({
        include: [
            {
                model: Transaction, 
                as: 'productTransaction', 
                include: [
                    {model: Category, as: 'transactionCategory'},
                    {model: Merchant, as: 'transactionMerchant'}
                ]
            },
            {
                model: Merchant,
                as: 'productMerchant',
                include: [
                    {model: Location, as:'merchantLocation'}
                ]
            }
        ]
    }).then(results=>{
        res.send(results)
    }).catch(err=>{
        res.send(err)
    })
})

router.delete('/deleteExpense/:id', (req,res)=>{
    ProductController.deleteProductWithRelations(req.params.id).then(result=>{
        res.send(result)
    }).catch(err=>{
        res.status(404).send(err)
    })
})

module.exports = router