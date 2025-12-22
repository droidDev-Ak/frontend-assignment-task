import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function ProtectedRoute({children}) {
    const {user,loading}=useAuth();
    if(loading){
        return <div className='bg-blue-500 h-40 w-full mx-auto text-center '> Loading ... </div>
    }
    if(!user){
        return <Navigate to="/login" replace />
    }
    return children;
}

export default ProtectedRoute;