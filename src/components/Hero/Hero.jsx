import React from 'react'
import Personaje from '../../assets/Personaje.png'
import Logo from '../../assets/Logo.png'
import {motion} from "framer-motion"
import { slipeUp ,slipeInFromSide} from '../../utility/animation'

const Hero = () => {
  return (
    <section className='mt-36'>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        {/* Textos y descripción */}
        <div className='p-10 sm:p-10 md:p-15 lg:p-30 xl:p-36'>
          <motion.img 
          src={Logo} alt="Logo del juego" 
          variants={slipeUp(0.2)}
          initial="initial"
          animate="animate"
          />
          <motion.p 
          className='py-12 text-white'
          variants={slipeUp(0.3)}
          initial="initial"
          animate="animate"
          >
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus, voluptates, laboriosam earum ipsum enim, voluptatibus nostrum modi quas numquam nemo repellendus temporibus quaerat! Quaerat nesciunt eius cumque, porro exercitationem omnis!
          </motion.p>
          <motion.div 
          className='flex justify-center gap-4'
          variants={slipeUp(0.5)}
          initial="initial"
          animate="animate"
          >
            <a href="" className='bg-purple-600 py-2 px-12 rounded-3xl text-white hover:bg-purple-700 transition-all duration-300 items-center cursor-pointer'>
              Jugar ahora 
              <i className="bi bi-controller text-xl ml-2"></i> 
            </a>

            <a href="" className='text-white flex items-center cursor-pointer'>
              Ver Gameplay 
              <i className="bi bi-youtube text-xl ml-2"></i> 
            </a> 
          </motion.div>
        </div>

        {/* Imagen */}
        <motion.div 
        className='p-10 sm:p-10 md:p-15 lg:p-30 xl:p-36'
        variants={slipeInFromSide("right",0.5)}
        initial="initial"
        animate="animate"
        >
          <img src={Personaje} alt="Personaje del Juego" />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
