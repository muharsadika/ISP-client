import { useState } from 'react';
import ModalKaryawan, { IKaryawan } from '../components/ModalKaryawan';
import { api } from '../utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { dateFormat } from '../utils/DateFormat';
import { FaRegEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';

const Karyawan = () => {
    const [open, setOpen] = useState(false);
    const [selectedKaryawan, setSelectedKaryawan] = useState<IKaryawan | null>(
        null
    );
    const queryClient = useQueryClient();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedKaryawan(null);
    };

    const { data } = useQuery({
        queryKey: ['karyawans'],
        queryFn: () => api.get('/karyawans'),
    });
    const karyawan = data?.data || [];

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/karyawans/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['karyawans'] });
            Swal.fire('Deleted!', 'Karyawan berhasil dihapus.', 'success');
        },
    });

    const handleEdit = (karyawan: IKaryawan) => {
        setSelectedKaryawan(karyawan);
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
                <h1 className="text-2xl font-bold mb-4">Data Karyawan</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleOpen}
                >
                    Tambah Karyawan
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="text-left">
                            <th className="py-2 px-4 border-b">Nama</th>
                            <th className="py-2 px-4 border-b">Umur</th>
                            <th className="py-2 px-4 border-b">Gender</th>
                            <th className="py-2 px-4 border-b">
                                Tanggal Lahir
                            </th>
                            <th className="py-2 px-4 border-b">Alamat</th>
                            <th className="py-2 px-4 border-b">Jabatan</th>
                            <th className="py-2 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {karyawan.map((karyawan: IKaryawan) => (
                            <tr key={karyawan.id} className="text-left">
                                <td className="py-2 px-4 border-b">
                                    {karyawan.name}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {karyawan.age}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {karyawan.gender}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {dateFormat(karyawan.tanggal_lahir)}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {karyawan.alamat}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {karyawan.nama_jabatan}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div>
                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 text-white font-bold p-2 rounded"
                                            onClick={() => handleEdit(karyawan)}
                                        >
                                            <FaRegEdit color="blue" size={20} />
                                        </button>

                                        <button
                                            className="bg-gray-200 hover:bg-gray-300 text-white font-bold p-2 rounded ml-2"
                                            onClick={() =>
                                                handleDelete(karyawan.id)
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

            <ModalKaryawan
                open={open}
                handleClose={handleClose}
                karyawanData={selectedKaryawan}
            />
        </div>
    );
};

export default Karyawan;
