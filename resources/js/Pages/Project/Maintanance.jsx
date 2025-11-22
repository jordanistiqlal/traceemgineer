import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Table from '@/Components/Table';
import Plus from '@/Components/Plus';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import Swal from 'sweetalert2';


export default function Maintanance({response=[]}){
    const columnsTicket = [
        { key: 'number', label: 'No', sortable: false, searchable: false, render: (item, index) => index + 1, title: "Ticket List"},
        { key: 'ticket_site', label: 'Site', sortable: true, searchable: true},
        { key: 'ticket_problem', label: 'Problem', sortable: true, searchable: true},
        { key: 'ticket_tanggal', label: 'Tanggal', sortable: true, searchable: true},
        { key: 'ticket_jam', label: 'Jam', sortable: true, searchable: true},
        { key: 'ticket.user.name', label: 'From', sortable: true, searchable: true, render: (item) => item.user?.name || '-' },
        { key: 'bodyraw', label: 'Body Raw', sortable: true, searchable: true},
    ];
    const { props } = usePage();
    const {data, setData, post, processing, reset, errors, clearErrors } = useForm({ 
        id:"",
        site:"",
        tanggal: "",
        jam: "",
        created: props.auth.user.user_id,
        problem:"",
        project:"",
        bodyraw:"",
    })
    const TicketData = response?.tickets
    const [FormVisible, setFormVisible] = useState(true)
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const ticketData = response.projects || []
    const [detailTicketData, setdetailTicketData] = useState([])
    const [TaskTitle, setTaskTitle] = useState("")
    const projectSelection = response?.selection?.projects || []
    

    const ProjectShow = (e) => {
        e.preventDefault()
        setFormVisible(true)
        setTaskTitle(e.currentTarget.dataset.title)
        showDetail(e.currentTarget.dataset.id)
    }

    const showDetail = async (id) => {
        try {
            const res = await fetch(route('ticket.show', id));
            if (!res.ok) throw await res.text();

            const data = await res.json();
            
            setdetailTicketData(data.ticket);

        } catch (error) {
            Swal.fire({
                text: error || 'Something went wrong',
                icon: "error",
                title: "Oops...",
                confirmButtonText: 'Close'
            });
        }
    };

    const handleSubmit = (e) =>{
        e.preventDefault()

        try {
            post(route('ticket.store'), {
                onSuccess: () =>{
                    Swal.fire({
                        title: "Created Succesfully",
                        icon: "success",
                        draggable: true
                    });

                    reset()
                    setSelectedDate(null)
                    setSelectedTime(null)
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
        } catch (error) {
            Swal.fire({
                text: error,
                icon: "error",
                title: "Oops...",
            })
        }
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
            <Head title='Maintanance Data'></Head>

            <div className="grid grid-cols-4">
                <div className="">
                    <div className="flex flex-col flex-1 gap-2 mb-5 p-3 max-h-max h-[45vh] overflow-y-auto scrollbar-hide">
                        {ticketData.map((item,i) => (
                            <Link key={i} data-title={(item.project_name).toUpperCase()} data-id={item.project_id} className="bg-[#9AB78F] rounded-2xl px-6 py-3 w-full uppercase text-md font-bold text-white hover:bg-[#8BA67E] ring-4 hover:ring-green-100/50" onClick={ProjectShow}>
                                {item.project_name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-start w-full px-2 mt-5">
                        <button type="button" onClick={() => setFormVisible(false)} className="w-12 h-12 rounded-full text-xl font-extrabold shadow-2xl transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-black text-white hover:bg-gray-700 ring-4 hover:ring-gray-400/50 p-2"> <Plus/> </button>
                        <p className='text-sm px-5 mt-2 font-extrabold md:text-md lg:text-2xl whitespace-nowrap'> Add Ticket </p>
                    </div>
                </div>
           
                <div className={`col-span-3 pl-5`}>
                    {/* Ticket List */}
                    <div className={``}>
                        <div className={`${FormVisible && TaskTitle != "" ? '' : 'hidden'} `}>
                            <h1 className='text-4xl font-bold mb-5'>{TaskTitle}</h1>
                            <Table 
                                data={detailTicketData || []}
                                columns={columnsTicket}
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

                    <div className={`${FormVisible ? 'hidden': ''}`}>
                        <h1 className='text-4xl font-bold mb-5'> Add Ticket</h1>

                        <form className='w-full mt-10'>
                            <div className="p-2 flex items-center"> 
                                <label htmlFor="project" className="w-55 text-sm font-medium text-gray-700" > Project </label> 
                                <div className="flex-1 flex flex-col">
                                    <Select
                                        id="project" name="project" placeholder="Select Project"
                                        value={projectSelection.find(option => option.value === data.project) || null}
                                        onChange={(selectedOption) => setData('project', selectedOption?.value || '')}
                                        options={projectSelection}
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
                                    {errors.project && <span className="text-red-500 text-sm">{errors.project}</span>}
                                </div>
                            </div>

                            <div className="p-2 flex items-center"> 
                                <label htmlFor="site" className="w-55 text-sm font-medium text-gray-700" >Site</label> 
                                <div className="flex-1 flex flex-col">
                                    <input type="text" name="site" id="site" placeholder="Site" className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.site} onChange={(e) => setData('site', e.target.value)}/>
                                    {errors.site && <span className="text-red-500 text-sm">{errors.site}</span>}
                                </div>
                            </div>

                            <div className="p-2 flex items-center"> 
                                <label htmlFor="tanggal" className="w-55 text-sm font-medium text-gray-700" >Tanggal</label> 
                                <div className="flex-1 flex flex-col">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => {
                                            setSelectedDate(date)
                                            setData('tanggal', date ? new Date(date).toISOString().split("T")[0] : '');
                                        }}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="00/00/0000"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
                                        id="tanggal"
                                        name="tanggal"
                                        popperPlacement="bottom-start"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        yearDropdownItemNumber={50}
                                        scrollableYearDropdown
                                    />
                                    {errors.tanggal && <span className="text-red-500 text-sm">{errors.tanggal}</span>}
                                </div>
                            </div>

                            <div className="p-2 flex items-center"> 
                                <label htmlFor="jam" className="w-55 text-sm font-medium text-gray-700" >Jam</label> 
                                <div className="flex-1 flex flex-col">
                                    <DatePicker
                                        selected={selectedTime}
                                        onChange={(time) => {
                                            setSelectedTime(time)
                                            setData('jam', time ? time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'}) : '');
                                        }}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Waktu"
                                        dateFormat="HH:mm:ss"
                                        placeholderText="00:00:00"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
                                        id="jam"
                                        name="jam"
                                        popperPlacement="bottom-start"
                                    />
                                    {errors.jam && <span className="text-red-500 text-sm">{errors.jam}</span>}
                                </div>
                            </div>

                            <div className="p-2 flex items-center"> 
                                <label htmlFor="userInput" className="w-55 text-sm font-medium text-gray-700" >Dibuat Oleh</label> 
                                <div className="flex-1 flex flex-col">
                                    <input type="text" name="userInput" id="userInput" placeholder="ADMIN" value={props.auth.user.username} className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200" disabled={true}/>
                                    <span className="text-gray-500 text-sm">Auto from user auth</span>
                                    {errors.userInput && <span className="text-red-500 text-sm">{errors.userInput}</span>}
                                </div>
                            </div>

                            <div className="p-2 flex items-center"> 
                                <label htmlFor="problem" className="w-55 text-sm font-medium text-gray-700" >Problem</label> 
                                <div className="flex-1 flex flex-col">
                                    <input name="problem" id="problem" placeholder="problem..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.problem} onChange={(e) => setData('problem', e.target.value)}/>
                                    {errors.problem && <span className="text-red-500 text-sm">{errors.problem}</span>}
                                </div>
                            </div>

                            <div className="p-2 flex items-center"> 
                                <label htmlFor="bodyraw" className="w-55 text-sm font-medium text-gray-700" >BodyRaw</label> 
                                <div className="flex-1 flex flex-col">
                                    <textarea name="bodyraw" id="bodyraw" placeholder="bodyRaw..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={data.bodyraw} onChange={(e) => setData('bodyraw', e.target.value)}/>
                                    {errors.bodyraw && <span className="text-red-500 text-sm">{errors.bodyraw}</span>}
                                </div>
                            </div>

                            <div className="flex items-end justify-end mt-10">
                                <button type="submit" onClick={handleSubmit} className="w-[10%] h-10 rounded-4xl text-lg font-extrabold transform hover:scale-103 transition-all ease-in-out duration-300 tracking-wider bg-[#9AB78F] text-white hover:bg-[#8BA67E] ring-4 hover:ring-green-100/50">
                                    <span className="">
                                        {processing ? 'Loading...' : 'Add'}
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

Maintanance.layout = page => <MainLayout children={page} sidebarData={[]} />;