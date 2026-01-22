/**
 * pulsar Framework - Complete Features Showcase
 */

import { bootstrapApp } from "pulsar"
import { ShowcaseApp } from './showcase/ShowcaseApp'

console.log('🚀 pulsar Features Showcase Starting...')

// Build application root
const appRoot = bootstrapApp()
    .root('#app')
    .onMount((element) => {
        console.log('✅ Showcase mounted successfully', element)
    })
    .onError((error) => {
        console.error('❌ Showcase error:', error)
    })
    .build()

// Mount the showcase application
const app = <ShowcaseApp root={appRoot} />

console.log('✅ pulsar Features Showcase Ready!')
