import { BrowserRouter, Routes, Route,} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Categories from "./pages/public/Categories";
import Issues from "./pages/public/Issues";
import GuidanceDetails from "./pages/public/GuidanceDetails";
import CreateComplaint from "./pages/user/CreateComplaint";
import MyComplaints from "./pages/user/MyComplaints";
import ComplaintDetails from "./pages/user/ComplaintDetails";
import ComplaintTracking from "./pages/user/ComplaintTracking";
import AllComplaints from "./pages/admin/AllComplaints";
import AdminComplaintDetails from "./pages/admin/AdminComplaintDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/categories" element={<Categories />}/>

          <Route path="/issues/:categoryId" element={<Issues />}/>

          <Route path="/guidance/:issueId" element={<GuidanceDetails />}/>

          <Route  path="/login" element={<Login />} />

          <Route
            path="/register"
            element={<Register />}
          />
        </Route>

        {/* Protected User Routes */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard"  element={<UserDashboard />}   />

             <Route path="/complaints/new" element={<CreateComplaint />} />

    <Route path="/complaints" element={<MyComplaints />} />


    <Route path="/complaints/tracking"  element={<ComplaintTracking />}/>

    <Route path="/complaints/:id"  element={<ComplaintDetails />} />
          </Route>
        </Route>

        {/* Admin Routes */}

        <Route element={<AdminRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admin/dashboard"  element={<AdminDashboard />} />
          </Route>

            <Route path="/admin/complaints" element={<AllComplaints />}/>
        </Route>
         <Route path="/admin/complaints/:id" element={<AdminComplaintDetails />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;