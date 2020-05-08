import { Request } from "express"

export type MatchPathFunc = (matched_path:string) => boolean

export abstract class ServerSideDataInjection {
  req:Request
  renderContext:any
  early_quit:boolean = false

  data:{ [key:string]: any } = {}

  constructor(renderContext:any) {
    this.renderContext = renderContext
    this.req = renderContext.req
  }

  onRequestReceived():void|Promise<void> {}
  /**
   * Fill `this.data` with data
   */
  abstract loadData():Promise<any>|any

  public async injectData() {
    await this.onRequestReceived()
    if(this.early_quit) {
      return
    }

    await this.loadData()
    Object.entries(this.data).forEach(([key, _value]) => {
      const value = <any> _value
      /**
       * 2020-05-08 20:41 
       * 
       * NOTE that this will inject the data to the vue file under `pages` only. So, if you decided to have
       * `pages/my-page/index.vue` and it imports another component `components/my-page/MyPage.vue` and keep
       * the `my-page/index.vue` simple by having it use the component `MyPage` and `MyPage` is the only
       * component in the template, the `MyPage` doesn't get nothing injected.
       * 
       * Could use `this.$parent` from `MyPage` or assign the injected data directly from the
       * `pages/my-page/index.vue` to `MyPage` with `<MyPage>this.$refs['my-page'].foo = this.foo` or
       * something.
       */
      this.renderContext.nuxt.data[0][key] = value
    })
  }
}