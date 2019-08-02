<template>
  <div class="todo">
    <header-item></header-item>
    <div class="todo-container">
      <form class="todo-form">
        <label  class="todo-label">
          <span class="todo-newText">New Todo:</span>
          <input v-model="newTodo" type="text" class="todo-input" placeholder="add todo text"/>
          <button class="btn todo-btn todo-btn--add" type="submit" @click.prevent="addTodo()">Add</button>
        </label>
      </form>
      <div class="todo-task">
        <ul class="todo-list">
          <li v-for="todo in todos" :key="todo.id" class="todo-item">
            <label class="todo-item-label">
              <input type="checkbox" v-model="todo.done" @change="stateTodo(todo)" class="todo-item-check">
              <span :class="{'is-done': todo.done }" class="todo-item-text">{{todo.todo}}</span>
              <input type="button" value="×" @click="deleteTodo(todo)" class="todo-item-delete">
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="logout">
      <button class="btn btn-logout" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { db } from '../main'

import HeaderItem from "../components/HeaderItem"

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
  },
  components: {
    HeaderItem: HeaderItem
  }
}
</script>

<style lang="scss" scoped>
  .btn {
    background-color: #eee;
    border-radius: 5px;
    padding: 7px 13px;
    cursor: pointer;
  }

  .todo {
    position: relative;
    height: 100vh;
  }

  .todo-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .todo-form {
    padding: 20px;
    margin: 30px auto;
    border-radius: 5px;
    box-shadow: 0 3px 8px #ccc;
  }

  .todo-label {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 auto;
  }

  .todo-newText {
    display: block;
    flex: 1 1 100%;
    text-align: left;
    margin-bottom: 10px;
  }

  .todo-task {
    height: 45vh;
    margin-bottom: 20px;
    overflow: scroll;
  }

  .todo-input {
    flex: 2 1 auto;
    margin-right: 1em;
  }

  .todo-list {
    list-style: none;
    padding: 0;
  }

  .todo-item {
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    text-align: left;

    &-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-text {
      flex: 2 1 auto;
      margin: 0 10px;
    }

    &-delete {
      display: flex;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      line-height: 11px;
      text-align: center;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .is-done {
    text-decoration: line-through;
    color: #aaa;
  }

  .logout {
    position: absolute;
    bottom: 20px;
    right: 0;
    left: 0;
    margin: auto;
  }
</style>
