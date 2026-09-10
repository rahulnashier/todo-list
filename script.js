const STORAGE_KEY = "todo-items";
const FILTER_KEY = "todo-filter";
const THEME_KEY = "todo-theme";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMessage = document.getElementById("empty-message");
const taskCount = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-btn");
const toggleAllBtn = document.getElementById("toggle-all");
const themeToggleBtn = document.getElementById("theme-toggle");
const searchInput = document.getElementById("search-input");

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

let currentFilter = localStorage.getItem(FILTER_KEY) || "all";
let searchTerm = "";

function render() {
        list.innerHTML = "";

  todos.forEach((todo, index) => {
          if ((currentFilter === "active" && todo.done) || (currentFilter === "completed" && !todo.done) || (searchTerm && !todo.text.toLowerCase().includes(searchTerm))) return;
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
          const editBtn = document.createElement("button");
          editBtn.type = "button";
          editBtn.textContent = "Edit";
          editBtn.addEventListener("click", () => {
                  editTodo(label, index);
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
          item.appendChild(editBtn);
            list.appendChild(item);
  });
const visibleCount = list.children.length;
        emptyMessage.textContent = todos.length === 0 ? "No tasks yet. Add one above." : "No tasks match this filter.";
  emptyMessage.style.display = visibleCount === 0 ? "block" : "none";

  const remaining = todos.filter((todo) => !todo.done).length;
        const completedCount = todos.length - remaining;

  if (todos.length === 0) {
            taskCount.textContent = "";
  } else {
            taskCount.textContent = remaining + " of " + todos.length + " " + pluralize(remaining, "task left", "tasks left");
  }

  clearCompletedBtn.hidden = completedCount === 0;
        toggleAllBtn.hidden = todos.length === 0;
        toggleAllBtn.textContent = todos.length > 0 && todos.every((t) => t.done) ? "Mark all active" : "Mark all complete";
}

function editTodo(label, index) {
        const input = document.createElement("input");
        input.type = "text";
        input.value = todos[index].text;
        input.className = "edit-input";
        label.replaceWith(input);
        input.focus();
        input.select();
        
        function commit() {
                const newText = input.value.trim();
                if (newText) {
                        todos[index].text = newText;
                }
                saveTodos(todos);
                render();
        }
        
        input.addEventListener("blur", commit);
        input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                        input.blur();
                } else if (event.key === "Escape") {
                        input.removeEventListener("blur", commit);
                        render();
                }
        });
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

filterButtons.forEach((btn) => { btn.addEventListener("click", () => { currentFilter = btn.dataset.filter; localStorage.setItem(FILTER_KEY, currentFilter); filterButtons.forEach((b) => { b.classList.toggle("active", b === btn); b.setAttribute("aria-pressed", b === btn); }); render(); }); });

toggleAllBtn.addEventListener("click", () => { const shouldComplete = !todos.every((t) => t.done); todos.forEach((t) => { t.done = shouldComplete; }); saveTodos(todos); render(); });

filterButtons.forEach((b) => { b.classList.toggle("active", b.dataset.filter === currentFilter); b.setAttribute("aria-pressed", b.dataset.filter === currentFilter); });
if (localStorage.getItem(THEME_KEY) === "dark") {
        document.body.classList.add("dark-theme");
}

themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

searchInput.addEventListener("input", () => {
        searchTerm = searchInput.value.trim().toLowerCase();
        render();
});

// Press "/" to jump to the search box.
document.addEventListener("keydown", (event) => {
        if (event.key === "/" && document.activeElement !== searchInput && document.activeElement !== input) {
                event.preventDefault();
                searchInput.focus();
        }
});

render();
