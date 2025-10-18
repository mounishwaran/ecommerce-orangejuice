import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from '../config/db.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

// Load env from backend/.env regardless of where this script is executed from
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

const products = [
  {
    name: 'Classic Orange Juice',
    price: 4.99,
    description: 'Freshly squeezed Valencia oranges. Pure and simple.',
    imageURL: 'https://images.unsplash.com/photo-1542442828-287223270839?w=800&q=80&auto=format&fit=crop',
    size: '500ml',
    type: 'Classic',
  },
  {
    name: 'Pulpy Orange Juice',
    price: 5.49,
    description: 'Extra pulp for the real fruit lovers.',
    imageURL: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&auto=format&fit=crop',
    size: '500ml',
    type: 'Pulpy',
  },
  {
    name: 'No Sugar Orange Juice',
    price: 5.29,
    description: 'Only natural sweetness, zero added sugar.',
    imageURL: 'https://images.unsplash.com/photo-1571079579697-193f0e2a9a8e?w=800&q=80&auto=format&fit=crop',
    size: '1L',
    type: 'No Sugar',
  },
  {
    name: 'Orange Mint Cooler',
    price: 5.99,
    description: 'Fresh mint twist for a cooling citrus punch.',
    imageURL: 'https://images.unsplash.com/photo-1541976076758-347942db1970?w=800&q=80&auto=format&fit=crop',
    size: '250ml',
    type: 'With Mint',
  },
]

async function seed() {
  try {
    await connectDB()

    console.log('Clearing products...')
    await Product.deleteMany({})
    console.log('Inserting products...')
    await Product.insertMany(products)

    const adminEmail = 'admin@freshflow.local'
    const existing = await User.findOne({ email: adminEmail })
    if (!existing) {
      console.log('Creating admin user admin@freshflow.local / admin123')
      await User.create({ name: 'Admin', email: adminEmail, password: 'admin123', role: 'admin', address: 'HQ' })
    } else {
      if (existing.role !== 'admin') {
        console.log('Upgrading existing user to admin role:', adminEmail)
        existing.role = 'admin'
        await existing.save()
      } else {
        console.log('Admin already exists, skipping')
      }
    }

    console.log('Seeding done')
    await mongoose.connection.close()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

seed()
