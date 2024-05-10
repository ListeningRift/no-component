import { reactive, watchEffect } from 'vue'
import { File, compileFile } from '@vue/repl'
import * as defaultCompiler from 'vue/compiler-sfc'
import { atou, utoa } from './encode'
import type { OutputModes, SFCOptions, Store, StoreState } from '@vue/repl'

const imports = {
  'no-component': `${location.origin}/src/components-dev-proxy.ts`,
}

const MAIN_FILE = 'App.vue'

const MAIN_CONTAINER = 'Playground.vue'
const containerCode = `\
<template>
  <App />
</template>

<script setup>
import App from './${MAIN_FILE}'
import { getCurrentInstance } from 'vue'
import noComponent from 'no-component'

const instance = getCurrentInstance()
instance.appContext.app.use(noComponent)
</script>
`

const defaultMainFile = `\
<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>

<script setup>
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>
`

export class ReplStore implements Store {
  state: StoreState

  compiler = defaultCompiler

  options?: SFCOptions

  initialShowOutput: boolean

  initialOutputMode: OutputModes = 'preview'

  private readonly defaultVueRuntimeURL: string

  constructor({
    serializedState = '',
    defaultVueRuntimeURL = 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.2.47/+esm',
    showOutput = false,
    outputMode = 'preview',
  }: {
    serializedState?: string
    showOutput?: boolean
    outputMode?: OutputModes | string
    defaultVueRuntimeURL?: string
  }) {
    let files: StoreState['files'] = {}

    if (serializedState) {
      const saved = JSON.parse(atou(serializedState))
      for (const filename of Object.keys(saved)) {
        files[filename] = new File(filename, saved[filename])
      }
    } else {
      files = {
        [MAIN_FILE]: new File(MAIN_FILE, defaultMainFile),
      }
    }

    this.defaultVueRuntimeURL = import.meta.env.PROD
      ? defaultVueRuntimeURL
      : `${location.origin}/src/vue-dev-proxy.ts`
    this.initialShowOutput = showOutput
    this.initialOutputMode = outputMode as OutputModes

    let mainFile = defaultMainFile
    if (!files[mainFile]) {
      mainFile = Object.keys(files)[0]
    }

    files[MAIN_CONTAINER] = new File(MAIN_CONTAINER, containerCode, true)

    this.state = reactive({
      mainFile: MAIN_CONTAINER,
      files,
      activeFile: files[mainFile],
      errors: [],
      vueRuntimeURL: this.defaultVueRuntimeURL,
      vueServerRendererURL: '',
      resetFlip: false,
    })

    this.initImportMap()

    watchEffect(() => compileFile(this, this.state.activeFile))

    // eslint-disable-next-line no-restricted-syntax
    for (const file in this.state.files) {
      if (file !== defaultMainFile) {
        compileFile(this, this.state.files[file])
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {}

  setActive(filename: string) {
    this.state.activeFile = this.state.files[filename]
  }

  addFile(fileOrFilename: string | File) {
    const file =
      typeof fileOrFilename === 'string'
        ? new File(fileOrFilename)
        : fileOrFilename
    this.state.files[file.filename] = file
    if (!file.hidden) this.setActive(file.filename)
  }

  deleteFile(filename: string) {
    if (this.state.activeFile.filename === filename) {
      this.state.activeFile = this.state.files[defaultMainFile]
    }
    delete this.state.files[filename]
  }

  serialize() {
    return `#${utoa(JSON.stringify(this.getFiles()))}`
  }

  getFiles() {
    const exported: Record<string, string> = {}
    for (const filename in this.state.files) {
      exported[filename] = this.state.files[filename].code
    }
    return exported
  }

  async setFiles(newFiles: Record<string, string>, mainFile = MAIN_FILE) {
    const files: Record<string, File> = {}
    if (mainFile === MAIN_FILE && !newFiles[mainFile]) {
      files[mainFile] = new File(mainFile, defaultMainFile)
    }
    for (const [filename, file] of Object.entries(newFiles)) {
      files[filename] = new File(filename, file)
    }
    for (const file of Object.values(files)) {
      await compileFile(this, file)
    }
    this.state.mainFile = mainFile
    this.state.files = files
    this.initImportMap()
    this.setActive(mainFile)
  }

  private initImportMap() {
    const map = this.state.files['import-map.json']
    if (!map) {
      this.state.files['import-map.json'] = new File(
        'import-map.json',
        JSON.stringify(
          {
            imports: {
              vue: this.defaultVueRuntimeURL,
              ...imports,
            },
          },
          null,
          2
        )
      )
    } else {
      try {
        const json = JSON.parse(map.code)
        if (!json.imports.vue) {
          json.imports.vue = this.defaultVueRuntimeURL
          map.code = JSON.stringify(json, null, 2)
        }
      } catch {}
    }
  }

  getImportMap() {
    try {
      return JSON.parse(this.state.files['import-map.json'].code)
    } catch (e) {
      this.state.errors = [
        `Syntax error in import-map.json: ${(e as Error).message}`,
      ]
      return {}
    }
  }
}
