import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from "@inertiajs/react";
import Swal from 'sweetalert2'

export default function Project({errors}){
    const {data, setData, post, processing, reset} = useForm({
        name:"",
        email:"",
        password:"",
        password2:""
    })

    const handleSubmit = (e) =>{
        e.preventDefault()

        try {
            post(route('user'), {
                onSuccess: () =>{
                    reset('password')

                    Swal.fire({
                        title: "Created Succesfully",
                        icon: "success",
                        draggable: true
                    });
                },
                onError: (errors) =>{
                    Swal.fire({
                        text: errors,
                        icon: "error",
                        title: "Oops...",
                        confirmButtonText: 'Close'
                    })
                }
            })
        } catch (error) {
            Swal.fire({
                text: error,
                icon: "error",
                title: "Oops...",
            })
        }
    }

    return(
        <>
            <Head title='Form New Engineer'></Head>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-800/20 p-6 overflow-x-auto">
                <div className="flex w-full justify-center items-center">
                    <h2 className="text-2xl mb-6 text-gray-700 uppercase font-sans font-bold">Form New Engineer</h2>
                </div>
            
                <form onSubmit={handleSubmit} id="form" className="p-4">
                    <div className="p-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="name" name="name" id="name" placeholder="John Doe" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.name} onChange={(e) => setData('name', e.target.value)}/>

                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                    </div>

                    <div className="p-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" placeholder="johndoe@gmail.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.email} onChange={(e) => setData('email', e.target.value)}/>

                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="p-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" name="password" id="password" placeholder="⦁⦁⦁⦁⦁" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.password} onChange={(e) => setData('password', e.target.value)}/>

                            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                        </div>
                        
                        <div className="p-2">
                            <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Repeated Password</label>
                            <input type="password" name="password2" id="password2" placeholder="⦁⦁⦁⦁⦁" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.password2} onChange={(e) => setData('password2', e.target.value)}/>

                            {errors.password2 && <span className="text-red-500 text-sm">{errors.password2}</span>}
                        </div>
                    </div>

                    <div className="flex justify-end w-full p-2 pt-10">
                        <button type="submit" disabled={processing} className="w-[20%] h-12 rounded-lg text-xl font-extrabold shadow-2xl transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-gradient-to-r from-blue-500 to-blue-300 text-white hover:from-blue-700 hover:to-blue-400 ring-4 hover:ring-indigo-400/50">
                            <span className="drop-shadow-md">
                                {processing ? 'Loading...' : 'Sumbit'}
                            </span>
                        </button>
                    </div>
                    
                </form>

            </div>
        </>
    )
}

Project.layout = page => <MainLayout children={page} sidebarData={[]} />;