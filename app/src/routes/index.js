import express from 'express'
import pages from './pages'
import synonyms from './synonyms'

const router = express.Router()

pages.configure('/', router)
synonyms.configure('/synonyms', router)

export default router
