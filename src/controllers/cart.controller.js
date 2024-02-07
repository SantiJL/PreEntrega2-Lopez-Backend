import { Router } from 'express';
import { cartModel } from '../DAOs/mongodb/models/carts.models.js';
import { productsModel } from '../DAOs/mongodb/models/products.models.js';

const router = Router();

router.get('/api', async (req, res) => {
	try {
		const result = await cartModel.find();
		res.json({ message: result });
	} catch (error) {
		res.status(500).json({ status: 'error', error: 'Internal error' });
	}
});
router.get('/:cid', async (req, res) => {
	try {
		const { cid } = req.params;
		const cart = await cartModel.findById(cid).lean();
		console.log(cart);
		res.render('cart', {
			cart: cart._id.toString(),
			products: cart.products,
			style: 'cart.css',
		});
		//res.json({ message: cart });
	} catch (error) {
		res.status(500).json({ status: 'error', error: 'Internal error' });
	}
});

router.post('/', async (req, res) => {
	try {
		const response = await cartModel.create(req.body);
		res.json(response);
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: 'error', error: 'Internal error' });
	}
});

router.put('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;

	const isCartValid = await cartModel.findById(cid);
	const isProductValid = await productsModel.findById(pid);
	let hasChange = false;

	const newProduct = {
		product: pid,
		quantity: 1,
	};

	if (!isCartValid || !isProductValid) {
		return res.status(400).json({
			status: 'error',
			message: 'Cart or product not found',
		});
	}

	const productIndex = isCartValid.products.findIndex(
		(product) => product.product.equals(pid)
		// product.product.toString().includes(pid)
	);

	if (productIndex === -1) {
		isCartValid.products.push(newProduct);
		hasChange = true;
	} else {
		isCartValid.products[productIndex].quantity++;
		hasChange = true;
	}

	if (hasChange) {
		const result = await cartModel.findByIdAndUpdate(cid, {
			products: isCartValid.products,
		});
		res.json({
			status: 'ok',
			message: isCartValid,
		});
	}
});

router.delete('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;

	const isCartValid = await cartModel.findById(cid);
	const isProductValid = await productsModel.findById(pid);
	let hasChange = false;

	const newProduct = {
		product: pid,
		quantity: 1,
	};

	if (!isCartValid || !isProductValid) {
		return res.status(400).json({
			status: 'error',
			message: 'Cart or product not found',
		});
	}

	const productIndex = isCartValid.products.findIndex(
		(product) => product.product.equals(pid)
		// product.product.toString().includes(pid)
	);

	if (productIndex === -1) {
		res.status(400).json({
			status: 'error',
			message: 'Product not found',
		});
	} else {
		isCartValid.products[productIndex].quantity--;
		if (isCartValid.products[productIndex].quantity === 0) {
			isCartValid.products.splice(productIndex, 1);
		}
		hasChange = true;
	}

	if (hasChange) {
		const result = await cartModel.findByIdAndUpdate(cid, {
			products: isCartValid.products,
		});
		res.json({
			status: 'ok',
			message: isCartValid,
			result: result,
		});
	}
});

router.delete('/:cid', async (req, res) => {
	try {
		const { cid } = req.params;
		const result = await cartModel.deleteOne({ _id: cid });
		res.json({ message: result });
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: 'error', error: 'Internal error' });
	}
});
export default router;
