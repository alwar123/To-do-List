document.addEventListener('DOMContentLoaded', function() {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let selectedColor = '#6366f1';
  let currentEditId = null;

  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const addBtn = document.getElementById('add-task');
  const dateInput = document.getElementById('task-date');
  const timeInput = document.getElementById('task-time');
  const editModal = document.getElementById('edit-modal');
  const editTaskInput = document.getElementById('edit-task-input');
  const editTaskDate = document.getElementById('edit-task-date');
  const editTaskTime = document.getElementById('edit-task-time');
  const saveEditBtn = document.getElementById('save-edit');
  const closeBtn = document.querySelector('.close-btn');
  
  showTasks();
  
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
  });
  
  saveEditBtn.addEventListener('click', saveEditedTask);
  closeBtn.addEventListener('click', closeModal);
 
  window.addEventListener('click', function(e) {
    if (e.target === editModal) {
      closeModal();
    }
  });

  document.querySelectorAll('.color').forEach(color => {
    color.addEventListener('click', function() {
      document.querySelectorAll('.color').forEach(c => c.classList.remove('selected'));
      color.classList.add('selected');
      selectedColor = color.dataset.color;
    });
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showTasks(btn.dataset.filter);
    });
  });

  document.getElementById('toggle-dark').addEventListener('click', function() {
    document.body.classList.toggle('dark');
  });

  function addTask() {
    const text = taskInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!text) {
      alert('Please enter a task!');
      return;
    }

    const task = {
      id: Date.now(),
      text,
      date,
      time,
      color: selectedColor,
      completed: false
    };

    tasks.push(task);
    saveAndRender();
     
    taskInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
  
  }

  function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    showTasks();
  }

  function showTasks(filter = 'all') {
    taskList.innerHTML = '';
    let filtered = tasks;

    if (filter === 'active') {
      filtered = tasks.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filtered = tasks.filter(t => t.completed);
    }

    if (filtered.length === 0) {
      taskList.innerHTML = '<li class="empty-message">No tasks found</li>';
      return;
    }

    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.style.borderLeftColor = task.color;

      li.innerHTML = `
        <div class="task-content">
          <div class="task-text">${task.text}</div>
          <div class="task-meta">
            ${task.date ? '📅 ' + task.date : ''} 
            ${task.time ? '🕒 ' + task.time : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="complete-btn" onclick="toggleComplete(${task.id})">${task.completed ? '↩' : '✔'}</button>
          <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
          <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      `;

      taskList.appendChild(li);
    });
  }

  function toggleComplete(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveAndRender();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
  }
  
  function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    currentEditId = id;
    editTaskInput.value = task.text;
    editTaskDate.value = task.date;
    editTaskTime.value = task.time;
      
    document.querySelectorAll('.color').forEach(color => {
      color.classList.remove('selected');
      if (color.dataset.color === task.color) {
        color.classList.add('selected');
        selectedColor = task.color;
      }
    });
    
    editModal.style.display = 'block';
  }

  function saveEditedTask() {
    if (!currentEditId) return;

    const text = editTaskInput.value.trim();
    if (!text) {
      alert('Task cannot be empty!');
      return;
    }

    tasks = tasks.map(t => {
      if (t.id === currentEditId) {
        return {
          ...t,
          text: text,
          date: editTaskDate.value,
          time: editTaskTime.value,
          color: selectedColor
        };
      }
      return t;
    });

    saveAndRender();
    closeModal();
  }

  function closeModal() {
    editModal.style.display = 'none';
    currentEditId = null;
  }

  window.toggleComplete = toggleComplete;
  window.deleteTask = deleteTask;
  window.editTask = editTask;
});