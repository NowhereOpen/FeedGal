<template lang="pug">
  v-app    
    v-app-bar(
      :clipped-left="clipped"
      fixed
      app
    )
      v-app-bar-nav-icon(@click.stop="onSidePanel")
      v-container
        v-row
          v-toolbar-title.mr-2(
            v-text="title"
            @click="onTitleClick"
          )
        v-row 
          div.mr-2(v-for="link of links")
            a(:href="link.href") {{ link.name }}
      
      v-spacer

      v-btn(
        icon
        @click.stop="rightDrawer = !rightDrawer"
      )
        v-icon mdi-menu
        
    v-content
      v-container
        nuxt

    v-navigation-drawer(
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    )
      v-list
        v-list-item(@click.native="right = !right")
          v-list-item-action
            v-icon(light) mdi-menu
          v-list-item-title Switch drawer (click me)
    
    v-footer(
      :fixed="fixed"
      app
    )
      span &copy; GYST 2020

</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import { Options as VuetifyOption } from "@nuxtjs/vuetify"

@Component
export default class DefaultLayout extends Vue {
  clipped = true
  fixed = false
  
  miniVariant = false
  right = true
  rightDrawer = false
  title = "GYST"
  links = [
    { name: "Main", href: "/" },
    { name: "User", href: "/user" },
    { name: "Suite", href: "/suite" },
    { name: "Connected Accounts", href: "/settings/accounts" },
  ]

  cur_link:any|null = null

  created() {
    this.cur_link = this.links.find(link => {
      return link.href.startsWith(this.$route.path)
    })
  }

  mounted() {

  }

  onTitleClick() {
    const dark = (<VuetifyOption> this.$vuetify).theme!.dark
    ;(<VuetifyOption> this.$vuetify).theme!.dark = ! dark
  }

  onSidePanel() {
    document.dispatchEvent(new CustomEvent("side-panel"))
  }
}
</script>
