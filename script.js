const todoUl = document.querySelector(".todo-ul");
const inputArea = document.querySelector(".input");
const submitBtn = document.querySelector(".submit-btn");
const logoutBtn = document.querySelector(".logout-btn");
const userPP = document.querySelector(".user-pp");
const userPPInput = document.querySelector(".user-pp-input");

const url = "https://emircan-task-manager.herokuapp.com";

let todos = [];
let myUser;

// Taking token from localStorage
/**
 *
 * @returns user token
 */
function getUserToken() {
  const user = localStorage.getItem("userInfo");
  myUser = JSON.parse(user);
  return myUser != null ? myUser.token : null;
}
let currentUser;
function getUserInfo() {
  if (!currentUser === undefined) return;
  const user = localStorage.getItem("userInfo");
  myUser = JSON.parse(user);
  currentUser = myUser.user;
}

/**
 * @function setting todos with returned data from server
 */
function keepData(value) {
  todos = value;
}

/**
 *
 * @function adding users to todos
 */
function addData(value) {
  todos.push(value);
}

/**
 * @function Authorizes user with JWT
 */
function getData() {
  fetch(url + "/tasks/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUserToken(),
    },
  })
    .then((res) => authorizationErrorHandler(res))
    .then((res) => res.json())
    .then((data) => keepData(data))
    .then(() => display());
}
/**
 * @param {*} val response
 * @function handles errors
 */
function authorizationErrorHandler(val) {
  if (val.status === 401) {
    window.location.href = "http://127.0.0.1:5500/login-index.html";
    console.log("redirected");
  }
  if (val.status === 404) {
    userPP.setAttribute("src", "pp-default.jpeg");
    return;
  }
  return val;
}
/**
 *
 * @param {*} value new todo
 * @function adds new todos
 */
function changeData(value) {
  fetch(url + "/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUserToken(),
    },
    body: JSON.stringify(value),
  })
    .then((res) => authorizationErrorHandler(res))
    .then((res) => res.json())
    .then((data) => addData(data))
    .then(() => display());
}
//DELETE USER DATA
function deleteTask(itemID) {
  fetch(url + `/tasks/${itemID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUserToken(),
    },
  })
    .then((res) => res.json())
    .then(() => getData());
}
//EDIT USER DESCRIPTION
function editTask(itemID, newValue) {
  fetch(url + `/tasks/${itemID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUserToken(),
    },
    body: JSON.stringify(newValue),
  })
    .then((res) => res.json())
    .then(() => getData());
}
//POST IMG TO SERVER
function postImg(image) {
  fetch(url + "/users/me/avatar", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + getUserToken(),
    },
    body: image,
  }).then((res) => authorizationErrorHandler(res));
}

//GET IMG FROM SERVER
function getImg() {
  getUserInfo();
  fetch(url + `/users/${currentUser._id}/avatar`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUserToken(),
    },
  })
    .then((res) => authorizationErrorHandler(res))
    .then((res) => res.blob())
    .then((res) => onLoadImg(res));
}
function onLoadImg(value) {
  let reader;
  reader = new FileReader();
  reader.readAsDataURL(value);

  reader.addEventListener("load", function () {
    userPP.setAttribute("src", this.result);
  });
}
//ADD - CHANGE IMG
userPPInput.addEventListener("change", function () {
  changeImage(this);
});

function changeImage(input) {
  let reader;
  if (input.files && input.files[0]) {
    reader = new FileReader();

    reader.readAsDataURL(input.files[0]);

    reader.addEventListener("load", function () {
      userPP.setAttribute("src", this.result);
      let formData = new FormData();
      formData.append("avatar", input.files[0]);
      postImg(formData);
    });
  }
}

//CREATE A USER AND POST IT TO SERVER
function add() {
  let todoText = inputArea.value;

  if (todoText === "" || todoText === null || !isNaN(todoText)) return;
  else {
    const todo = {
      description: todoText,
      //id: createID(),
      completed: false,
    };
    if (todo.text === "") return;
    changeData(todo);

    inputArea.value = "";

    //localStorage.setItem("todos", JSON.stringify(todos));
  }
}
//RENDER DATA
function display() {
  inputArea.value = "";
  todoUl.innerHTML = "";
  document.querySelector(".user-profile-info").innerHTML = "";
  getUserInfo();

  const userName = document.createElement("p");
  userName.textContent = `User : ${currentUser.name}`;
  document.querySelector(".user-profile-info").appendChild(userName);

  const userMail = document.createElement("p");
  userMail.textContent = `Email : ${currentUser.email}`;
  document.querySelector(".user-profile-info").appendChild(userMail);

  todos.forEach((todo) => {
    const liItem = document.createElement("li");
    liItem.innerText = todo.description;

    const editBtn = document.createElement("i");
    editBtn.className = "fas fa-edit";
    editBtn.id = todo._id;

    const checkIcon = document.createElement("i");
    checkIcon.className = "fas fa-check";
    checkIcon.id = todo._id;

    const deleteBtn = document.createElement("i");
    deleteBtn.className = "fas fa-trash-alt";
    deleteBtn.id = todo._id;

    liItem.appendChild(checkIcon);
    liItem.appendChild(deleteBtn);
    liItem.appendChild(editBtn);

    todoUl.appendChild(liItem);

    deleteBtn.addEventListener("click", (e) => deleteTodo(e));
    editBtn.addEventListener("click", (e) => editTodo(e));
    checkIcon.addEventListener("click", (e) => changeStatus(e));

    if (todo.completed === true) {
      liItem.classList.add("checked");
      checkIcon.classList.add("check-icon-checked");
    }
  });
}
//DELETE TODO
function deleteTodo(event) {
  let btn = event.target;
  deleteTask(btn.id);
  //todos = todos.filter((todo) => todo._id != btn.id);
  //localStorage.setItem("todos", JSON.stringify(todos));
  submitBtn.disabled = false;

  display();
}
//EDIT TODOS DESCRIPTION
function editTodo(event) {
  let btn = event.target;

  const editTodo = todos.find((todo) => todo._id == btn.id);

  if (!btn.classList.contains("confirm")) {
    inputArea.value = editTodo.description;
  } else {
    let todoText = {
      description: inputArea.value,
    };
    editTask(btn.id, todoText);
    // editTodo.description = todoText;

    btn.classList.remove("confirm");
  }

  //localStorage.setItem("todos", JSON.stringify(todos));
  btn.classList.add("confirm");
}
//CHANGE TODOS STATUS
function changeStatus(event) {
  let checkIcon = event.target;
  const checkedTodo = todos.find((todo) => todo._id == checkIcon.id);
  let checkedStatus = {
    completed: !checkedTodo.completed,
  };
  editTask(checkedTodo._id, checkedStatus);
  //checkedTodo.status = !checkedTodo.status;
  //localStorage.setItem("todos", JSON.stringify(todos));
  submitBtn.disabled = false;
}
//WHEN PAGE LOADS GET DATA
window.addEventListener("DOMContentLoaded", function () {
  getData();
  getImg();
  //let storedTodos = localStorage.getItem("todos");
  // todos = JSON.parse(storedTodos);
});

submitBtn.addEventListener("click", () => {
  add();
  display();
});
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "http://127.0.0.1:5500/login-index.html";
});
/*
function createID() {
  const id = Date.now();
  return id;
}
*/
