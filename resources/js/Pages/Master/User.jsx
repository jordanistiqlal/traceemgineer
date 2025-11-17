import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from "@inertiajs/react";
import Table from '@/Components/Table';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { formatPhone } from '@/Utils/Function';
import { handleRequestSubmit, handleRequestDelete } from '@/Utils/Request';

const RoleOptions = [
    { value: 'ENGINEER', label: 'ENGINEER' },
    { value: 'ADMIN', label: 'ADMIN' }
];

export default function User({response = []}){
    const columns = [
        { key: 'number', label: 'No', sortable: false, searchable: false, render: (item, index) => index + 1, title: "Users"},
        { key: 'user_id', label: 'Id', sortable: true, searchable: true},
        { key: 'name', label: 'Name', sortable: true, searchable: true},
        { key: 'username', label: 'Username', sortable: true, searchable: true},
        { key: 'email', label: 'Email', sortable: true, searchable: true},
        { key: 'action', label: 'Action', align: 'center', sortable: false, searchable: false,
            render: (item) => (
                    <div className="flex justify-center gap-2">
                        <button 
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-lg transition h-10 w-10 inline-flex items-center justify-center cursor-pointer"
                            title="Edit"
                            data-user={JSON.stringify(item)}
                            onClick={(e) => onEdit(e)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 640 640" fill="white">
                                <path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/>
                            </svg>
                        </button>
                        <button 
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-lg transition h-10 w-10 inline-flex items-center justify-center cursor-pointer"
                            title="Delete"
                            onClick={() => onDelete(item.user_id)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 640 640" fill="white">
                                <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/>
                            </svg>
                        </button>
                    </div>
            )}
    ];

    const {data, setData, post, put, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        id:"",
        name:"",
        username:"",
        email:"",
        nohp:"",
        password:"",
        role:""
    })
    const [FormVisible, setFormVisible] = useState(false)

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setData((prev) => ({ ...prev, nohp: formatted }));
    };

    const handleSubmit = (e) =>{
        e.preventDefault()
        handleRequestSubmit(e, data, post, put, reset, 'user', ToogleForm);
    }

    const onEdit = (e) => {
        e.preventDefault()
        ToogleForm();

        const response = (e.currentTarget.dataset.user) ? JSON.parse(e.currentTarget.dataset.user) : null;
        if(!response) return;
        
        setData({
            id: response.user_id || "",
            name: response.name || "",
            username: response.username || "",
            email: response.email || "",
            nohp: response.nohp || "",
            password: "",
            role: response.role || ""
        });
    }

    const onDelete = (id) => {
        handleRequestDelete(id, destroy, 'user');
    }

    const ToogleForm = () => {
        reset();
        if(FormVisible){
            return setFormVisible(false)
        }
        return setFormVisible(true)
    }

    useEffect(() =>{
        const hasErrors = Object.keys(errors).length > 0;
        
        if(hasErrors){
            setTimeout(() => {
                clearErrors();
            }, 5000);
        }
        
    }, [errors])


    return(
        <>
            <Head title='User Data'></Head>
            <div className={`${FormVisible ? 'hidden' : ''}`}>
                <div className="flex justify-end w-full px-6 py-2">
                    <button type="submit" onClick={ToogleForm} className="w-[10%] h-11 rounded-4xl text-xl font-extrabold transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-[#9AB78F] text-white hover:bg-[#8BA67E] ring-4 hover:ring-green-100/50">
                        <span className="drop-shadow-md px-2 ">
                            Create
                        </span>
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-800/20 p-6 max-h-max h-[90vh] overflow-y-auto">
                    <Table 
                        data={response || []}
                        columns={columns}
                        search={true}
                        sort={true}
                        pagination={true}
                        perPage={5}
                        perPageOptions={[5, 10, 25, 50, 100]}
                        searchPlaceholder="Search name or email..."
                        emptyMessage="No users available"
                    />
                </div>
            </div>

            <div className={`${FormVisible ? '' : 'hidden'}`}>
                <div className="flex justify-start w-full px-6 py-2">
                    <button type="button" onClick={ToogleForm} className="w-[10%] h-10 rounded-4xl text-xl font-extrabold transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-black text-white hover:bg-gray-700 ring-4 hover:ring-gray-400/50">Back</button>
                </div>
                <div className='px-6'>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-800/20 p-6 overflow-x-auto">
                        <div className="flex w-full justify-center items-center">
                            <h2 className="text-2xl mb-6 text-gray-700 uppercase font-sans font-bold">Form User</h2>
                        </div>
                    
                        <form onSubmit={handleSubmit} id="form" className="p-4">
                            <div className="p-2 hidden">
                                <label htmlFor="id" className="block text-sm font-medium text-gray-700">Id</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="id" name="id" id="id" placeholder="ENG328F" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.id} onChange={(e) => setData('id', e.target.value)}/>

                                    {errors.id && <span className="text-red-500 text-sm">{errors.id}</span>}
                                </div>
                            </div>

                            <div className="p-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="name" name="name" id="name" placeholder="John Doe" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.name} onChange={(e) => setData('name', e.target.value)}/>

                                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                </div>
                            </div>

                            <div className="p-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="username" name="username" id="username" placeholder="Joko" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.username} onChange={(e) => setData('username', e.target.value)}/>

                                    {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
                                </div>
                            </div>

                            <div className="p-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="email" name="email" id="email" placeholder="johndoe@gmail.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.email} onChange={(e) => setData('email', e.target.value)}/>

                                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2">
                                <div className="p-2">
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                    <div className="flex-1 flex flex-col">
                                        <Select
                                            id="role" name="role" placeholder="Select Role"
                                            value={RoleOptions.find(option => option.value === data.name)}
                                            onChange={(selectedOption) => setData('role', selectedOption?.value || '')}
                                            options={RoleOptions}
                                            className="flex-1"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderColor: '#d1d5db',
                                                    boxShadow: 'none',
                                                    '&:hover': { borderColor: '#d1d5db' }
                                                })
                                            }}
                                        />
                                        {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
                                    </div>
                                </div>

                                <div className="p-2">
                                    <label htmlFor="nohp" className="w-55 text-sm font-medium text-gray-700" > No Handphone </label>

                                    <div className="flex-1 flex flex-col">
                                        <input type="text" name="nohp" id="nohp" placeholder="0000-0000-0000"className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handlePhoneChange} onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") e.preventDefault(); }} value={data.nohp} />
                                        {errors.nohp && <span className="text-red-500 text-sm">{errors.nohp}</span>}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="flex-1 flex flex-col">
                                    <input type="password" name="password" id="password" placeholder="⦁⦁⦁⦁⦁" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.password} onChange={(e) => setData('password', e.target.value)}/>

                                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                                </div>
                            </div>



                            <div className="flex justify-end w-full p-2 pt-10">
                                <button type="submit" disabled={processing} className="w-[20%] h-12 rounded-lg text-xl font-extrabold transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-[#9AB78F] text-white hover:bg-[#8BA67E] ring-4 hover:ring-green-100/50">
                                    <span className="drop-shadow-md">
                                        {processing ? 'Loading...' : 'Sumbit'}
                                    </span>
                                </button>
                            </div>
                            
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

User.layout = page => <MainLayout children={page} sidebarData={[]} />;