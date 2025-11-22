import React from "react";
import MainLayout from "../Layouts/MainLayout";
import { Head } from '@inertiajs/react';
import { motion } from "framer-motion";
import img404 from "@/Assets/img/404.png"

export default function page404({response=[]}){
    return (
        <>
            <Head title="Page Not Found"/>
            <div className="h-screen w-screen flex justify-center items-center text-white">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
                    className="h-fit w-150 flex flex-col bg-[#9AB78F] rounded-2xl justify-center items-center shadow-xl py-10 px-10 text-center"
                >
                    <img src={img404} className="h-60 w-fit"/>
                    <p className="text-lg font-light">Oooops!</p>
                    <br />
                    <h1 className="text-4xl font-extrabold uppercase">Page Not Found</h1>
                </motion.div>
            </div>
        </>
    )
}

// page404.layout = page => <MainLayout children={page} sidebarData={[]} />;