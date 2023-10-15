import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';
export default function Header() {
  return (
    <header className='bg-blue-500 shadow-lg'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'><h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
      <span className='text-white'>Real</span>
      <span className='text-gray-700'>Esatate</span>
    </h1></Link>
        
    <form className='bg-slate-100 p-2 rounded-lg flex items-center'>
<input type="text" 
placeholder='Search....' 
className='bg-transparent focus:outline-none w-24 sm:w-64 md:54' />
<FaSearch className='text-slate-600' />
    </form>
    <ul className='flex gap-4 '>
      <Link to='/'><li className='font-poppins hidden sm:inline text-white  hover:text-red-950'>Home</li></Link>
      <Link to='/about'><li className='hidden font-poppins sm:inline text-white hover:text-red-950 ' >About</li></Link>
      <Link to='/sign-in'><li className='sm:inline font-poppins text-white hover:text-red-950 '>Sign in</li></Link>
      </ul>
    </div>
    </header>
  )
}
