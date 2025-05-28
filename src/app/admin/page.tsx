import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../lib/store/store'

const AdminPage = () => {
const router = useRouter()
const user = useSelector((state:RootState) => state.auth.user)
    useEffect(() => {

        if (!user || user.role !== "ADMIN") {
            router.push("/")
        }
    },[user])

  return (
    <div>
        <h1>Admin Dashboard</h1>
        <p>This is an admin page</p>
    </div>
  )
}

export default AdminPage