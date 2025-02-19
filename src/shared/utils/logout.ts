import { signOut } from "next-auth/react";

async function logout() {
    await signOut({ redirect: false });
    window.location.href = '/login';
}

export { logout }