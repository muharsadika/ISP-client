import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { api } from '../utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

interface ModalDepartmentProps {
    open: boolean;
    handleClose: () => void;
    departmentData?: IDepartment | null;
    jabatanData?: IJabatan[]; // Tambah properti jabatanData
}

export interface IDepartment {
    id?: number;
    nama_department: string;
}

export interface IJabatan {
    id: number;
    nama_jabatan: string;
    id_department: number;
}

const ModalDepartment: React.FC<ModalDepartmentProps> = ({
    open,
    handleClose,
    departmentData,
}) => {
    const [formDepartment, setFormDepartment] = useState<IDepartment>({
        nama_department: '',
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => {
            if (departmentData?.id) {
                return api.put(
                    `/departments/${departmentData.id}`,
                    formDepartment
                );
            } else {
                return api.post('/departments', formDepartment);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            Swal.fire('Success', 'Department saved successfully', 'success');
            handleClose();
        },
    });

    useEffect(() => {
        if (departmentData) {
            setFormDepartment(departmentData);
        } else {
            setFormDepartment({
                nama_department: '',
            });
        }
    }, [departmentData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormDepartment((prevForm) => ({
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
                        {departmentData
                            ? 'Edit Department'
                            : 'Tambah Department'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="nama_department"
                            >
                                Nama Department
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nama_department"
                                type="text"
                                name="nama_department" // Ganti name menjadi nama_department
                                value={formDepartment.nama_department}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                {departmentData ? 'Update' : 'Tambah'}
                            </button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalDepartment;
