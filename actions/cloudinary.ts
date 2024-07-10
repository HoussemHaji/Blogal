import axios from "axios";

export const ImageUppload = (formData: FormData) => {
    const file = formData.get('file') as File
    formData.append('upload_preset', `${process.env.CLOUDINARY_URL}`)
}