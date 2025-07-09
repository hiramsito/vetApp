import React,{useState} from 'react'
import Logo from '../../assets/Logo.png'
 

const navbarlinks = [
{
    id:1,
    title:"Inicio",
    Link:"/"
},
{
    id:2,
    title:"Nosotros",
    Link:"/"
},
{
    id:3,
    title:"Contacto",
    Link:"/"
},
{
    id:4,
    title:"Soporte",
    Link:"#"
}
]

const navbarRedes = [
    {
        id:1,
        title:"Instagram",
        Link:"https://www.instagram.com",
        icon:'bi bi-instagram'
    },
    {
        id:2,
        title:"Facebook",
        Link:"https://www.facebook.com",
        icon:'bi bi-facebook'
    },
    {
        id:3,
        title:"Tiktok",
        Link:"https://www.Tiktok.com",
        icon:'bi bi-tiktok'
    }
]


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

  return (
    <nav className='fixed top-0 left-0 bg-purple-900/30 w-full backdrop-blur-md z-50'>
        <div className='flex justify-between items-center sm:px-12 sm:py-6 px-4 py-3'>
            {/* Logo Navbar */}
            <div>
                <img src={Logo} alt="Logo del Landing" className='w-[100px]' />
            </div>

            {/* Boton de hamburguesa */}
            <button onClick={toggleMenu} className='md:hidden text-white'>
                <svg 
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                        {isOpen ? (<path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                        />) : (<path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                        />)}
                        
                        
                </svg>
            </button>

            {/* Navegación Desktop */}
            <div className='hidden md:block'>
                <ul className='flex sm:space-x-8 space-x-4'>
                    {navbarlinks.map((links)=>(
                        <li key={links.id}>
                            <a className='text-white sm:text-lg text-sm hover:text-sky-100 transition-transform hover:scale-110 transform inline-block duration-300' href={links.Link}>{links.title}</a>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Navegación redes Desktop */}
            <div className='hidden md:block'>
                <ul className='flex space-x-4'>
                    {navbarRedes.map((links)=>(
                        <li key={links.id}>
                            <a
                            target = '_blank'
                            rel='noopener noreferrer' 
                            className='inline-block transition-transform duration-300 transform hover:scale-125'
                            href={links.Link}>
                                <i
                                className={`${links.icon} sm:text-2xl text-lg text-white hover:text-sky-200 transition-all duration-300`}>

                                </i>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
            {/* Menu mobile */}
            <div className={`md:hidden absolute w-full bg-purple-950 transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <ul className='flex flex-col px-4 py-2'>
                    {navbarlinks.map((links)=>(
                        <li key={links.id} className='py-2 text-center'>
                            <a className='text-white hover:text-sky-200' 
                            href={links.Link} onClick={()=>setIsOpen(false)}>
                                {links.title}</a>
                        </li>
                    ))}
                </ul>
                <ul className='flex space-x-4 px-4 py-2 border-t border-purple-700 justify-center'>
                    {navbarRedes.map((links)=>(
                        <li key={links.id}>
                            <a
                            target = '_blank'
                            rel='noopener noreferrer' 
                            className='inline-block'
                            href={links.Link} 
                            onClick={()=>setIsOpen(false)}>
                                <i
                                className={`${links.icon} tx-lg text-white hover:text-sky-200`}>

                                </i>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
    </nav>
  )
}

export default Navbar
