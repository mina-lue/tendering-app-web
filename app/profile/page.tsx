import { authOptions } from "@/lib/auth-options";
import { backend_url } from "@/lib/constants";
import { getServerSession } from "next-auth";

const ProfilePage = async () => {
    const session = await getServerSession(authOptions);
    const response = await fetch(backend_url + `/api/users/1`, {
        method: "GET",
        headers: {
            authorization: `Bearer ${session?.backendTokens.accessToken}`,
            "Content-Type": "application/json",
        },
    });
    console.log({ response });
    const user = await response.json();

    return (
        <div className="m-2 border rounded shadow overflow-hidden">
            <div className="p-2 bg-gradient-to-b from-white to-slate-200 text-slate-600 text-center">
                User Profile
            </div>

            <div className="grid grid-cols-2  p-2 gap-2">
                <p className="p-2 text-slate-400">Name:</p>
                <p className="p-2 text-slate-950">{user.name}</p>
                <p className="p-2 text-slate-400">Email:</p>
                <p className="p-2 text-slate-950">{user.email}</p>
            </div>
        </div>
    );
};

export default ProfilePage;