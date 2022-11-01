// import { Product } from "./Products.js";
class CartItem {
  constructor(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type,
    id,
    quantity
  ) {
    this.quantity = quantity;
    this.newProduct = {
      name: name,
      price: price,
      screen: screen,
      backCamera: backCamera,
      frontCamera: frontCamera,
      img: img,
      desc: desc,
      type: type,
      id: id,
    };
  }
}
