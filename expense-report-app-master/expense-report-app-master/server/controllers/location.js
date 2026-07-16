const Location = require('../models/locations')
const Merchant = require('../models/merchants')
const Category = require('../models/categories')
const Transaction = require('../models/transactions')

var createLocation = (location) => {
    let prom = new Promise((resolve, reject)=>{
        // Generate zipcode from city and state if not provided
        const zipcode = location.zipcode || `${location.city}-${location.state}`.replace(/\s+/g, '_')
        
        Location.findOne({
            where: {
                zipcode: zipcode
            }
        }).then(res=>{
            if(res && res.zipcode){
                resolve(res)
            }else{
                Location.create({
                    zipcode: zipcode,
                    city: location.city,
                    state: location.state,
                    street: location.street
                }).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    reject(err)
                })
            }
        }).catch(err=>{
            reject(err)
        })
    })
    return prom
}

module.exports = {
    createLocation
}