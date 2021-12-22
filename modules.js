import {
  getUserToken,
  keepData,
  addData,
  authorizationErrorHandler,
  onLoadImg,
  getUserInfo,
  currentUser,
  display,
} from "./main.js";

const url = "https://emircan-task-manager.herokuapp.com";

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

function postImg(image) {
  fetch(url + "/users/me/avatar", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + getUserToken(),
    },
    body: image,
  }).then((res) => authorizationErrorHandler(res));
}

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
export { getData, changeData, deleteTask, editTask, postImg, getImg };
