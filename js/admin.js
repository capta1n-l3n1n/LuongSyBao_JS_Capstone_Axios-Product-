window.onload = () => {
  fetchApi();
  document.getElementById("btnAddItem").addEventListener("click", createItem);
  document
    .getElementById("btnSaveUpdate")
    .addEventListener("click", updateItem);
};
var itemList = [];
//call API
const fetchApi = async () => {
  try {
    const res = await axios({
      url: "https://633fd4c4d1fcddf69caa8103.mockapi.io/capstone",
      method: "GET",
    });
    itemList = res.data;
    renderItem();
  } catch (error) {
    console.log(error);
  }
};
//validate Item
const validateItem = () => {
  //lấy input
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const img = document.getElementById("itemImg").value;
  const type = document.getElementById("itemType").value;
  let isValid = true;

  isValid &= required(name, "spanName");
  isValid &= required(price, "spanPrice");
  isValid &= required(img, "spanImg") && urlCheck(img, "spanImg");
  isValid &= required(type, "spanType");

  return isValid;
};

//set Item
// const setApi = async () => {
//   try {
//     const res = await axios({
//       url: "https://633fd4c4d1fcddf69caa8103.mockapi.io/capstone",
//       method: "POST",
//       data: itemList,
//     });
//   } catch (error) {}
// };

//create item
const createItem = async () => {
  //check valid
  if (!validateItem()) return;

  //lấy input
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const screen = document.getElementById("itemScreen").value;
  const backCamera = document.getElementById("itemBackCamera").value;
  const frontCamera = document.getElementById("itemFrontCamera").value;
  const img = document.getElementById("itemImg").value;
  const type = document.getElementById("itemType").value;
  const desc = document.getElementById("itemDesc").value;

  //tạo obj mới
  const newProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  console.log(newProduct);
  try {
    await axios({
      url: "https://633fd4c4d1fcddf69caa8103.mockapi.io/capstone",
      method: "POST",
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
  }

  fetchApi();
};

//render Item
const renderItem = (input) => {
  if (!input) input = itemList;

  let itemListHTML = "";
  const data = input;
  for (let i in data) {
    itemListHTML += `<tr>
    <td>${data[i].id}</td>
    <td>${data[i].name}</td>
    <td>${data[i].price}</td>
    <td>${data[i].screen}</td>
    <td>${data[i].backCamera}</td>
    <td>${data[i].frontCamera}</td>
    <td><img src="${data[i].img}" alt=""/></td>
    <td>${data[i].desc}</td>
    <td>
      <button class="btn btn-primary"
      data-toggle="modal"
      data-target="#myModal" onclick="showUpdateItem(${data[i].id})" data-id="${data[i].id}">Cập nhật</button>
      <button class="btn btn-danger" onclick="deleteItem(event)" data-id="${data[i].id}">Xóa</button>
    </td>
  </tr>`;
  }
  document.getElementById("tableList").innerHTML = itemListHTML;
};

//hiện thông tin item cần update lên bảng
const showUpdateItem = async (itemId) => {
  document.getElementById("btnSaveUpdate").style.display = "inline-block";
  document.getElementById("btnAddItem").style.display = "none";
  try {
    const res = await axios({
      url: "https://633fd4c4d1fcddf69caa8103.mockapi.io/capstone/" + itemId,
      method: "GET",
    });
    let item = res.data;
    document.getElementById("itemId").value = item.id;
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemPrice").value = item.price;
    document.getElementById("itemScreen").value = item.screen;
    document.getElementById("itemBackCamera").value = item.backCamera;
    document.getElementById("itemFrontCamera").value = item.frontCamera;
    document.getElementById("itemImg").value = item.img;
    document.getElementById("itemDesc").value = item.desc;
    document.getElementById("itemType").value = item.type;
  } catch (error) {
    console.log(error);
  }
};

//update Item
const updateItem = async () => {
  //valid check
  if (!validateItem()) return;
  //lấy input
  const id = document.getElementById("itemId").value;
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const screen = document.getElementById("itemScreen").value;
  const backCamera = document.getElementById("itemBackCamera").value;
  const frontCamera = document.getElementById("itemFrontCamera").value;
  const img = document.getElementById("itemImg").value;
  const desc = document.getElementById("itemDesc").value;
  const type = document.getElementById("itemType").value;

  const newProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  try {
    await axios({
      url: "https://633fd4c4d1fcddf69caa8103.mockapi.io/capstone/" + id,
      method: "PUT",
      data: newProduct,
    });
    fetchApi();
  } catch (error) {
    console.log(error);
  }
  document.getElementById("itemId").value = "";
  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemScreen").value = "";
  document.getElementById("itemBackCamera").value = "";
  document.getElementById("itemFrontCamera").value = "";
  document.getElementById("itemImg").value = "";
  document.getElementById("itemDesc").value = "";
  document.getElementById("itemType").value = "";
  alert("Cập nhật thành công");
};

//delete Item
const deleteItem = async (e) => {
  confirm("Xác nhận xóa?");
  if (!confirm()) return;
  let itemId = e.target.getAttribute("data-id");
  try {
    await axios({
      url: "https://633fd4c4d1fcddf69caa8103.mockapi.io/capstone/" + itemId,
      method: "DELETE",
    });
    fetchApi();
  } catch (error) {
    console.log(error);
  }
};

//validate funtion
//required
const required = (val, spanId) => {
  if (val.length === 0) {
    document.getElementById(spanId).innerHTML =
      "*Vui lòng nhập thông tin yêu cầu";
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
};

//img link check
const urlCheck = (val, spanId) => {
  var pattern = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/g;

  if (pattern.test(val)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }
  document.getElementById(spanId).innerHTML =
    "URL không hợp lệ (https://... .png/.jpg)";
  return false;
};

//show button
const showButton = () => {
  document.getElementById("btnAddItem").style.display = "inline-block";
  document.getElementById("btnSaveUpdate").style.display = "none";
};
