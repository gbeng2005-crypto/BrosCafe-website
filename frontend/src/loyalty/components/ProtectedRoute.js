import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/loyalty/context/AuthContext";
import { Coffee } from "@phosphor-icons/react";

const Loader = () => (
  <div className="flex min-h-screen items-center justify-center bg-bros-cream">
    <Coffee size={40} weight="fill" color="#66734A" className="animate-pulse" />
  </div>
);

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading || user === null) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/staff" replace />;
  return children;
};

export default ProtectedRoute;
