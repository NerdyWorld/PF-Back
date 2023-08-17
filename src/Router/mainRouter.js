const { Router } = require('express');
const userRouter = require('./User/userRouter');
const productRouter = require('./Products/productRouter');
const reviewsRouter = require('./Reviews/reviewsRouter');
const orderRouter = require('./Orders/orderRouter');
const colorRouter = require('./Colors/colorsRouter');
const brandRouter = require('./Brands/brandsRouter');
const categoriesRouter = require('./Categories/categoriesRouter');


const router = Router();

router.use('/users', userRouter)
router.use('/products', productRouter)
router.use('/reviews', reviewsRouter)
router.use('/orders', orderRouter)
router.use('/colors', colorRouter)
router.use('/brands', brandRouter)
router.use('/categories', categoriesRouter)



module.exports = router;