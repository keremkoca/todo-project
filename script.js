const todoUl = document.querySelector(".todo-ul");
const inputArea = document.querySelector(".input");
const submitBtn = document.querySelector(".submit-btn");
// Taking token from localStorage
let myUser;

/**
 *
 * @returns user token
 */
function getUserToken() {
  const user = localStorage.getItem("userInfo");
  myUser = JSON.parse(user);
  return myUser.token;
}

let todos = [];
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
  fetch("http://emircan-task-manager.herokuapp.com/tasks/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUserToken(),
    },
  })
    .then((res) => res.json())
    .then((data) => keepData(data))
    .then(() => display());
}

/**
 *
 * @param {*} value new todo
 * @function adds new todos
 */
function changeData(value) {
  fetch("http://emircan-task-manager.herokuapp.com/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUserToken(),
    },
    body: JSON.stringify(value),
  })
    .then((res) => res.json())
    .then((data) => addData(data))
    .then(() => display());
}
//DELETE USER DATA
function deleteTask(itemID) {
  fetch(`http://emircan-task-manager.herokuapp.com/tasks/${itemID}`, {
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
  fetch(`http://emircan-task-manager.herokuapp.com/tasks/${itemID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getUserToken(),
    },
    body: JSON.stringify(newValue),
  })
    .then((res) => res.json())
    .then(() => getData())
    .then(() => display());
}
//WHEN PAGE LOADS GET DATA
window.addEventListener("DOMContentLoaded", function () {
  getData();

  //let storedTodos = localStorage.getItem("todos");
  // todos = JSON.parse(storedTodos);
});

//CREATE A USER AND POST IT TO SERVER
function add() {
  let todoText = inputArea.value;

  if (todoText === "" || todoText === null || !isNaN(todoText)) return;
  else {
    const todo = {
      description: todoText,
      id: createID(),
      complated: false,
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
  console.log(todos);
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

    if (todo.complated === true) {
      liItem.classList.add("checked");
      checkIcon.classList.add("fa-check-color");
    }
  });
}
//DELETE TODO
function deleteTodo(event) {
  let btn = event.target;
  deleteTask(btn.id);
  todos = todos.filter((todo) => todo._id != btn.id);
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

    submitBtn.disabled = true;
  } else {
    let todoText = inputArea.value;
    editTask(btn.id, todoText);
    // editTodo.description = todoText;

    btn.classList.remove("confirm");

    submitBtn.disabled = false;

    display();
  }

  //localStorage.setItem("todos", JSON.stringify(todos));
  btn.classList.add("confirm");
}
//CHANGE TODOS STATUS
function changeStatus(event) {
  let checkIcon = event.target;

  const checkedTodo = todos.find((todo) => todo._id == checkIcon.id);

  editTask(checkIcon.id, !checkedTodo.complated);
  //checkedTodo.status = !checkedTodo.status;
  //localStorage.setItem("todos", JSON.stringify(todos));
  submitBtn.disabled = false;
  display();
}

submitBtn.addEventListener("click", () => {
  add();
  display();
});

function createID() {
  const id = Date.now();
  return id;
}
