import Logo from "@/Assets/img/logo.png"
import PersonalIcon from "@/Assets/icons/personal-icon.png"
import MenuIcon from "@/Assets/icons/menu-icon.png"
import { Link, router, usePage } from "@inertiajs/react"
import { getActiveMenu } from "@/Config/menuConfig"
import { useState } from "react"
import Swal from "sweetalert2"

export default function Header({data}){
    const { url, props } = usePage();
    const activeMenu = getActiveMenu(url);
    const [open, setOpen] = useState(false);


    const onLogout = () =>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
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
           <header className="absolute top-0 left-0 w-full h-[95px] bg-white z-0">
                <div className="flex flex-1 pt-3">

                    {/* Icon */}
                    <div className="px-11 lg:w-[25%] md:w-[40%]">
                        <img className="h-[77px] w-[100px]" src={Logo} alt="Logo" />
                    </div>
                    
                    {/* Menu Section */}
                    <div className="lg:w-[60%] md:w-[35%] flex items-center px-6">
                        <div className="flex items-center gap-4">
                            
                            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                                <img src={activeMenu.icon} alt={activeMenu.name} className="w-8 h-8 brightness-0" />
                            </div>
                            
                            <div className="flex flex-col uppercase">
                                {activeMenu.isSubmenu ? ( <> <span className="text-black/80 text-xs font-medium uppercase tracking-wider"> {activeMenu.parentName} </span> <span className="text-black text-2xl font-bold"> {activeMenu.name} </span> </> ) : ( <span className="text-black text-2xl font-bold"> {activeMenu.name} </span> )}
                            </div>
                            
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="lg:w-[25%] md:w-[25%] flex justify-end items-center p-4 gap-2">
                        
                        <button className="flex items-center gap-2 border border-[#9AB78F] text-black px-4 py-1.5 rounded-full bg-white hover:bg-green-50 transition-all duration-200 cursor-pointer" onClick={() => setOpen(!open)}>
                            <span className="text-sm font-medium uppercase">{props.auth.user.username}</span>
                            <img src={PersonalIcon} alt="profile" className="w-5 h-5" />
                        </button>

                        {/* Sub Menu */}
                        {open && (
                            <div className="absolute right-17 top-17 bg-white shadow-lg rounded-xl border border-gray-200 w-40 py-2 animate-fadeIn z-50 transition-all duration-300 ease-in-out">
                                <button
                                    className="block w-full text-left px-5 py-2 hover:bg-gray-100 transition cursor-pointer font-bold hover:text-[#9AB78F]"
                                    onClick={onLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        <button className="flex items-center py-1.5 px-3 transition-all duration-200 cursor-pointer">
                            <img src={MenuIcon} alt="menu" className="w-5 h-5 cursor-pointer"/>
                        </button>   

                    </div>
                </div>
           </header>
        </>
    )
}