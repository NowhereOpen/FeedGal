/**
 * Making a class because the data returned by the data dragon are quite static,
 * and I don't want to make request everytime I need to look up the champion name from
 * champion id, for example.
 * 
 * Also in the future (YAGNI!!!), GYST could store its own resources including riot
 * related data just like how LoL Fandom Wikia does.
 * 
 * For example, Fandom wikia for LoL uses:
 *  
 *   - https://vignette.wikia.nocookie.net/leagueoflegends/images/6/67/Aatrox_OriginalCentered.jpg/revision/latest/scale-to-width-down/1215?cb=20180626200206
 * 
 * for Aatrox image, for example (as of 2019-09-14 19:43)
 */

import axios from "axios"

export class DataDragon {
  is_loaded = false
  latest_version:string = ""
  versions:string[] = []
  raw_champion_data:any = {}
  game_map_raw_data:any[] = []

  async setup() {
    await this.setRawData()
  }

  private async setRawData() {
    /**
     * https://developer.riotgames.com/ddragon.html
     * 
     * "Realms & versions"
     */
    const versions_res = await axios.get("http://ddragon.leagueoflegends.com/api/versions.json")
    this.versions = versions_res.data
    this.latest_version = this.versions[0]

    /**
     * https://developer.riotgames.com/ddragon.html
     * 
     * "IMAGE & DATA URLS" > "DATA" > "Champions"
     */
    const load_champions_res = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${this.latest_version}/data/en_US/champion.json`)
    this.raw_champion_data = load_champions_res.data

    const game_map_raw_data_res = await axios.get("https://raw.githubusercontent.com/CommunityDragon/Data/master/queuesFull.json")
    this.game_map_raw_data = game_map_raw_data_res.data
  }

  /**
   * Champion "detail" includes complete link to the image url attached by this class.
   * 
   * @param id String type integer "154" for Zac, for example.
   */
  getChampionDetailWithId(id:string) {
    const champions = this.raw_champion_data.data
    const [champion_name, champion] = <[string, any]> Object.entries<any>(champions).find(([champ_name, champion]) => champion.key == id)

    // New property
    champion.urls = {
      splash_art: `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion_name}_0.jpg`,
      loading_art: `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion_name}_0.jpg`,
      profile_art: `http://ddragon.leagueoflegends.com/cdn/${this.latest_version}/img/champion/${champion_name}.png`
    }

    return champion
  }

  getMapDescription(queue_id:any) {
    const entry = this.game_map_raw_data.find(entry => entry.id == queue_id)
    return entry
  }
}

export let data_dragon:DataDragon = <any> null

export function setup() {
  data_dragon = new DataDragon()
  data_dragon.setup()
}