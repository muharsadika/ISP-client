import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Karyawan from './pages/Karyawan';
import Department from './pages/Department';
import Jabatan from './pages/Jabatan';
import Navbar from './components/Navbar';

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Karyawan />} />
                    <Route path="/department" element={<Department />} />
                    <Route path="/jabatan" element={<Jabatan />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
