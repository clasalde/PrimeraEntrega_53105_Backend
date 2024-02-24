import fs from "fs";

class ProductManager {
    static ultId = 0;  
    constructor(path) {
      this.products = [];
      this.path = path;
    }
  
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
      try {
        const productsArray = await this.readJSONfile();
  
        if (!title || !description || !price || !code || !stock || !category) {
          console.log("All fields are mandatory");
          return;
        }
  
        if (productsArray.some(item => item.code === code)) {
          console.log("Code MUST be unique!");
          return;
        }
  
        const newProduct = {
          title,
          description,
          price,
          img,
          code,
          stock,
          category,
          status: true,
          thumbnails: thumbnails || []
        };
  
        if (productsArray.length > 0) {
          ProductManager.ultId = productsArray.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        }
  
        newProduct.id = ++ProductManager.ultId;   
        productsArray.push(newProduct);
        await this.saveProductFile(productsArray);

      } catch (error) {
        console.log("Error while adding new product", error);
        throw error; 
      }
    }
    
    async getProducts() {
      try {
        const productsArray = await this.readJSONfile();
        return productsArray;
      } catch (error) {
        console.log("Error while reading file", error);
        throw error;
      }
    }
  
    async getProductById(id) {
      try {
        const productsArray = await this.readJSONfile();
        const searchProduct = productsArray.find(item => item.id === id);
  
        if (!searchProduct) {
          console.log("Product NOT FOUND");
          return null;
        } else {
          console.log("Product FOUND");
          return searchProduct;
        }
      } catch (error) {
        console.log("Error while reading file", error);
        throw error;
      }
    }
  
    async readJSONfile() {
      try {
        const answer = await fs.promises.readFile(this.path, "utf-8");
        const productsArray = JSON.parse(answer);
        return productsArray;
      } catch (error) {
        console.log("Error while reading file", error);
        throw error;
      }
    }
  
    async saveProductFile(productsArray) {
      try {
        await fs.promises.writeFile(this.path, JSON.stringify(productsArray, null, 2));
      } catch (error) {
        console.log("Error while saving file", error);
        throw error;
      }
    }
  
    async updateProduct(id, updatedProduct) {
      try {
        const productsArray = await this.readJSONfile();
  
        const index = productsArray.findIndex(item => item.id === id);
  
        if (index !== -1) {
          productsArray[index] = { ...productsArray[index], ...updatedProduct };
          await this.saveProductFile(productsArray);
          console.log("Product Updated");
        } else {
          console.log("Product NOT FOUND");
        }
      } catch (error) {
        console.log("Error while updating product", error);
        throw error;
      }
    }
  
    async deleteProduct(id) {
      try {
        const productsArray = await this.readJSONfile();
  
        const index = productsArray.findIndex(item => item.id === id);
  
        if (index !== -1) {
          productsArray.splice(index, 1);
          await this.saveProductFile(productsArray);
          console.log("Product deleted!");
        } else {
          console.log("Product NOT FOUND");
        }
      } catch (error) {
        console.log("Error while deleting product", error);
        throw error;
      }
    }
  }

export default ProductManager;