import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/loyalty/lib/api";

const CustomerAuthContext = createContext(null);
const KEY = "bros_customer_token";

export function CustomerAuthProvider({ children }) {
  const [member, setMember] = useState(null); // null=checking, false=guest, obj=member
  const [loading, setLoading] = useState(true);

  const fetchMe = () => {
    const token = localStorage.getItem(KEY);
    if (!token) {
      setMember(false);
      setLoading(false);
      return;
    }
    api
      .get("/customer/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setMember(data))
      .catch(() => {
        localStorage.removeItem(KEY);
        setMember(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchMe, []);

  const requestLink = (email, first_name) =>
    api.post("/auth/request-link", { email, first_name });

  const verify = async (token) => {
    const { data } = await api.post("/auth/verify", { token });
    localStorage.setItem(KEY, data.token);
    setMember(data.member);
    return data.member;
  };

  const refresh = async () => {
    const token = localStorage.getItem(KEY);
    if (!token) return;
    const { data } = await api.get("/customer/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMember(data);
    return data;
  };

  const changeEmail = async (email) => {
    const token = localStorage.getItem(KEY);
    const { data } = await api.post(
      "/customer/change-email",
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMember(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setMember(false);
  };

  return (
    <CustomerAuthContext.Provider
      value={{ member, loading, requestLink, verify, refresh, changeEmail, logout }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export const useCustomer = () => useContext(CustomerAuthContext);
