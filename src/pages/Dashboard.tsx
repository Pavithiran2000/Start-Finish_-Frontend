import React from 'react'
import DrawerAppBar from '../component/bar'
import Footer from '../component/Footer'
import ViewTodayTask from '../component/ViewTodayTask'
import RequireToken from './RequireToken'

function Dashboard() {
  return (
    <div>
    <RequireToken>
    <DrawerAppBar/>
    <main>
    <ViewTodayTask/>
    </main>
    <Footer/>
    </RequireToken>
    </div>
  )
}

export default Dashboard
