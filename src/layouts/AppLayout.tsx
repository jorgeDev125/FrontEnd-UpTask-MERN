import { Outlet, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify"
import Logo from "@/components/Logo"
import NavMenu from "@/components/NavMenu"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from '@/hooks/useAuth';



export default function AppLayout() {

    const {data, isError, isLoading} = useAuth()
    
    if (isLoading) {
        return <div>Cargando...</div>;
    }
    if (isError) {
        return <Navigate to="/auth/login"/>
    }

    if (data)  return (
        <>
            <header className="bg-gray-800 py-5">
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
                    <div className="w-64">
                        <Link to={`/`}
                            className='block px-3 py-1 text-sm leading-6 text-gray-900'>
                            <Logo />
                        </Link>
                    </div>
                    <NavMenu name={data.name} />
                </div>
            </header>

            <section className="max-w-screen-2xl mx-auto mt-10 p-5">
                <Outlet />
            </section>
            <footer className="py-5 text-center">
                <p>
                    Todos los Derechos Reservados - {new Date().getFullYear()}
                </p>
            </footer>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}
