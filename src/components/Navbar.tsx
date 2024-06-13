import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-slate-900 h-20 text-white mb-5 flex items-center px-5">
            <div className="flex gap-10">
                <h1 className="font-bold">IMMOBI SOLUSI PRIMA</h1>
                <ul className="flex gap-5">
                    <li className="hover:text-blue-500">
                        <Link to="/department">Department</Link>
                    </li>
                    <li className="hover:text-blue-500">
                        <Link to="/jabatan">Jabatan</Link>
                    </li>
                    <li className="hover:text-blue-500">
                        <Link to="/">Karyawan</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
