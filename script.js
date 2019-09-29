"use strict";

const form = document.querySelector("form#addform");
// form.setAttribute("novalidate", true);

form.addEventListener("submit", evt => {
  evt.preventDefault();

  const inputData = {
    task: form.elements.task.value,
    category: form.elements.category.value,
    taskmanager: form.elements.taskmanager.value
  };
  post(inputData);
});

function get() {
  fetch("https://todolist-ebac.restdb.io/rest/todolist", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(tasks => {
      console.log(tasks);
      tasks.forEach(addTaskToDOM);
    });
}
get();

function addTaskToDOM(task) {
  const template = document.querySelector("template").content;
  const clone = template.cloneNode(true);
  const formEdit = clone.querySelector("form#editform");
  clone.querySelector("article").dataset.taskid = task._id;
  clone.querySelector(".flip-card").dataset.taskid = task._id;
  formEdit.dataset.taskid = task._id;
  clone.querySelector("h1.task").textContent = task.task;
  clone.querySelector("h1.category").textContent = task.category;
  clone.querySelector("h1.taskmanager").textContent = task.taskmanager;

  if (task.doing) {
    clone.querySelector(".flip-card-front").classList.add("doing");
    clone.querySelector("button.doing").textContent = "todo";
  }

  formEdit.addEventListener("submit", evt => {
    evt.preventDefault();
    put(task._id);
  });

  clone.querySelector(".delete").addEventListener("click", () => {
    deleteTask(task._id);
  });

  clone.querySelector(".edit").addEventListener("click", () => {
    clickedDetails(task._id);
  });
  clone.querySelector(".cancel").addEventListener("click", () => {
    cancelDetails(task._id);
  });

  clone.querySelector("button.doing").addEventListener("click", () => {
    putDoing(task._id);
  });

  document.querySelector(".app").prepend(clone);
}

function clickedDetails(id) {
  const clickedTask = document.querySelector(`.flip-card[data-taskid="${id}"`);
  clickedTask.classList.add("clicked");
  editBand(id);
}

function cancelDetails(id) {
  const clickedTask = document.querySelector(`.flip-card[data-taskid="${id}"`);
  clickedTask.classList.remove("clicked");
}

function post(inputData) {
  addTaskToDOM(inputData);
  const postData = JSON.stringify(inputData);
  fetch("https://todolist-ebac.restdb.io/rest/todolist", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(() => {
      form.elements.task.value = "";
      form.elements.category.value = "";
      form.elements.taskmanager.value = "";
    });
}

function put(id) {
  const formEdit = document.querySelector(`#editform[data-taskid="${id}"`);
  const data = {
    task: formEdit.elements.task.value,
    category: formEdit.elements.category.value,
    taskmanager: formEdit.elements.taskmanager.value
  };
  const postData = JSON.stringify(data);
  fetch("https://todolist-ebac.restdb.io/rest/todolist/" + id, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(updatedTask => {
      console.log(updatedTask);
      const parentElement = document.querySelector(`article[data-taskid="${updatedTask._id}"`);
      parentElement.querySelector("h1.task").textContent = updatedTask.task;
      parentElement.querySelector("h1.category").textContent = updatedTask.category;
      parentElement.querySelector("h1.taskmanager").textContent = updatedTask.taskmanager;
      formEdit.elements.task.value = "";
      formEdit.elements.category.value = "";
      formEdit.elements.taskmanager.value = "";
      formEdit.elements.id.value = "";
      cancelDetails(updatedTask._id);
    });
}

function putDoing(id) {
  const parentTask = document.querySelector(`article[data-taskid="${id}"`);
  let data = {};
  if (parentTask.classList.contains("doing")) {
    data = {
      task: parentTask.querySelector("h1.task").textContent,
      category: parentTask.querySelector("h1.category").textContent,
      taskmanager: parentTask.querySelector("h1.taskmanager").textContent,
      doing: false
    };
  } else {
    data = {
      task: parentTask.querySelector("h1.task").textContent,
      category: parentTask.querySelector("h1.category").textContent,
      taskmanager: parentTask.querySelector("h1.taskmanager").textContent,
      doing: true
    };
  }

  const postData = JSON.stringify(data);
  fetch("https://todolist-ebac.restdb.io/rest/todolist/" + id, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(updatedTask => {
      const parentElement = document.querySelector(`article[data-taskid="${updatedTask._id}"`);
      if (updatedTask.doing) {
        parentElement.classList.add("doing");
        parentElement.querySelector("button.doing").textContent = "todo";
      } else {
        parentElement.classList.remove("doing");
        parentElement.querySelector("button.doing").textContent = "doing";
      }
    });
}

function deleteTask(id) {
  fetch("https://todolist-ebac.restdb.io/rest/todolist/" + id, {
    method: "delete",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      //delete from DOM
      document.querySelector(`.flip-card[data-taskid="${id}"`).remove();
    });
}

function editBand(id) {
  fetch(`https://todolist-ebac.restdb.io/rest/todolist/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d8e0ae91ce70f63798550a9",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(tasks => {
      const formEdit = document.querySelector(`#editform[data-taskid="${id}"`);
      console.log(formEdit);
      formEdit.elements.task.value = tasks.task;
      formEdit.elements.category.value = tasks.category;
      formEdit.elements.taskmanager.value = tasks.taskmanager;
      formEdit.elements.id.value = tasks._id;
    });
}

// ---------------------- mouse notes
// src: https://medium.com/@zxlee618/drawing-on-a-html-canvas-b7566624b17f

const MAIN_MOUSE_BUTTON = 0;

function prepareContext(canvasElement) {
  let dpr = window.devicePixelRatio || 1;
  let rect = canvasElement.getBoundingClientRect();
  canvasElement.width = rect.width * dpr;
  canvasElement.height = rect.height * dpr;

  let context = canvasElement.getContext("2d");
  context.scale(dpr, dpr);

  return context;
}

function setLineProperties(context) {
  context.lineWidth = 4;
  context.lineJoin = "round";
  context.lineCap = "round";
  return context;
}

let clearButton = document.getElementById("clearButton");
let theCanvas = document.getElementById("theCanvas");
let theContext = prepareContext(theCanvas);
let shouldDraw = false;

theCanvas.addEventListener("mousedown", start);
theCanvas.addEventListener("mouseup", end);
theCanvas.addEventListener("mousemove", move, false);

clearButton.addEventListener("click", event => {
  clearCanvas(theContext);
});

function clearCanvas(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function start(event) {
  if (event.button === MAIN_MOUSE_BUTTON) {
    shouldDraw = true;
    setLineProperties(theContext);

    theContext.beginPath();

    let elementRect = event.target.getBoundingClientRect();
    theContext.moveTo(event.clientX - elementRect.left, event.clientY - elementRect.top);
  }
}

function end(event) {
  if (event.button === MAIN_MOUSE_BUTTON) {
    shouldDraw = false;
  }
}

function move(event) {
  if (shouldDraw) {
    let elementRect = event.target.getBoundingClientRect();
    theContext.lineTo(event.clientX - elementRect.left, event.clientY - elementRect.top);
    theContext.stroke();
  }
}
