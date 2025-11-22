import React from "react";
import MainLayout from "../Layouts/MainLayout";
import Swal from "sweetalert2";
import { Head } from '@inertiajs/react';
import { router } from "@inertiajs/react";
import { motion } from "framer-motion";
import blockImage from "@/Assets/img/block.png"

export default function Redirect({response=[]}){
    const onLogout = () =>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#9AB78F',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('logout'),{
                    onSuccess: () => {
                        Swal.fire({
                            title: "Logout Succesfully",
                            icon: "success",
                            draggable: true
                        });
                    },
                    onError: (errors) =>{
                        const errorMessages = typeof errors != 'object' ? errors : Object.values(errors).flat().join('\n');
                        
                        Swal.fire({
                            text: errorMessages,
                            icon: "error",
                            title: "Oops...",
                            confirmButtonText: 'Close'
                        })
                    }
                })
            }
        });
    }

    return (
        <>
            <Head title="Sorry Your Access is Limited"/>
            
            <div className="h-screen w-screen flex justify-center items-center text-white">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
                    className="h-fit w-150 flex flex-col gap-6 bg-[#9AB78F] rounded-2xl justify-center items-center shadow-xl py-10 px-10 text-center"
                >
                    <img src={blockImage} className="h-50 w-fit invert"/>
                    <h1 className="text-2xl font-extrabold">Kamu Bukan Administrator</h1>
                    <p className="text-lg font-light">Halaman ini dikhususkan untuk akun Admin dari penyedia Program <br /> jika ada keluhan, kritik, serta saran dapat disampaikan pada layanan kontak penyedia <br /> <strong className="text-2xl">Terima Kasih</strong></p>

                    <div className="flex gap-5">
                    <a
                        href="https://wa.me/6281252303522"
                        target="_blank"
                        className="bg-[#25D366] p-3 px-15 rounded-xl cursor-pointer hover:bg-[#075E54] transition-all duration-300 ease-in-out shadow-xl hover:ring-4 hover:ring-gray-400/50 hover:scale-105"
                    >
                        
                        Kontak Info
                    </a>

                    <button
                        className="bg-red-500 p-3 px-15 rounded-xl cursor-pointer hover:bg-red-700 transition-all duration-300 ease-in-out shadow-xl hover:ring-4 hover:ring-gray-400/50 hover:scale-105"
                        onClick={onLogout}
                    >
                        Logout
                    </button>

                    </div>
                </motion.div>
            </div>
        </>
    )
}

// Redirect.layout = page => <MainLayout children={page} sidebarData={[]} />;