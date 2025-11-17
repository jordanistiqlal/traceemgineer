import Swal from 'sweetalert2';

export const handleRequestSubmit = (e, data = [], post, put, reset, routename, ToogleForm) => {
    e.preventDefault()

    try {
        if(!data.id){ // Create New Project
            post(route(routename+'.store'), {
                onSuccess: () =>{
                    Swal.fire({
                        title: "Created Succesfully",
                        icon: "success",
                        draggable: true
                    });

                    reset()
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
        }else{ // Update Existing Project
            put(route(routename+'.update', data.id), {
                onSuccess: () =>{
                    Swal.fire({
                        title: "Updated Succesfully",
                        icon: "success",
                        draggable: true
                    });

                    reset()

                    ToogleForm();
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
    } catch (error) {
        Swal.fire({
            text: error,
            icon: "error",
            title: "Oops...",
        })
    }
}


export const handleRequestDelete = (id, destroy, routename) => {
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
                destroy(route(routename+'.destroy', id), {
                    onSuccess: () =>{
                        Swal.fire({
                            title: "Deleted Succesfully",
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
                });
            }
        });
}