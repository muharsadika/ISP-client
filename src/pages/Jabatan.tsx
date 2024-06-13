import { useState } from 'react';
import { api } from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaRegEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import ModalJabatan, { IJabatan } from '../components/ModalJabatan';

const Jabatan = () => {
    const [open, setOpen] = useState(false);
    const [selectedJabatan, setSelectedJabatan] = useState<IJabatan | null>(
        null
    );
    const queryClient = useQueryClient();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedJabatan(null);
    };

    const { data } = useQuery({
        queryKey: ['jabatans'],
        queryFn: () => api.get('/jabatans'),
    });
    const jabatan = data?.data || [];

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/jabatans/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jabatans'] });
            Swal.fire('Deleted!', 'Karyawan berhasil dihapus.', 'success');
        },
    });

    const handleEdit = (jabatan: IJabatan) => {
        setSelectedJabatan(jabatan);
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
                <h1 className="text-2xl font-bold mb-4">Data Jabatan</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleOpen}
                >
                    Tambah Jabatan
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="text-left">
                            <th className="py-2 px-4 border-b">Nama jabatan</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jabatan.map((jabatan: IJabatan) => (
                            <tr key={jabatan.id} className="text-left">
                                <td className="py-2 px-4 border-b">
                                    {jabatan.nama_jabatan}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div>
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 text-white font-bold p-2 rounded"
                                            onClick={() => handleEdit(jabatan)}
                                        >
                                            <FaRegEdit color="blue" size={20} />
                                        </button>

                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 text-white font-bold p-2 rounded ml-2"
                                            onClick={() =>
                                                handleDelete(jabatan.id)
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

            <ModalJabatan
                open={open}
                handleClose={handleClose}
                jabatanData={selectedJabatan}
            />
        </div>
    );
};

export default Jabatan;
