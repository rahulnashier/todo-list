const STORAGE_KEY = "todo-items";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMessage = document.getElementById("empty-message");

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
      try {
          return JSON.parse(raw);
            } catch (err) {
                return [];
                  }
                  }

                  function saveTodos(todos) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
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
                                                                                                                                                
                                                                                                                                                render();
                                                                                                                                                
