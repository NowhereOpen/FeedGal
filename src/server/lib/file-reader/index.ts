import fs from "fs"
import YamlParse from "yaml"

export abstract class StrictFileReader {
  file_path:string
  yaml_content!:any

  constructor(file_path:string) {
    this.file_path = file_path
  }

  load() {
    const yaml_content = readYamlFile(this.file_path)
    
    this.yaml_content = yaml_content
    this.validate()
    this.loadDone()
  }

  abstract validate():void
  
  loadDone() {}
}

export function readYamlFile(file_path:string) {
  const file_content = fs.readFileSync(file_path, "utf-8")
  const yaml_content = YamlParse.parse(file_content)
  return yaml_content
}