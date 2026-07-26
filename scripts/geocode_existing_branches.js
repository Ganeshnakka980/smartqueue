import { createClient } from '@supabase/supabase-js'
import { geocodeExistingBranches } from '../src/services/geocoding.js'
import fs from 'fs'
import path from 'path'

// Helper to parse .env file manually without external dependencies
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
  } catch (err) {
    console.warn('Could not read .env file:', err.message)
  }
}

loadEnv()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables required.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log('🚀 Running one-time Geocoding Migration for existing branches in Supabase...')
  const result = await geocodeExistingBranches(supabase)
  
  if (result.success) {
    console.log('==============================================')
    console.log('🎉 Geocoding Migration Finished!')
    console.log(`Total needing geocode: ${result.total}`)
    console.log(`Successfully updated:  ${result.updated}`)
    console.log(`Failed / unresolvable: ${result.failed}`)
    console.log('==============================================')
  } else {
    console.error('❌ Migration failed:', result.error)
  }
}

run()
