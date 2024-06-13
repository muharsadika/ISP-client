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

interface ModalKaryawanProps {
    open: boolean;
    handleClose: () => void;
    karyawanData?: IKaryawan | null;
}

export interface IDepartment {
    id: number;
    nama_department: string;
}

export interface IJabatan {
    id: number;
    nama_jabatan: string;
    id_department: number;
}

export interface IKaryawan {
    id?: number;
    name: string;
    age: number;
    gender: string;
    tanggal_lahir: string;
    alamat: string;
    id_jabatan: number;
    nama_jabatan?: string;
}

const ModalKaryawan: React.FC<ModalKaryawanProps> = ({
    open,
    handleClose,
    karyawanData,
}) => {
    const [selectedDepartment, setSelectedDepartment] = useState<number>(0);
    const [formKaryawan, setFormKaryawan] = useState<IKaryawan>({
        name: '',
        age: 0,
        gender: '',
        tanggal_lahir: '',
        alamat: '',
        id_jabatan: 0,
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => {
            if (karyawanData?.id) {
                return api.put(`/karyawans/${karyawanData.id}`, formKaryawan);
            } else {
                return api.post('/karyawans', formKaryawan);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['karyawans'] });
            Swal.fire('Success', 'Karyawan saved successfully', 'success');
            handleClose();
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
        if (karyawanData) {
            setFormKaryawan(karyawanData);
            const dept = jabatan.find(
                (jab: IJabatan) => jab.id === karyawanData.id_jabatan
            )?.id_department;
            if (dept) {
                setSelectedDepartment(dept);
            }
        } else {
            setFormKaryawan({
                name: '',
                age: 0,
                gender: '',
                tanggal_lahir: '',
                alamat: '',
                id_jabatan: 0,
            });
            setSelectedDepartment(0);
        }
    }, [karyawanData, jabatan]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormKaryawan((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
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
                        {karyawanData ? 'Edit Karyawan' : 'Tambah Karyawan'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="name"
                            >
                                Nama
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                name="name"
                                value={formKaryawan.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="age"
                            >
                                Umur
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="age"
                                type="number"
                                name="age"
                                value={formKaryawan.age}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="gender"
                            >
                                Gender
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="gender"
                                name="gender"
                                value={formKaryawan.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Pilih Gender</option>
                                <option value="Male">Laki-Laki</option>
                                <option value="Female">Perempuan</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="tanggal_lahir"
                            >
                                Tanggal Lahir
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="tanggal_lahir"
                                type="date"
                                name="tanggal_lahir"
                                value={formKaryawan.tanggal_lahir}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="alamat"
                            >
                                Alamat
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="alamat"
                                type="text"
                                name="alamat"
                                value={formKaryawan.alamat}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="department"
                            >
                                Department
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="department"
                                name="department"
                                value={selectedDepartment}
                                onChange={(e) =>
                                    setSelectedDepartment(
                                        Number(e.target.value)
                                    )
                                }
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
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="id_jabatan"
                            >
                                Jabatan
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="id_jabatan"
                                name="id_jabatan"
                                value={formKaryawan.id_jabatan}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Pilih Jabatan</option>
                                {jabatan
                                    .filter(
                                        (jab: IJabatan) =>
                                            jab.id_department ===
                                            selectedDepartment
                                    )
                                    .map((jab: IJabatan) => (
                                        <option key={jab.id} value={jab.id}>
                                            {jab.nama_jabatan}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                {karyawanData ? 'Update' : 'Tambah'}
                            </button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalKaryawan;
