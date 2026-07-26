import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
        if (match) {
          const key = match[1]
          let value = match[2] || ''
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
          process.env[key] = value
        }
      })
    }
  } catch (err) {}
}

loadEnv()

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY)

async function inspectDb() {
  console.log('--- Inspecting Supabase DB ---')
  const { data: categories, error: catErr } = await supabase.from('business_categories').select('*')
  console.log('Business Categories:', catErr ? catErr.message : categories?.length)

  const { data: branches, error: bErr } = await supabase.from('branches').select('*')
  console.log('Branches in DB total:', bErr ? bErr.message : branches?.length)
  if (branches && branches.length > 0) {
    console.log('Sample branch 0:', branches[0])
    console.log('Branches with status active:', branches.filter(b => b.status === 'active').length)
  }
}

inspectDb()
