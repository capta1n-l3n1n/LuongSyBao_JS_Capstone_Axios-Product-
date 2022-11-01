// https://633fd4c4d1fcddf69caa8103.mockapi.io/capstone
// import { Product } from "../method/Products.js";
// import { CartItem } from "../method/CartItem.js";

window.onload = () => {
  getItem();
  countItem();
  totalBuy();
  document.getElementById("iphone").addEventListener("change", sortItem);
  document.getElementById("samsung").addEventListener("change", sortItem);
  renderCart();
};
var productList = [];
var cartList = [];

//call Api
const getItem = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "https://633fd4c4d1fcddf69caa8103.mockapi.io/capstone",
    });
    productList = res.data;
    renderItem();
  } catch (err) {
    console.log(err);
  }
};
//renderItem
const renderItem = (data) => {
  if (!data) data = productList;
  let productHTML = "";
  getLocal();

  for (let i in data) {
    productHTML += `<div class="col">
      <div class="item">
        <img
          src='${data[i].img}'
        />
        <div>
          <h3>${data[i].name}</h3>
          <p>Camera sau: ${data[i].backCamera}</p>
          <p>Camera trước: ${data[i].frontCamera}</p>
          <p>Mô tả: ${data[i].desc}</p>
          <p>Giá: ${data[i].price}$</p>
        </div>
        <div>
          <button onclick="addToCart(event)" data-id="${data[i].id}">Add to cart</button> 
          <button onclick="addToCart(event)" data-id="${data[i].id}" ><a href="./checkout.html">Buy now</a></button>

        </div>
      </div>
    </div>`;
  }
  document.getElementById("row").innerHTML = productHTML;
};

//sort
const sortItem = () => {
  let itemFilter = [];
  if (
    !document.getElementById("iphone").checked &&
    !document.getElementById("samsung").checked
  )
    return renderItem();

  if (document.getElementById("iphone").checked) {
    for (let i in productList) {
      if (productList[i].type === "iphone") {
        itemFilter.push(productList[i]);
        renderItem(itemFilter);
      }
    }
  }
  if (document.getElementById("samsung").checked) {
    for (let i in productList) {
      if (productList[i].type === "samsung") {
        itemFilter.push(productList[i]);
        renderItem(itemFilter);
      }
    }
  }
};
//countItem
const countItem = () => {
  getLocal();
  let quantity = 0;
  for (let item of cartList) {
    quantity += item.quantity;
  }
  document.getElementById("countItem").innerHTML = quantity;
};
//cart
const addToCart = (e) => {
  const itemId = e.target.getAttribute("data-id");
  for (let item of cartList) {
    if (itemId === item.newProduct.id) {
      item.quantity += 1;

      setLocal();
      renderCart();
      totalBuy();
      countItem();
      return;
    }
  }
  for (let item of productList) {
    if (itemId === item.id) {
      const newCartItem = new CartItem(
        item.name,
        item.price,
        item.screen,
        item.backCamera,
        item.frontCamera,
        item.img,
        item.desc,
        item.type,
        item.id,
        1
      );
      cartList.push(newCartItem);
    }
  }
  setLocal();
  renderCart();
  totalBuy();
  countItem();
};

//change Item
const changeItem = (e) => {
  const itemId = e.target.getAttribute("data-id");
  let data = cartList;

  for (let i in data) {
    if (data[i].quantity === 1) {
      //xoa item khi ve 0 trong gio hang
      data.splice(i, 1);
      setLocal();
      totalBuy();
      renderCart();
      return;
    }
    if (itemId === data[i].newProduct.id) {
      data[i].quantity -= 1;
      document.getElementById(`count-${itemId}`).innerHTML = data[i].quantity;
      setLocal();
      totalBuy();
      renderCart();
      return;
    }
  }
};

//set local
const setLocal = () => {
  const cartListJSON = JSON.stringify(cartList);
  localStorage.setItem("phoneCart", cartListJSON);
};
//get local
const getLocal = () => {
  const cartListJSON = localStorage.getItem("phoneCart");
  if (!cartListJSON) return;
  cartList = JSON.parse(cartListJSON);
};
//renderCart
const renderCart = (data) => {
  getLocal();
  if (!data) data = cartList;

  let cartListHTML = "";
  for (let i in data) {
    cartListHTML += `<div class="col">
      <div class="item">
      <img
        src='${data[i].newProduct.img}'
      />
      <div>
        <p>Camera sau: ${data[i].newProduct.backCamera}</p>
        <p>Camera trước: ${data[i].newProduct.frontCamera}</p>
        <p>Mô tả: ${data[i].newProduct.desc}</p>
        <p>Giá: ${data[i].newProduct.price}$</p>
      </div>

        <div>
          <button onclick="addToCart(event)" data-id="${data[i].newProduct.id}">+</button>
          <span id="count-${data[i].newProduct.id}">${data[i].quantity}</span>
          <button onclick="changeItem(event)" data-id="${data[i].newProduct.id}">-</button>
          <button onclick="removeItem(event)" data-remove="${data[i].newProduct.id}">Xóa</button>
        </div>
    </div>
  </div>`;
  }

  document.getElementById("checkoutCart").innerHTML = cartListHTML;
};

//totalBuy
const totalBuy = () => {
  getLocal();
  let total = 0;
  for (let item of cartList) {
    total += item.quantity * +item.newProduct.price;
  }
  const totalBuyHTML = `
      <div>
        <p>Tổng tiền: ${total}$</p>
        <button
                onclick="checkout()"
                type="button"
                class="btn btn-primary bg-danger border border-0
                "
              >
                Thanh toán
              </button>
      </div>`;

  document.getElementById("buyNow").innerHTML = totalBuyHTML;
};
//5
//checkout
const checkout = () => {
  getLocal();
  let total = 0;

  for (let item of cartList) {
    total += item.quantity * +item.newProduct.price;
  }
  if (!confirm(`Xác nhận thanh toán ${total}$ ?`)) return;
  cartList.length = 0;

  setLocal();
  renderCart();
  totalBuy();
};

//removeItem
const removeItem = (e) => {
  getLocal();
  const itemId = e.target.getAttribute("data-remove");
  const data = cartList;
  for (let i in data) {
    if (data[i].newProduct.id === itemId) {
      data.splice(i, 1);
      setLocal();
      renderCart();
      countItem();
      totalBuy();
      return;
    }
  }
};