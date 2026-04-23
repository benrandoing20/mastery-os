import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const dir = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(dir, '../../../../.env') })
