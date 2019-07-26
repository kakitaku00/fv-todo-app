<template>
  <div class="todo">
    <form>
      <label>
        New Todo:
        <input v-model="newTodo" type="text"/>
        <button type="submit" @click.prevent="addTodo()">Add</button>
      </label>
    </form>
    <div class="todo_task">
      <ul>
        <li v-for="todo in todos" :key="todo.id">
          {{todo.todo}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: "todo",
  data() {
    return {
      newTodo: "",
      todos: []
    }
  },
  methods: {
    addTodo: function() {
      db.collection("todos").add({
        todo: this.newTodo,
        done: false,
        createdAt: new Date()
      })
      this.newTodo = ""
    },
    getTodo: function() {
      db.collection("todos").onSnapshot((querySnapShot) => {
        let allTodos = [];
        querySnapShot.forEach(doc => {
          allTodos.push(doc.data())
        });
        this.todos = allTodos;
      })
    }
  },
  created() {
    this.getTodo()
  }
}
</script>

<style lang="scss" scoped>

</style>
