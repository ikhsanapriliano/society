/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Loading from "@/app/loading"
import { setPhoto } from "@/slices/auth"
import { RootState } from "@/store/store"
import { LoginResponse } from "@/types/auth"
import { PeopleResponse } from "@/types/people"
import { BioPayload, PhotoPayload } from "@/types/profile"
import { get, patch } from "@/utils/axios"
import { handleError } from "@/utils/error"
import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Image from "next/image"
import { deleteFile, saveFile } from "@/utils/firebase"
import { AnimatePresence, motion } from "framer-motion"

const Profile = () => {
    const dispatch = useDispatch()
    const [isLoading, setIsloading] = useState(true)
    const token = useSelector((state: RootState) => state.auth.token)
    const [user, setUser] = useState<PeopleResponse>()
    const [bioEdit, setBioEdit] = useState({ isEdit: false, isLoading: false })
    const [photoEdit, setPhotoEdit] = useState({ isEdit: false, isLoading: false })
    const [error, setError] = useState({ isError: false, message: "" })
    const avatars = ["/ava-1.png", "/ava-2.png", "/ava-3.png", "/ava-4.png", "/ava-5.png", "/ava-6.png", "/ava-7.png"]
    const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, width: 150, height: 150, unit: "px" })
    const [cropPhoto, setCropPhoto] = useState("")
    const [oldPhoto, setOldPhoto] = useState("")

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            const data = await get<PeopleResponse>("/users/profile", token, undefined) as PeopleResponse
            setUser(data)
            setOldPhoto(data.photo)
            setIsloading(false)
        } catch (error) {
            handleError(error, dispatch)
        }
    }

    const handleEditBio = async () => {
        try {
            setBioEdit(prev => ({ ...prev, isLoading: true }))
            setError({ isError: false, message: "" })
            const payload: BioPayload = { bio: user!.bio }
            const data = await patch<BioPayload, LoginResponse>("/users/bio", token, payload) as LoginResponse
            const newToken = data.token
            localStorage.setItem("token", newToken)
            setBioEdit({ isEdit: false, isLoading: false })
        } catch (error) {
            const message = handleError(error, dispatch) as string
            setError({ isError: true, message: message })
            setBioEdit(prev => ({ ...prev, isLoading: false }))
        }
    }

    const handleEditPhoto = async (link?: string) => {
        try {
            setPhotoEdit(prev => ({ ...prev, isLoading: true }))
            setError({ isError: false, message: "" })
            const payload: PhotoPayload = { photo: link ? link : user!.photo }
            const data = await patch<PhotoPayload, LoginResponse>("/users/photo", token, payload) as LoginResponse
            const newToken = data.token
            localStorage.setItem("token", newToken)
            if (!oldPhoto.startsWith("/ava") && !oldPhoto.startsWith("/profile")) {
                await deleteFile(oldPhoto)
            }
            dispatch(setPhoto(link ? link : user!.photo))
            setOldPhoto(link ? link : user!.photo)
            setPhotoEdit({ isEdit: false, isLoading: false })
        } catch (error) {
            const message = handleError(error, dispatch) as string
            setError({ isError: true, message: message })
            setPhotoEdit(prev => ({ ...prev, isLoading: false }))
        }
    }

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        setError({ isError: false, message: "" })
        if (e.target.files) {
            const file = e.target.files[0]
            if (!file.type.startsWith("image/")) {
                setPhotoEdit({ isEdit: false, isLoading: false })
                setError({ isError: true, message: "Image not valid." })
                return
            }

            setCropPhoto(URL.createObjectURL(file))
        }
    }

    const handleCrop = () => {
        try {
            setPhotoEdit(prev => ({ ...prev, isLoading: true }))
            const image = document.createElement("img")
            image.src = cropPhoto

            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (ctx) {
                canvas.width = 150;
                canvas.height = 150;

                ctx.drawImage(
                    image,
                    0, 0,
                    image.width,
                    image.height,
                    0, -crop.y,
                    150,
                    (image.height / image.width) * 150
                );

                canvas.toBlob((blob) => {
                    if (blob) {
                        const filename = `profiles/${user?.username}-${Date.now()}.jpg`
                        saveFile(blob, filename).then((link) => {
                            setUser(prev => ({ ...prev!, photo: link }))
                            handleEditPhoto(link).then(() => {
                                setCropPhoto("")
                            })
                        })
                    }
                }, "jpg")
            }
        } catch (error) {
            handleError(error, dispatch)
            setPhotoEdit(prev => ({ ...prev, isLoading: false }))
            setCropPhoto("")
        }
    }

    return (
        <section className="px-5 py-10 md:p-5 w-full h-full overflow-hidden">
            <h2 className="font-semibold text-[20px] mb-5">Profile</h2>
            {
                isLoading ?
                    <Loading />
                    :
                    <>
                        {
                            cropPhoto !== "" &&
                            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col gap-5 justify-center items-center z-50">
                                <div className="w-[150px] h-fit overflow-hidden">
                                    <ReactCrop maxHeight={150} maxWidth={150} minHeight={150} minWidth={150} crop={crop} onChange={c => { setCrop(c) }}>
                                        <Image src={cropPhoto} alt="photo" width={0} height={0} sizes="100vw" className="w-full h-auto" />
                                    </ReactCrop>
                                </div>
                                {
                                    photoEdit.isLoading ?
                                        <button disabled className="bg-fifth hover:bg-third duration-200 py-2 w-[150px] rounded-md"><i className="fa-solid fa-spinner fa-spin"></i></button>
                                        :
                                        <button onClick={() => { handleCrop() }} className="bg-fifth hover:bg-third duration-200 py-2 w-[150px] rounded-md">ok</button>
                                }
                            </div>
                        }
                        <div className="relative w-fit mx-auto">
                            <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                                <Image src={user!.photo} alt={"photo"} width={0} height={0} sizes="100vw" className="w-full h-auto" />
                            </div>
                            {
                                photoEdit.isEdit ?
                                    photoEdit.isLoading ?
                                        <button className="absolute right-0 bottom-0 bg-gray-700 hover:bg-gray-600 duration-200 w-[50px] h-[50px] rounded-full"><i className="fa-solid fa-spinner fa-spin"></i></button>
                                        :
                                        <button onClick={() => { handleEditPhoto() }} className="absolute right-0 bottom-0 bg-gray-700 hover:bg-gray-600 duration-200 w-[50px] h-[50px] rounded-full"><i className="fa-solid fa-check"></i></button>
                                    :
                                    <button onClick={() => { setPhotoEdit(prev => ({ ...prev, isEdit: true })) }} className="absolute right-0 bottom-0 bg-gray-700 hover:bg-gray-600 duration-200 w-[50px] h-[50px] rounded-full"><i className="fa-solid fa-pencil"></i></button>
                            }
                        </div>
                        <AnimatePresence>
                            {
                                photoEdit.isEdit &&
                                <motion.div
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-4 gap-3 w-fit mx-auto mt-5">
                                    {
                                        avatars.map((item, index) => (
                                            <button key={index} onClick={() => { setUser(prev => ({ ...prev!, photo: item })) }} className="w-[40px] h-[40px] rounded-full overflow-hidden hover:scale-110 duration-200">
                                                <Image src={item} alt={"photo"} width={0} height={0} sizes="100vw" className="w-full h-auto" />
                                            </button>
                                        ))
                                    }
                                    <label htmlFor="plus-image" className="w-[40px] h-[40px] flex justify-center items-center cursor-pointer rounded-full overflow-hidden bg-fifth hover:scale-110 duration-200 relative">
                                        <i className="fa-solid fa-plus"></i>
                                    </label>
                                    <input onChange={(e) => { handleFile(e) }} type="file" accept="image/*" id="plus-image" hidden />
                                </motion.div>
                            }
                        </AnimatePresence>
                        <div className="p-5 flex flex-col">
                            <p className="text-center">username</p>
                            <p className="text-center font-semibold">{user!.username}</p>
                            <AnimatePresence>
                                {
                                    !photoEdit.isEdit &&
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                    >
                                        <div className="flex justify-between mt-5">
                                            <p>bio</p>
                                            {
                                                bioEdit.isEdit ?
                                                    bioEdit.isLoading ?
                                                        <button><i className="fa-solid fa-spinner fa-spin"></i></button>
                                                        :
                                                        <button onClick={() => { handleEditBio() }}><i className="fa-solid fa-check"></i></button>
                                                    :
                                                    <button onClick={() => { setBioEdit(prev => ({ ...prev, isEdit: true })) }}><i className="fa-solid fa-pencil"></i></button>
                                            }
                                        </div>
                                        <textarea value={user!.bio} onChange={(e) => { setUser(prev => ({ ...prev!, bio: e.target.value })) }} rows={4} className="resize-none bg-first rounded-md p-3 mt-2 w-full" readOnly={bioEdit.isEdit ? false : true} disabled={bioEdit.isEdit ? false : true}></textarea>
                                    </motion.div>
                                }
                            </AnimatePresence>
                            {error.isError && <p className="text-red-500 mt-2 text-end">{error.message}</p>}
                        </div>
                    </>
            }
        </section>
    )
}

export default Profile
