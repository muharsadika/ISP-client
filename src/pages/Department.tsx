import { useState } from 'react';
import ModalDepartment, { IDepartment } from '../components/ModalDepartment';
import { api } from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaRegEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';

const Department = () => {
    const [open, setOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] =
        useState<IDepartment | null>(null);
    const queryClient = useQueryClient();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedDepartment(null);
    };

    const { data } = useQuery({
        queryKey: ['departments'],
        queryFn: () => api.get('/departments'),
    });
    const department = data?.data || [];

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/departments/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            Swal.fire('Deleted!', 'Department berhasil dihapus.', 'success');
        },
    });

    const handleEdit = (department: IDepartment) => {
        setSelectedDepartment(department);
        handleOpen();
    };

    const handleDelete = (id?: number) => {
        if (id !== undefined) {
            Swal.fire({
                title: 'Apakah Anda yakin?',
                text: 'Anda tidak dapat mengembalikan ini!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, hapus itu!',
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteMutation.mutate(id);
                }
            });
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold mb-4">Data Department</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleOpen}
                >
                    Tambah Department
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="text-left">
                            <th className="py-2 px-4 border-b">
                                Nama Department
                            </th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {department.map((department: IDepartment) => (
                            <tr key={department.id} className="text-left">
                                <td className="py-2 px-4 border-b">
                                    {department.nama_department}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div>
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 text-white font-bold p-2 rounded"
                                            onClick={() =>
                                                handleEdit(department)
                                            }
                                        >
                                            <FaRegEdit color="blue" size={20} />
                                        </button>

                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 text-white font-bold p-2 rounded ml-2"
                                            onClick={() =>
                                                handleDelete(department.id)
                                            }
                                        >
                                            <MdDeleteOutline
                                                color="red"
                                                size={20}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ModalDepartment
                open={open}
                handleClose={handleClose}
                departmentData={selectedDepartment}
            />
        </div>
    );
};

export default Department;
