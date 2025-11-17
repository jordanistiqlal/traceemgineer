import AuthLayout from "@/Layouts/AuthLayout";
import { Head, useForm } from "@inertiajs/react";
import Logo from "@/Assets/img/logo.png"
import Swal from 'sweetalert2';

export default function Login({errors}){
    const {data, setData, post, processing, reset} = useForm({
        username:"",
        password:""
    })

    const handleSubmit = (e) =>{
        e.preventDefault()

        post(route('login.post'), {
            onSuccess: () =>{
                reset('password')
            },
            onError: (errors) =>{
                Swal.fire({
                    text: errors,
                    icon: "error",
                    title: "Oops...",
                })
            }
        })
    }
    return (
        <> 
            <Head title="Login Page"/>
            <div className="h-screen">
                <div className="absolute h-screen w-[30%]"></div>
                <div className="absolute h-screen w-[70%] right-0 bg-[#D9D9D9] flex flex-col p-10 justify-center items-center">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-800/20 p-6 max-h-max h-[90vh] overflow-y-auto w-[70%]">
                        <div className="w-full max-w-sm mx-auto pt-10">
                            <img src={Logo} height={150} width={150} alt="" className="block mx-auto"/>
                        </div>
                            
                        <div className="w-full mt-[5%]">
                            <form onSubmit={handleSubmit} id="form_login" className="p-4">
                                <div className="p-2">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                    <input type="username" name="username" id="username" placeholder="John Doe" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.username} onChange={(e) => setData('username', e.target.value)}/>

                                    {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
                                </div>
                                <div className="p-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <input type="password" name="password" id="password" placeholder="⦁⦁⦁⦁⦁" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.password} onChange={(e) => setData('password', e.target.value)}/>

                                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                                </div>

                                <div className="p-2 pt-10 w-full flex justify-center">
                                        <button type="submit" disabled={processing} className="w-[60%] h-12 rounded-4xl text-xl font-extrabold shadow-2xl transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-gradient-to-r from-green-400 to-green-400 text-white hover:from-green-700 hover:to-green-300 ring-4 hover:ring-white/50">
                                            <span className="drop-shadow-md">
                                                {processing ? 'Loading...' : 'Login'}
                                            </span>
                                        </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


Login.layout = page => <AuthLayout children={page}></AuthLayout>