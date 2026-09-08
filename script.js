const STORAGE_KEY = "todo-items";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMessage = document.getElementById("empty-message");
const taskCount = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");

function loadTodos() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        try {
                  return JSON.parse(raw);
        } catch (err) {
                  return [];
        }
}

// Saving can fail if storage is full or unavailable (for example, in some
// private browsing modes). Fail quietly instead of breaking the app.
function saveTodos(todos) {
        try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (err) {
                  console.warn("Could not save tasks to local storage:", err);
        }
}

let todos = loadTodos();

function render() {
        list.innerHTML = "";

  todos.forEach((todo, index) => {
            const item = document.createElement("li");
            if (todo.done) {
                        item.classList.add("completed");
            }

                    const label = document.createElement("span");
            label.textContent = todo.text;
            label.addEventListener("click", () => {
                        todos[index].done = !todos[index].done;
                        saveTodos(todos);
                        render();
            });

                    const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.textContent = "Delete";
            removeBtn.addEventListener("click", () => {
                        todos.splice(index, 1);
                        saveTodos(todos);
                        render();
            });

                    item.appendChild(label);
            item.appendChild(removeBtn);
            list.appendChild(item);
  });

  emptyMessage.style.display = todos.length === 0 ? "block" : "none";

  const remaining = todos.filter((todo) => !todo.done).length;
        const completedCount = todos.length - remaining;

  if (todos.length === 0) {
            taskCount.textContent = "";
  } else {
            taskCount.textContent = remaining + " of " + todos.length + " tasks left";
  }

  clearCompletedBtn.hidden = completedCount === 0;
}

form.addEventListener("submit", (event) => {
        event.preventDefault();
        const text = input.value.trim();
        if (!text) return;

                        todos.push({ text, done: false });
        saveTodos(todos);
        input.value = "";
        render();
});

clearCompletedBtn.addEventListener("click", () => {
        todos = todos.filter((todo) => !todo.done);
        saveTodos(todos);
        render();
});

render();
