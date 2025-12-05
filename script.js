// kurze Variablen
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const doneBox = document.getElementById("all-done");
const cDone = document.getElementById("completed-count");
const cTotal = document.getElementById("total-count");

let tasks = loadTasks();
renderTasks();
updateCounters();

// Aufgabe hinzufügen
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const task = {
    id: Date.now().toString(),
    text: text,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  updateCounters();
  input.value = "";
});

// Aufgaben anzeigen
function renderTasks() {
  list.innerHTML = "";

  tasks.forEach(t => {
    const li = document.createElement("li");
    li.className = "task" + (t.completed ? " completed" : "");
    li.setAttribute("role", "listitem");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = t.completed;
    cb.addEventListener("change", () => toggleComplete(t.id));

    const span = document.createElement("span");
    span.textContent = t.text;

    const btn = document.createElement("button");
    btn.textContent = "Löschen";
    btn.addEventListener("click", () => deleteTask(t.id));

    li.appendChild(cb);
    li.appendChild(span);
    li.appendChild(btn);

    list.appendChild(li);
  });
}

// Aufgabe erledigt / nicht erledigt
function toggleComplete(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;

  t.completed = !t.completed;
  saveTasks();
  renderTasks();
  updateCounters();
}

// Aufgabe löschen
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
  updateCounters();
}

// Zähler aktualisieren
function updateCounters() {
  const total = tasks.length;
  const comp = tasks.filter(t => t.completed).length;

  cDone.textContent = comp;
  cTotal.textContent = total;

  if (total > 0 && comp === total) {
    allDone();
  } else {
    doneBox.style.opacity = 0;
  }
}

// Animation wenn alle fertig
function allDone() {
  doneBox.style.opacity = 1;
  doneBox.style.transform = "translateY(0)";

  // kleines, einfaches Konfetti
  for (let i = 0; i < 20; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 200 + "px";
    c.style.background = ["#6c63ff", "#ff8a65", "#ffd54f"][Math.floor(Math.random()*3)];
    doneBox.appendChild(c);

    setTimeout(() => c.remove(), 1200);
  }

  setTimeout(() => {
    doneBox.style.opacity = 0;
  }, 3500);
}

// speichern + laden
function saveTasks() {
  localStorage.setItem("todo.tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const raw = localStorage.getItem("todo.tasks");
  return raw ? JSON.parse(raw) : [];
}
