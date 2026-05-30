import { useState, useEffect } from "react";

export function useSync(done, setDone) {
  const [userId, setUserId] = useState("");
  const [dbStatus, setDbStatus] = useState("local");
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showSyncModal, setShowSyncModal] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      let uid = urlParams.get("user");
      
      if (uid) {
        localStorage.setItem("dsa_user_uuid", uid);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        uid = localStorage.getItem("dsa_user_uuid");
      }

      if (!uid) {
        uid = "dsa_" + Math.random().toString(36).substring(2, 10);
        localStorage.setItem("dsa_user_uuid", uid);
      }
      setUserId(uid);

      let initialData = {};

      try {
        setDbStatus("syncing");
        const res = await fetch(`/api/progress?userId=${uid}`);
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data && data.progress) {
            const merged = { ...initialData, ...data.progress };
            setDone(merged);
            setDbStatus("synced");
          } else {
            setDbStatus("synced");
          }
        } else {
          setDbStatus("local");
        }
      } catch (err) {
        console.error("Failed to sync:", err);
        setDbStatus("error");
      } finally {
        setLoading(false);
      }
    })();
  }, [setDone]);

  const syncProgress = async (nextDone) => {
    if (!userId || dbStatus === "local") return;
    try {
      setDbStatus("syncing");
      const res = await fetch(`/api/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, progress: nextDone })
      });
      if (res.ok) {
        setDbStatus("synced");
      } else {
        setDbStatus("local");
      }
    } catch (e) {
      setDbStatus("error");
    }
  };

  const registerNickname = async (nickname) => {
    if (!nickname.trim()) return;
    const cleanId = nickname.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (cleanId.length < 3) {
      triggerToast("Nickname must be at least 3 alphanumeric characters.");
      return;
    }

    setLoading(true);

    try {
      setDbStatus("syncing");
      
      const checkRes = await fetch(`/api/progress?userId=${cleanId}`);
      if (checkRes.ok) {
        const data = await checkRes.json();
        if (data && data.progress && Object.keys(data.progress).length > 0) {
          triggerToast(`Nickname '${cleanId}' is already taken.`);
          setDbStatus(dbStatus); // revert
          setLoading(false);
          return;
        }
      }

      setUserId(cleanId);
      localStorage.setItem("dsa_user_uuid", cleanId);
      window.history.replaceState({}, document.title, window.location.pathname);

      const res = await fetch(`/api/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: cleanId, progress: done })
      });
      if (res.ok) {
        setDbStatus("synced");
        triggerToast(`Nickname successfully set to '${cleanId}'!`);
      } else {
        setDbStatus("local");
        triggerToast(`Nickname set locally to '${cleanId}'.`);
      }
    } catch (e) {
      setDbStatus("error");
    } finally {
      setLoading(false);
      setShowSyncModal(false);
    }
  };

  const linkNickname = async (nickname) => {
    if (!nickname.trim()) return;
    const cleanId = nickname.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    
    setLoading(true);
    setUserId(cleanId);
    localStorage.setItem("dsa_user_uuid", cleanId);
    window.history.replaceState({}, document.title, window.location.pathname);
    
    try {
      setDbStatus("syncing");
      const res = await fetch(`/api/progress?userId=${cleanId}`);
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data && data.progress) {
          setDone(data.progress);
          setDbStatus("synced");
          triggerToast(`Successfully linked to '${cleanId}'.`);
        } else {
          setDone({});
          setDbStatus("synced");
          triggerToast(`Connected to a clean custom nickname '${cleanId}'.`);
        }
      } else {
        setDbStatus("local");
        triggerToast(`Nickname '${cleanId}' loaded locally. DB unreachable.`);
      }
    } catch (err) {
      setDbStatus("error");
    } finally {
      setLoading(false);
      setShowSyncModal(false);
    }
  };

  return {
    userId, dbStatus, loading,
    showToast, toastMessage, triggerToast,
    showSyncModal, setShowSyncModal,
    syncProgress, registerNickname, linkNickname
  };
}
