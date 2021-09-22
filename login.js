const loginForm = document.querySelector("#login");
const createAccount = document.querySelector("#create-account");

const url = `https://emircan-task-manager.herokuapp.com`;
const createAccountLink = document.querySelector("#link-create-account");
const loginLink = document.querySelector("#link-login");
/////SWITCH TO LOGIN/CREATE ACCOUNT///////
createAccountLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("form-hidden");
  createAccount.classList.remove("form-hidden");
});

loginLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.remove("form-hidden");
  createAccount.classList.add("form-hidden");
});

//// MESSAGE HANDLERS////
function formMessageHandler(formName, status, message) {
  const formMessage = formName.querySelector(".form-message");
  formMessage.textContent = message;
  formMessage.classList.add(`.message-${status}`);
}

function inputMessageHandler(formId, message) {
  const messageField = createAccount.querySelector(`#${formId}`);
  messageField.innerText = message;
}

function clearFormMessage(formElement, messageContainer) {
  formElement.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("form-input")) {
      formElement.querySelector(`${messageContainer}`).textContent = "";
    }
  });
}
let myUserInfo;
console.log(`${url}/users`);
////LOGIN/////
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginForm.querySelectorAll(".form-input").forEach((input) => {
    if (input.value === "") {
      formMessageHandler(
        loginForm,
        "error",
        "Username and password must be filled"
      );
      clearFormMessage(loginForm, ".form-message");
      return;
    }
  });
  const userName = document.querySelector("#login-username").value;
  const userPassword = document.querySelector("#login-password").value;
  let userObj = {
    email: userName,
    password: userPassword,
  };
  // console.log(JSON.stringify(userObj));
  fetch(`${url}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObj),
  })
    .then((userInfo) => (userInfo ? userInfo.json() : {}))
    .then((userInfo) => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      window.location.href = "http://127.0.0.1:5500/";
      console.log("Success:", userInfo);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
});

////CREATE ACCOUNT////
createAccount.addEventListener("submit", (e) => {
  e.preventDefault();
  const userName = createAccount.querySelector("#username").value;
  const emailAddress = createAccount.querySelector("#email").value;
  const password = createAccount.querySelector("#password").value;
  const confirmPassword =
    createAccount.querySelector("#confirm-password").value;

  const userInfo = {
    name: userName,
    email: emailAddress,
    password: password,
  };

  const passwordValidation = (
    password = password,
    confirm = confirmPassword
  ) => {
    if (password !== confirm) {
      inputMessageHandler(
        "password-confirm-message",
        "The password confirmation does not match"
      );
      clearFormMessage(createAccount, "#password-confirm-message");
      return false;
    } else {
      return true;
    }
  };

  ///FETCH REQUEST///

  if (passwordValidation) {
    fetch(`${url}/users`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((userInfo) => {
        saveUserInfo(userInfo);
        console.log("Success:", userInfo);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  } else return;
});

function saveUserInfo(data) {
  myUserInfo = data;
  localStorage.setItem("myUserInfo", JSON.stringify(myUserInfo));
}
