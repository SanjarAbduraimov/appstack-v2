document.addEventListener("DOMContentLoaded", (e) => {
  const page = location.pathname;
  console.log(page);
  if (page === "/index.html" || page === "/") {
    if (localStorage.token) {
      let img__wrapper = document.querySelector(".img__wrapper");
      let auth__link = document.querySelector(".auth__link");
      auth__link.remove();
      img__wrapper.classList.remove("hide");
    }
    getBooksRequest()
      .then((data) => {
        displayBooks(data.payload.docs);
        initializeBookEvents();
      })
      .catch((err) => {
        alert(err.message);
      });
  }
  if (page === "/authors.html" || page === "authors") {
    if (localStorage.token) {
      let img__wrapper = document.querySelector(".img__wrapper");
      let auth__link = document.querySelector(".auth__link");
      auth__link.remove();
      img__wrapper.classList.remove("hide");
    }
    getAuthorsRequest()
      .then((data) => {
        displayAuthors(data.payload);
      })
      .catch((err) => {
        alert(err.message);
      });
  }
  if (page === "/book.html" || page === "/book") {
    // console.log(location.search);
    // const query = new URLSearchParams(location.search);
    // const id = query.get("id");
    // console.log(history.state.id);
    fetchById("https://bookzone-v2.herokuapp.com/api/books", history.state.id).then(
      (book) => {
        console.log(book, "book data from api");
      }
    );
  }
  if (page === "/sign-up.html" || page === "/signup") {
    const signUpform = document.querySelector(".signUp_form");

    signUpform.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(signUpform);
      const data = {};
      Array.from(formData).forEach((item) => {
        data[item[0]] = item[1];
      });
      authRequest("https://bookzone-v2.herokuapp.com/api/sign-up", data)
        .then((data) => {
          console.log(data);
          localStorage.token = data.token;
          localStorage.user = JSON.stringify(data.user);
          location.assign("/");
        })
        .catch((err) => {
          alert(err.msg);
          if (err?.path) {
            location.assign(err.path);
          }
        });
    });
  }
  if (page === "/sign-in.html" || page === "/login") {
    const signInForm = document.querySelector(".signIn_form");

    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        email: signInForm.email.value,
        password: signInForm.password.value,
      };
      authRequest("https://bookzone-v2.herokuapp.com/api/login", formData)
        .then((data) => {
          console.log(data);
          localStorage.token = data.token;
          localStorage.user = JSON.stringify(data.user);
          location.assign("/");
        })
        .catch((err) => {
          Toastify({
            text: err.msg,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, red, red)",
            },
            onClick: function () {},
          }).showToast();
          if (err?.path) {
            location.assign(err.path);
          }
        });
    });
  }
});
const fetchAll = async (url, query) => {};
const fetchById = async (url, id) => {
  try {
    const response = await fetch(`${url}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Iltimos to'g'ri manzilga so'rov jo'nating!");
      } else if (response.status === 403) {
      } else {
      }
      throw new Error(response);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
const getBooksRequest = async () => {
  try {
    const response = await fetch("https://bookzone-v2.herokuapp.com/api/books");
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Iltimos to'g'ri manzilga so'rov jo'nating!");
      } else if (response.status === 403) {
      } else {
      }
      throw new Error(response);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
function displayBooks(data) {
  let result = "";
  const bookMenuNode = document.querySelector(".books");
  data.forEach((book) => {
    result += `
          <div data-id="${book._id}" class="book">
          <img src="img/book.png" alt="Book Image" class="book_img" />
          <h4>${book.title}</h4>
          <h6>${book.author.firstName}</h6>
          <img src="img/star.png" alt="Star" class="star" />
          <h5>4.1 • ${book.pages} bet</h5>
        </div>
      `;
  });
  bookMenuNode.innerHTML = result;
}
function initializeBookEvents() {
  const bookMenuNode = document.querySelector(".books");
  bookMenuNode.addEventListener("click", (event) => {
    const id = event.target.closest(".book")?.dataset?.id;
    console.log(id, "bosilgan narsa");
    if (!id) return;
    history.pushState({ id }, null, "/book.html");
    location.reload();
    // location.assign(`/book.html?id=${id}`);
  });
}
async function authRequest(url, formData) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    let data = await response.json();
    if (!response.ok) {
      if (response.status === 404) {
        throw { msg: "Iltimos to'g'ri manzilga so'rov jo'nating!" };
      } else if (response.status === 403) {
        // displaying "hm, what about no?"
      } else if (response.status === 401) {
        throw { msg: "Iltimos ro'yxatdan o'ting" };
      } else {
        // displaying "dunno what happened \_(ツ)_/¯"
      }
      if (data?.msg.startsWith("E11000")) {
        throw {
          msg: "Siz allaqochon ro'yhatdan o'tgansiz",
          path: "/sign-in.html",
        };
      }
      throw data;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
// Display authors

const getAuthorsRequest = async () => {
  try {
    const response = await fetch(
      "https://bookzone-v2.herokuapp.com/api/authors/"
    );
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Iltimos to'g'ri manzilga so'rov jo'nating!");
      } else if (response.status === 403) {
      } else {
      }
      throw new Error(response);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
function displayAuthors(data) {
  let result = "";
  const authorMenuNode = document.querySelector(".authors");
  data.forEach((author) => {
    result += `
    <div class="author">
    <img src="./img/author.png" class="author_img" alt="author">
    <h3>${author.firstName} ${author.lastName}</h3>
    <p>${author.date_of_birth} ${author.date_of_death}</p>
    <div class="author_logo">
      <img src="img/book_author.png" alt="Book">
      <span>34</span>
      <img src="img/listener.png" alt="listener">
      <span>34</span>
    </div>
  </div>
      `;
  });
  authorMenuNode.innerHTML = result;
}
