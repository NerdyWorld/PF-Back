const { Router } = require('express');
const userRouter = require('./User/userRouter');
const productRouter = require('./Products/productRouter');
const reviewsRouter = require('./Reviews/reviewsRouter');
const orderRouter = require('./Orders/orderRouter');
const colorRouter = require('./Colors/colorsRouter');
const brandRouter = require('./Brands/brandsRouter');
const categoriesRouter = require('./Categories/categoriesRouter');
const stripeRouter = require('./Stripe/stripeRouter');
const mercadoPagoRouter = require('./MercadoPago/mpRouter');


const router = Router();

router.use('/user', userRouter)
router.use('/products', productRouter)
router.use('/reviews', reviewsRouter)
router.use('/orders', orderRouter)
router.use('/colors', colorRouter)
router.use('/brands', brandRouter)
router.use('/categories', categoriesRouter)
router.use('/stripe', stripeRouter)
router.use('/mp', mercadoPagoRouter)



module.exports = router;