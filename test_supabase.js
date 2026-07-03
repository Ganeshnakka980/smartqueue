import { queueService } from './src/services/queue.js'

async function test() {
  console.log('--- Testing queueService updates ---')
  try {
    const categories = await queueService.getBusinessCategories()
    console.log('✅ Categories fetched count:', categories.length)
    console.log('Sample category:', categories[0])
    
    // Fetch branches for first category
    const branches = await queueService.getBranches(categories[0].id)
    console.log('✅ Branches fetched count:', branches.length)
    console.log('Sample branch:', branches[0])
    
    // Fetch services for first branch
    const services = await queueService.getServices(branches[0].id)
    console.log('✅ Services fetched count:', services.length)
    console.log('Sample service:', services[0])
    
    // Try joining queue (mock)
    const token = await queueService.joinQueue(branches[0].id, services[0].id, 'test-user-123')
    console.log('✅ Mock Token generated:', token)
    
    // Get active token (mock)
    const active = await queueService.getActiveToken('test-user-123')
    console.log('✅ Active Token fetched:', active)
  } catch (err) {
    console.log('❌ Test failed with exception:', err)
  }
}

test()
