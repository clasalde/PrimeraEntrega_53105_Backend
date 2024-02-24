import fs from "fs";

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.promises.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error while loading carts from file", error);
            await this.saveCarts();
        }
    }

    async saveCarts() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createNewCart() {
        const newCart = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(cart => cart.id === cartId);

            if (!cart) {
                throw new Error(`Cart ID: ${cartId} NOT FOUND`);
            }
            return cart;

        } catch (error) {
            console.error("Error while getting cart by ID", error);
            throw error;
        }
    }

    async addNewProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const productFound = cart.products.find(product => product.product === productId);

        if (productFound) {
            productFound.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }
}

export default CartManager;