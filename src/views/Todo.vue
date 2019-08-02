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
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import firebase from 'firebase/app'
require("firebase/auth")
import { db } from '../main'
import { get } from 'http';

export default {
  name: "todo",
  data() {
    return {
      newTodo: "",
      todos: [],
      authUser: {}
    }
  },
  methods: {
    getTodo: function() {
      // 要素が作られた際イベントを登録し変更を監視
      db.collection("users").doc(this.authUser.uid).collection("todos").orderBy('createdAt', 'desc').onSnapshot((querySnapShot) => {
        const allTodos = [];
        querySnapShot.forEach(doc => {
          allTodos.push(doc.data())
        });
        this.todos = allTodos;
      })
    },
    addTodo: function() {
      db.collection("users").doc(this.authUser.uid).collection("todos").add({
        todo: this.newTodo,
        done: false,
        createdAt: new Date()
      })
      .then((docRef) => {
        // ドキュメントidをフィールドに登録
        db.collection("users").doc(this.authUser.uid).collection("todos").doc(docRef.id).update({
          id: docRef.id
        })
      })
      this.newTodo = ""
    },
    stateTodo: function(todo) {
      // ...todoと渡し、他の変更にも対応
      db.collection("users").doc(this.authUser.uid).collection("todos").doc(todo.id).update({...todo})
    },
    deleteTodo: function(todo) {
      db.collection("users").doc(this.authUser.uid).collection("todos").doc(todo.id).delete()
      // if (window.confirm("Are you sure delete ?")) {
      //   db.collection("users").doc(this.authUser.uid).collection("todos").doc(todo.id).delete()
      // }
    },
    logout() {
      firebase.auth().signOut().then(()=>{
        console.log("logout");
      })
      .catch( (error)=>{
        console.log(error);
      });
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authUser = user;
        this.getTodo()
      } else {
        this.authUser = {}
      }
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // ユーザーログインが完了していたら次の処理へ => コンポーネントの作成へ
          next();
        } else {
          // ログインしていない場合はログイン画面へ
          vm.$router.push("/login")
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
