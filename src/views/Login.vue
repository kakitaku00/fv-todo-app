<template>
  <div>
    <h3>Please Login with your google account to continue</h3>
    <input type="button" value="signin with google" @click="login">
  </div>
</template>

<script>
import firebase from "firebase/app"
require("firebase/auth")

export default {
  methods: {
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        this.$router.push("/")
      })
    }
  }
}
</script>
