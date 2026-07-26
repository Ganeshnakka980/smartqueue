import { geocodeAddress } from './src/services/geocoding.js'

async function test() {
  console.log('Testing geocodeAddress function...')

  const testAddresses = [
    'Achutrao Patwardhan Marg, Andheri West, Mumbai, 400053',
    'Bandra West, Mumbai, Maharashtra 400050',
    'Invalid Nonexistent Location 99999999 XYZ'
  ]

  for (const addr of testAddresses) {
    console.log(`\nAddress: "${addr}"`)
    const result = await geocodeAddress(addr)
    console.log('Result:', result)
  }
}

test()
