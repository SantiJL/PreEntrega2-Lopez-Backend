import { Router } from 'express'
import { cartsModel } from '../DAOs/mongodb/models/carts.models.js'
import { productsModel } from '../DAOs/mongodb/models/products.models.js'

const router = Router()


router.get('/', async (req, res) => {
    try{
        const carts = await cartsModel.find()
        console.log("🚀 ~ router.get ~ carts:", carts)
        //res.json({ message: carts })
        res.render('carts')
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartsModel.findById(cid).populate('products').
        exec();
        res.json({ message: cart })
    } catch (error) {
        res.status(500).json({ status: 'error', error });
    }
})






//crear un carrito
router.post("/",async (req,res)=>{
    try {
        const cart = new cartsModel();
        cart.save();
        res.send(cart)
    } catch (error) {
        
    }
});


//agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const product = await productsModel.findById(pid);
        if(product){
            const result = await cartsModel.updateOne({ _id: cid }, { $push: { products: product._id } } )
            res.status(201).send(result)
        }else{
            res.send({data:[],message:"no existe tal producto"})
        }
        //res.json({ message: result })
    } catch (error) {
        res.status(500).json({ status: 'error', error});
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { qty } = req.body
        const result = await cartsModel.updateOne({ _id: cid, }, { $set: { 'products.$.quantity': qty }})
        res.json({ message: result })
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const result = await cartsModel.deleteOne({ _id: cid }, { $pull: { products: { product: pid }}})
        res.json({ message: result })
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal error' });
    }
})

export default router



