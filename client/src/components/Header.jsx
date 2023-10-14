import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';
export default function Header() {
  return (
    <header className='bg-blue-400 shadow-lg'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'><h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
      <span className='text-white'>Kharbache</span>
      <span className='text-slate-700'>Esatate</span>
    </h1></Link>
        
    <form className='bg-slate-100 p-2 rounded-lg flex items-center'>
<input type="text" 
placeholder='Search....' 
className='bg-transparent focus:outline-none w-24 sm:w-64 md:54' />
<FaSearch className='text-slate-600' />
    </form>
    <ul className='flex gap-4 '>
      <Link to='/'><li className='font-sans hidden sm:inline text-blue-950 hover:font-bold hover:text-white'>Home</li></Link>
      <Link to='/about'><li className='hidden sm:inline text-blue-950 hover:text-white hover:font-bold' >About</li></Link>
      <Link to='/sign-in'><li className='sm:inline text-blue-950 hover:text-white hover:font-bold'>Sign in</li></Link>
      </ul>
    </div>
    </header>
  )
}
