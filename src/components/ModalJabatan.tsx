import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { api } from '../utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface ModalJabatanProps {
    open: boolean;
    handleClose: () => void;
    jabatanData?: IJabatan | null;
}

export interface IDepartment {
    id: number;
    nama_department: string;
}

export interface IJabatan {
    id?: number;
    nama_jabatan: string;
    id_department: number;
    id_jabatan?: number;
}

const ModalJabatan: React.FC<ModalJabatanProps> = ({
    open,
    handleClose,
    jabatanData,
}) => {
    const [selectedDepartment, setSelectedDepartment] = useState<number>(0);
    const [formJabatan, setFormJabatan] = useState<IJabatan>({
        nama_jabatan: '',
        id_department: 0,
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => {
            if (jabatanData?.id) {
                return api.put(`/jabatans/${jabatanData.id}`, formJabatan);
            } else {
                return api.post('/jabatans', formJabatan);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jabatans'] });
            Swal.fire('Success', 'Jabatan saved successfully', 'success');
            handleClose();
        },
        onError: (error: Error) => {
            Swal.fire('Error', error.message, 'error');
        },
    });

    const { data: departments } = useQuery({
        queryKey: ['departments'],
        queryFn: () => api.get('/departments'),
    });
    const department = departments?.data || [];

    const { data: jabatans } = useQuery({
        queryKey: ['jabatans'],
        queryFn: () => api.get('/jabatans'),
    });
    const jabatan = jabatans?.data || [];

    useEffect(() => {
        if (jabatanData) {
            setFormJabatan({
                nama_jabatan: jabatanData.nama_jabatan || '',
                id_department: jabatanData.id_department,
            });

            const dept = jabatan.find(
                (jab: IJabatan) => jab.id === jabatanData.id_jabatan
            )?.id_department;
            if (dept) {
                setSelectedDepartment(dept);
            }
        } else {
            setFormJabatan({
                nama_jabatan: '',
                id_department: department,
            });
            setSelectedDepartment(department);
        }
    }, [jabatanData, jabatan, department]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'id_department') {
            setSelectedDepartment(Number(value));
            setFormJabatan((prevForm) => ({
                ...prevForm,
                id_department: Number(value),
            }));
        } else {
            setFormJabatan((prevForm) => ({
                ...prevForm,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        {jabatanData ? 'Edit Jabatan' : 'Tambah Jabatan'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="nama_jabatan"
                            >
                                Nama Jabatan
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nama_jabatan"
                                type="text"
                                name="nama_jabatan"
                                value={formJabatan.nama_jabatan}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="id_department"
                            >
                                Department
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="id_department"
                                name="id_department"
                                value={selectedDepartment}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Pilih Department</option>
                                {department.map((dept: IDepartment) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.nama_department}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                {jabatanData ? 'Update' : 'Tambah'}
                            </button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalJabatan;
