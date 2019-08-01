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
          <label class="todo-item">
            <input type="checkbox" v-model="todo.done" @change="stateTodo(todo)">
            {{todo.todo}}
            <input type="button" value="[×]" @click="deleteTodo(todo)">
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { db } from '../main'

export default {
  name: "todo",
  data() {
    return {
      newTodo: "",
      todos: []
    }
  },
  created() {
    db.collection("todos").orderBy('createdAt', 'desc').onSnapshot((querySnapShot) => {
      let allTodos = [];
      querySnapShot.forEach(doc => {
        allTodos.push(doc.data())
      });
      this.todos = allTodos;
    })
  },
  methods: {
    addTodo: function() {
      db.collection("todos").add({
        todo: this.newTodo,
        done: false,
        createdAt: new Date()
      })
      .then((docRef) => {
        db.collection("todos").doc(docRef.id).update({
          id: docRef.id
        })
      })
      this.newTodo = ""
    },
    stateTodo: function(todo) {
      db.collection("todos").doc(todo.id).update({...todo})
    },
    deleteTodo: function(todo) {
      if (window.confirm("Are you sure delete ?")) {
        db.collection("todos").doc(todo.id).delete()
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
