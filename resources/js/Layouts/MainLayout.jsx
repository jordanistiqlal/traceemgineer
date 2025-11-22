import React from "react";
import { DataProvider } from '@/Contexts/DataContext';
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { usePage } from "@inertiajs/react";
import Redirect from "@/Pages/Redirect";

export default function MainLayout({children, sidebarData }){
    const { url, props } = usePage();
    
    if (props.auth.user.role !== "ADMIN") {
        return (
            <Redirect></Redirect>
        )
    }

    return (
        <DataProvider initialData={sidebarData?.[0]}>
            <div className="flex h-screen relative">
                <Header></Header>
                <Sidebar data={sidebarData} ></Sidebar>

                <main className="flex-grow bg-white overflow-auto scrollbar-hide font-sans">
                    {url == '/track' 
                    ? children
                    : <div className='pt-25 px-6'>{children}</div>
                }    
                </main>
            </div>
        </DataProvider>
    )
}