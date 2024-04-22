import React from 'react'
import DrawerAppBar from '../component/bar'
import Footer from '../component/Footer'
import AllTasks from '../component/AllTask'
import RequireToken from './RequireToken'

function AllTaaskPage() {
  return (
    <div>
    <RequireToken>
    <DrawerAppBar/>
    <main>
    <AllTasks/>
    </main>
    <Footer/>
    </RequireToken>
    </div>
  )
}

export default AllTaaskPage
