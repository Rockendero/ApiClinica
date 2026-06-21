import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { verificarJWT } from '../middlewares/verificarJWT.js'
import { getDoctores, postDoctor, putDoctor, deleteDoctor } from '../controladores/doctoresCtrl.js'

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'doctores', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] }
})

const upload = multer({ storage })

router.get('/doctores', verificarJWT, getDoctores)
router.post('/doctores', verificarJWT, upload.single('foto'), postDoctor)
router.put('/doctores/:id', verificarJWT, upload.single('foto'), putDoctor)
router.delete('/doctores/:id', verificarJWT, deleteDoctor)

export default router