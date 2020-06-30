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

      AuthWidget
        
    v-content
      v-container
        nuxt

    
    v-footer(
      :fixed="fixed"
      app
    )
      span &copy; GYST 2020

</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import { Options as VuetifyOption } from "@nuxtjs/vuetify"

import AuthWidget from "~/components/layouts/AuthWidget.vue"

@Component({
  components: { AuthWidget }
})
export default class DefaultLayout extends Vue {
  clipped = true
  fixed = false
  
  miniVariant = false
  right = true
  rightDrawer = false
  title = "FeedGal"
  links = [
    { name: "Main", href: "/" },
    { name: "Suite", href: "/suite" },
    { name: "Connected Accounts", href: "/settings/accounts" },
    { name: "About", href: "/about" }
  ]

  cur_link:any|null = null

  created() {
    this.cur_link = this.links.find(link => {
      return link.href.startsWith(this.$route.path)
    })
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
