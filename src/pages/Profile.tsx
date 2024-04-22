import React from 'react'
import DrawerAppBar from '../component/bar'
import Footer from '../component/Footer'
import ViewTodayTask from '../component/ViewTodayTask'
import MyProfile from '../component/MyProfile'
import RequireToken from './RequireToken'

function Profile() {
  return (
    <div>
    <RequireToken>
    <DrawerAppBar/>
    <main>
    <MyProfile/>
    </main>
    <Footer/>
    </RequireToken>
    </div>
  )
}

export default Profile
